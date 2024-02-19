const productContainers = [...document.querySelectorAll('.product-container')];
const nxtBtn = [...document.querySelectorAll('.nxt-btn')];
const preBtn = [...document.querySelectorAll('.pre-btn')];

// Define custom scroll amount
const scrollAmount = 500; // Adjust this value to control the scroll amount

// Iterate over each product container
productContainers.forEach((item, i) => {
    // Add event listener for the next button
    nxtBtn[i].addEventListener('click', () => {
        // Scroll the container to the right by the specified amount
        item.scrollLeft += scrollAmount;
    });

    // Add event listener for the previous button
    preBtn[i].addEventListener('click', () => {
        // Scroll the container to the left by the specified amount
        item.scrollLeft -= scrollAmount;
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

///////////////////////////////////////////////////////////////

const tabs = document.querySelectorAll(".tab-btn")
const all_content = document.querySelectorAll(".contentt")

tabs.forEach((tab,index) => {
    tab.addEventListener("click",(e)=>{
        tabs.forEach(tab=>{tab.classList.remove("active")}); //remove the active to replace it with the class that is pressed
        tab.classList.add("active");

        var line = document.querySelector('.line');
        line.style.width = e.target.offsetWidth + "px";
        line.style.left = e.target.offsetLeft + "px";

        all_content.forEach(content =>content.classList.remove('active'));
        all_content[index].classList.add('active');
    })

})



///////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Function to fetch books based on genre
        const fetchBooks = async (genre, containerId) => {
            const screenLimit = window.innerWidth <= 765 ? 6 : 15; // Adjust limit based on screen width
            const response = await fetch(`https://openlibrary.org/search.json?q=books&subject=${genre}&has_cover=true&limit=${screenLimit}`);
            const data = await response.json();
            const container = document.getElementById(containerId);
            const spinner = container.querySelector('.spinner-border'); // Get spinner element inside container

            if (!container) {
                console.error(`Element with id "${containerId}" not found`);
                return;
            }

            const maxBooksToShow = 20;
            let booksDisplayed = 0;
            let booksHTML = '';

            data.docs.forEach(book => {
                if (booksDisplayed < maxBooksToShow && book.cover_i && book.language && book.language.includes('eng')) {
                    const cardContainer = document.createElement('div');
                    cardContainer.style.width = "16rem"
                    cardContainer.classList.add("card")

                    const card = document.createElement('div');
                    card.classList.add(`${genre.toLowerCase()}Card`); // Dynamic class based on genre

                    const img = document.createElement('img');
                    img.src = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
                    img.alt = book.title;
                    img.classList.add("card-img-top");

                    const title = document.createElement('div');
                    title.textContent = book.title;
                    title.classList.add("card-title")

                    const description = document.createElement('p');
                    description.textContent = book.first_publish_year ? `First Published: ${book.first_publish_year}` : 'No publish year available'; // Displaying first publish year if available

                    const button = document.createElement('button');
                    button.textContent = 'Add to Cart';
                    button.classList.add("btn")

                    card.appendChild(img);
                    card.appendChild(title);
                    card.appendChild(description);
                    card.appendChild(button);

                    cardContainer.appendChild(card);
                    container.appendChild(cardContainer);

                    booksDisplayed++;
                }
            });

            // Hide spinner when content is loaded
            if (spinner) {
                spinner.style.display = 'none';
            }
        };

        // Fetch books for each genre
        await fetchBooks('Mystery', 'mysteryBooksContainer');
        await fetchBooks('Comedy', 'comedyBooksContainer');
        await fetchBooks('Horror', 'horrorBooksContainer');
        await fetchBooks('Action', 'actionBooksContainer');

    } catch (error) {
        console.error('Error fetching books:', error);
    }
});





const searchForm = document.querySelector('form[role="search"]');
const suggestionsList = document.getElementById('suggestions');
const spinner = document.createElement('div');
spinner.classList.add('spinner-grow', 'text-primary'); // Add classes for styling the spinner
spinner.setAttribute('role', 'status');

let debounceTimer;

searchForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission

    const searchInput = document.getElementById('searchInput');
    const searchQuery = searchInput.value.trim();
    console.log('Search query:', searchQuery);
    
    if (searchQuery.length === 0) {
        suggestionsList.innerHTML = '';
        return;
    }

    // Show spinner while fetching suggestions
    suggestionsList.innerHTML = '';
    suggestionsList.appendChild(spinner);

    // Encode the search query and replace spaces with plus signs
    const processedSearchQuery = encodeURIComponent(searchQuery).replace(/%20/g, '+');
    const apiUrl = `https://openlibrary.org/search.json?title=${processedSearchQuery}*&&limit=5`;
    console.log('API URL:', apiUrl);

    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        console.log('API Response:', data);
        console.log('Search Query (toLowerCase):', searchQuery.toLowerCase());
        console.log('Titles of Suggestions:');
        data.docs.forEach(suggestion => {
            console.log(suggestion.title.toLowerCase());
        });
        
        const filteredSuggestions = filterSuggestions(data.docs, searchQuery);
        console.log('Filtered Suggestions:', filteredSuggestions);
        displaySuggestions(filteredSuggestions);
    })
    .catch(error => {
        console.error('Error fetching search suggestions:', error);
    })
    .finally(() => {
        // Remove spinner after suggestions are displayed or if there's an error
        suggestionsList.removeChild(spinner);
    });

});

function filterSuggestions(suggestions, searchQuery) {
    // Split the search query into individual words
    const searchWords = searchQuery.toLowerCase().split(' ');

    return suggestions.filter(suggestion => {
        // Convert the title to lowercase
        const title = suggestion.title.toLowerCase();
        
        // Check if all words from the search query are included in the title
        return searchWords.every(word => title.includes(word));
    });
}

function displaySuggestions(suggestions) {
    console.log('Displaying Suggestions:', suggestions);
    suggestionsList.innerHTML = '';

    suggestions.forEach(suggestion => {
        const suggestionLink = document.createElement('a');
        suggestionLink.classList.add('list-group-item', 'list-group-item-action'); // Add the desired classes
        suggestionLink.href = `https://openlibrary.org${suggestion.key}`;
        suggestionLink.textContent = suggestion.title;
        suggestionsList.appendChild(suggestionLink);
    });
}
