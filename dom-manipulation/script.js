// Load quotes from localStorage or initialize with default quotes
const quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
    { text: "Do what you can, with what you have, where you are.", category: "Action" }
];

// Function to save quotes to localStorage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");

    if (quotes.length === 0) {
        quoteDisplay.innerHTML = "<p>No quotes available.</p>";
        return;
    }

    // Select a random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    // Store last viewed quote in sessionStorage
    sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));

    // Update the DOM
    quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><small>- ${randomQuote.category}</small>`;
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

    // Save to localStorage
    saveQuotes();

    // Clear input fields
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    // Show the new quote immediately
    showRandomQuote();
}

// Function to export quotes as a JSON file
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    
    fileReader.onload = function (e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                alert("Quotes imported successfully!");
                showRandomQuote();
            } else {
                alert("Invalid file format. Please upload a valid JSON file.");
            }
        } catch (error) {
            alert("Error parsing JSON file.");
        }
    };

    fileReader.readAsText(event.target.files[0]);
}

// Function to create and add the quote input form dynamically
function createAddQuoteForm() {
    const formContainer = document.createElement("div");

    formContainer.innerHTML = `
        <h2>Add Your Own Quote</h2>
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button id="addQuoteBtn">Add Quote</button>
        
        <h2>Import/Export Quotes</h2>
        <button id="exportJsonBtn">Export Quotes</button>
        <input type="file" id="importFile" accept=".json" />
    `;

    document.body.appendChild(formContainer);

    // Attach event listeners
    document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
    document.getElementById("exportJsonBtn").addEventListener("click", exportToJsonFile);
    document.getElementById("importFile").addEventListener("change", importFromJsonFile);
}

// Event listener for "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// On page load, check session storage and load last viewed quote
window.onload = function () {
    createAddQuoteForm();
    const lastQuote = sessionStorage.getItem("lastQuote");

    if (lastQuote) {
        const quoteDisplay = document.getElementById("quoteDisplay");
        const storedQuote = JSON.parse(lastQuote);
        quoteDisplay.innerHTML = `<p>"${storedQuote.text}"</p><small>- ${storedQuote.category}</small>`;
    } else {
        showRandomQuote();
    }
};

