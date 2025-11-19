import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  vite:{
    plugins: [
      tailwindcss(),
    ]
  },
  // ensure file-based routing is enabled
  pages: true,
  modules: [
    '@nuxt/eslint',
    '@nuxt/scripts',
    '@nuxt/ui',
    'shadcn-nuxt'
  ],
  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: '@/components/ui'
  }
  ,
  // force light theme by default to avoid starting in dark mode
  colorMode: {
    preference: 'light',
    fallback: 'light',
    storageKey: 'nuxt-color-mode'
  },
  alias: {
    '~/components': './components',
    '@/components': './components'
  }
})