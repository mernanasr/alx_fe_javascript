// Array of quotes
const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
    { text: "Do what you can, with what you have, where you are.", category: "Action" }
];

// Function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");

    // Select a random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    // Update the DOM
    quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><small>- ${randomQuote.category}</small>`;
}

// Function to create and add the quote input form dynamically
function createAddQuoteForm() {
    const formContainer = document.createElement("div");

    formContainer.innerHTML = `
        <h2>Add Your Own Quote</h2>
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button id="addQuoteBtn">Add Quote</button>
    `;

    document.body.appendChild(formContainer);

    // Attach event listener after adding the button to the DOM
    document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value.trim();
    const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (newQuoteText === "" || newQuoteCategory === "") {
        alert("Please enter both quote text and category.");
        return;
    }

    // Add new quote to the array
    quotes.push({ text: newQuoteText, category: newQuoteCategory });

    // Clear input fields
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    // Show the new quote immediately
    showRandomQuote();
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Call `createAddQuoteForm` to dynamically add the form when the script loads
window.onload = function () {
    showRandomQuote();
    createAddQuoteForm();
};

