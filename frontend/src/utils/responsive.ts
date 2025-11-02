import React from 'react';

/**
 * Responsive utility functions for handling various screen sizes
 */

export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * Get current breakpoint based on window width
 */
export function getCurrentBreakpoint(): Breakpoint {
  if (typeof window === 'undefined') return 'md';

  const width = window.innerWidth;

  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
}

/**
 * Check if current screen size is mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < breakpoints.sm;
}

/**
 * Check if current screen size is tablet
 */
export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  const width = window.innerWidth;
  return width >= breakpoints.sm && width < breakpoints.lg;
}

/**
 * Check if current screen size is desktop
 */
export function isDesktop(): boolean {
  if (typeof window === 'undefined') return true;
  return window.innerWidth >= breakpoints.lg;
}

/**
 * Hook to get current breakpoint with automatic updates
 */
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] =
    React.useState<Breakpoint>(getCurrentBreakpoint);

  React.useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getCurrentBreakpoint());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
}

/**
 * Hook to check if screen is mobile
 */
export function useIsMobile() {
  const [mobile, setMobile] = React.useState(isMobile);

  React.useEffect(() => {
    const handleResize = () => {
      setMobile(isMobile());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return mobile;
}

/**
 * Get optimal grid columns based on container width and card size
 */
export function getOptimalColumns(
  containerWidth: number,
  minCardWidth: number = 280,
  maxColumns: number = 5,
  gap: number = 24
): number {
  const availableWidth = containerWidth - gap;
  const possibleColumns = Math.floor(availableWidth / (minCardWidth + gap));
  return Math.min(Math.max(possibleColumns, 1), maxColumns);
}

/**
 * Responsive value selector based on breakpoint
 */
export function getResponsiveValue<T>(
  values: Partial<Record<Breakpoint, T>>,
  fallback: T
): T {
  const currentBreakpoint = getCurrentBreakpoint();

  // Check current breakpoint first
  if (values[currentBreakpoint] !== undefined) {
    return values[currentBreakpoint]!;
  }

  // Fall back to smaller breakpoints
  const orderedBreakpoints: Breakpoint[] = ['xl', 'lg', 'md', 'sm', 'xs'];
  const currentIndex = orderedBreakpoints.indexOf(currentBreakpoint);

  for (let i = currentIndex + 1; i < orderedBreakpoints.length; i++) {
    const bp = orderedBreakpoints[i];
    if (values[bp] !== undefined) {
      return values[bp]!;
    }
  }

  return fallback;
}
