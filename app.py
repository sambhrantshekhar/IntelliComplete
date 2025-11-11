from flask import Flask, render_template, request, jsonify
import time
import json
from trie import Trie

app = Flask(__name__)

with open("words.json", encoding="utf-8") as f:
    data = json.load(f)
    if isinstance(data, dict):   
        WORDS = list(data.keys())
    else:
        WORDS = data
trie = Trie()
for word in WORDS:
    trie.insert(word.lower())


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/search", methods=["POST"])
def search():
    data = request.get_json()
    prefix = data.get("prefix", "").lower()
    use_trie = data.get("useTrie", False)
    limit = int(data.get("limit", 10))

    if not prefix:
        return jsonify({"results": [], "time": 0})
    REPEAT_COUNT = 20
    start_time = time.perf_counter()

    for _ in range(REPEAT_COUNT):
        if use_trie:
            results = trie.starts_with(prefix)
        else:
            results = [w for w in WORDS if w.startswith(prefix)]

    elapsed_time = ((time.perf_counter() - start_time) * 1000) / REPEAT_COUNT

    return jsonify({
        "results": results[:limit],
        "time": round(elapsed_time, 3)
    })


if __name__ == "__main__":
    app.run(debug=True)
