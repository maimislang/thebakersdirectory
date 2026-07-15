(() => {
  const track = (eventName, params = {}) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  };

  const searchForm = document.getElementById('main-search-form');
  const searchInput = document.getElementById('search');
  const resultsCount = document.getElementById('results-count');

  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', () => {
      const term = searchInput.value.trim();
      if (!term) return;

      const match = (resultsCount?.textContent || '').match(/(\d+)/);
      track('view_search_results', {
        search_term: term,
        results_count: match ? Number(match[1]) : undefined
      });
    });
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('.card .actions a');
    if (!link) return;

    const card = link.closest('.card');
    const listingName = card?.querySelector('h3')?.textContent?.trim() || 'Unknown listing';
    const isMaps = link.textContent.includes('Google Maps');

    track('select_content', {
      content_type: isMaps ? 'google_maps' : 'listing_website',
      item_id: listingName,
      link_url: link.href
    });
  });

  const supplierForm = document.getElementById('supplier-form');
  const successMessage = document.getElementById('submission-success');

  if (supplierForm && successMessage) {
    const observer = new MutationObserver(() => {
      if (successMessage.style.display === 'block') {
        const formData = new FormData(supplierForm);
        track('generate_lead', {
          lead_source: 'supplier_submission',
          business_type: formData.get('business_type') || 'unknown'
        });
        observer.disconnect();
      }
    });

    observer.observe(successMessage, {
      attributes: true,
      attributeFilter: ['style']
    });
  }
})();
