const productContainers = [...document.querySelectorAll('.product-container')];
const nxtBtn = [...document.querySelectorAll('.nxt-btn')];
const preBtn = [...document.querySelectorAll('.pre-btn')];

// Iterate over each product container
productContainers.forEach((item, i) => {
    // Get the dimensions of the container
    let containerDimensions = item.getBoundingClientRect();
    let containerWidth = containerDimensions.width;

    // Debugging: Log container width
    console.log("Container Width:", containerWidth);

    // Add event listener for the next button
    nxtBtn[i].addEventListener('click', () => {
        // Debugging: Log next button click
        console.log("Next Button Clicked");
        // Scroll the container to the right
        item.scrollLeft += containerWidth;
        // Debugging: Log scroll left position
        console.log("Scroll Left:", item.scrollLeft);
    });

    // Add event listener for the previous button
    preBtn[i].addEventListener('click', () => {
        // Debugging: Log previous button click
        console.log("Previous Button Clicked");
        // Scroll the container to the left
        item.scrollLeft -= containerWidth;
        // Debugging: Log scroll left position
        console.log("Scroll Left:", item.scrollLeft);
    });
});

// When the DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "https://openlibrary.org/search.json?author=tolkien&sort=new";
    const maxBooksToShow = 20; // Set the maximum number of books to display

    const booksContainer = document.querySelector('.product-container');

    // Add spinner to indicate loading
    const spinnerHTML = `
    <div class="spinner-border" style="width: 5rem; height: 5rem;" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>`;
    booksContainer.innerHTML = spinnerHTML;

    // Fetch data from the API
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            return response.json();
        })
        .then(data => {
            // Filter out books without cover images and limit to English language
            const books = data.docs.filter(book => book.cover_i && book.language && book.language.includes('eng'));
            let booksDisplayed = 0; // Initialize counter for books displayed
            let booksHTML = ''; // Initialize string to store HTML for all books
            console.log(books);
            // Iterate over each book
            books.forEach(book => {
                if (booksDisplayed < maxBooksToShow) {
                    const bookCard = document.createElement('div');
                    bookCard.classList.add('product-card', 'card'); // Added 'card' class

                    bookCard.style.width = '18rem';

                    const bookImage = document.createElement('img');
                    bookImage.classList.add('cardImg',"d-flex","justify-content-center","align-items-center", "container");
                    bookImage.alt = book.title;
                    bookImage.src = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;

                    const bookCardBody = document.createElement('div');
                    bookCardBody.classList.add('card-body');

                    const bookTitle = document.createElement('h2');
                    bookTitle.classList.add('card-title');
                    bookTitle.textContent = book.title;

                    const bookText = document.createElement('p');
                    bookText.classList.add('card-text');
                    bookText.textContent = 'Some quick example text to build on the card title and make up the bulk of the card\'s content.';

                    const bookButton = document.createElement('a');
                    bookButton.classList.add('btnn');
                    bookButton.href = '#';
                    bookButton.textContent = 'Checkout the book'; // Change the text as needed

                    bookCardBody.appendChild(bookTitle);
                    bookCardBody.appendChild(bookText);
                    bookCardBody.appendChild(bookButton); // Append the button to the card body
                    bookCard.appendChild(bookImage);
                    bookCard.appendChild(bookCardBody);

                    booksHTML += bookCard.outerHTML;
                    booksDisplayed++;
                }
            });

            booksContainer.innerHTML = booksHTML;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            // Display an error message or handle the error as needed
        });
});
