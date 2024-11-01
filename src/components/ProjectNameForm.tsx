import React from 'react';

interface ProjectNameFormProps {
  onSubmit: (name: string) => void;
  initialName: string;
}

/**
 * Form component for entering the project name.
 * Allows users to input and submit the project name.
 */
export const ProjectNameForm: React.FC<ProjectNameFormProps> = ({ onSubmit, initialName }) => {
  const [name, setName] = React.useState(initialName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Project Name</h2>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
            Project Name
          </label>
          <input
            type="text"
            id="projectName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter project name"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
      </div>
    </form>
  );
};