import { MetadataRoute } from 'next'
import { i18nConfig } from '@/i18n-config'

const BASE_URL = 'https://ourquran.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = i18nConfig.locales
  const mainRoutes = ['', '/advanced-search', '/tags', '/login', '/signup']
  
  const entries: MetadataRoute.Sitemap = []

  // Add main routes for each locale
  locales.forEach((locale) => {
    mainRoutes.forEach((route) => {
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: route === '' ? 1 : 0.8,
      })
    })

    // Add all 114 Surahs
    for (let i = 1; i <= 114; i++) {
      entries.push({
        url: `${BASE_URL}/${locale}/surah/${i}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  })

  return entries
}
