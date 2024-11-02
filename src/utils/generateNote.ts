import { CalculationResults } from '../types';
import { formatCurrency } from './calculations';

export const generateDetailedNote = (
  _projectName: string,
  baseEstimate: number,
  margin: number,
  category: string,
  results: CalculationResults,
  studyRate: number,
  monitoringRate: number
): string => {
  const projectCost = baseEstimate * (1 + margin / 100);
  const projectCostMillions = projectCost / 1_000_000;

  let note = `
=================================================================
                    NOTE DE CALCUL DÉTAILLÉE
                    ${new Date().toLocaleString('fr-FR')}
=================================================================

DONNÉES D'ENTRÉE :
----------------
Estimation de base : ${formatCurrency(baseEstimate)}
Marge appliquée : ${margin}%
Coût du projet avec marge : ${formatCurrency(projectCost)}
Coût en millions : ${projectCostMillions.toFixed(2)} millions DA
Catégorie : ${category}

TAUX APPLIQUÉS :
--------------
Taux études : ${(studyRate * 100).toFixed(2)}%
Taux suivi : ${(monitoringRate * 100).toFixed(2)}%

DÉTAIL DES CALCULS :
------------------`;

  for (const [site, data] of Object.entries(results)) {
    note += `\n\n${site}:\n-------`;

    // Preliminary studies
    note += `\n1. Études préliminaires:`;
    note += `\n   Base de calcul = ${formatCurrency(projectCost)}`;
    if (data.reduction_preliminaries !== null) {
      note += `\n   Formule = Coût × Taux études × 0.20 × (1 - Réduction)`;
      note += `\n   Calcul = ${formatCurrency(projectCost)} × ${studyRate.toFixed(4)} × 0.20 × (1 - ${(data.reduction_preliminaries / 100).toFixed(2)})`;
    } else {
      note += `\n   Formule = Coût × Taux études × 0.20`;
      note += `\n   Calcul = ${formatCurrency(projectCost)} × ${studyRate.toFixed(4)} × 0.20`;
    }
    note += `\n   Résultat = ${formatCurrency(data.preliminaries)}`;

    // Preliminary project studies
    note += `\n\n2. Études d'avant-projet:`;
    note += `\n   Base de calcul = ${formatCurrency(projectCost)}`;
    if (data.reduction_preliminary !== null) {
      note += `\n   Formule = Coût × Taux études × 0.30 × (1 - Réduction)`;
      note += `\n   Calcul = ${formatCurrency(projectCost)} × ${studyRate.toFixed(4)} × 0.30 × (1 - ${(data.reduction_preliminary / 100).toFixed(2)})`;
    } else {
      note += `\n   Formule = Coût × Taux études × 0.30`;
      note += `\n   Calcul = ${formatCurrency(projectCost)} × ${studyRate.toFixed(4)} × 0.30`;
    }
    note += `\n   Résultat = ${formatCurrency(data.preliminary)}`;

    // Execution studies
    note += `\n\n3. Études d'exécution:`;
    note += `\n   Base de calcul = ${formatCurrency(projectCost)}`;
    if (data.reduction_execution !== null) {
      note += `\n   Formule = Coût × Taux études × 0.45 × (1 - Réduction)`;
      note += `\n   Calcul = ${formatCurrency(projectCost)} × ${studyRate.toFixed(4)} × 0.45 × (1 - ${(data.reduction_execution / 100).toFixed(2)})`;
    } else {
      note += `\n   Formule = Coût × Taux études × 0.45`;
      note += `\n   Calcul = ${formatCurrency(projectCost)} × ${studyRate.toFixed(4)} × 0.45`;
    }
    note += `\n   Résultat = ${formatCurrency(data.execution)}`;

    // Assistance
    note += `\n\n4. Assistance maître d'ouvrage:`;
    note += `\n   Base de calcul = ${formatCurrency(projectCost)}`;
    note += `\n   Formule = Coût × Taux études × 0.05`;
    note += `\n   Calcul = ${formatCurrency(projectCost)} × ${studyRate.toFixed(4)} × 0.05`;
    note += `\n   Résultat = ${formatCurrency(data.assistance)}`;

    // Monitoring
    note += `\n\n5. Suivi des travaux:`;
    note += `\n   Base de calcul = ${formatCurrency(projectCost)}`;
    note += `\n   Formule = Coût × Taux suivi`;
    note += `\n   Calcul = ${formatCurrency(projectCost)} × ${monitoringRate.toFixed(4)}`;
    note += `\n   Résultat = ${formatCurrency(data.suivi)}`;

    note += `\n\nTotal ${site} = ${formatCurrency(data.preliminaries)} + ${formatCurrency(data.preliminary)} + ${formatCurrency(data.execution)} + ${formatCurrency(data.assistance)} + ${formatCurrency(data.suivi)}`;
    note += `\n            = ${formatCurrency(data.total)}`;
  }

  const totalGlobal = Object.values(results).reduce((sum, site) => sum + site.total, 0);
  note += `\n\n=================================================================`;
  note += `\nTOTAL GLOBAL : ${formatCurrency(totalGlobal)}`;
  note += `\n=================================================================`;

  return note;
};

export const downloadNote = (content: string): void => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `note_calcul_${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};