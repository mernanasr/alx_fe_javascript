const API_URL = "https://jsonplaceholder.typicode.com/posts"; // Simulated API

// Load quotes from localStorage or initialize default quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
    { text: "Do what you can, with what you have, where you are.", category: "Action" }
];

// Save quotes to localStorage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Fetch quotes from the mock server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(API_URL);
        const serverQuotes = await response.json();

        // Convert server response to match quote format
        const serverFormattedQuotes = serverQuotes.map(q => ({
            text: q.title,
            category: "General"
        }));

        return serverFormattedQuotes;
    } catch (error) {
        console.error("Error fetching quotes from server:", error);
        return [];
    }
}

// Sync with the server and handle conflicts
async function syncWithServer() {
    const serverQuotes = await fetchQuotesFromServer();

    // Merge server and local quotes (avoid duplicates)
    const mergedQuotes = [...serverQuotes, ...quotes].filter((quote, index, self) =>
        index === self.findIndex(q => q.text === quote.text)
    );

    quotes = mergedQuotes;
    saveQuotes();
    populateCategories();

    alert("Quotes synced with the server!");
}

// Populate category dropdown
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];

    uniqueCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    categoryFilter.value = localStorage.getItem("selectedCategory") || "all";
}

// Display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const selectedCategory = document.getElementById("categoryFilter").value;
    
    const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
    
    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = "<p>No quotes available for this category.</p>";
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];

    sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));

    quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><small>- ${randomQuote.category}</small>`;
}

// Filter quotes when category changes
function filterQuotes() {
    localStorage.setItem("selectedCategory", document.getElementById("categoryFilter").value);
    showRandomQuote();
}

// Add a new quote
function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value.trim();
    const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (newQuoteText === "" || newQuoteCategory === "") {
        alert("Please enter both quote text and category.");
        return;
    }

    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();

    populateCategories();
    showRandomQuote();

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    alert("Your quote has been saved locally!");
}

// Periodic sync (every 30 seconds)
setInterval(syncWithServer, 30000);

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("categoryFilter").addEventListener("change", filterQuotes);

window.onload = function () {
    populateCategories();
    showRandomQuote();
    syncWithServer();
};


