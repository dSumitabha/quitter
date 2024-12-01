import { useEffect, useRef } from "react";

const useIntersection = (onIntersect, loading) => {
  const observerRef = useRef(null);

  useEffect(() => {
    console.log('useIntersection hook initialized', { 
      loading, 
      observerRef: observerRef.current 
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log('🚦 Intersection Observer triggered', {
          isIntersecting: entry.isIntersecting,
          loading: loading,
          intersectionRatio: entry.intersectionRatio
        });

        if (entry.isIntersecting && !loading) {
          console.log(' Conditions met: Calling onIntersect');
          onIntersect();
        } else {
          console.log(' Intersection conditions not met', {
            isIntersecting: entry.isIntersecting,
            loading: loading
          });
        }
      },
      { 
        root: null, 
        rootMargin: "0px", 
        threshold: 1.0 
      }
    );

    if (observerRef.current) {
      console.log(' Observing element', observerRef.current);
      observer.observe(observerRef.current);
    } else {
      console.warn(' No current element to observe');
    }

    return () => {
      console.log('🧹 Cleanup: Stopping observation');
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loading, onIntersect]);

  return observerRef;
};

export default useIntersection;