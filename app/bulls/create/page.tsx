'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { CATTLE_BREEDS } from '@/lib/cattle-breeds';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface PhotoItem {
  id: string;
  url: string;
  isHero: boolean;
}

function SortablePhoto({ photo, onDelete }: { photo: PhotoItem; onDelete: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: photo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group cursor-move"
    >
      <Image
        src={photo.url}
        alt="Bull photo"
        width={200}
        height={128}
        className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
      />
      {photo.isHero && (
        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
          Hero
        </div>
      )}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(photo.id);
        }}
        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function CreateBullPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    registrationNumber: '',
    birthDate: '',
  });
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    // TEMPORARILY DISABLED FOR DEVELOPMENT
    // if (!session.user?.emailVerified) {
    //   router.push('/check-email');
    //   return;
    // }
  }, [session, status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check total photo limit (1 hero + 6 additional = 7 max)
    if (photos.length + files.length > 7) {
      setError('Maximum 7 photos allowed (1 hero + 6 additional)');
      return;
    }

    setUploading(true);
    setError('');

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
          setError(`Invalid file type for ${file.name}. Only JPG and PNG are allowed.`);
          continue;
        }

        // Validate file size
        if (file.size > 10 * 1024 * 1024) {
          setError(`File ${file.name} exceeds 10MB limit`);
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          const newPhoto: PhotoItem = {
            id: data.publicId,
            url: data.urls.medium,
            isHero: photos.length === 0, // First photo is hero
          };
          setPhotos(prev => [...prev, newPhoto]);
        } else {
          setError(data.message || 'Upload failed');
        }
      }
    } catch (error) {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPhotos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        // Update hero status - first photo is always hero
        return newItems.map((item, index) => ({
          ...item,
          isHero: index === 0,
        }));
      });
    }
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos(prev => {
      const newPhotos = prev.filter(p => p.id !== id);
      // Update hero status after deletion
      return newPhotos.map((item, index) => ({
        ...item,
        isHero: index === 0,
      }));
    });
  };

  const handleSubmit = async (status: 'DRAFT' | 'PUBLISHED') => {
    setError('');
    setLoading(true);

    // Validation
    if (!formData.name || !formData.breed) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (photos.length === 0) {
      setError('At least one photo is required');
      setLoading(false);
      return;
    }

    try {
      const heroPhoto = photos[0];
      const additionalPhotos = photos.slice(1).map(p => p.url);

      const response = await fetch('/api/bulls/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          heroImage: heroPhoto.url,
          additionalImages: additionalPhotos,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to create bull');
      } else {
        if (status === 'DRAFT') {
          router.push('/dashboard?success=bull-draft-saved');
        } else {
          // Continue to genetic data (Story 2.4)
          router.push(`/bulls/${data.bull.slug}/edit/genetic?new=true`);
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow px-8 py-10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Add Your Bull</h2>
            <p className="mt-2 text-sm text-gray-600">
              Step 1 of 3: Basic Information & Photos
            </p>
          </div>

          <form className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Bull Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Bull Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600"
                placeholder="e.g., Champion Angus 2024"
              />
            </div>

            {/* Breed */}
            <div>
              <label htmlFor="breed" className="block text-sm font-medium text-gray-700">
                Breed <span className="text-red-500">*</span>
              </label>
              <select
                id="breed"
                name="breed"
                required
                value={formData.breed}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600"
              >
                <option value="">Select a breed</option>
                {CATTLE_BREEDS.map(breed => (
                  <option key={breed} value={breed}>{breed}</option>
                ))}
              </select>
            </div>

            {/* Registration Number */}
            <div>
              <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
                Registration Number (Optional)
              </label>
              <input
                type="text"
                id="registrationNumber"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600"
                placeholder="e.g., 12345678"
              />
            </div>

            {/* Birth Date */}
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                Birth Date (Optional)
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600"
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Upload up to 7 photos. The first photo will be the hero image. JPG/PNG only, max 10MB each.
              </p>
              
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                multiple
                onChange={handleFileUpload}
                disabled={uploading || photos.length >= 7}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
              />

              {uploading && (
                <p className="mt-2 text-sm text-blue-600">Uploading...</p>
              )}

              {/* Photo Grid with Drag and Drop */}
              {photos.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Drag to reorder photos. First photo is the hero image.
                  </p>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={photos.map(p => p.id)}
                      strategy={rectSortingStrategy}
                    >
                      <div className="grid grid-cols-3 gap-4">
                        {photos.map((photo) => (
                          <SortablePhoto
                            key={photo.id}
                            photo={photo}
                            onDelete={handleDeletePhoto}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => handleSubmit('DRAFT')}
                disabled={loading || uploading}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleSubmit('PUBLISHED')}
                disabled={loading || uploading}
                className="flex-1 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Continue to Genetic Data'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
