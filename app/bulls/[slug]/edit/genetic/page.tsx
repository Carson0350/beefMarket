'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Ancestor {
  id: string;
  name: string;
  relationship: string;
}

export default function BullGeneticDataPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const isNew = searchParams.get('new') === 'true';
  
  const [formData, setFormData] = useState({
    // EPD Values
    birthWeightEPD: '',
    weaningWeightEPD: '',
    yearlingWeightEPD: '',
    milkEPD: '',
    marblingEPD: '',
    ribeyeAreaEPD: '',
    // Genetic Data
    geneticMarkers: '',
    dnaTestResults: '',
    // Pedigree
    sireName: '',
    damName: '',
  });
  
  const [ancestors, setAncestors] = useState<Ancestor[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

    // If not new, fetch existing bull data
    if (!isNew) {
      // TODO: Fetch bull data and populate form
    }
  }, [session, status, router, isNew]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAncestor = () => {
    if (ancestors.length >= 6) {
      setError('Maximum 6 ancestors allowed');
      return;
    }
    setAncestors(prev => [...prev, {
      id: Date.now().toString(),
      name: '',
      relationship: '',
    }]);
  };

  const handleRemoveAncestor = (id: string) => {
    setAncestors(prev => prev.filter(a => a.id !== id));
  };

  const handleAncestorChange = (id: string, field: 'name' | 'relationship', value: string) => {
    setAncestors(prev => prev.map(a => 
      a.id === id ? { ...a, [field]: value } : a
    ));
  };

  const handleSubmit = async (action: 'draft' | 'continue' | 'back') => {
    if (action === 'back') {
      router.push(`/bulls/${params.slug}/edit`);
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Prepare EPD data as JSON
      const epdData = {
        birthWeight: formData.birthWeightEPD ? parseFloat(formData.birthWeightEPD) : null,
        weaningWeight: formData.weaningWeightEPD ? parseFloat(formData.weaningWeightEPD) : null,
        yearlingWeight: formData.yearlingWeightEPD ? parseFloat(formData.yearlingWeightEPD) : null,
        milk: formData.milkEPD ? parseFloat(formData.milkEPD) : null,
        marbling: formData.marblingEPD ? parseFloat(formData.marblingEPD) : null,
        ribeyeArea: formData.ribeyeAreaEPD ? parseFloat(formData.ribeyeAreaEPD) : null,
      };

      const notableAncestors = ancestors
        .filter(a => a.name.trim())
        .map(a => `${a.name} (${a.relationship})`);

      const response = await fetch(`/api/bulls/${params.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          epdData,
          geneticMarkers: formData.geneticMarkers || null,
          dnaTestResults: formData.dnaTestResults || null,
          sireName: formData.sireName || null,
          damName: formData.damName || null,
          notableAncestors,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to update bull');
      } else {
        if (action === 'draft') {
          router.push('/dashboard?success=bull-updated');
        } else {
          // Continue to performance data (Story 2.5)
          router.push(`/bulls/${params.slug}/edit/performance?from=genetic`);
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
            <h2 className="text-3xl font-bold text-gray-900">Genetic Data & Pedigree</h2>
            <p className="mt-2 text-sm text-gray-600">
              Step 2 of 3: Add genetic information and pedigree details (all fields optional)
            </p>
          </div>

          <form className="space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* EPD Values Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Expected Progeny Differences (EPDs)
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                EPDs predict the genetic merit of an animal&apos;s offspring. All fields are optional.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="birthWeightEPD" className="block text-sm font-medium text-gray-700">
                    Birth Weight EPD (lbs)
                    <span className="text-gray-500 font-normal" title="Predicts birth weight of offspring">&#39;</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="birthWeightEPD"
                    name="birthWeightEPD"
                    value={formData.birthWeightEPD}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600"
                    placeholder="e.g., +2.5"
                  />
                </div>

                <div>
                  <label htmlFor="weaningWeightEPD" className="block text-sm font-medium text-gray-700">
                    Weaning Weight EPD (lbs)
                    <span className="text-gray-500 font-normal ml-1" title="Predicts weaning weight of offspring">ⓘ</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="weaningWeightEPD"
                    name="weaningWeightEPD"
                    value={formData.weaningWeightEPD}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600"
                    placeholder="e.g., +45"
                  />
                </div>

                <div>
                  <label htmlFor="yearlingWeightEPD" className="block text-sm font-medium text-gray-700">
                    Yearling Weight EPD (lbs)
                    <span className="text-gray-500 font-normal ml-1" title="Predicts yearling weight of offspring">ⓘ</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="yearlingWeightEPD"
                    name="yearlingWeightEPD"
                    value={formData.yearlingWeightEPD}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600"
                    placeholder="e.g., +80"
                  />
                </div>

                <div>
                  <label htmlFor="milkEPD" className="block text-sm font-medium text-gray-700">
                    Milk EPD (lbs)
                    <span className="text-gray-500 font-normal ml-1" title="Predicts maternal milk production">ⓘ</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="milkEPD"
                    name="milkEPD"
                    value={formData.milkEPD}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600"
                    placeholder="e.g., +25"
                  />
                </div>

                <div>
                  <label htmlFor="marblingEPD" className="block text-sm font-medium text-gray-700">
                    Marbling EPD
                    <span className="text-gray-500 font-normal ml-1" title="Predicts intramuscular fat">ⓘ</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="marblingEPD"
                    name="marblingEPD"
                    value={formData.marblingEPD}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600"
                    placeholder="e.g., +0.45"
                  />
                </div>

                <div>
                  <label htmlFor="ribeyeAreaEPD" className="block text-sm font-medium text-gray-700">
                    Ribeye Area EPD (sq in)
                    <span className="text-gray-500 font-normal ml-1" title="Predicts ribeye muscle area">ⓘ</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="ribeyeAreaEPD"
                    name="ribeyeAreaEPD"
                    value={formData.ribeyeAreaEPD}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600"
                    placeholder="e.g., +0.75"
                  />
                </div>
              </div>
            </div>

            {/* Genetic Markers Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Genetic Markers & DNA</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="geneticMarkers" className="block text-sm font-medium text-gray-700">
                    Genetic Markers (Optional)
                  </label>
                  <input
                    type="text"
                    id="geneticMarkers"
                    name="geneticMarkers"
                    value={formData.geneticMarkers}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600"
                    placeholder="e.g., Polled, Red carrier"
                  />
                </div>

                <div>
                  <label htmlFor="dnaTestResults" className="block text-sm font-medium text-gray-700">
                    DNA Test Results (Optional)
                  </label>
                  <textarea
                    id="dnaTestResults"
                    name="dnaTestResults"
                    rows={4}
                    maxLength={1000}
                    value={formData.dnaTestResults}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600"
                    placeholder="Enter DNA test results, genomic information, or other genetic details..."
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.dnaTestResults.length}/1000 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Pedigree Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pedigree Information</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="sireName" className="block text-sm font-medium text-gray-700">
                      Sire (Father)
                    </label>
                    <input
                      type="text"
                      id="sireName"
                      name="sireName"
                      value={formData.sireName}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600"
                      placeholder="Sire name"
                    />
                  </div>

                  <div>
                    <label htmlFor="damName" className="block text-sm font-medium text-gray-700">
                      Dam (Mother)
                    </label>
                    <input
                      type="text"
                      id="damName"
                      name="damName"
                      value={formData.damName}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600"
                      placeholder="Dam name"
                    />
                  </div>
                </div>

                {/* Notable Ancestors */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Notable Ancestors (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={handleAddAncestor}
                      disabled={ancestors.length >= 6}
                      className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      + Add Ancestor
                    </button>
                  </div>
                  
                  {ancestors.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No ancestors added yet</p>
                  )}
                  
                  <div className="space-y-3">
                    {ancestors.map((ancestor) => (
                      <div key={ancestor.id} className="flex gap-2">
                        <input
                          type="text"
                          value={ancestor.name}
                          onChange={(e) => handleAncestorChange(ancestor.id, 'name', e.target.value)}
                          placeholder="Ancestor name"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600"
                        />
                        <input
                          type="text"
                          value={ancestor.relationship}
                          onChange={(e) => handleAncestorChange(ancestor.id, 'relationship', e.target.value)}
                          placeholder="Relationship"
                          className="w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-600 focus:border-blue-600"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveAncestor(ancestor.id)}
                          className="px-3 py-2 text-red-600 hover:text-red-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  {ancestors.length > 0 && (
                    <p className="mt-2 text-xs text-gray-500">
                      {ancestors.length}/6 ancestors added
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => handleSubmit('back')}
                disabled={loading}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                ← Back to Photos
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
                onClick={() => handleSubmit('continue')}
                disabled={loading}
                className="flex-1 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Continue to Performance →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
