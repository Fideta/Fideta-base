// @ts-check
import 'dotenv/config';
import { themes as prismThemes } from 'prism-react-renderer';
import path from 'path';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Fideta',
  tagline: 'Compléments alimentaires décodés par la science, pas par le marketing',
  favicon: 'img/favico.ico',

  customFields: {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabasePublishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
  },

  future: {
    v4: true,
  },

  url: 'https://fideta.fr',
  baseUrl: '/',
  trailingSlash: false,

  organizationName: 'Fideta',
  projectName: 'Fideta-base',
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.js',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: 'https://github.com/Fideta/Fideta-base/edit/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-google-gtag',
      {
        trackingID: 'G-HHB456PQGJ',
        anonymizeIP: true,
      },
    ],
    path.resolve(__dirname, 'plugins/principes-frontmatter'),
    path.resolve(__dirname, 'plugins/produits-frontmatter'),
  ],

  themeConfig: {
    image: 'img/fideta-social-card.png',
    metadata: [
      {
        name: 'description',
        content:
          'Analyse indépendante des compléments alimentaires, basée sur le consensus scientifique. Fiches détaillées, preuves et recommandations.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Fideta' },
      { property: 'og:url', content: 'https://fideta.fr' },
      { property: 'og:image', content: 'https://fideta.fr/img/fideta-social-card.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Fideta' },
      {
        name: 'twitter:description',
        content:
          'Analyse indépendante des compléments alimentaires, basée sur le consensus scientifique.',
      },
      { name: 'twitter:image', content: 'https://fideta.fr/img/fideta-social-card.png' },
    ],
    navbar: {
      title: 'Fideta',
      logo: {
        alt: 'Fideta Logo',
        src: 'img/logofideta.svg',
      },
      items: [
        { to: '/principes-actifs', label: 'Principes actifs', position: 'left' },
        { to: '/produits', label: 'Produits analysés', position: 'left' },
        { to: '/docs/methodologie', label: 'Méthodologie', position: 'left' },
        { to: '/docs/qui-sommes-nous', label: 'Qui sommes-nous', position: 'left' },
        { to: '/blog', label: 'Actu', position: 'left' },
        { to: '/scan', label: 'Scanner', position: 'right', className: 'fab-scan' },
        { to: '/search', label: '🔍 Rechercher', position: 'right' },
        { type: 'custom-account', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Fideta',
          items: [{ label: 'Méthodologie', to: '/docs/methodologie' }],
        },
        {
          title: 'Community',
          items: [
            { label: 'Linkedin', href: 'https://www.linkedin.com/company/fideta-app/' },
            { label: 'X', href: 'https://x.com/Fideta_app' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'Actu', to: '/blog' },
            { label: 'Soutenir Fideta', to: '/soutenir' },
            { label: 'Nous contacter', to: '/contact' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Fideta, Inc.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },

  scripts: [
    { src: '/pagefind-loader.js', async: true },
    { src: '/auto-table-labels.js', defer: true },
  ],

  stylesheets: ['/pagefind/pagefind-ui.css'],
};

export default config;
