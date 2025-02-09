// Load quotes from localStorage or initialize default quotes
const quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
    { text: "Do what you can, with what you have, where you are.", category: "Action" }
];

// Function to save quotes to localStorage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to populate category filter dropdown
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

    // Restore last selected filter from localStorage
    const lastSelectedCategory = localStorage.getItem("selectedCategory") || "all";
    categoryFilter.value = lastSelectedCategory;
}

// Function to display a random quote based on category
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

// Function to filter quotes when category changes
function filterQuotes() {
    localStorage.setItem("selectedCategory", document.getElementById("categoryFilter").value);
    showRandomQuote();
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value.trim();
    const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (newQuoteText === "" || newQuoteCategory === "") {
        alert("Please enter both quote text and category.");
        return;
    }

    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes();

    populateCategories();

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    showRandomQuote();
}

// Event listener for "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("categoryFilter").addEventListener("change", filterQuotes);

// On page load
window.onload = function () {
    populateCategories();
    const lastQuote = sessionStorage.getItem("lastQuote");

    if (lastQuote) {
        const quoteDisplay = document.getElementById("quoteDisplay");
        const storedQuote = JSON.parse(lastQuote);
        quoteDisplay.innerHTML = `<p>"${storedQuote.text}"</p><small>- ${storedQuote.category}</small>`;
    } else {
        showRandomQuote();
    }
};


