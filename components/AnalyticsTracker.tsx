import React from 'react';

interface AnalyticsTrackerProps {
  children: React.ReactNode;
}

const AnalyticsTracker: React.FC<AnalyticsTrackerProps> = ({ children }) => {
  return <>{children}</>;
};

export default AnalyticsTracker;
