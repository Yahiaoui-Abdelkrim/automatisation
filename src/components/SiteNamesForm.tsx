import React from 'react';
import { Building, Plus, Trash2 } from 'lucide-react';

interface SiteNamesFormProps {
  onSubmit: (siteNames: string[]) => void;
}

export const SiteNamesForm: React.FC<SiteNamesFormProps> = ({ onSubmit }) => {
  const [siteNames, setSiteNames] = React.useState<string[]>(['']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validSiteNames = siteNames.filter(name => name.trim() !== '');
    if (validSiteNames.length > 0) {
      onSubmit(validSiteNames);
    }
  };

  const addSite = () => {
    setSiteNames([...siteNames, '']);
  };

  const removeSite = (index: number) => {
    if (siteNames.length > 1) {
      const newSiteNames = [...siteNames];
      newSiteNames.splice(index, 1);
      setSiteNames(newSiteNames);
    }
  };

  const updateSiteName = (index: number, value: string) => {
    const newSiteNames = [...siteNames];
    newSiteNames[index] = value;
    setSiteNames(newSiteNames);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
    >
      <div className="flex items-center gap-3 mb-6">
        <Building className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Noms des Sites</h2>
      </div>

      <div className="space-y-4">
        {siteNames.map((siteName, index) => (
          <div key={index} className="flex gap-2">
            <div className="flex-1">
              <label
                htmlFor={`siteName${index}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nom du Site {index + 1}
              </label>
              <input
                type="text"
                id={`siteName${index}`}
                value={siteName}
                onChange={(e) => updateSiteName(index, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="ex: BELLIL"
              />
            </div>
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeSite(index)}
                className="mt-7 p-2 text-red-600 hover:text-red-700 focus:outline-none"
                aria-label="Supprimer le site"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addSite}
          className="flex items-center gap-2 w-full justify-center py-2 px-4 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter un Site
        </button>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors mt-4"
        >
          Continuer
        </button>
      </div>
    </form>
  );
};