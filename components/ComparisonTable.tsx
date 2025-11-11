'use client';

interface Bull {
  id: string;
  name: string;
  epdData?: any;
  sireName?: string | null;
  damName?: string | null;
  birthDate?: Date | string | null;
  birthWeight?: number | null;
  weaningWeight?: number | null;
  yearlingWeight?: number | null;
}

interface ComparisonTableProps {
  bulls: Bull[];
}

export default function ComparisonTable({ bulls }: ComparisonTableProps) {
  // EPD fields to compare
  const epdFields = [
    { key: 'birthWeight', label: 'Birth Weight (BW)', higherIsBetter: false },
    { key: 'weaningWeight', label: 'Weaning Weight (WW)', higherIsBetter: true },
    { key: 'yearlingWeight', label: 'Yearling Weight (YW)', higherIsBetter: true },
    { key: 'milk', label: 'Milk', higherIsBetter: true },
    { key: 'marbling', label: 'Marbling', higherIsBetter: true },
    { key: 'ribeye', label: 'Ribeye Area', higherIsBetter: true },
  ];

  const getEpdValue = (bull: Bull, field: string) => {
    return bull.epdData?.[field] ?? null;
  };

  const getHighlightClass = (value: number | null, values: (number | null)[], higherIsBetter: boolean) => {
    if (value === null) return '';
    
    const validValues = values.filter((v): v is number => v !== null);
    if (validValues.length === 0) return '';
    
    const max = Math.max(...validValues);
    const min = Math.min(...validValues);
    
    if (validValues.length === 1) return '';
    
    if (higherIsBetter) {
      if (value === max) return 'bg-green-100 font-semibold text-green-900';
      if (value === min) return 'bg-red-50 text-red-900';
    } else {
      if (value === min) return 'bg-green-100 font-semibold text-green-900';
      if (value === max) return 'bg-red-50 text-red-900';
    }
    
    return '';
  };

  const formatAge = (birthDate: Date | string | null | undefined) => {
    if (!birthDate) return 'N/A';
    const date = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    const now = new Date();
    const ageInMonths = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
    const years = Math.floor(ageInMonths / 12);
    const months = ageInMonths % 12;
    return years > 0 ? `${years}y ${months}m` : `${months}m`;
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-8">
      {/* EPD Comparison Table */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Genetic Data (EPDs)</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 p-3 text-left font-semibold text-gray-700">
                  EPD Trait
                </th>
                {bulls.map((bull) => (
                  <th key={bull.id} className="border border-gray-200 p-3 text-center font-semibold text-gray-700">
                    {bull.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {epdFields.map((field) => {
                const values = bulls.map((bull) => getEpdValue(bull, field.key));
                
                return (
                  <tr key={field.key} className="hover:bg-gray-50">
                    <td className="border border-gray-200 p-3 font-medium text-gray-700">
                      {field.label}
                    </td>
                    {values.map((value, idx) => (
                      <td
                        key={idx}
                        className={`border border-gray-200 p-3 text-center ${getHighlightClass(
                          value,
                          values,
                          field.higherIsBetter
                        )}`}
                      >
                        {value !== null ? (value > 0 ? `+${value}` : value) : 'N/A'}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
            <span>Best value</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
            <span>Lowest value</span>
          </div>
        </div>
      </div>

      {/* Pedigree Comparison */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Pedigree Information</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 p-3 text-left font-semibold text-gray-700">
                  Pedigree
                </th>
                {bulls.map((bull) => (
                  <th key={bull.id} className="border border-gray-200 p-3 text-center font-semibold text-gray-700">
                    {bull.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-200 p-3 font-medium text-gray-700">Sire</td>
                {bulls.map((bull) => (
                  <td key={bull.id} className="border border-gray-200 p-3 text-center">
                    {bull.sireName || 'N/A'}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-200 p-3 font-medium text-gray-700">Dam</td>
                {bulls.map((bull) => (
                  <td key={bull.id} className="border border-gray-200 p-3 text-center">
                    {bull.damName || 'N/A'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Data */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Performance Data</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 p-3 text-left font-semibold text-gray-700">
                  Metric
                </th>
                {bulls.map((bull) => (
                  <th key={bull.id} className="border border-gray-200 p-3 text-center font-semibold text-gray-700">
                    {bull.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-200 p-3 font-medium text-gray-700">Birth Date</td>
                {bulls.map((bull) => (
                  <td key={bull.id} className="border border-gray-200 p-3 text-center">
                    {formatDate(bull.birthDate)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-200 p-3 font-medium text-gray-700">Age</td>
                {bulls.map((bull) => (
                  <td key={bull.id} className="border border-gray-200 p-3 text-center">
                    {formatAge(bull.birthDate)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-200 p-3 font-medium text-gray-700">Birth Weight (lbs)</td>
                {bulls.map((bull) => (
                  <td key={bull.id} className="border border-gray-200 p-3 text-center">
                    {bull.birthWeight ?? 'N/A'}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-200 p-3 font-medium text-gray-700">Weaning Weight (lbs)</td>
                {bulls.map((bull) => (
                  <td key={bull.id} className="border border-gray-200 p-3 text-center">
                    {bull.weaningWeight ?? 'N/A'}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-200 p-3 font-medium text-gray-700">Yearling Weight (lbs)</td>
                {bulls.map((bull) => (
                  <td key={bull.id} className="border border-gray-200 p-3 text-center">
                    {bull.yearlingWeight ?? 'N/A'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
