import { CalculationResults } from '../types';
import { formatCurrency } from './calculations';

export const generateDetailedNote = (
  projectName: string,
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

PROJET : ${projectName}

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
    note += `

${site}:
-------
1. Études d'exécution (45% des études):
   Base de calcul = ${formatCurrency(projectCost)}
   Formule = Coût × Taux études × 0.45 × (1 - Réduction)
   Calcul = ${formatCurrency(projectCost)} × ${(studyRate).toFixed(4)} × 0.45 × (1 - ${(data.reduction_execution / 100).toFixed(2)})
   Résultat = ${formatCurrency(data.etude_execution)}

2. Assistance maître d'ouvrage (5% des études):
   Base de calcul = ${formatCurrency(projectCost)}
   Formule = Coût × Taux études × 0.05
   Calcul = ${formatCurrency(projectCost)} × ${(studyRate).toFixed(4)} × 0.05
   Résultat = ${formatCurrency(data.assistance)}

3. Suivi des travaux:
   Base de calcul = ${formatCurrency(projectCost)}
   Formule = Coût × Taux suivi
   Calcul = ${formatCurrency(projectCost)} × ${(monitoringRate).toFixed(4)}
   Résultat = ${formatCurrency(data.suivi)}

Total ${site} = ${formatCurrency(data.etude_execution)} + ${formatCurrency(data.assistance)} + ${formatCurrency(data.suivi)}
            = ${formatCurrency(data.total)}`;
  }

  const totalGlobal = Object.values(results).reduce((sum, site) => sum + site.total, 0);
  note += `

=================================================================
TOTAL GLOBAL : ${formatCurrency(totalGlobal)}
=================================================================`;

  return note;
};

export const downloadNote = (content: string) => {
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