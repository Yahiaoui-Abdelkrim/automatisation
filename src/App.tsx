import React from 'react';
import { ProjectForm } from './components/ProjectForm';
import { SiteForm } from './components/SiteForm';
import { Results } from './components/Results';
import { calculateSiteEstimation } from './utils/calculations';
import type { CalculationResults } from './types';

// List of site names for the estimation process
const SITES = ['BELLIL', 'DJEBEL M\'RAKEB'];

/**
 * Main application component for administrative cost estimation.
 * Manages the flow between project data input, site-specific data input, and results display.
 */
function App() {
  // State to track the current step in the process
  const [step, setStep] = React.useState(1);

  // State to store project data submitted from the ProjectForm
  const [projectData, setProjectData] = React.useState<{
    baseEstimate: number;
    margin: number;
    category: string;
  } | null>(null);

  // State to track the current site being processed
  const [currentSite, setCurrentSite] = React.useState(0);

  // State to store the calculation results for each site
  const [results, setResults] = React.useState<CalculationResults>({});

  /**
   * Handles submission of project data from the ProjectForm.
   * @param data - The project data including base estimate, margin, and category.
   */
  const handleProjectSubmit = (data: {
    baseEstimate: number;
    margin: number;
    category: string;
  }) => {
    setProjectData(data);
    setStep(2);
  };

  /**
   * Handles submission of site-specific data from the SiteForm.
   * Calculates the site estimation and updates the results state.
   * @param data - The site-specific data including existing study status and reductions.
   */
  const handleSiteSubmit = (data: {
    hasExistingStudy: boolean;
    reductions: { execution: number };
  }) => {
    if (!projectData) return;

    // Calculate the project cost with margin
    const projectCost = projectData.baseEstimate * (1 + projectData.margin / 100);
    const projectCostMillions = projectCost / 1_000_000;

    // Calculate site estimation results
    const siteResults = calculateSiteEstimation(
      projectCost,
      projectCostMillions,
      projectData.category,
      data.reductions
    );

    // Update results with the new site estimation
    setResults((prev) => ({
      ...prev,
      [SITES[currentSite]]: {
        etude_execution: siteResults.executionStudy,
        assistance: siteResults.assistance,
        suivi: siteResults.monitoring,
        total: siteResults.total,
        reduction_execution: data.reductions.execution,
      },
    }));

    // Move to the next site or step to results display
    if (currentSite < SITES.length - 1) {
      setCurrentSite((prev) => prev + 1);
    } else {
      setStep(3);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Administrative Cost Estimation
        </h1>

        <div className="flex flex-col items-center space-y-8">
          {step === 1 && <ProjectForm onSubmit={handleProjectSubmit} />}
          {step === 2 && (
            <SiteForm
              siteName={SITES[currentSite]}
              onSubmit={handleSiteSubmit}
            />
          )}
          {step === 3 && <Results results={results} />}

          {/* Indicator for the current site being processed */}
          <div className="flex gap-2">
            {SITES.map((site, index) => (
              <div
                key={site}
                className={`w-3 h-3 rounded-full ${
                  index < currentSite || step === 3
                    ? 'bg-blue-600'
                    : index === currentSite && step === 2
                    ? 'bg-blue-400'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
