import React from 'react';
import FicheAccountActions from '../account/FicheAccountActions';

export default function PrincipeHero({
  title,
  scientificName,
  partUsed,
  origin,
  image,
  imageAlt,
  path,
}) {
  return (
    <div className="product-hero">
      <div className="product-hero__titlewrap">
        <div className="fiche-title-row">
          <h1 style={{ margin: 0, flex: 1 }}>{title}</h1>

          <div className="fiche-favorite-star">
            <FicheAccountActions
              path={path}
              title={title}
              type="principe-actif"
            />
          </div>
        </div>

        <p style={{ margin: 0 }}>
          <strong>Nom scientifique :</strong> <em>{scientificName}</em>
          <br />
          <strong>Partie utilisée :</strong> {partUsed}
          <br />
          <strong>Origine :</strong> {origin}
        </p>
      </div>

      <div className="product-hero__packshot">
        <img src={image} alt={imageAlt || title} loading="eager" />
      </div>
    </div>
  );
}