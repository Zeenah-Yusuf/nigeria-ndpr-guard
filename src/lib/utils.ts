// src/lib/utils.ts
// Utility functions for RegTrack

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================
// FORMATTING FUNCTIONS
// ============================================

/**
 * Format a number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-NG');
}

/**
 * Format currency in Naira
 */
export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}

/**
 * Format a date for display
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return new Date(date).toLocaleDateString('en-NG', options || defaultOptions);
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return diffMins <= 1 ? 'Just now' : `${diffMins} minutes ago`;
    }
    return `${diffHours} hours ago`;
  }
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

// ============================================
// RISK SCORE FUNCTIONS
// ============================================

/**
 * Get risk level from score
 */
export function getRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
  if (score <= 30) return 'low';
  if (score <= 60) return 'medium';
  if (score <= 80) return 'high';
  return 'critical';
}

/**
 * Get risk color
 */
export function getRiskColor(score: number): string {
  const level = getRiskLevel(score);
  const colors = {
    low: '#22c55e',
    medium: '#eab308',
    high: '#f97316',
    critical: '#ef4444',
  };
  return colors[level];
}

/**
 * Get risk background color
 */
export function getRiskBgColor(score: number): string {
  const level = getRiskLevel(score);
  const colors = {
    low: '#f0fdf4',
    medium: '#fefce8',
    high: '#fff7ed',
    critical: '#fef2f2',
  };
  return colors[level];
}

/**
 * Get risk label
 */
export function getRiskLabel(score: number): string {
  const level = getRiskLevel(score);
  const labels = {
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk',
    critical: 'Critical Risk',
  };
  return labels[level];
}

// ============================================
// DCPMI FUNCTIONS
// ============================================

/**
 * Get DCPMI tier based on data subject count
 */
export function getDcpmTier(dataSubjectCount: number): 'UHL' | 'EHL' | 'OHL' | null {
  if (dataSubjectCount > 10000) return 'UHL';
  if (dataSubjectCount >= 5000) return 'EHL';
  if (dataSubjectCount >= 2000) return 'OHL';
  return null;
}

/**
 * Get DCPMI tier label
 */
export function getDcpmLabel(tier: string | null): string {
  const labels: Record<string, string> = {
    'UHL': 'Ultra-High Level',
    'EHL': 'Extra-High Level',
    'OHL': 'Ordinary-High Level',
  };
  return tier ? labels[tier] || tier : 'Not classified';
}

/**
 * Get DCPMI registration fee
 */
export function getDcpmFee(tier: string | null): string {
  const fees: Record<string, string> = {
    'UHL': '₦250,000',
    'EHL': '₦100,000',
    'OHL': '₦10,000',
  };
  return tier ? fees[tier] || 'Unknown' : 'N/A';
}

// ============================================
// FRAMEWORK FUNCTIONS
// ============================================

/**
 * Get framework display name
 */
export function getFrameworkDisplayName(framework: string): string {
  const names: Record<string, string> = {
    'NDPA': 'NDP Act 2023',
    'CBN-AML': 'CBN AML/CFT',
    'CBN-CP': 'CBN Consumer Protection',
    'CBN-MMO': 'CBN Mobile Money',
    'SEC-CF': 'SEC Crowdfunding',
    'SEC-CONDUCT': 'SEC Code of Conduct',
    'NITDA-DP': 'NITDA Data Protection',
    'NITDA-LC': 'NITDA Local Content',
  };
  return names[framework] || framework;
}

/**
 * Get framework color
 */
export function getFrameworkColor(framework: string): string {
  const colors: Record<string, string> = {
    'NDPA': '#16a34a',
    'CBN-AML': '#1e40af',
    'CBN-CP': '#2563eb',
    'CBN-MMO': '#3b82f6',
    'SEC-CF': '#7c3aed',
    'SEC-CONDUCT': '#8b5cf6',
    'NITDA-DP': '#0891b2',
    'NITDA-LC': '#06b6d4',
  };
  return colors[framework] || '#64748b';
}

/**
 * Get regulator for a framework
 */
export function getRegulatorForFramework(framework: string): string {
  const regulators: Record<string, string> = {
    'NDPA': 'NDPC',
    'CBN-AML': 'CBN',
    'CBN-CP': 'CBN',
    'CBN-MMO': 'CBN',
    'SEC-CF': 'SEC',
    'SEC-CONDUCT': 'SEC',
    'NITDA-DP': 'NITDA',
    'NITDA-LC': 'NITDA',
  };
  return regulators[framework] || 'Unknown';
}

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Check if a string is a valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a string is a valid email
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

// ============================================
// STORAGE FUNCTIONS
// ============================================

/**
 * Safely get item from localStorage
 */
export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Safely set item in localStorage
 */
export function setStorageItem(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error);
  }
}

// ============================================
// DEBOUNCE FUNCTION
// ============================================

/**
 * Debounce a function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}