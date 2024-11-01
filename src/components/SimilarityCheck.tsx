import React from 'react';
import { Copy } from 'lucide-react';

interface SimilarityCheckProps {
  onSubmit: (areSimilar: boolean) => void;
}

export const SimilarityCheck: React.FC<SimilarityCheckProps> = ({ onSubmit }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      <div className="flex items-center gap-3 mb-6">
        <Copy className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Similarité des Projets</h2>
      </div>

      <div className="space-y-6">
        <p className="text-gray-600">
          Est-ce que tous les sites utilisent les mêmes informations de projet (estimation de base, marge et catégorie) ?
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => onSubmit(true)}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Oui, utiliser les mêmes informations pour tous les sites
          </button>
          <button
            onClick={() => onSubmit(false)}
            className="w-full border border-blue-600 text-blue-600 py-3 px-4 rounded-md hover:bg-blue-50 transition-colors"
          >
            Non, chaque site nécessite des informations différentes
          </button>
        </div>
      </div>
    </div>
  );
};