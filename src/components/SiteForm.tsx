import React from 'react';
import { Building } from 'lucide-react';

interface SiteFormProps {
  siteName: string;
  onSubmit: (data: {
    hasExistingStudy: boolean;
    reductions: {
      preliminaries: number;
      preliminary: number;
      execution: number;
    };
  }) => void;
}

/**
 * Form component for entering site-specific data.
 * Allows users to specify if a previous study exists and input reduction percentages.
 */
export const SiteForm: React.FC<SiteFormProps> = ({ siteName, onSubmit }) => {
  const [hasExistingStudy, setHasExistingStudy] = React.useState(false);
  const [reductions, setReductions] = React.useState({
    preliminaries: 0,
    preliminary: 0,
    execution: 0,
  });

  /**
   * Handles form submission and passes data to the parent component.
   * @param e - Form event.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      hasExistingStudy,
      reductions,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
    >
      <div className="flex items-center gap-3 mb-6">
        <Building className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">{siteName}</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={hasExistingStudy}
              onChange={(e) => setHasExistingStudy(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              Previous study exists for this site
            </span>
          </label>
        </div>

        {hasExistingStudy && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">
              Reduction Percentages
            </h3>
            {Object.entries(reductions).map(([key, value]) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)} (%)
                </label>
                <input
                  type="number"
                  id={key}
                  value={value}
                  onChange={(e) =>
                    setReductions((prev) => ({
                      ...prev,
                      [key]: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Calculate Site
        </button>
      </div>
    </form>
  );
};
