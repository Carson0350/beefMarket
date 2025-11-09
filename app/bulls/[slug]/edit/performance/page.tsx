'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function BullPerformancePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const fromGenetic = searchParams.get('from') === 'genetic';
  
  const [formData, setFormData] = useState({
    // Performance Data
    birthWeight: '',
    weaningWeight: '',
    yearlingWeight: '',
    currentWeight: '',
    frameScore: '',
    scrotalCircumference: '',
    progenyNotes: '',
    // Inventory & Pricing
    semenAvailable: '',
    price: '',
    availabilityStatus: 'AVAILABLE',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [bullData, setBullData] = useState<any>(null);

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

    // Fetch existing bull data
    fetchBullData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, router]);

  const fetchBullData = async () => {
    try {
      const response = await fetch(`/api/bulls/${params.slug}`);
      const data = await response.json();
      
      if (data.success && data.bull) {
        setBullData(data.bull);
        // Pre-populate form if data exists
        if (data.bull.currentWeight) {
          setFormData(prev => ({
            ...prev,
            currentWeight: data.bull.currentWeight?.toString() || '',
            frameScore: data.bull.frameScore?.toString() || '',
            scrotalCircumference: data.bull.scrotalCircumference?.toString() || '',
            semenAvailable: data.bull.semenAvailable?.toString() || '',
            price: data.bull.price?.toString() || '',
            availabilityStatus: data.bull.availabilityStatus || 'AVAILABLE',
          }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch bull data:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (action: 'draft' | 'publish' | 'back') => {
    if (action === 'back') {
      router.push(`/bulls/${params.slug}/edit/genetic`);
      return;
    }

    // Validate required field
    if (!formData.semenAvailable || parseInt(formData.semenAvailable) < 0) {
      setError('Semen straw count is required and must be 0 or greater');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`/api/bulls/${params.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthWeight: formData.birthWeight ? parseFloat(formData.birthWeight) : null,
          weaningWeight: formData.weaningWeight ? parseFloat(formData.weaningWeight) : null,
          yearlingWeight: formData.yearlingWeight ? parseFloat(formData.yearlingWeight) : null,
          currentWeight: formData.currentWeight ? parseFloat(formData.currentWeight) : null,
          frameScore: formData.frameScore ? parseInt(formData.frameScore) : null,
          scrotalCircumference: formData.scrotalCircumference ? parseFloat(formData.scrotalCircumference) : null,
          progenyNotes: formData.progenyNotes || null,
          semenAvailable: parseInt(formData.semenAvailable),
          price: formData.price ? parseFloat(formData.price) : null,
          availabilityStatus: formData.availabilityStatus,
          status: action === 'publish' ? 'PUBLISHED' : 'DRAFT',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to update bull');
      } else {
        if (action === 'publish') {
          // Show success with shareable URL
          const bullUrl = `${window.location.origin}/bulls/${params.slug}`;
          router.push(`/dashboard?success=bull-published&url=${encodeURIComponent(bullUrl)}`);
        } else {
          router.push('/dashboard?success=bull-draft-saved');
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
            <h2 className="text-3xl font-bold text-gray-900">Performance & Inventory</h2>
            <p className="mt-2 text-sm text-gray-600">
              Step 3 of 3: Add performance data and semen inventory
            </p>
          </div>

          <form className="space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Performance Data Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Performance Data
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                All performance fields are optional. Provide what you have available.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="birthWeight" className="block text-sm font-medium text-gray-700">
                    Birth Weight (lbs)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="birthWeight"
                    name="birthWeight"
                    value={formData.birthWeight}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600"
                    placeholder="e.g., 85"
                  />
                </div>

                <div>
                  <label htmlFor="weaningWeight" className="block text-sm font-medium text-gray-700">
                    Weaning Weight (lbs)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="weaningWeight"
                    name="weaningWeight"
                    value={formData.weaningWeight}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600"
                    placeholder="e.g., 650"
                  />
                </div>

                <div>
                  <label htmlFor="yearlingWeight" className="block text-sm font-medium text-gray-700">
                    Yearling Weight (lbs)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="yearlingWeight"
                    name="yearlingWeight"
                    value={formData.yearlingWeight}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600"
                    placeholder="e.g., 1200"
                  />
                </div>

                <div>
                  <label htmlFor="currentWeight" className="block text-sm font-medium text-gray-700">
                    Current Weight (lbs)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="currentWeight"
                    name="currentWeight"
                    value={formData.currentWeight}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600"
                    placeholder="e.g., 1800"
                  />
                </div>

                <div>
                  <label htmlFor="frameScore" className="block text-sm font-medium text-gray-700">
                    Frame Score (1-9)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="9"
                    id="frameScore"
                    name="frameScore"
                    value={formData.frameScore}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600"
                    placeholder="e.g., 6"
                  />
                </div>

                <div>
                  <label htmlFor="scrotalCircumference" className="block text-sm font-medium text-gray-700">
                    Scrotal Circumference (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="scrotalCircumference"
                    name="scrotalCircumference"
                    value={formData.scrotalCircumference}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600"
                    placeholder="e.g., 38.5"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="progenyNotes" className="block text-sm font-medium text-gray-700">
                  Progeny Performance Notes (Optional)
                </label>
                <textarea
                  id="progenyNotes"
                  name="progenyNotes"
                  rows={4}
                  maxLength={1000}
                  value={formData.progenyNotes}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600"
                  placeholder="Describe the performance of this bull's offspring..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.progenyNotes.length}/1000 characters
                </p>
              </div>
            </div>

            {/* Inventory & Pricing Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Semen Inventory & Pricing
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="semenAvailable" className="block text-sm font-medium text-gray-700">
                    Available Semen Straws <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    id="semenAvailable"
                    name="semenAvailable"
                    required
                    value={formData.semenAvailable}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600"
                    placeholder="e.g., 100"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Number of semen straws currently available
                  </p>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price per Straw (Optional)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-600 focus:border-blue-600"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="availabilityStatus" className="block text-sm font-medium text-gray-700">
                    Availability Status
                  </label>
                  <select
                    id="availabilityStatus"
                    name="availabilityStatus"
                    value={formData.availabilityStatus}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="LIMITED">Limited Supply</option>
                    <option value="SOLD_OUT">Sold Out</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            {bullData && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-blue-900">
                      Ready to publish?
                    </h3>
                    <p className="mt-1 text-sm text-blue-700">
                      Review your bull profile before publishing. Once published, it will be visible to all breeders on your ranch page.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowPreview(true)}
                      className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      Preview Bull Profile →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => handleSubmit('back')}
                disabled={loading}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                ← Back to Genetic Data
              </button>
              <button
                type="button"
                onClick={() => handleSubmit('draft')}
                disabled={loading}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleSubmit('publish')}
                disabled={loading}
                className="flex-1 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? 'Publishing...' : '✓ Publish Bull'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
