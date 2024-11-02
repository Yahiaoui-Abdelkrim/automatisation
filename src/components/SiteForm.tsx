import React from 'react';
import { Building } from 'lucide-react';

interface SiteFormProps {
  siteName: string;
  onSubmit: (data: {
    hasExistingStudy: boolean;
    reductions: {
      preliminaries: number | null;
      preliminary: number | null;
      execution: number | null;
    };
  }) => void;
}

export const SiteForm: React.FC<SiteFormProps> = ({ siteName, onSubmit }) => {
  const [hasExistingStudy, setHasExistingStudy] = React.useState(false);
  const [availableStudies, setAvailableStudies] = React.useState({
    preliminaries: false,
    preliminary: false,
    execution: false,
  });
  const [reductions, setReductions] = React.useState({
    preliminaries: null as number | null,
    preliminary: null as number | null,
    execution: null as number | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      hasExistingStudy,
      reductions: {
        preliminaries: availableStudies.preliminaries ? (reductions.preliminaries ?? 100) : null,
        preliminary: availableStudies.preliminary ? (reductions.preliminary ?? 100) : null,
        execution: availableStudies.execution ? (reductions.execution ?? 100) : null,
      },
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
              Existe-t-il des études réalisées dans un autre marché?
            </span>
          </label>
        </div>

        {hasExistingStudy && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Études disponibles</h3>
            <div className="space-y-2">
              {Object.entries({
                preliminaries: 'Études préliminaires',
                preliminary: 'Études d\'avant-projet',
                execution: 'Études d\'exécution',
              }).map(([key, label]) => (
                <label key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={availableStudies[key as keyof typeof availableStudies]}
                    onChange={(e) =>
                      setAvailableStudies((prev) => ({
                        ...prev,
                        [key]: e.target.checked,
                      }))
                    }
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">
                Pourcentages de réduction
              </h3>
              {Object.entries({
                preliminaries: 'Études préliminaires',
                preliminary: 'Études d\'avant-projet',
                execution: 'Études d\'exécution',
              }).map(([key, label]) => (
                availableStudies[key as keyof typeof availableStudies] && (
                  <div key={key}>
                    <label
                      htmlFor={key}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {label} (%)
                    </label>
                    <input
                      type="number"
                      id={key}
                      value={reductions[key as keyof typeof reductions] ?? 100}
                      onChange={(e) =>
                        setReductions((prev) => ({
                          ...prev,
                          [key]: e.target.value ? Number(e.target.value) : 100,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Calculer le site
        </button>
      </div>
    </form>
  );
};