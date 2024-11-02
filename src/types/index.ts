export interface ProjectData {
  baseEstimate: number;
  margin: number;
  category: 'A' | 'B' | 'C' | 'D' | 'E';
}

export interface SiteData {
  hasExistingStudy: boolean;
  reductions: {
    preliminaries: number | null;
    preliminary: number | null;
    execution: number | null;
  };
}

export interface CalculationResults {
  [key: string]: {
    preliminaries: number;
    preliminary: number;
    execution: number;
    assistance: number;
    suivi: number;
    total: number;
    reduction_preliminaries: number | null;
    reduction_preliminary: number | null;
    reduction_execution: number | null;
  };
}