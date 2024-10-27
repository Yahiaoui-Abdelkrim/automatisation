import React from 'react';
import { ProjectForm } from './components/ProjectForm';
import { SiteForm } from './components/SiteForm';
import { Results } from './components/Results';
import { calculateSiteEstimation, determineRateAndRange } from './utils/calculations';
import type { CalculationResults } from './types';

const SITES = ['BELLIL', 'DJEBEL M\'RAKEB'];

function App() {
  const [step, setStep] = React.useState(1);
  const [projectData, setProjectData] = React.useState<{
    baseEstimate: number;
    margin: number;
    category: string;
  } | null>(null);
  const [currentSite, setCurrentSite] = React.useState(0);
  const [results, setResults] = React.useState<CalculationResults>({});
  const [rates, setRates] = React.useState<{ study: number; monitoring: number } | null>(null);

  const handleProjectSubmit = (data: {
    baseEstimate: number;
    margin: number;
    category: string;
  }) => {
    setProjectData(data);
    const projectCost = data.baseEstimate * (1 + data.margin / 100);
    const projectCostMillions = projectCost / 1_000_000;
    
    const studyRate = determineRateAndRange(projectCostMillions, data.category, 'study');
    const monitoringRate = determineRateAndRange(projectCostMillions, data.category, 'monitoring');
    
    setRates({ study: studyRate, monitoring: monitoringRate });
    setStep(2);
  };

  const handleSiteSubmit = (data: {
    hasExistingStudy: boolean;
    reductions: { execution: number };
  }) => {
    if (!projectData) return;

    const projectCost = projectData.baseEstimate * (1 + projectData.margin / 100);
    const projectCostMillions = projectCost / 1_000_000;

    const siteResults = calculateSiteEstimation(
      projectCost,
      projectCostMillions,
      projectData.category,
      data.reductions
    );

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

    if (currentSite < SITES.length - 1) {
      setCurrentSite((prev) => prev + 1);
    } else {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      if (currentSite > 0) {
        setCurrentSite((prev) => prev - 1);
        setResults((prev) => {
          const newResults = { ...prev };
          delete newResults[SITES[currentSite]];
          return newResults;
        });
      } else {
        setStep(1);
        setCurrentSite(0);
        setResults({});
      }
    } else if (step === 3) {
      setStep(2);
      setCurrentSite(SITES.length - 1);
      setResults((prev) => {
        const newResults = { ...prev };
        delete newResults[SITES[SITES.length - 1]];
        return newResults;
      });
    }
  };

  const handleReset = () => {
    setStep(1);
    setCurrentSite(0);
    setResults({});
    setProjectData(null);
    setRates(null);
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
          {step === 3 && projectData && rates && (
            <Results 
              results={results}
              projectData={projectData}
              rates={rates}
              onReset={handleReset}
            />
          )}

          {step > 1 && (
            <button
              onClick={handleBack}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Go Back
            </button>
          )}

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