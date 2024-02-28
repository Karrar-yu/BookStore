function setupTabs() {
  document.querySelectorAll('.tabs-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const sidebar = button.parentElement;
      const tabsContainer = sidebar.parentElement;
      const tabNumber = button.dataset.forTab;
      const tabToActivate = tabsContainer.querySelector(
        `.tabs-content[data-tab="${tabNumber}"]`,
      );

      sidebar.querySelectorAll('.tabs-btn').forEach((btn) => {
        btn.classList.remove('tabs-btn--active');
      });

      tabsContainer.querySelectorAll('.tabs-content').forEach((tab) => {
        tab.classList.remove('tabs-content--active');
      });

      button.classList.add('tabs-btn--active');
      tabToActivate.classList.add('tabs-content--active');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
});

async function fetchBooks(category) {
  const response = await fetch(
    `https://openlibrary.org/search.json?q=${category}&limit=8`,
  );
  const data = await response.json();
  return data.docs;
}

function displayBooksInList(books, containerId) {
  const container = document.getElementById(containerId);
  books.forEach((book) => {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card-dis');

    const cardImg = document.createElement('div');
    cardImg.classList.add('card-imgg');
    cardImg.style.backgroundImage = `url("https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg")`;

    const cardContent = document.createElement('div');
    cardContent.classList.add('card-content');

    const title = document.createElement('h2');
    title.textContent = book.title;

    const author = document.createElement('p');
    author.textContent = `by ${book.author_name ? book.author_name.join(', ') : 'Unknown Author'}`;

    const readMoreLink = document.createElement('a');
    readMoreLink.href = `https://openlibrary.org${book.key}`;
    readMoreLink.textContent = 'Read more';
    readMoreLink.classList.add('read.more');

    cardContent.appendChild(title);
    cardContent.appendChild(author);
    cardContent.appendChild(readMoreLink);

    cardDiv.appendChild(cardImg);
    cardDiv.appendChild(cardContent);

    container.appendChild(cardDiv);
  });

  const infinityElement = container.querySelector('.infinity-10');
  if (infinityElement) {
    infinityElement.style.display = 'none';
  }
}

async function displayBooks() {
  const comedyBooks = await fetchBooks('comedy');
  const horrorBooks = await fetchBooks('horror');
  const actionBooks = await fetchBooks('action');

  displayBooksInList(comedyBooks, 'comedy-books');
  displayBooksInList(horrorBooks, 'horror-books');
  displayBooksInList(actionBooks, 'action-books');
}

window.onload = displayBooks;
