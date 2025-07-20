// @ts-check
import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Fideta',
  tagline: 'Compléments alimentaires décodés par la science, pas par le marketing',
  favicon: 'img/fidetaico.ico',

  future: {
    v4: true,
  },

  url: 'https://fideta.fr',
  baseUrl: '/',

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

  themeConfig: {
    image: 'img/fideta-social-card.png',
    navbar: {
      title: 'Fideta',
      logo: {
        alt: 'Fideta Logo',
        src: 'img/logofideta.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'principesSidebar',
          position: 'left',
          label: 'Principes actifs',
        },
        {
          type: 'docSidebar',
          sidebarId: 'produitsSidebar',
          position: 'left',
          label: 'Produits analysés',
        },
        {
          to: '/docs/methodologie',
          label: 'Méthodologie',
          position: 'left',
        },
        {
          to: '/docs/qui-sommes-nous',
          label: 'Qui suis-je',
          position: 'left',
        },
        {
          to: '/blog',
          label: 'Blog',
          position: 'left',
        },
        {
          to: '/search',
          label: '🔍 Rechercher',
          position: 'right',
        },
        {
          href: 'https://github.com/Fideta/Fideta-base',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Fideta',
          items: [
            {
              label: 'Méthodologie',
              to: '/docs/methodologie',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Linkedin',
              href: 'https://www.linkedin.com/company/fideta-app/',
            },
            {
              label: 'X',
              href: 'https://x.com/Fideta_app',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/Fideta/Fideta-base',
            },
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

  // ➕ Scripts externes : Pagefind + Google Analytics
  scripts: [
    {
      src: '/pagefind-loader.js',
      async: true,
    },
    {
    src: '/ga.js',
  },
  {
    src: '/pagefind-loader.js',
    async: true,
  },
  ],

  stylesheets: [
    '/pagefind/pagefind-ui.css',
  ],
};

export default config;
