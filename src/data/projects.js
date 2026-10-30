/**
 * Projects data for Nebnou Studio
 * To add real projects:
 * 1. Add image to public/projects/ or assets
 * 2. Set isExample: false
 * 3. Update titleKey/descKey or provide direct titles
 */

export const projects = [
  {
    id: '01',
    slug: 'safir-mode',
    titleKey: 'projects.items.safir.title',
    descKey: 'projects.items.safir.desc',
    tagsKey: 'projects.items.safir.tags',
    category: 'ecommerce', // 'ecommerce' | 'platforms' | 'showcase'
    domain: 'safir-mode.dz',
    year: '2026',
    image: null,
    liveUrl: 'https://safir-mode.dz',
    isExample: true,
  },
  {
    id: '02',
    slug: 'clinique-el-bahdja',
    titleKey: 'projects.items.clinique.title',
    descKey: 'projects.items.clinique.desc',
    tagsKey: 'projects.items.clinique.tags',
    category: 'showcase',
    domain: 'clinique-elbahdja.dz',
    year: '2026',
    image: null,
    liveUrl: 'https://clinique-elbahdja.dz',
    isExample: true,
  },
  {
    id: '03',
    slug: 'dz-fleet-logistics',
    titleKey: 'projects.items.dzfleet.title',
    descKey: 'projects.items.dzfleet.desc',
    tagsKey: 'projects.items.dzfleet.tags',
    category: 'platforms',
    domain: 'app.dzfleet.com',
    year: '2026',
    image: null,
    liveUrl: null,
    isExample: true,
  },
  {
    id: '04',
    slug: 'dar-zellige',
    titleKey: 'projects.items.darzellige.title',
    descKey: 'projects.items.darzellige.desc',
    tagsKey: 'projects.items.darzellige.tags',
    category: 'ecommerce',
    domain: 'darzellige-art.dz',
    year: '2026',
    image: null,
    liveUrl: null,
    isExample: true,
  },
  {
    id: '05',
    slug: 'academie-numerique-dz',
    titleKey: 'projects.items.academiadz.title',
    descKey: 'projects.items.academiadz.desc',
    tagsKey: 'projects.items.academiadz.tags',
    category: 'platforms',
    domain: 'academie-dz.com',
    year: '2026',
    image: null,
    liveUrl: 'https://academie-dz.com',
    isExample: true,
  },
  {
    id: '06',
    slug: 'cabinet-benali',
    titleKey: 'projects.items.cabinet.title',
    descKey: 'projects.items.cabinet.desc',
    tagsKey: 'projects.items.cabinet.tags',
    category: 'showcase',
    domain: 'benali-avocats.dz',
    year: '2026',
    image: null,
    liveUrl: null,
    isExample: true,
  },
];

export const projectCategories = [
  { key: 'all', labelKey: 'projects.filterAll' },
  { key: 'ecommerce', labelKey: 'projects.filterEcommerce' },
  { key: 'platforms', labelKey: 'projects.filterPlatforms' },
  { key: 'showcase', labelKey: 'projects.filterShowcase' },
];
