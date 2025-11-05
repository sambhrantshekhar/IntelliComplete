const inputBox = document.getElementById("input-box");
const suggestionsList = document.getElementById("suggestions");
const stats = document.getElementById("stats");
const useTrie = document.getElementById("useTrie");

let timer;

inputBox.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(fetchSuggestions, 200); // debounce for smooth typing
});

async function fetchSuggestions() {
    const prefix = inputBox.value.trim();
    if (!prefix) {
        suggestionsList.innerHTML = "";
        stats.textContent = "";
        return;
    }

    const response = await fetch("/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            prefix,
            useTrie: useTrie.checked
        })
    });

    const data = await response.json();
    displaySuggestions(data.results, data.time);
}

function displaySuggestions(words, time) {
    suggestionsList.innerHTML = "";
    words.forEach(word => {
        const li = document.createElement("li");
        li.textContent = word;
        suggestionsList.appendChild(li);
    });
    stats.textContent = `Time taken: ${time} ms (${useTrie.checked ? "Using Trie" : "Linear Search"})`;
}
