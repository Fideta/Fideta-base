import React from 'react';
import './InfoTip.css';

export default function InfoTip({ text }) {
  return (
    <details className="info-tip">
      <summary
        className="info-tip__trigger"
        aria-label="Afficher une précision"
      >
        i
      </summary>

      <div className="info-tip__bubble" role="note">
        {text}
      </div>
    </details>
  );
}