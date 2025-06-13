/**
 * Color System for WorkFlow App
 * Standardized color palette following glass morphism design
 */

export const colors = {
  // Primary Brand Colors
  primary: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c', // Main orange
    500: '#f97316',
    600: '#ea580c', // Versace orange
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  
  // Neutral Colors
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  
  // Semantic Colors
  success: {
    light: '#10b981',
    DEFAULT: '#059669',
    dark: '#047857',
  },
  
  warning: {
    light: '#f59e0b',
    DEFAULT: '#d97706',
    dark: '#b45309',
  },
  
  danger: {
    light: '#ef4444',
    DEFAULT: '#dc2626',
    dark: '#b91c1c',
  },
  
  // Glass Morphism Colors
  glass: {
    light: 'rgba(255, 255, 255, 0.1)',
    DEFAULT: 'rgba(255, 255, 255, 0.15)',
    dark: 'rgba(255, 255, 255, 0.2)',
    border: 'rgba(255, 255, 255, 0.3)',
  }
};

export const gradients = {
  primary: 'linear-gradient(135deg, #fb923c, #ea580c)',
  secondary: 'linear-gradient(135deg, #f5f5f5, #e5e5e5)',
  success: 'linear-gradient(135deg, #10b981, #059669)',
  warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
  danger: 'linear-gradient(135deg, #ef4444, #dc2626)',
  glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2))',
};

export const textColors = {
  primary: colors.neutral[900],
  secondary: colors.neutral[700],
  muted: colors.neutral[500],
  accent: colors.primary[600],
  success: colors.success.DEFAULT,
  warning: colors.warning.DEFAULT,
  danger: colors.danger.DEFAULT,
  white: '#ffffff',
};

export const backgroundColors = {
  primary: colors.primary[600],
  light: colors.neutral[50],
  dark: colors.neutral[900],
  glass: colors.glass.DEFAULT,
};
