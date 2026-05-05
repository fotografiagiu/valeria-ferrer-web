import React, { useEffect } from 'react';

interface AnalyticsTrackerProps {
  children: React.ReactNode;
}

declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: Record<string, any>) => void;
    dataLayer?: any[];
  }
}

const AnalyticsTracker: React.FC<AnalyticsTrackerProps> = ({ children }) => {
  useEffect(() => {
    // Check for consent first
    const hasConsent = localStorage.getItem('analytics-consent') === 'granted';
    
    if (!hasConsent) {
      // Show consent banner
      const consentBanner = document.createElement('div');
      consentBanner.id = 'analytics-consent-banner';
      consentBanner.innerHTML = `
        <div style="position: fixed; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.9); color: white; padding: 15px; text-align: center; z-index: 9999; font-size: 14px;">
          <p style="margin: 0 0 10px 0;">📊 Usamos cookies para analizar el tráfico y mejorar tu experiencia.</p>
          <button id="accept-analytics" style="background: #c2b2a3; color: black; border: none; padding: 8px 16px; margin-right: 10px; cursor: pointer; border-radius: 4px; font-weight: bold;">
            Aceptar
          </button>
          <button id="reject-analytics" style="background: transparent; color: white; border: 1px solid white; padding: 8px 16px; margin-right: 10px; cursor: pointer; border-radius: 4px;">
            Rechazar
          </button>
        </div>
      `;
      document.body.appendChild(consentBanner);

      // Handle consent
      const acceptBtn = document.getElementById('accept-analytics');
      const rejectBtn = document.getElementById('reject-analytics');

      acceptBtn?.addEventListener('click', () => {
        localStorage.setItem('analytics-consent', 'granted');
        document.getElementById('analytics-consent-banner')?.remove();
        initializeAnalytics();
      });

      rejectBtn?.addEventListener('click', () => {
        localStorage.setItem('analytics-consent', 'rejected');
        document.getElementById('analytics-consent-banner')?.remove();
      });

      return;
    }

    // If consent already granted, initialize analytics
    if (hasConsent) {
      initializeAnalytics();
    }
  }, []);

  const initializeAnalytics = () => {
    // Initialize Google Analytics
    const GA_MEASUREMENT_ID = 'G-QY07YBB25G'; // Google Analytics Measurement ID
    
    // Load gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer!.push(arguments);
    };
    window.gtag('js', new Date().toISOString());
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });

    // Track external clicks
    const trackExternalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a') as HTMLAnchorElement;
      
      if (link && link.href) {
        const url = new URL(link.href);
        
        // Track Telegram clicks
        if (url.hostname.includes('t.me') || url.hostname.includes('telegram')) {
          window.gtag?.('event', 'click', {
            event_category: 'Contact',
            event_label: 'Telegram',
            value: 1,
            link_url: link.href,
          });
          
          console.log('📱 Telegram click tracked:', link.href);
        }
        
        // Track phone clicks
        if (link.href.startsWith('tel:')) {
          window.gtag?.('event', 'click', {
            event_category: 'Contact',
            event_label: 'Phone',
            value: 1,
            phone_number: link.href.replace('tel:', ''),
          });
          
          console.log('Phone click tracked:', link.href);
        }
        
        // Track WhatsApp clicks
        if (url.hostname.includes('wa.me') || url.hostname.includes('whatsapp')) {
          window.gtag?.('event', 'click', {
            event_category: 'Contact',
            event_label: 'WhatsApp',
            value: 1,
            link_url: link.href,
          });
          
          console.log('WhatsApp click tracked:', link.href);
        }
        
        // Track email clicks
        if (link.href.startsWith('mailto:')) {
          window.gtag?.('event', 'click', {
            event_category: 'Contact',
            event_label: 'Email',
            value: 1,
            email: link.href.replace('mailto:', ''),
          });
          
          console.log('Email click tracked:', link.href);
        }
      }
    };

    // Add click listener to document
    document.addEventListener('click', trackExternalClick);

    // Track page views for single page app
    const trackPageView = () => {
      window.gtag?.('config', GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href,
      });
    };

    // Track navigation changes
    window.addEventListener('popstate', trackPageView);
    
    // Custom event for React Router navigation
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(trackPageView, 0);
    };

    return () => {
      document.removeEventListener('click', trackExternalClick);
      window.removeEventListener('popstate', trackPageView);
    };
  };

  return <>{children}</>;
};

export default AnalyticsTracker;

// Helper function to track custom events
export const trackCustomEvent = (
  eventName: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (window.gtag) {
    window.gtag('event', eventName, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Helper function to track model profile views
export const trackModelView = (modelName: string, modelSlug: string) => {
  if (window.gtag) {
    window.gtag('event', 'view_item', {
      event_category: 'Engagement',
      event_label: `Model Profile: ${modelName}`,
      items: [{
        item_id: modelSlug,
        item_name: modelName,
        item_category: 'Model',
      }],
    });
  }
};

// Helper function to track contact form submissions
export const trackContactSubmission = (formData: Record<string, string>) => {
  if (window.gtag) {
    window.gtag('event', 'generate_lead', {
      event_category: 'Conversion',
      event_label: 'Contact Form',
      value: 1,
    });
  }
};
