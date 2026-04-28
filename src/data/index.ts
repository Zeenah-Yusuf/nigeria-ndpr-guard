// src/data/index.ts
// Centralized data exports for all frameworks

import ndpaDataset from './ndpa_dataset.json';
import cbnDataset from './cbn_dataset.json';
import secDataset from './sec_dataset.json';
import nitdaDataset from './nitda_dataset.json';

// Multilingual clause files
import enClauses from './en-clause.json';
import haClauses from './ha-clause.json';
import igClauses from './ig-clause.json';
import yoClauses from './yo-clause.json';

export {
  ndpaDataset,
  cbnDataset,
  secDataset,
  nitdaDataset,
  enClauses,
  haClauses,
  igClauses,
  yoClauses,
};

export const allDatasets = {
  NDPA: ndpaDataset,
  'CBN-AML': cbnDataset,
  'CBN-CP': cbnDataset,
  'SEC-CF': secDataset,
  'NITDA-DP': nitdaDataset,
  'NITDA-LC': nitdaDataset,
};

export const multilingualClauses = {
  en: enClauses,
  ha: haClauses,
  ig: igClauses,
  yo: yoClauses,
};

export function getDatasetByFramework(framework: string) {
  return allDatasets[framework] || ndpaDataset;
}

export function getClausesByLanguage(language: string) {
  return multilingualClauses[language] || enClauses;
}