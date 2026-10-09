import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'rejoice-cookie-notice-dismissed';

export const CookieNotice: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(sessionStorage.getItem(STORAGE_KEY) !== 'true');
    } catch {
      setVisible(true);
    }
  }, []);

  const dismissNotice = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // The notice can still be dismissed if session storage is unavailable.
    }

    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      role="status"
      aria-label="Cookie notice"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-3xl rounded-lg border border-gold/30 bg-white p-4 text-chocolate shadow-xl"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6">
          We use essential cookies for sign-in and security. We do not
          currently use analytics or advertising cookies.{' '}
          <Link
            to="/cookie-policy"
            className="font-semibold underline hover:text-gold"
          >
            Cookie Policy
          </Link>
        </p>

        <button
          type="button"
          onClick={dismissNotice}
          className="shrink-0 rounded bg-chocolate px-4 py-2 text-sm font-semibold text-cream hover:bg-chocolate/90"
        >
          Got it
        </button>
      </div>
    </aside>
  );
};