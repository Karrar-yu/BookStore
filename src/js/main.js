import './fetch-book.js';
import './search-bar.js';
import './featured-section.js';

const exploreBooks = document.querySelector('.button-1');
const tabs = document.getElementById('Featured');

exploreBooks.addEventListener('click', () => {
  tabs.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
