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
          <span>Fideta synthétise les preuves publiques disponibles : la note juge un usage, pas la marque ni la fabrication.</span>
        </summary>

        <div className="product-note-disclaimer__content">
          <p>
            La note Fideta est établie à partir des informations publiquement
      accessibles : composition déclarée, dosages, usages revendiqués ou
      suggérés, données réglementaires et études scientifiques disponibles.
      Elle ne constitue pas un jugement personnel sur une marque, un laboratoire
      ou un produit. Une note faible ne signifie pas nécessairement danger,
      fraude, illégalité ou défaut de fabrication : elle peut simplement traduire
      un niveau de preuve clinique insuffisant pour l’usage analysé selon le
      barème Fideta.
       Seule la mention « Disqualifié » signale un risque bloquant identifié selon
      la méthodologie Fideta.
          </p>

          <a className="product-note-disclaimer__link" href="/docs/methodologie">
            En savoir plus
          </a>
        </div>
      </details>
    </>
  );
}
