import { useEffect } from 'react';
import { useRouter } from 'react-router-dom';
import { track } from '@vercel/analytics';

interface AnalyticsEventsProps {
  modelName?: string;
  serviceType?: string;
  districtName?: string;
  blogArticleId?: string;
}

const AnalyticsEvents: React.FC<AnalyticsEventsProps> = ({
  modelName,
  serviceType,
  districtName,
  blogArticleId
}) => {
  const router = useRouter();

  useEffect(() => {
    // Track page views
    const handleRouteChange = () => {
      track('page_view', {
        path: window.location.pathname,
        title: document.title,
        modelName,
        serviceType,
        districtName,
        blogArticleId
      });
    };

    // Track initial page load
    handleRouteChange();

    // Track route changes
    const unlisten = router.listen(handleRouteChange);
    return () => unlisten();
  }, [router, modelName, serviceType, districtName, blogArticleId]);

  useEffect(() => {
    // Track model views
    if (modelName) {
      track('model_view', {
        modelName,
        path: window.location.pathname
      });
    }

    // Track service views
    if (serviceType) {
      track('service_view', {
        serviceType,
        path: window.location.pathname
      });
    }

    // Track district views
    if (districtName) {
      track('district_view', {
        districtName,
        path: window.location.pathname
      });
    }

    // Track blog article views
    if (blogArticleId) {
      track('blog_article_view', {
        articleId: blogArticleId,
        path: window.location.pathname
      });
    }
  }, [modelName, serviceType, districtName, blogArticleId]);

  // Track user interactions
  useEffect(() => {
    // Track contact clicks
    const handleContactClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('a[href*="t.me"]') || target.closest('a[href*="whatsapp"]')) {
        track('contact_click', {
          platform: target.closest('a[href*="t.me"]') ? 'telegram' : 'whatsapp',
          path: window.location.pathname
        });
      }
    };

    // Track model card clicks
    const handleModelCardClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const modelCard = target.closest('[data-model-name]');
      if (modelCard) {
        const modelName = modelCard.getAttribute('data-model-name');
        track('model_card_click', {
          modelName: modelName || 'unknown',
          path: window.location.pathname
        });
      }
    };

    // Track blog article clicks
    const handleBlogClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const blogCard = target.closest('[data-article-id]');
      if (blogCard) {
        const articleId = blogCard.getAttribute('data-article-id');
        track('blog_card_click', {
          articleId: articleId || 'unknown',
          path: window.location.pathname
        });
      }
    };

    document.addEventListener('click', handleContactClick);
    document.addEventListener('click', handleModelCardClick);
    document.addEventListener('click', handleBlogClick);

    return () => {
      document.removeEventListener('click', handleContactClick);
      document.removeEventListener('click', handleModelCardClick);
      document.removeEventListener('click', handleBlogClick);
    };
  }, []);

  // Track scroll depth
  useEffect(() => {
    let maxScroll = 0;
    let scrollThresholds = [25, 50, 75, 90];
    let trackedThresholds = new Set<number>();

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = (window.scrollY / scrollHeight) * 100;
      
      if (scrollProgress > maxScroll) {
        maxScroll = scrollProgress;
      }

      // Track scroll milestones
      scrollThresholds.forEach(threshold => {
        if (scrollProgress >= threshold && !trackedThresholds.has(threshold)) {
          trackedThresholds.add(threshold);
          track('scroll_depth', {
            depth: threshold,
            path: window.location.pathname
          });
        }
      });
    };

    // Track session end
    const handleBeforeUnload = () => {
      track('session_end', {
        maxScrollDepth: Math.round(maxScroll),
        sessionDuration: Math.round(Date.now() - window.performance.timing.navigationStart),
        path: window.location.pathname
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default AnalyticsEvents;
