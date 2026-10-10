import React, { useEffect, useRef } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  const layoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = layoutRef.current;
    if (!root) return;

    const elements = root.querySelectorAll<HTMLElement>('[data-reveal]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const observed = new WeakSet<HTMLElement>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          element.classList.add('is-visible');
          observer.unobserve(element);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -36px 0px' },
    );

    const observeElement = (element: HTMLElement) => {
      if (observed.has(element)) return;
      observed.add(element);
      observer.observe(element);
    };

    const observeTree = (node: HTMLElement) => {
      if (node.matches('[data-reveal]')) observeElement(node);
      node.querySelectorAll<HTMLElement>('[data-reveal]').forEach(observeElement);
    };

    root.querySelectorAll<HTMLElement>('[data-reveal]').forEach(observeElement);

    // Also picks up product/order cards inserted after an API response.
    const mutationObserver = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) observeTree(node);
        });
      });
    });
    mutationObserver.observe(root, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={layoutRef} className="flex flex-col min-h-screen bg-cream">
      <Header variant="customer" />
      <main className="flex-1 page-enter">{children}</main>
      <Footer />
    </div>
  );
};
