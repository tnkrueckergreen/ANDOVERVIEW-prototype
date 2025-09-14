import Fuse from 'fuse.js';
import { getCombinedData } from '../api.js';

let fuseInstance = null;
let articlesForSearch = [];

function stripHtml(html) {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

export async function initializeSearch() {
    if (fuseInstance) return;

    const { articles } = await getCombinedData();

    articlesForSearch = articles.map(article => {
        const searchableContent = [];

        searchableContent.push(article.title);
        searchableContent.push(article.rawDescription);
        searchableContent.push(stripHtml(article.content));

        if (article.tags) searchableContent.push(article.tags.join(' '));
        if (article.categories) searchableContent.push(article.categories.join(' '));

        if (article.writers) {
            article.writers.forEach(writer => {
                searchableContent.push(writer.name);
                if (writer.role) searchableContent.push(writer.role);
                if (writer.bio) searchableContent.push(writer.bio);
            });
        }

        return {
            ...article,
            searchableText: searchableContent.join(' | ')
        };
    });

    const options = {
        keys: [
            { name: 'title', weight: 0.6 },
            { name: 'searchableText', weight: 0.4 }
        ],
        includeScore: true,
        minMatchCharLength: 2,
        threshold: 0.35,
        ignoreLocation: true,
    };

    fuseInstance = new Fuse(articlesForSearch, options);
}

export async function performSearch(query) {
    await initializeSearch();
    const results = fuseInstance.search(query);
    return results.map(result => result.item);
}