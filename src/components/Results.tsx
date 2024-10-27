import React from 'react';
import { FileText } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';
import type { CalculationResults } from '../types';

interface ResultsProps {
  results: CalculationResults;
}

/**
 * Component to display the results of the site estimations.
 * Shows detailed costs for each site and a global total.
 */
export const Results: React.FC<ResultsProps> = ({ results }) => {
  // Calculate the total cost across all sites
  const totalGlobal = Object.values(results).reduce(
    (sum, site) => sum + site.total,
    0
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Results</h2>
      </div>

      <div className="space-y-6">
        {Object.entries(results).map(([site, data]) => (
          <div key={site} className="border-b pb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">{site}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Execution Studies</p>
                <p className="text-base font-medium">
                  {formatCurrency(data.etude_execution)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Owner Assistance</p>
                <p className="text-base font-medium">
                  {formatCurrency(data.assistance)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Work Monitoring</p>
                <p className="text-base font-medium">
                  {formatCurrency(data.suivi)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Site Total</p>
                <p className="text-base font-medium text-blue-600">
                  {formatCurrency(data.total)}
                </p>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4">
          <p className="text-lg font-semibold text-gray-800">Global Total</p>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(totalGlobal)}
          </p>
        </div>
      </div>
    </div>
  );
};
