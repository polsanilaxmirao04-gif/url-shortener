// DOM Elements
const longUrl = document.getElementById("longUrl");
const shortUrl = document.getElementById("shortUrl");
const shortenBtn = document.getElementById("shortenBtn");
const copyBtn = document.getElementById("copyBtn");
const historyTable = document.getElementById("historyTable");

// Load history on page load
window.onload = loadHistory;

// Shorten URL
shortenBtn.addEventListener("click", shortenURL);

async function shortenURL() {

    const url = longUrl.value.trim();

    if (url === "") {
        alert("Please enter a URL.");
        return;
    }

    if (!isValidURL(url)) {
        alert("Please enter a valid URL.");
        return;
    }

    shortenBtn.innerHTML = "Shortening...";
    shortenBtn.disabled = true;

    try {

        const response = await fetch(
            `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`
        );

        const data = await response.text();

        shortUrl.value = data;

        saveHistory(url, data);

        loadHistory();

    } catch (error) {

        alert("Something went wrong.");

    }

    shortenBtn.innerHTML = "Shorten URL";
    shortenBtn.disabled = false;
}

// Validate URL
function isValidURL(url) {

    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }

}

// Copy URL
copyBtn.addEventListener("click", () => {

    if (shortUrl.value === "") {
        alert("No shortened URL available.");
        return;
    }

    navigator.clipboard.writeText(shortUrl.value);

    copyBtn.innerHTML = "Copied!";

    setTimeout(() => {
        copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
    }, 2000);

});

// Save history
function saveHistory(original, shortened) {

    let history = JSON.parse(localStorage.getItem("urlHistory")) || [];

    history.unshift({
        original,
        shortened
    });

    localStorage.setItem("urlHistory", JSON.stringify(history));

}

// Load history
function loadHistory() {

    let history = JSON.parse(localStorage.getItem("urlHistory")) || [];

    historyTable.innerHTML = "";

    history.forEach((item, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.original}</td>
            <td>
                <a href="${item.shortened}" target="_blank">
                    ${item.shortened}
                </a>
            </td>
            <td>
                <button onclick="copyHistory('${item.shortened}')">
                    Copy
                </button>

                <button onclick="deleteHistory(${index})">
                    Delete
                </button>
            </td>
        `;

        historyTable.appendChild(row);

    });

}

// Copy from history
function copyHistory(url) {

    navigator.clipboard.writeText(url);

    alert("Copied!");

}

// Delete history
function deleteHistory(index) {

    let history = JSON.parse(localStorage.getItem("urlHistory")) || [];

    history.splice(index, 1);

    localStorage.setItem("urlHistory", JSON.stringify(history));

    loadHistory();

}
