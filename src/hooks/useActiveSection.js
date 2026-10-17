import { useState, useEffect } from 'react';

/**
 * Hook to track which section is currently active in the viewport
 * @param {string[]} sectionIds - Array of element IDs to monitor
 * @param {string} defaultSection - Initial section ID
 * @returns {string} activeSection
 */
export const useActiveSection = (sectionIds, defaultSection = 'home') => {
  const [activeSection, setActiveSection] = useState(defaultSection);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionIds]);

  return activeSection;
};
