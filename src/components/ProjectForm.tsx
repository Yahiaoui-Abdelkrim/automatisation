import React from 'react';
import { Calculator } from 'lucide-react';

interface ProjectFormProps {
  onSubmit: (data: {
    baseEstimate: number;
    margin: number;
    category: string;
  }) => void;
}

/**
 * Form component for entering project data.
 * Collects base estimate, margin, and category information.
 */
export const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit }) => {
  const [baseEstimate, setBaseEstimate] = React.useState('');
  const [margin, setMargin] = React.useState('20');
  const [category, setCategory] = React.useState('A');

  /**
   * Handles form submission and passes data to the parent component.
   * @param e - Form event.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      baseEstimate: Number(baseEstimate),
      margin: Number(margin),
      category,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
    >
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">
          Project Information
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="baseEstimate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Base Estimate (DA)
          </label>
          <input
            type="number"
            id="baseEstimate"
            value={baseEstimate}
            onChange={(e) => setBaseEstimate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label
            htmlFor="margin"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Margin (%)
          </label>
          <input
            type="number"
            id="margin"
            value={margin}
            onChange={(e) => setMargin(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min="0"
            max="100"
            step="0.1"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Project Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            {['A', 'B', 'C', 'D', 'E'].map((cat) => (
              <option key={cat} value={cat}>
                Category {cat}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Calculate
        </button>
      </div>
    </form>
  );
};
