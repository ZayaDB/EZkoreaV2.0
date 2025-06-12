import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationProps {
  threshold?: number;
  rootMargin?: string;
}

export const useScrollAnimation = ({
  threshold = 0.1,
  rootMargin = "0px",
}: UseScrollAnimationProps = {}) => {
  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once the animation is triggered, we can disconnect the observer
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, rootMargin]);

  return { elementRef, isVisible };
};
