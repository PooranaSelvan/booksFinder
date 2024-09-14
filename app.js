const input = document.getElementById('userInput'); // getting user input
const btn = document.getElementById('search'); // getting button
const results = document.getElementById('results'); // getting the div where we need to append our outputs.

btn.addEventListener("click", async () => {
    if (!input.value) {
        alert("Please enter a search term.");
        return;
    }

    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${input.value}&key=YOUR_API_KEY`);
        const data = await response.json();
        displayResults(data.items); // using callback function passing our datas as param..
    } catch (error) {
        console.error('Error fetching books:', error);
    }
});

function displayResults(books) {
    results.innerHTML = "";
    if (!books) {
        results.innerHTML = "<p>No books found.</p>";
        return;
    }

    books.forEach(book => {
        const bookInfo = book.volumeInfo;
        const bookElement = document.createElement('div');
        bookElement.classList.add('p-6', 'bg-white', 'shadow-lg', 'rounded-lg', 'flex', 'flex-wrap', 'gap-6', 'max-w-full', 'overflow-hidden');

        const thumbnail = bookInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/300x400'; // if image found show or show placeholder
        const rating = bookInfo.averageRating ? `${bookInfo.averageRating} / 5` : 'No rating'; // if rating found show or show no rating
        let description = bookInfo.description || 'No description available'; // if description found show or show no description
        const maxLength = 150; // Max length of description

        // Shorten the description if it's too long
        let descriptionHtml = description;
        // description ooda length max length aa vida high aa irutha 
        if (description.length > maxLength) {
            // maxLength varaikum thaa display pananum athuku mela read more..
            descriptionHtml = `
                <span class="short-desc">${description.substring(0, maxLength)}...</span>
                <span class="full-desc" style="display:none;">${description}</span>
                <a href="#" class="text-blue-600 cursor-pointer read-more">Read more..</a>
            `;
        } else {
            descriptionHtml = `<span>${description}</span>`;
        }

        const language = bookInfo.language ? bookInfo.language.toUpperCase() : 'Unknown'; // if book language found change to uppercase or show unknown
        const pageCount = bookInfo.pageCount || 'N/A'; // if pagecount irutha atha show pannu or N/A

        // Showing image,title,authors,rating,description,language,pagecount,preview.
        bookElement.innerHTML = `
            <img src="${thumbnail}" alt="${bookInfo.title}" class="w-full h-72 object-contain rounded-lg">
            <div class="flex flex-col flex-grow">
                <h3 class="text-2xl font-semibold mb-2">${bookInfo.title}</h3>
                <p class="text-lg text-gray-600 mb-2">Authors: ${bookInfo.authors?.join(", ") || 'Unknown author'}</p>
                <p class="text-lg font-semibold mb-2">Rating: ${rating}</p>
                <p class="text-sm text-gray-700 my-4"><strong>Description:</strong> ${descriptionHtml}</p>
                <p class="text-sm text-gray-600 mb-2"><strong>Language:</strong> ${language}</p>
                <p class="text-sm text-gray-600 mb-4"><strong>Page Count:</strong> ${pageCount}</p>
                <a href="${bookInfo.previewLink}" target="_blank" class="text-blue-600 font-bold hover:underline">Preview</a>
            </div>
        `;

        // result div kulla append panrom
        results.appendChild(bookElement);

        // toggle "Read more" and "Read less"
        if (description.length > maxLength) {
            const toggleLink = bookElement.querySelector('.read-more');
            toggleLink.addEventListener('click', (event) => {
                event.preventDefault();
                const shortDesc = bookElement.querySelector('.short-desc');
                const fullDesc = bookElement.querySelector('.full-desc');

                if (toggleLink.textContent === 'Read more..') {
                    shortDesc.style.display = 'none';
                    fullDesc.style.display = 'inline';
                    toggleLink.textContent = 'Read less';
                } else {
                    shortDesc.style.display = 'inline';
                    fullDesc.style.display = 'none';
                    toggleLink.textContent = 'Read more..';
                }
            });
        }
    });
}
