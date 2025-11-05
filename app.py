from flask import Flask, render_template, request, jsonify
import time
import json
from trie import Trie

app = Flask(__name__)

# Load word data
with open("words.json") as f:
    WORDS = json.load(f)

# Initialize Trie
trie = Trie()
for word in WORDS:
    trie.insert(word)


# --------------------------
# ROUTES
# --------------------------
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/search", methods=["POST"])
def search():
    data = request.get_json()
    prefix = data["prefix"].lower()
    use_trie = data["useTrie"]

    start_time = time.time()

    if use_trie:
        results = trie.starts_with(prefix)
    else:
        # Linear Search
        results = [w for w in WORDS if w.startswith(prefix)]

    elapsed_time = (time.time() - start_time) * 1000  # in ms

    return jsonify({
        "results": results[:10],  # top 10 suggestions
        "time": round(elapsed_time, 3)
    })


if __name__ == "__main__":
    app.run(debug=True)
