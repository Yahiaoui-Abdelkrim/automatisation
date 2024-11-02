const RANGES = [
  [0, 50],
  [50, 150],
  [150, 250],
  [250, 450],
  [450, 650],
  [650, 1050],
  [1050, 1450],
  [1450, Infinity],
];

const STUDY_RATES = {
  A: [3.00, 2.90, 2.80, 2.70, 2.60, 2.50, 2.40, 2.30],
  B: [null, 3.65, 3.55, 3.45, 3.35, 3.25, 3.15, 3.05],
  C: [null, null, 4.30, 4.20, 4.10, 4.00, 3.90, 4.80],
  D: [null, null, null, 4.95, 4.85, 4.75, 4.65, 4.55],
  E: [null, null, null, null, 5.60, 5.50, 5.40, 5.30],
};

const MONITORING_RATES = {
  A: [6.20, 5.70, 5.20, 4.70, 4.50, 3.70, 3.20, 2.70],
  B: [null, 5.80, 5.30, 4.80, 4.30, 3.80, 3.30, 2.80],
  C: [null, null, 5.40, 4.90, 4.40, 3.90, 3.40, 2.90],
  D: [null, null, null, 5.00, 4.50, 4.00, 3.50, 3.00],
  E: [null, null, null, null, 4.60, 4.10, 3.60, 3.10],
};

export const determineRateAndRange = (
  amountMillions: number,
  category: string,
  type: 'study' | 'monitoring'
): number => {
  const rangeIndex = RANGES.findIndex(
    ([min, max]) => amountMillions >= min && amountMillions < max
  );

  if (rangeIndex === -1) {
    throw new Error('Amount out of bounds');
  }

  const ratesTable = type === 'study' ? STUDY_RATES : MONITORING_RATES;
  const rate = ratesTable[category as keyof typeof STUDY_RATES][rangeIndex];

  if (rate === null) {
    throw new Error(`No rate defined for category ${category} in this range`);
  }

  return rate / 100;
};

export const calculateSiteEstimation = (
  projectCost: number,
  projectCostMillions: number,
  category: string,
  reductions: {
    preliminaries: number | null;
    preliminary: number | null;
    execution: number | null;
  }
) => {
  const studyRate = determineRateAndRange(projectCostMillions, category, 'study');
  const monitoringRate = determineRateAndRange(projectCostMillions, category, 'monitoring');

  // Preliminary studies (20%)
  const preliminaries = projectCost * studyRate * 0.20 * 
    (reductions.preliminaries !== null ? (1 - reductions.preliminaries / 100) : 1);

  // Preliminary project studies (30%)
  const preliminary = projectCost * studyRate * 0.30 * 
    (reductions.preliminary !== null ? (1 - reductions.preliminary / 100) : 1);

  // Execution studies (45%)
  const execution = projectCost * studyRate * 0.45 * 
    (reductions.execution !== null ? (1 - reductions.execution / 100) : 1);

  const assistance = projectCost * studyRate * 0.05;
  const monitoring = projectCost * monitoringRate;

  return {
    preliminaries,
    preliminary,
    execution,
    assistance,
    monitoring,
    total: preliminaries + preliminary + execution + assistance + monitoring,
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: 'DZD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};