const API_URL = "https://jsonplaceholder.typicode.com/posts"; // Simulated API

// Load quotes from localStorage or initialize with default quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
    { text: "Do what you can, with what you have, where you are.", category: "Action" }
];

// Save quotes to localStorage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// **✅ Display a notification for updates/conflicts**
function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
}

// **✅ Fetch quotes from server**
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(API_URL);
        const serverQuotes = await response.json();

        return serverQuotes.map(q => ({
            text: q.title, // JSONPlaceholder uses "title", adapting it for quotes
            category: "General"
        }));
    } catch (error) {
        console.error("Error fetching quotes from server:", error);
        showNotification("Failed to sync with server!", "error");
        return [];
    }
}

// **✅ Sync quotes with the server**
async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();

    // Merge server and local quotes, avoiding duplicates
    const mergedQuotes = [...serverQuotes, ...quotes].filter((quote, index, self) =>
        index === self.findIndex(q => q.text === quote.text)
    );

    if (mergedQuotes.length !== quotes.length) {
        showNotification("Quotes synced with server!", "success");
    }

    quotes = mergedQuotes;
    saveQuotes();
    populateCategories();
}

// **✅ Post new quote to the server**
async function postQuoteToServer(quote) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(quote)
        });

        const data = await response.json();
        console.log("Quote successfully posted to server:", data);
        showNotification("Quote successfully saved to server!", "success");
        return data;
    } catch (error) {
        console.error("Error posting quote to server:", error);
        showNotification("Failed to save quote to server!", "error");
    }
}

// **✅ Display a random quote**
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

// **✅ Filter quotes by category**
function filterQuotes() {
    localStorage.setItem("selectedCategory", document.getElementById("categoryFilter").value);
    showRandomQuote();
}

// **✅ Add new quote and sync with server**
async function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value.trim();
    const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (newQuoteText === "" || newQuoteCategory === "") {
        showNotification("Please enter both quote text and category!", "error");
        return;
    }

    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();

    populateCategories();
    showRandomQuote();

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    showNotification("Your quote has been saved locally!", "success");

    // **✅ Post the new quote to the server**
    await postQuoteToServer(newQuote);
}

// **✅ Sync with the server every 30 seconds**
setInterval(syncQuotes, 30000);

// **✅ Event listeners**
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("categoryFilter").addEventListener("change", filterQuotes);

// **✅ Initialize application**
window.onload = function () {
    populateCategories();
    showRandomQuote();
    syncQuotes();
};


