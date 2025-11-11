const inputBox = document.getElementById("input-box");
const suggestionsList = document.getElementById("suggestions");
const stats = document.getElementById("stats");
const useTrie = document.getElementById("useTrie");
const limitSelect = document.getElementById("limitSelect");

let debounceTimer;

const ctx = document.getElementById("speedChart").getContext("2d");

let speedChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Trie Search", "Linear Search"],
    datasets: [
      {
        label: "Time (ms)",
        data: [0, 0],
        backgroundColor: ["#0fb800ff", "#bc1111ff"],
        borderRadius: 8,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Time (ms)", color: "#ccc" },
        ticks: { color: "#ccc" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      x: {
        ticks: { color: "#ccc" },
        grid: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Search Time Comparison",
        color: "#fff",
        font: { size: 14 },
      },
    },
    animation: {
      duration: 700,
      easing: "easeOutQuart",
    },
  },
});

inputBox.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(fetchSuggestions, 250);
});

async function fetchSuggestions() {
  const prefix = inputBox.value.trim();
  if (!prefix) {
    suggestionsList.innerHTML = "";
    stats.textContent = "";
    updateChart(0, 0);
    return;
  }

  const limit = parseInt(limitSelect?.value || 10);

  const linearData = await measureSearch(prefix, false, limit);
  const trieData = await measureSearch(prefix, true, limit);

  const activeData = useTrie.checked ? trieData : linearData;
  displaySuggestions(activeData.results, activeData.time);

  updateChart(linearData.time, trieData.time);
}

async function measureSearch(prefix, useTrie, limit) {
  const response = await fetch("/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prefix, useTrie, limit }),
  });
  return await response.json();
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

  stats.innerHTML = `⏱️ <b>${useTrie.checked ? "Trie" : "Linear"}</b> search took 
  <b>${time} ms</b> (${words.length} results)`;
}

function updateChart(linearTime, trieTime) {
  speedChart.data.labels = ["Trie Search", "Linear Search"];
  speedChart.data.datasets[0].data = [trieTime, linearTime];
  speedChart.update();
}

