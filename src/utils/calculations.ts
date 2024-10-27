// Define ranges for project cost in millions
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

// Study rates for different project categories
const STUDY_RATES = {
  A: [3.00, 2.90, 2.80, 2.70, 2.60, 2.50, 2.40, 2.30],
  B: [null, 3.65, 3.55, 3.45, 3.35, 3.25, 3.15, 3.05],
  C: [null, null, 4.30, 4.20, 4.10, 4.00, 3.90, 4.80],
  D: [null, null, null, 4.95, 4.85, 4.75, 4.65, 4.55],
  E: [null, null, null, null, 5.60, 5.50, 5.40, 5.30],
};

// Monitoring rates for different project categories
const MONITORING_RATES = {
  A: [6.20, 5.70, 5.20, 4.70, 4.50, 3.70, 3.20, 2.70],
  B: [null, 5.80, 5.30, 4.80, 4.30, 3.80, 3.30, 2.80],
  C: [null, null, 5.40, 4.90, 4.40, 3.90, 3.40, 2.90],
  D: [null, null, null, 5.00, 4.50, 4.00, 3.50, 3.00],
  E: [null, null, null, null, 4.60, 4.10, 3.60, 3.10],
};

/**
 * Determines the rate based on project cost and category.
 * @param amountMillions - Project cost in millions.
 * @param category - Project category (A, B, C, D, E).
 * @param type - Type of rate ('study' or 'monitoring').
 * @returns The rate as a decimal.
 */
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

/**
 * Calculates the site estimation based on project cost and reductions.
 * @param projectCost - Total project cost.
 * @param projectCostMillions - Project cost in millions.
 * @param category - Project category.
 * @param reductions - Reductions applicable to the project.
 * @returns An object containing the calculated costs.
 */
export const calculateSiteEstimation = (
  projectCost: number,
  projectCostMillions: number,
  category: string,
  reductions: { execution: number }
) => {
  const studyRate = determineRateAndRange(projectCostMillions, category, 'study');
  const monitoringRate = determineRateAndRange(
    projectCostMillions,
    category,
    'monitoring'
  );

  const executionStudy =
    projectCost * studyRate * 0.45 * (1 - reductions.execution / 100);
  const assistance = projectCost * studyRate * 0.05;
  const monitoring = projectCost * monitoringRate;

  return {
    executionStudy,
    assistance,
    monitoring,
    total: executionStudy + assistance + monitoring,
  };
};

/**
 * Formats a number as currency in DZD.
 * @param amount - The amount to format.
 * @returns The formatted currency string.
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: 'DZD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
