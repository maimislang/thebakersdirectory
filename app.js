const supplierData = Array.isArray(window.SUPPLIERS) ? window.SUPPLIERS : [];

// Keep city-level discovery useful even when a national retailer's original listing is broad.
const allAboutBaking = supplierData.find(item => item.name === 'All About Baking');
if (allAboutBaking) {
  allAboutBaking.location = 'Quezon City branches and stores nationwide; online delivery across the Philippines';
  allAboutBaking.mapsQuery = 'All About Baking Quezon City';
}

const localAdditions = [
  {
    name: 'Rise Artisanal',
    region: 'Philippines',
    location: 'Quezon City, Metro Manila',
    categories: ['Bakery', 'Sourdough bread', 'Artisan bread', 'Workshops'],
    levels: ['Beginner', 'Growing bakery'],
    bestFor: 'Long-fermented sourdough, focaccia and hands-on learning',
    description: 'A Quezon City microbakery producing naturally leavened bread, focaccia and seasonal baked goods, with practical sourdough workshops for home bakers.',
    website: 'https://riseartisanal.com/',
    mapsQuery: 'Rise Artisanal Quezon City',
    access: 'Pre-order + workshops',
    featured: true
  },
  {
    name: 'Wonderbake',
    region: 'Philippines',
    location: 'Quezon City, Metro Manila',
    categories: ['Ingredients', 'Tools & bakeware', 'Packaging', 'Cake decorating'],
    levels: ['Beginner', 'Growing bakery'],
    bestFor: 'Accessible baking ingredients, tools and decorating supplies in Quezon City',
    description: 'A local baking-supply stop for ingredients, pans, decorating materials, packaging and everyday tools used by home and small-business bakers.',
    website: 'https://www.google.com/search?q=Wonderbake+Quezon+City',
    mapsQuery: 'Wonderbake Quezon City',
    access: 'Store + online search'
  },
  {
    name: "Gavino's Japanese Donuts",
    region: 'Philippines',
    location: 'Granada Street area, Quezon City, Metro Manila',
    categories: ['Bakery', 'Donuts', 'Pastries'],
    levels: ['Beginner', 'Growing bakery'],
    bestFor: 'Japanese-style donuts and filled pastries',
    description: 'A Quezon City bakery known for soft Japanese-style donuts and a broad selection of filled and glazed pastries.',
    website: 'https://www.google.com/search?q=Gavino%27s+Japanese+Donuts+Quezon+City',
    mapsQuery: "Gavino's Donuts Quezon City",
    access: 'Store + delivery platforms'
  },
  {
    name: 'Kamuning Bakery Cafe',
    region: 'Philippines',
    location: '43 Judge Jimenez Street corner K-1 Street, Kamuning, Quezon City',
    categories: ['Bakery', 'Traditional bread', 'Pandesal', 'Cafe'],
    levels: ['Beginner', 'Growing bakery', 'Professional'],
    bestFor: 'Historic Filipino bread baked in a traditional pugon',
    description: 'A historic Quezon City bakery best known for pandesal, pan de suelo and other breads made using its traditional wood-fired brick oven.',
    website: 'https://www.google.com/search?q=Kamuning+Bakery+Cafe',
    mapsQuery: 'Kamuning Bakery Cafe Quezon City',
    access: 'Bakery + cafe'
  },
  {
    name: 'Pan de Manila',
    region: 'Philippines',
    location: 'Quezon City-based bakery chain with branches across Metro Manila and the Philippines',
    categories: ['Bakery', 'Pandesal', 'Traditional bread', 'Spreads'],
    levels: ['Beginner', 'Growing bakery'],
    bestFor: 'Everyday Filipino breads, pandesal and take-home spreads',
    description: 'A Philippine bakery chain founded in Quezon City, known for freshly baked pandesal, specialty breads, spreads and merienda products.',
    website: 'https://www.google.com/search?q=Pan+de+Manila+Quezon+City',
    mapsQuery: 'Pan de Manila Quezon City',
    access: 'Branches + delivery platforms'
  }
];

const existingNames = new Set(supplierData.map(item => item.name.toLowerCase()));
localAdditions.forEach(item => {
  if (!existingNames.has(item.name.toLowerCase())) supplierData.unshift(item);
});

const suppliers = supplierData;
const grid = document.getElementById('supplier-grid');
const searchInput = document.getElementById('search');
const searchForm = document.getElementById('main-search-form');
const regionFilter = document.getElementById('region-filter');
const categoryFilter = document.getElementById('category-filter');
const levelFilter = document.getElementById('level-filter');
const resultsCount = document.getElementById('results-count');
const emptyState = document.getElementById('empty-state');
const clearButton = document.getElementById('clear-filters');

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;'
}[character]));

const mapsUrl = query =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const allCategories = [...new Set(suppliers.flatMap(supplier => supplier.categories))].sort();
allCategories.forEach(category => {
  const option = document.createElement('option');
  option.value = category;
  option.textContent = category;
  categoryFilter.appendChild(option);
});

document.getElementById('supplier-stat').textContent = suppliers.length;
document.getElementById('ph-stat').textContent =
  suppliers.filter(supplier => supplier.region === 'Philippines').length;
document.getElementById('category-stat').textContent = `${allCategories.length}+`;

function cardTemplate(supplier) {
  const searchableTags = [...supplier.categories, ...supplier.levels];
  return `
    <article class="card ${supplier.featured ? 'featured' : ''}">
      <div class="card-top">
        <span class="region ${supplier.region === 'International' ? 'international' : ''}">
          ${escapeHtml(supplier.region)}
        </span>
        ${supplier.featured ? '<span class="featured-label">Strong first stop</span>' : ''}
      </div>
      <h3>${escapeHtml(supplier.name)}</h3>
      <p class="best-for">${escapeHtml(supplier.bestFor)}</p>
      <p class="description">${escapeHtml(supplier.description)}</p>
      <div class="meta">
        <div class="meta-row"><strong>Location</strong><span>${escapeHtml(supplier.location)}</span></div>
        <div class="meta-row"><strong>Access</strong><span>${escapeHtml(supplier.access)}</span></div>
        <div class="meta-row"><strong>Level</strong><span>${escapeHtml(supplier.levels.join(' · '))}</span></div>
      </div>
      <div class="tags">
        ${searchableTags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
      </div>
      <div class="actions">
        <a class="btn primary" href="${escapeHtml(supplier.website)}" target="_blank" rel="noopener noreferrer">Visit listing ↗</a>
        <a class="btn secondary" href="${mapsUrl(supplier.mapsQuery)}" target="_blank" rel="noopener noreferrer">Google Maps ↗</a>
      </div>
    </article>
  `;
}

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  const region = regionFilter.value;
  const category = categoryFilter.value;
  const level = levelFilter.value;

  const filtered = suppliers.filter(supplier => {
    const haystack = [
      supplier.name,
      supplier.location,
      supplier.bestFor,
      supplier.description,
      supplier.access,
      ...(supplier.searchTerms || []),
      ...supplier.categories,
      ...supplier.levels
    ].join(' ').toLowerCase();

    return (!query || haystack.includes(query))
      && (!region || supplier.region === region)
      && (!category || supplier.categories.includes(category))
      && (!level || supplier.levels.includes(level));
  });

  grid.innerHTML = filtered.map(cardTemplate).join('');
  resultsCount.textContent = filtered.length === suppliers.length
    ? `Showing all ${suppliers.length} listings`
    : `${filtered.length} listing${filtered.length === 1 ? '' : 's'} found`;
  emptyState.style.display = filtered.length ? 'none' : 'block';
}

searchInput.addEventListener('input', applyFilters);
[regionFilter, categoryFilter, levelFilter].forEach(control => {
  control.addEventListener('change', applyFilters);
});

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  applyFilters();
  document.getElementById('directory').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

clearButton.addEventListener('click', () => {
  searchInput.value = '';
  regionFilter.value = '';
  categoryFilter.value = '';
  levelFilter.value = '';
  applyFilters();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  searchInput.focus({ preventScroll: true });
});

const accountInput = document.getElementById('account_type');
const companyFields = document.getElementById('company-fields');
const featureInput = document.getElementById('wants_featured');
const businessFields = document.getElementById('business-fields');

document.querySelectorAll('[data-account-type]').forEach(button => {
  button.addEventListener('click', () => {
    const type = button.dataset.accountType;
    accountInput.value = type;
    document.querySelectorAll('[data-account-type]').forEach(item => {
      item.classList.toggle('active', item === button);
    });
    companyFields.classList.toggle('visible', type === 'company');
    if (type !== 'company') {
      featureInput.value = '';
      businessFields.classList.remove('visible');
      document.querySelectorAll('[data-feature]').forEach(item => item.classList.remove('active'));
    }
  });
});

document.querySelectorAll('[data-feature]').forEach(button => {
  button.addEventListener('click', () => {
    const value = button.dataset.feature;
    featureInput.value = value;
    document.querySelectorAll('[data-feature]').forEach(item => {
      item.classList.toggle('active', item === button);
    });
    businessFields.classList.toggle('visible', value === 'yes');
  });
});

const notifyForm = document.getElementById('notify-form');
notifyForm.addEventListener('submit', async event => {
  event.preventDefault();
  const submitButton = notifyForm.querySelector('[type="submit"]');
  const originalLabel = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = 'Signing up…';

  try {
    const response = await fetch('https://formspree.io/f/xpqnynqe', {
      method: 'POST',
      body: new FormData(notifyForm),
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) throw new Error('Form submission failed');
    notifyForm.style.display = 'none';
    document.getElementById('success-msg').style.display = 'block';
  } catch (error) {
    alert('Something went wrong. Please try again.');
    submitButton.disabled = false;
    submitButton.textContent = originalLabel;
  }
});

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: "The Baker's Directory listings",
  numberOfItems: suppliers.length,
  itemListElement: suppliers.map((supplier, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Organization',
      name: supplier.name,
      url: supplier.website,
      areaServed: supplier.region,
      description: supplier.description
    }
  }))
};

const schemaScript = document.createElement('script');
schemaScript.type = 'application/ld+json';
schemaScript.textContent = JSON.stringify(itemListSchema);
document.head.appendChild(schemaScript);

applyFilters();
