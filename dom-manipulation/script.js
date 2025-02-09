// Quote array with predefined quotes
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Do what you can, with what you have, where you are.", category: "Inspiration" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" }
];

// Function to show a random quote
function showRandomQuote() {
    let selectedCategory = document.getElementById("categorySelect").value;
    let filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
    
    if (filteredQuotes.length === 0) {
        document.getElementById("quoteDisplay").innerText = "No quotes available in this category.";
        return;
    }

    let randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    document.getElementById("quoteDisplay").innerText = filteredQuotes[randomIndex].text;
}

// Function to add a new quote
function addQuote() {
    let newQuoteText = document.getElementById("newQuoteText").value.trim();
    let newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

    if (newQuoteText === "" || newQuoteCategory === "") {
        alert("Please enter both a quote and a category.");
        return;
    }

    quotes.push({ text: newQuoteText, category: newQuoteCategory });

    // Add new category to the dropdown if it doesn't exist
    let categorySelect = document.getElementById("categorySelect");
    if (![...categorySelect.options].some(option => option.value === newQuoteCategory)) {
        let newOption = document.createElement("option");
        newOption.value = newQuoteCategory;
        newOption.textContent = newQuoteCategory;
        categorySelect.appendChild(newOption);
    }

    // Clear input fields
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    alert("Quote added successfully!");
}

// Event Listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuote").addEventListener("click", addQuote);
