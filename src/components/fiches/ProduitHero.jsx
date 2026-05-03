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
    <>
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

      <details className="product-note-disclaimer">
        <summary className="product-note-disclaimer__summary">
          <span className="product-note-disclaimer__icon">ⓘ</span>
          <span>La note Fideta est issue d’une évaluation fondée sur les faits.</span>
        </summary>

        <div className="product-note-disclaimer__content">
          <p>
            La note Fideta évalue la pertinence clinique du produit pour les usages
            revendiqués ou suggérés. Une note faible ne signifie pas nécessairement
            danger, fraude, illégalité ou défaut de fabrication : elle peut simplement
            refléter un niveau de preuve insuffisant pour l’usage analysé.
          </p>

          <a className="product-note-disclaimer__link" href="/docs/methodologie">
            En savoir plus
          </a>
        </div>
      </details>
    </>
  );
}
