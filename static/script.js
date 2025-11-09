const inputBox = document.getElementById("input-box");
const suggestionsList = document.getElementById("suggestions");
const stats = document.getElementById("stats");
const useTrie = document.getElementById("useTrie");

let debounceTimer;

inputBox.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(fetchSuggestions, 200);
});

async function fetchSuggestions() {
  const prefix = inputBox.value.trim();
  if (!prefix) {
    suggestionsList.innerHTML = "";
    stats.textContent = "";
    return;
  }

  const limit = document.getElementById("limitSelect").value;

  const response = await fetch("/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prefix,
      useTrie: useTrie.checked,
      limit: parseInt(limit)
    }),
  });

  const data = await response.json();
  displaySuggestions(data.results, data.time);
}


function displaySuggestions(words, time) {
  suggestionsList.innerHTML = "";
  words.forEach((word) => {
    const li = document.createElement("li");
    li.textContent = word;
    li.addEventListener("click", () => {
      inputBox.value = word;
      suggestionsList.innerHTML = "";
    });
    suggestionsList.appendChild(li);
  });

  stats.innerHTML = `⏱️ <b>${useTrie.checked ? "Trie" : "Linear"}</b> search took <b>${time} ms</b>`;
}