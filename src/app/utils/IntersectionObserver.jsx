import { useEffect, useRef } from "react";

const useIntersection = (onIntersect, loading) => {
  const observerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) {
          onIntersect();  // Call the function passed as a prop
        }
      },
      { root: null, rootMargin: "0px", threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loading, onIntersect]);

  return observerRef;  // Return the ref to be assigned to the target element
};

export default useIntersection;
