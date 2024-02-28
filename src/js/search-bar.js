const searchForm = document.querySelector('form[role="search"]');
const suggestionsList = document.getElementById('suggestions');
const spinner = document.createElement('div');
spinner.classList.add('spinner-grow', 'text-primary'); // Add classes for styling the spinner
spinner.setAttribute('role', 'status');

searchForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent the default form submission

  const searchInput = document.getElementById('searchInput');
  const searchQuery = searchInput.value.trim();

  if (searchQuery.length === 0) {
    suggestionsList.innerHTML = '';
    return;
  }

  // Show spinner while fetching suggestions
  suggestionsList.innerHTML = '';
  suggestionsList.appendChild(spinner);

  // Encode the search query and replace spaces with plus signs
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
      // Remove spinner after suggestions are displayed or if there's an error
      suggestionsList.removeChild(spinner);
    });
});

const filterSuggestions = (suggestions, searchQuery) => {
  // Split the search query into individual words
  const searchWords = searchQuery.toLowerCase().split(' ');

  return suggestions.filter((suggestion) => {
    // Convert the title to lowercase
    const title = suggestion.title.toLowerCase();

    // Check if all words from the search query are included in the title
    return searchWords.every((word) => title.includes(word));
  });
};

const displaySuggestions = (suggestions) => {
  suggestionsList.innerHTML = '';

  suggestions.forEach((suggestion) => {
    const suggestionLink = document.createElement('a');
    suggestionLink.classList.add('list-group-item', 'list-group-item-action'); // Add the desired classes
    suggestionLink.href = `https://openlibrary.org${suggestion.key}`;
    suggestionLink.textContent = suggestion.title;
    suggestionsList.appendChild(suggestionLink);
  });
};
