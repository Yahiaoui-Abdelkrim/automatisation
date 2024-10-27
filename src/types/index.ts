/**
 * Interface representing the data for a project.
 * Includes the base estimate, margin, and category.
 */
export interface ProjectData {
  baseEstimate: number;
  margin: number;
  category: 'A' | 'B' | 'C' | 'D' | 'E';
}

/**
 * Interface representing the data for a site.
 * Includes information about existing studies and reduction percentages.
 * Optionally includes calculated costs.
 */
export interface SiteData {
  hasExistingStudy: boolean;
  reductions: {
    preliminaries: number;
    preliminary: number;
    execution: number;
  };
  calculations?: {
    executionStudy: number;
    assistance: number;
    monitoring: number;
    total: number;
  };
}

/**
 * Interface representing the calculation results for multiple sites.
 * Maps site names to their respective cost breakdowns.
 */
export interface CalculationResults {
  [key: string]: {
    etude_execution: number;
    assistance: number;
    suivi: number;
    total: number;
    reduction_execution: number;
  };
}
