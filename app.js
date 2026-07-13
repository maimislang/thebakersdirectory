const suppliers = Array.isArray(window.SUPPLIERS) ? window.SUPPLIERS : [];
const grid = document.getElementById('supplier-grid');
const searchInput = document.getElementById('search');
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
        <a class="btn primary" href="${escapeHtml(supplier.website)}" target="_blank" rel="noopener noreferrer">Visit supplier ↗</a>
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
      ...supplier.categories,
      ...supplier.levels
    ].join(' ').toLowerCase();

    return (!query || haystack.includes(query))
      && (!region || supplier.region === region)
      && (!category || supplier.categories.includes(category))
      && (!level || supplier.levels.includes(level));
  });

  grid.innerHTML = filtered.map(cardTemplate).join('');
  resultsCount.textContent =
    filtered.length === suppliers.length
      ? `Showing all ${suppliers.length} suppliers`
      : `${filtered.length} supplier${filtered.length === 1 ? '' : 's'} found`;

  emptyState.style.display = filtered.length ? 'none' : 'block';
}

[searchInput, regionFilter, categoryFilter, levelFilter].forEach(control => {
  control.addEventListener(control === searchInput ? 'input' : 'change', applyFilters);
});

clearButton.addEventListener('click', () => {
  searchInput.value = '';
  regionFilter.value = '';
  categoryFilter.value = '';
  levelFilter.value = '';
  applyFilters();
  searchInput.focus();
});

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: "The Baker's Directory supplier list",
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
