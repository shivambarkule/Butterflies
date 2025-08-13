import React, { useEffect, useState } from 'react';
import { Headphones, BellOff, EyeOff, Eye } from 'lucide-react';

interface FocusModeToggleProps {
  className?: string;
}

export const FocusModeToggle: React.FC<FocusModeToggleProps> = ({ className }) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('focus-mode', enabled);
  }, [enabled]);

  return (
    <button
      aria-pressed={enabled}
      onClick={() => setEnabled(v => !v)}
      className={`px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm inline-flex items-center gap-2 transition ${className || ''}`}
    >
      <Headphones className="w-4 h-4" />
      {enabled ? (
        <>
          <BellOff className="w-4 h-4" />
          <EyeOff className="w-4 h-4" />
          <span>Focus On</span>
        </>
      ) : (
        <>
          <Eye className="w-4 h-4" />
          <span>Focus Off</span>
        </>
      )}
    </button>
  );
};

export default FocusModeToggle;


