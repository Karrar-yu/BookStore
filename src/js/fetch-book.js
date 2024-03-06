document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://openlibrary.org/search.json?author=tolkien&sort=new';
    const maxBooksToShow = 20;
  
    const booksContainer = document.querySelector('.product-container');
    const nxtBtn = document.querySelector('.nxt-btn');
    const preBtn = document.querySelector('.pre-btn');
  
    const spinnerHTML = `
      <div class="spinner-border" style="width: 5rem; height: 5rem;" role="status">
      <span class="visually-hidden">Loading...</span>
      </div>`;
    booksContainer.innerHTML = spinnerHTML;
  
    let scrollPosition = 0;
  
    const handleScroll = (direction) => {
      const containerWidth = booksContainer.offsetWidth;
      const scrollIncrement = containerWidth * 0.3; 
  
      if (direction === 'next') {
        scrollPosition += scrollIncrement;
      } else {
        scrollPosition -= scrollIncrement;
      }
  
      scrollPosition = Math.max(0, Math.min(scrollPosition, booksContainer.scrollWidth - containerWidth));
  
      booksContainer.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    };
  
    nxtBtn.addEventListener('click', () => {
      handleScroll('next');
    });
  
    preBtn.addEventListener('click', () => {
      handleScroll('prev');
    });
  
;
  
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then((data) => {
        const books = data.docs.filter(
          (book) => book.cover_i && book.language && book.language.includes('eng'),
        );
        const booksDisplayed = 0; 
        let booksHTML = '';
        books.forEach((book) => {
          if (booksDisplayed < maxBooksToShow) {
            const bookCard = document.createElement('div');
            bookCard.classList.add('product-card', 'card'); 
  
            bookCard.style.width = '18rem';
  
            const bookImage = document.createElement('img');
            bookImage.classList.add(
              'cardImg',
              'd-flex',
              'justify-content-center',
              'align-items-center',
              'container',
            );
            bookImage.alt = book.title;
            bookImage.src = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
  
            const bookCardBody = document.createElement('div');
            bookCardBody.classList.add('card-body');
  
            const bookTitle = document.createElement('h2');
            bookTitle.classList.add('card-title');
            bookTitle.textContent = book.title;
  
            const bookText = document.createElement('p');
            bookText.classList.add('card-text');
            bookText.textContent = "[Description about the book]";
  
            const bookButton = document.createElement('a');
            bookButton.classList.add('btnn');
            bookButton.href = '#';
            bookButton.textContent = 'Checkout the book';
  
            bookCardBody.appendChild(bookTitle);
            bookCardBody.appendChild(bookText);
            bookCardBody.appendChild(bookButton); 
            bookCard.appendChild(bookImage);
            bookCard.appendChild(bookCardBody);
  
            booksHTML += bookCard.outerHTML;
          }
        });
  

  
        booksContainer.innerHTML = booksHTML;
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  });
  