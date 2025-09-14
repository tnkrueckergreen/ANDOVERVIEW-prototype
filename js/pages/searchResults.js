import { performSearch } from '../lib/search.js';
import { SmallCard } from '../components/cards/SmallCard.js';
import { PageHeader } from '../components/layout/PageHeader.js';
import { Container } from '../components/layout/Container.js';
import { Section } from '../components/layout/Section.js';
import { renderList, renderIf } from '../lib/template.js';
import { SortControl } from '../components/common/SortControl.js';
import { sortItems } from '../lib/sorting.js';

let searchResults = [];

function createHTML(query, results) {
    const title = results.length > 0
        ? `Search results for '<span class="query">${query}</span>'`
        : `No results found for '<span class="query">${query}</span>'`;
    
    const subtitle = results.length === 0 
        ? 'Try searching for something else, or check out our latest articles.' 
        : '';
    
    const articleCards = renderList(results, SmallCard);
    
    const content = Container(
        PageHeader(title, subtitle) +
        renderIf(results.length > 0, `
            ${SortControl()}
            <div id="search-grid-container" class="article-grid">${articleCards}</div>
        `)
    );

    return Section({
        className: 'page article-grid-page search-results-page',
        content
    });
}

function attachSortListener() {
    const sortSelect = document.getElementById('sort-by');
    const gridContainer = document.getElementById('search-grid-container');

    if (!sortSelect || !gridContainer) return;

    sortSelect.addEventListener('change', (e) => {
        const sortBy = e.target.value;
        const sortedResults = sortItems(searchResults, sortBy);
        gridContainer.innerHTML = renderList(sortedResults, SmallCard);
    });
}

export async function render(container, query) {
    const decodedQuery = decodeURIComponent(query);
    searchResults = await performSearch(decodedQuery);
    container.innerHTML = createHTML(decodedQuery, searchResults);
    attachSortListener();
}