import { useEffect, useRef, useCallback } from "react";

const useIntersection = (onIntersect, loading) => {
  const observerRef = useRef(null);
  const currentObserver = useRef(null);

  const observerCallback = useCallback(([entry]) => {
    if (entry.isIntersecting && !loading) {
      console.log('📍 Intersection detected and loading is false - triggering load');
      onIntersect();
    } else {
      console.log('ℹ️ Skip intersection:', 
        entry.isIntersecting ? 'loading in progress' : 'not intersecting');
    }
  }, [onIntersect, loading]);

  useEffect(() => {
    // Only create a new observer if we don't have one
    if (!currentObserver.current) {
      currentObserver.current = new IntersectionObserver(observerCallback, {
        root: null,
        rootMargin: "400px",
        threshold: 0
      });
      
      console.log('🔧 Created new IntersectionObserver');
    }

    // If we have an element to observe, start observing
    if (observerRef.current) {
      console.log('👀 Starting observation of element');
      currentObserver.current.observe(observerRef.current);
    }

    // Cleanup function
    return () => {
      if (observerRef.current && currentObserver.current) {
        console.log('🧹 Cleaning up observation');
        currentObserver.current.unobserve(observerRef.current);
      }
    };
  }, [observerCallback]); // Only re-run if the callback changes

  return observerRef;
};

export default useIntersection;