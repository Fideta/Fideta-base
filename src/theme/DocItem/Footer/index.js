import React from 'react';
import {useLocation} from '@docusaurus/router';
import DocItemFooter from '@theme-original/DocItem/Footer';
import FicheSupportCta from '../../../components/support/FicheSupportCta';

export default function DocItemFooterWrapper(props) {
  const {pathname} = useLocation();
  const isFiche =
    pathname.startsWith('/docs/produits/') ||
    pathname.startsWith('/docs/principes/');

  return (
    <>
      {isFiche && <FicheSupportCta />}
      <DocItemFooter {...props} />
    </>
  );
}
