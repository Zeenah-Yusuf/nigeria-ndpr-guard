export const AZURE_FUNCTION_URL = import.meta.env.VITE_AZURE_FUNCTION_URL || '';

export const DCPMI_THRESHOLDS = {
  ULTRA_HIGH: 10000,
  EXTRA_HIGH: 5000,
  ORDINARY_HIGH: 2000,
} as const;

export const RISK_LEVELS = {
  LOW: { threshold: 30, color: 'risk-low', labelKey: 'risk.low' },
  MEDIUM: { threshold: 60, color: 'risk-medium', labelKey: 'risk.medium' },
  HIGH: { threshold: 100, color: 'risk-high', labelKey: 'risk.high' },
} as const;

export const NDPC_RESOURCES = {
  OFFICIAL_WEBSITE: 'https://ndpc.gov.ng',
  NDPA_FULL_TEXT: 'https://ndpc.gov.ng/ndpa-2023',
  GAID_2025: 'https://ndpc.gov.ng/gaid-2025',
  DPCO_DIRECTORY: 'https://ndpc.gov.ng/dpco-directory',
  CAR_FILING: 'https://ndpc.gov.ng/car-filing',
  BREACH_REPORTING: 'https://ndpc.gov.ng/breach-reporting',
  REGISTRATION: 'https://ndpc.gov.ng/registration',
} as const;