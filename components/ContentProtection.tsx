import React, { useEffect } from 'react';

const ContentProtection: React.FC = () => {
  useEffect(() => {
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || target.closest('img')) {
        e.preventDefault();
      }
    };

    document.addEventListener('dragstart', handleDragStart);

    const style = document.createElement('style');
    style.textContent = `
      img {
        -webkit-user-drag: none;
        user-drag: none;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener('dragstart', handleDragStart);
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return null;
};

export default ContentProtection;
