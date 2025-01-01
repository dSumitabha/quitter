import { useEffect, useRef } from "react";

const useIntersection = (onIntersect, loading) => {
  const observerRef = useRef(null);

  useEffect(() => {
    const observerCallback = ([entry]) => {
      if (entry.isIntersecting && !loading) {
        // Intersection detected and loading is false - triggering the callback
        // console.log('Intersection detected and loading is false - triggering load');
        onIntersect();
      } else {
        // console.log('Skip intersection: ', entry.isIntersecting ? 'loading in progress' : 'not intersecting');
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "400px",
      threshold: 0,
    });

    if (observerRef.current) {
      // console.log('Starting observation of element');
      observer.observe(observerRef.current);
    }

    // Cleanup function to stop observing when the component unmounts
    return () => {
      if (observerRef.current) {
        // console.log('Cleaning up observation');
        observer.unobserve(observerRef.current);
      }
    };
  }, [onIntersect, loading]); // Dependencies: onIntersect and loading

  return observerRef;
};

export default useIntersection;
