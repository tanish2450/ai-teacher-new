// Animation utilities

/**
 * Initialize fade-in animations for elements with the 'fade-in' class
 */
export function initFadeAnimations() {
  // Function to check if an element is in viewport
  const isInViewport = (element: Element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
    );
  };

  // Function to handle scroll events
  const handleScroll = () => {
    document.querySelectorAll('.fade-in').forEach(element => {
      if (isInViewport(element)) {
        element.classList.add('visible');
      }
    });
  };

  // Initial check
  handleScroll();

  // Add scroll event listener
  window.addEventListener('scroll', handleScroll);

  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}