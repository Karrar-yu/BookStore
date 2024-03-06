const searchForm = document.querySelector('form[role="search"]');
const suggestionsList = document.getElementById('suggestions');
const spinner = document.createElement('div');
spinner.classList.add('spinner-grow', 'text-primary');
spinner.setAttribute('role', 'status');

searchForm.addEventListener('submit', (event) => {
  event.preventDefault(); 

  const searchInput = document.getElementById('searchInput');
  const searchQuery = searchInput.value.trim();

  if (searchQuery.length === 0) {
    suggestionsList.innerHTML = '';
    return;
  }

  suggestionsList.innerHTML = '';
  suggestionsList.appendChild(spinner);

  const processedSearchQuery = encodeURIComponent(searchQuery).replace(
    /%20/g,
    '+',
  );
  const apiUrl = `https://openlibrary.org/search.json?title=${processedSearchQuery}*&&limit=5`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const filteredSuggestions = filterSuggestions(data.docs, searchQuery);
      displaySuggestions(filteredSuggestions);
    })
    .catch((error) => {
      console.error('Error fetching search suggestions:', error);
    })
    .finally(() => {
      suggestionsList.removeChild(spinner);
    });
});

const filterSuggestions = (suggestions, searchQuery) => {
  const searchWords = searchQuery.toLowerCase().split(' ');

  return suggestions.filter((suggestion) => {
    const title = suggestion.title.toLowerCase();

    return searchWords.every((word) => title.includes(word));
  });
};

const displaySuggestions = (suggestions) => {
  suggestionsList.innerHTML = '';

  suggestions.forEach((suggestion) => {
    const suggestionLink = document.createElement('a');
    suggestionLink.classList.add('list-group-item', 'list-group-item-action'); 
    suggestionLink.href = `https://openlibrary.org${suggestion.key}`;
    suggestionLink.textContent = suggestion.title;
    suggestionsList.appendChild(suggestionLink);
  });
};

// Add event listener to document body to clear suggestions list when clicked
document.body.addEventListener('click', () => {
  suggestionsList.innerHTML = '';
});
