import React from 'react';
import FicheAccountActions from '../account/FicheAccountActions';

export default function ProduitHero({
  title,
  brand,
  category,
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
              type="produit"
              image={image}
            />
          </div>
        </div>

        <p style={{ margin: 0 }}>
          <strong>Marque / Laboratoire :</strong> {brand}
          <br />
          <strong>Catégorie :</strong> {category}
        </p>
      </div>

      <div className="product-hero__packshot">
        <img src={image} alt={imageAlt || title} loading="eager" />
      </div>
    </div>
  );
}