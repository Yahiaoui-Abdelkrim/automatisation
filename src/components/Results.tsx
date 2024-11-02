import React from 'react';
import { FileText, Download, RotateCcw } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';
import { generateDetailedNote, downloadNote } from '../utils/generateNote';
import type { CalculationResults } from '../types';

interface ResultsProps {
  projectName: string;
  results: CalculationResults;
  projectData: {
    baseEstimate: number;
    margin: number;
    category: string;
  };
  rates: {
    study: number;
    monitoring: number;
  };
  onReset: () => void;
}

export const Results: React.FC<ResultsProps> = ({
  projectName,
  results,
  projectData,
  rates,
  onReset,
}) => {
  const totalGlobal = Object.values(results).reduce(
    (sum, site) => sum + site.total,
    0
  );

  const handleDownload = () => {
    const note = generateDetailedNote(
      projectName,
      projectData.baseEstimate,
      projectData.margin,
      projectData.category,
      results,
      rates.study,
      rates.monitoring
    );
    downloadNote(note);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Results</h2>
          </div>
          <p className="text-sm text-gray-600 mt-1">{projectName}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Note
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            New Calculation
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(results).map(([site, data]) => (
          <div key={site} className="border-b pb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">{site}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Études préliminaires</p>
                <p className="text-base font-medium">
                  {formatCurrency(data.preliminaries)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Études d'avant-projet</p>
                <p className="text-base font-medium">
                  {formatCurrency(data.preliminary)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Études d'exécution</p>
                <p className="text-base font-medium">
                  {formatCurrency(data.execution)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Assistance maître d'ouvrage</p>
                <p className="text-base font-medium">
                  {formatCurrency(data.assistance)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Suivi des travaux</p>
                <p className="text-base font-medium">
                  {formatCurrency(data.suivi)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Site</p>
                <p className="text-base font-medium text-blue-600">
                  {formatCurrency(data.total)}
                </p>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4">
          <p className="text-lg font-semibold text-gray-800">Total Global</p>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(totalGlobal)}
          </p>
        </div>
      </div>
    </div>
  );
};