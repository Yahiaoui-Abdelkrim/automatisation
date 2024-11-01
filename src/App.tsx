import React from 'react';
import { ProjectNameForm } from './components/ProjectNameForm';
import { SiteNamesForm } from './components/SiteNamesForm';
import { ProjectForm } from './components/ProjectForm';
import { SimilarityCheck } from './components/SimilarityCheck';
import { SiteForm } from './components/SiteForm';
import { Results } from './components/Results';
import { calculateSiteEstimation, determineRateAndRange } from './utils/calculations';
import type { CalculationResults } from './types';

function App() {
  const [step, setStep] = React.useState(0);
  const [projectName, setProjectName] = React.useState('');
  const [siteNames, setSiteNames] = React.useState<string[]>([]);
  const [areSitesSimilar, setAreSitesSimilar] = React.useState<boolean | null>(null);
  const [projectData, setProjectData] = React.useState<{
    baseEstimate: number;
    margin: number;
    category: string;
  } | null>(null);
  const [currentSite, setCurrentSite] = React.useState(0);
  const [results, setResults] = React.useState<CalculationResults>({});
  const [rates, setRates] = React.useState<{ study: number; monitoring: number } | null>(null);

  const handleProjectNameSubmit = (name: string) => {
    setProjectName(name);
    setStep(1);
  };

  const handleSiteNamesSubmit = (names: string[]) => {
    setSiteNames(names);
    setStep(2);
  };

  const handleSimilarityCheck = (areSimilar: boolean) => {
    setAreSitesSimilar(areSimilar);
    setStep(3);
  };

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
    setStep(4);
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
      [siteNames[currentSite]]: {
        etude_execution: siteResults.executionStudy,
        assistance: siteResults.assistance,
        suivi: siteResults.monitoring,
        total: siteResults.total,
        reduction_execution: data.reductions.execution,
      },
    }));

    if (currentSite < siteNames.length - 1) {
      setCurrentSite((prev) => prev + 1);
    } else {
      setStep(5);
    }
  };

  const handleBack = () => {
    if (step === 4) {
      if (currentSite > 0) {
        setCurrentSite((prev) => prev - 1);
        setResults((prev) => {
          const newResults = { ...prev };
          delete newResults[siteNames[currentSite]];
          return newResults;
        });
      } else {
        setStep(3);
        setCurrentSite(0);
        setResults({});
      }
    } else if (step === 5) {
      setStep(4);
      setCurrentSite(siteNames.length - 1);
      setResults((prev) => {
        const newResults = { ...prev };
        delete newResults[siteNames[siteNames.length - 1]];
        return newResults;
      });
    } else if (step === 3) {
      setStep(2);
      setAreSitesSimilar(null);
      setProjectData(null);
    } else if (step === 2) {
      setStep(1);
      setSiteNames([]);
    } else if (step === 1) {
      setStep(0);
      setProjectName('');
    }
  };

  const handleReset = () => {
    setStep(0);
    setProjectName('');
    setCurrentSite(0);
    setResults({});
    setProjectData(null);
    setRates(null);
    setSiteNames([]);
    setAreSitesSimilar(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Estimation des Coûts Administratifs
        </h1>

        <div className="flex flex-col items-center space-y-8">
          {step === 0 && (
            <ProjectNameForm 
              onSubmit={handleProjectNameSubmit} 
              initialName={projectName} 
            />
          )}
          {step === 1 && <SiteNamesForm onSubmit={handleSiteNamesSubmit} />}
          {step === 2 && <SimilarityCheck onSubmit={handleSimilarityCheck} />}
          {step === 3 && <ProjectForm onSubmit={handleProjectSubmit} />}
          {step === 4 && (
            <SiteForm
              siteName={siteNames[currentSite]}
              onSubmit={handleSiteSubmit}
            />
          )}
          {step === 5 && projectData && rates && (
            <Results 
              projectName={projectName}
              results={results}
              projectData={projectData}
              rates={rates}
              onReset={handleReset}
            />
          )}

          {step > 0 && (
            <button
              onClick={handleBack}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Retour
            </button>
          )}

          <div className="flex gap-2">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index < step
                    ? 'bg-blue-600'
                    : index === step
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