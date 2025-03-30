// src/constants/colors.ts
export const Colors = {
  // Primary colors
  // primary: '#0F172A',    // slate-900
  primary: '#0f0f0f',    
  primaryLight: '#1E293B', // slate-800
  primaryDark: '#020617',  // slate-950

  secondary: "#1E293B",

  // Accent colors
  // accent: '#F59E0B',      // amber-500
  accent: '#ff194c',     
  accentLight: '#FBBF24',  // amber-400
  accentDark: '#D97706',   // amber-600

  // Text colors
  textPrimary: '#F8FAFC',  // slate-50
  textSecondary: '#94A3B8', // slate-400
  textTertiary: '#64748B', // slate-500
  textAccent: '#F59E0B',   // Same as accent

  // Background colors
  bgPrimary: '#0F172A',    // slate-900
  bgSecondary: '#1E293B',  // slate-800
  bgTertiary: '#334155',   // slate-700

  // Status colors
  success: '#10B981',      // emerald-500
  error: '#EF4444',        // red-500
  warning: '#F59E0B',      // amber-500
  info: '#3B82F6',         // blue-500

  // Additional colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  overlay: 'rgba(15, 23, 42, 0.8)',
} as const;

// Type for TypeScript usage
export type ColorKey = keyof typeof Colors;