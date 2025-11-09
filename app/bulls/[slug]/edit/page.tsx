'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
      <div className="relative w-full h-32 bg-gray-200 rounded-lg overflow-hidden">
        <Image
          src={photo.url}
          alt="Bull photo"
          fill
          className="object-cover"
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
    </div>
  );
}

export default function EditBullPage() {
  const router = useRouter();
  const params = useParams();
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

    if (!session.user?.emailVerified) {
      router.push('/check-email');
      return;
    }

    fetchBullData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, router]);

  const fetchBullData = async () => {
    try {
      const response = await fetch(`/api/bulls/${params.slug}`);
      const data = await response.json();
      
      if (data.success && data.bull) {
        const bull = data.bull;
        
        // Populate form data
        setFormData({
          name: bull.name || '',
          breed: bull.breed || '',
          registrationNumber: bull.registrationNumber || '',
          birthDate: bull.birthDate ? new Date(bull.birthDate).toISOString().split('T')[0] : '',
        });

        // Populate photos
        const photoItems: PhotoItem[] = [];
        if (bull.heroImage) {
          photoItems.push({
            id: 'hero',
            url: bull.heroImage,
            isHero: true,
          });
        }
        if (bull.additionalImages && Array.isArray(bull.additionalImages)) {
          bull.additionalImages.forEach((url: string, index: number) => {
            photoItems.push({
              id: `additional-${index}`,
              url,
              isHero: false,
            });
          });
        }
        setPhotos(photoItems);
      } else {
        setError('Bull not found');
      }
    } catch (error) {
      console.error('Failed to fetch bull data:', error);
      setError('Failed to load bull data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > 7) {
      setError('Maximum 7 photos allowed');
      return;
    }

    setUploading(true);
    setError('');

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

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
            isHero: photos.length === 0,
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
      return newPhotos.map((item, index) => ({
        ...item,
        isHero: index === 0,
      }));
    });
  };

  const handleSubmit = async (action: 'draft' | 'continue') => {
    setError('');
    
    if (!formData.name.trim()) {
      setError('Bull name is required');
      return;
    }

    if (!formData.breed) {
      setError('Breed is required');
      return;
    }

    setSubmitting(true);

    try {
      const heroImage = photos.find(p => p.isHero)?.url || null;
      const additionalImages = photos.filter(p => !p.isHero).map(p => p.url);

      const response = await fetch(`/api/bulls/${params.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          breed: formData.breed,
          registrationNumber: formData.registrationNumber || null,
          birthDate: formData.birthDate || null,
          heroImage,
          additionalImages,
          status: action === 'draft' ? 'DRAFT' : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to update bull');
      } else {
        if (action === 'draft') {
          router.push('/dashboard?success=bull-updated');
        } else {
          router.push(`/bulls/${params.slug}/edit/genetic`);
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading' || loading) {
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
            <h2 className="text-3xl font-bold text-gray-900">Edit Bull Profile</h2>
            <p className="mt-2 text-sm text-gray-600">
              Step 1 of 3: Update basic information and photos
            </p>
          </div>

          <form className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Basic Information */}
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
              />
            </div>

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
                {CATTLE_BREEDS.map((breed) => (
                  <option key={breed} value={breed}>
                    {breed}
                  </option>
                ))}
              </select>
            </div>

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
              />
            </div>

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
                Photos (up to 7)
              </label>
              
              <div className="mb-4">
                <label className="flex items-center justify-center w-full h-32 px-4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-1 text-sm text-gray-600">
                      {uploading ? 'Uploading...' : 'Click to upload photos'}
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    disabled={uploading || photos.length >= 7}
                  />
                </label>
              </div>

              {photos.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Drag to reorder. First photo is the hero image.
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
                onClick={() => router.push('/dashboard')}
                disabled={submitting}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSubmit('draft')}
                disabled={submitting}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => handleSubmit('continue')}
                disabled={submitting}
                className="flex-1 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Continue to Genetic Data →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
