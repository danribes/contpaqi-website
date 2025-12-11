/**
 * Analytics Module for ContPAQi AI Bridge
 *
 * Supports both Plausible Analytics (privacy-focused) and Google Analytics.
 * Plausible is the recommended default for GDPR compliance.
 *
 * Environment Variables:
 * - NEXT_PUBLIC_PLAUSIBLE_DOMAIN: Your domain for Plausible
 * - NEXT_PUBLIC_GA_MEASUREMENT_ID: Google Analytics measurement ID (G-XXXXXXX)
 */

// Type definitions for analytics events
export interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

// Check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

// Get analytics configuration from environment
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Determine which analytics provider is active
const isPlausibleEnabled = Boolean(PLAUSIBLE_DOMAIN);
const isGAEnabled = Boolean(GA_MEASUREMENT_ID);

/**
 * Track a custom event
 * @param eventName - Name of the event to track
 * @param properties - Optional properties to attach to the event
 */
export function trackEvent(
  eventName: string,
  properties?: EventProperties
): void {
  if (!isBrowser) return;

  // Plausible tracking
  if (isPlausibleEnabled && window.plausible) {
    window.plausible(eventName, { props: properties });
  }

  // Google Analytics tracking
  if (isGAEnabled && window.gtag) {
    window.gtag('event', eventName, properties);
  }

  // Development logging
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Event:', eventName, properties);
  }
}

/**
 * Track a page view
 * @param path - Optional page path (defaults to current path)
 */
export function trackPageView(path?: string): void {
  if (!isBrowser) return;

  const pagePath = path || window.location.pathname;

  // Plausible automatically tracks page views
  // Manual tracking only needed for SPA navigation
  if (isPlausibleEnabled && window.plausible) {
    window.plausible('pageview', { u: window.location.origin + pagePath });
  }

  // Google Analytics page view
  if (isGAEnabled && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID!, {
      page_path: pagePath,
    });
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Page View:', pagePath);
  }
}

// =============================================================================
// Predefined Event Helpers
// =============================================================================

/**
 * Track CTA button clicks
 * @param buttonId - Identifier for the button (e.g., 'hero_get_started')
 * @param location - Optional location on the page
 */
export function trackCTAClick(buttonId: string, location?: string): void {
  trackEvent('cta_click', {
    button: buttonId,
    location: location || 'unknown',
  });
}

/**
 * Track when a user starts the checkout process
 * @param plan - Plan name (starter, professional, enterprise)
 * @param interval - Billing interval (monthly, yearly)
 */
export function trackCheckoutStart(
  plan: string,
  interval: 'monthly' | 'yearly'
): void {
  trackEvent('checkout_start', {
    plan,
    interval,
  });
}

/**
 * Track successful purchase completion
 * @param plan - Plan name
 * @param value - Purchase value in USD
 */
export function trackPurchaseComplete(plan: string, value: number): void {
  trackEvent('purchase_complete', {
    plan,
    value,
    currency: 'USD',
  });

  // Also track as conversion for Google Analytics
  if (isGAEnabled && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: GA_MEASUREMENT_ID,
      value,
      currency: 'USD',
    });
  }
}

/**
 * Track user sign up
 * @param method - Sign up method (email, google, etc.)
 */
export function trackSignUp(method: string = 'email'): void {
  trackEvent('sign_up', {
    method,
  });
}

/**
 * Track demo request
 */
export function trackDemoRequest(): void {
  trackEvent('demo_request');
}

/**
 * Track contact form submission
 * @param type - Type of inquiry
 */
export function trackContactSubmit(type: string): void {
  trackEvent('contact_submit', {
    inquiry_type: type,
  });
}

/**
 * Track download initiation
 * @param version - Software version being downloaded
 */
export function trackDownload(version: string): void {
  trackEvent('download_start', {
    version,
  });
}

/**
 * Track feature page section views
 * @param section - Section identifier
 */
export function trackFeatureView(section: string): void {
  trackEvent('feature_view', {
    section,
  });
}

// =============================================================================
// Type declarations for global window objects
// =============================================================================

declare global {
  interface Window {
    plausible?: (
      eventName: string,
      options?: { props?: EventProperties; u?: string }
    ) => void;
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}
