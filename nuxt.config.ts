import { provider } from 'std-env'
import { currentLocales } from './i18n/i18n'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    '@nuxthub/core',
    'shadcn-nuxt',
    '@vueuse/motion/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
  ],

  devtools: { enabled: true },

  colorMode: {
    classSuffix: '',
  },

  runtimeConfig: {
    siteToken: crypto.randomUUID(),
    redirectStatusCode: '301',
    linkCacheTtl: 60,
    redirectWithQuery: false,
    homeURL: '',
    cfAccountId: '',
    cfApiToken: '',
    dataset: 'sink',
    aiModel: '@cf/meta/llama-3.1-8b-instruct',
    aiPrompt: `You are a URL shortening assistant, please shorten the URL provided by the user into a SLUG. The SLUG information must come from the URL itself, do not make any assumptions. A SLUG is human-readable and should not exceed three words and can be validated using regular expressions {slugRegex} . Only the best one is returned, the format must be JSON reference {"slug": "example-slug"}`,
    caseSensitive: false,
    listQueryLimit: 500,
    disableBotAccessLog: false,
    public: {
      previewMode: '',
      slugDefaultLength: '6',
    },
  },

  routeRules: {
    '/': {
      prerender: true,
    },
    '/dashboard/**': {
      prerender: true,
      ssr: false,
    },
    '/dashboard': {
      redirect: '/dashboard/links',
    },
    '/api/**': {
      cors: process.env.NUXT_API_CORS === 'true',
    },
  },

  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    // Disable module compatibility enforcement as it might conflict with nodejs_compat
  },

  nitro: {
    experimental: {
      openAPI: true,
    },
    timing: true,
    openAPI: {
      production: 'runtime',
      meta: {
        title: 'Sink API',
        description: 'A Simple / Speedy / Secure Link Shortener with Analytics, 100% run on Cloudflare.',
      },
      route: '/_docs/openapi.json',
      ui: {
        scalar: {
          route: '/_docs/scalar',
        },
        swagger: {
          route: '/_docs/swagger',
        },
      },
    },
    // Exclude build scripts and test files from the Worker bundle
    exclude: [
      'scripts/**',
      'tests/**',
      '**/*.test.*',
      '**/*.spec.*',
    ],
  },

  hub: {
    ai: true,
    analytics: true,
    blob: false,
    cache: false,
    database: false,
    kv: true,
    workers: provider !== 'cloudflare_pages',
  },

  // Cloudflare Workers with nodejs_compat enabled - configure for Node.js compatibility
  vite: {
    define: {
      'process.env': {},
    },
    build: {
      rollupOptions: {
        external: [
          // Exclude Node.js built-in modules from bundling since they're available in nodejs_compat
          'node:fs',
          'node:path',
          'node:buffer',
          'node:process',
          'node:timers',
          'node:events',
          'node:async_hooks',
        ],
      },
    },
  },

  eslint: {
    config: {
      stylistic: true,
      standalone: false,
    },
  },

  i18n: {
    locales: currentLocales,
    compilation: {
      strictMessage: false,
      escapeHtml: true,
    },
    lazy: true,
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'sink_i18n_redirected',
      redirectOn: 'root',
    },
    baseUrl: '/',
    defaultLocale: 'en-US',
  },
  preset: 'cloudflare',

  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },
})
