import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop Component
 * Automatically scrolls to the top of the page when the route changes
 * This improves UX by ensuring users don't stay at the bottom of the page
 * when navigating between pages
 */

// Export this function so it can be called from components
export const forceScrollToTop = () => {
  // Method 1: Standard window scroll
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant"
  });
  
  // Method 2: Direct property assignment
  window.scrollX = 0;
  window.scrollY = 0;
  
  // Method 3: Scroll document element
  document.documentElement.scrollTop = 0;
  document.documentElement.scrollLeft = 0;
  
  // Method 4: Scroll body element
  document.body.scrollTop = 0;
  document.body.scrollLeft = 0;
  
  // Method 5: Scroll main content container
  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.scrollTop = 0;
    mainContent.scrollLeft = 0;
  }
  
  // Method 6: Scroll any element with role="main"
  const roleMain = document.querySelector('[role="main"]');
  if (roleMain) {
    roleMain.scrollTop = 0;
  }
  
  // Method 7: Scroll the #root element
  const root = document.getElementById('root');
  if (root) {
    root.scrollTop = 0;
  }
  
  // Method 8: Scroll any container with class "results-container"
  const resultsContainer = document.querySelector('.results-container');
  if (resultsContainer) {
    resultsContainer.scrollTop = 0;
  }
};

const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    // Only scroll if the pathname actually changed (not just hash or search)
    if (previousPathname.current !== pathname) {
      previousPathname.current = pathname;
      
      // Execute immediately
      forceScrollToTop();
      
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        forceScrollToTop();
      });
      
      // Execute again after a tiny delay to catch any async rendering
      const timeoutIds = [
        setTimeout(forceScrollToTop, 0),
        setTimeout(forceScrollToTop, 10),
        setTimeout(forceScrollToTop, 50),
        setTimeout(forceScrollToTop, 100)
      ];
      
      return () => {
        timeoutIds.forEach(id => clearTimeout(id));
      };
    }
  }, [pathname, search, hash]);

  return null;
};

export default ScrollToTop;