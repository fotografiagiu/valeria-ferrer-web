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
    // Initialize local tracking automatically - no consent needed
    initializeLocalTracking();
    
    // Check for consent for Google Analytics only
    const hasConsent = localStorage.getItem('analytics-consent') === 'granted';
    
    // If consent granted, also initialize Google Analytics
    if (hasConsent) {
      initializeAnalytics();
    }
  }, []);

  const initializeLocalTracking = () => {
    // Local storage tracking without cookies
    const trackLocalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a') as HTMLAnchorElement;
      
      if (link && link.href) {
        const url = new URL(link.href);
        let clickType = 'Unknown';
        
        // Check if mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // DEBUG: Always log click attempts for debugging
        console.log(`🔍 [DEBUG] Click detected on:`, {
          href: link.href,
          hostname: url.hostname,
          isMobile: isMobile,
          userAgent: navigator.userAgent
        });
        
        // Determine click type
        if (url.hostname.includes('t.me') || url.hostname.includes('telegram')) {
          clickType = 'Telegram';
          
          // Track Telegram clicks with device info (ALWAYS track regardless of device)
          console.log(`📱 [${isMobile ? 'MOBILE' : 'DESKTOP'}] Telegram click detected:`, {
            type: 'Telegram',
            url: link.href,
            device: isMobile ? 'mobile' : 'desktop',
            timestamp: new Date().toISOString()
          });
          
        } else if (link.href.startsWith('tel:')) {
          clickType = 'Phone';
        } else if (url.hostname.includes('wa.me') || url.hostname.includes('whatsapp')) {
          clickType = 'WhatsApp';
        } else if (link.href.startsWith('mailto:')) {
          clickType = 'Email';
        }
        
        if (clickType !== 'Unknown') {
          // Get existing local data
          const localData = JSON.parse(localStorage.getItem('local-analytics') || '{}');
          
          // Initialize if not exists
          if (!localData.clicks) localData.clicks = {};
          if (!localData.clicks[clickType]) localData.clicks[clickType] = 0;
          if (!localData.daily) localData.daily = {};
          
          // Get today's date
          const today = new Date().toISOString().split('T')[0];
          if (!localData.daily[today]) {
            localData.daily[today] = { Telegram: 0, Phone: 0, WhatsApp: 0, Email: 0 };
          }
          
          // Increment counters
          localData.clicks[clickType]++;
          localData.daily[today][clickType]++;
          
          // Add timestamp for detailed tracking
          if (!localData.recent) localData.recent = [];
          localData.recent.unshift({
            type: clickType,
            url: link.href,
            timestamp: new Date().toISOString(),
            page: window.location.pathname
          });
          
          // Keep only last 100 entries
          if (localData.recent.length > 100) {
            localData.recent = localData.recent.slice(0, 100);
          }
          
          // Save to localStorage
          localStorage.setItem('local-analytics', JSON.stringify(localData));
          
          // Console log for debugging
          console.log(`📊 [LOCAL] ${clickType} click tracked:`, {
            type: clickType,
            url: link.href,
            total: localData.clicks[clickType],
            today: localData.daily[today][clickType]
          });
        }
      }
    };

    // Add click listener for local tracking
    document.addEventListener('click', trackLocalClick);
  };

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
