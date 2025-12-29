const positiveWords = [
  "baik","bagus","hebat","mantap","keren","enak",
  "bahagia","senang","cantik","ganteng","luar biasa"
];

const negativeWords = [
  "buruk","jelek","gagal","lambat","rusak","parah",
  "mengecewakan","menyebalkan","berbahaya","kacau","hina"
];

let wordsData = [];
let chart = null;

/* ===============================
   GENERATE KATA RANDOM
================================ */
function generateRandomSentence() {
  const total = Number(document.getElementById("wordSelect").value);
  wordsData = [];

  for (let i = 0; i < total; i++) {
    // rasio stabil agar sentimen konsisten
    const pickNegative = Math.random() < 0.6;
    const word = pickNegative
      ? negativeWords[Math.floor(Math.random() * negativeWords.length)]
      : positiveWords[Math.floor(Math.random() * positiveWords.length)];
    wordsData.push(word);
  }

  document.getElementById("textInput").value = wordsData.join(" ");
  updateCount();
}

/* ===============================
   HITUNG POSITIF & NEGATIF
================================ */
function updateCount() {
  let pos = 0, neg = 0;
  for (let w of wordsData) {
    if (positiveWords.includes(w)) pos++;
    if (negativeWords.includes(w)) neg++;
  }
  document.getElementById("wordCount").innerHTML =
    `Positif: <b>${pos}</b> | Negatif: <b>${neg}</b>`;
}

/* ===============================
   ITERATIVE
================================ */
function sentimentIterative(words) {
  let score = 0;
  for (let w of words) {
    if (positiveWords.includes(w)) score++;
    if (negativeWords.includes(w)) score--;
  }
  return score;
}

/* ===============================
   RECURSIVE
================================ */
function sentimentRecursive(words, i = 0) {
  if (i === words.length) return 0;

  let val = 0;
  if (positiveWords.includes(words[i])) val = 1;
  if (negativeWords.includes(words[i])) val = -1;

  return val + sentimentRecursive(words, i + 1);
}

/* ===============================
   RUN BENCHMARK (FINAL FIX)
================================ */
function runAnalysis() {
  if (wordsData.length === 0) {
    alert("Generate kata terlebih dahulu!");
    return;
  }

  // ✅ FIX: 1000 SELALU MASUK
  const checkpoints = [1000, 3000, 7000, 10000]
    .filter(n => n <= wordsData.length);

  const table = document.getElementById("resultTable");
  table.innerHTML = "";

  let labels = [];
  let iterTimes = [];
  let recTimes = [];

  checkpoints.forEach(n => {
    const subset = wordsData.slice(0, n);

    let t1 = performance.now();
    const scoreIter = sentimentIterative(subset);
    let t2 = performance.now();

    let t3 = performance.now();
    sentimentRecursive(subset);
    let t4 = performance.now();

    const sentiment =
      scoreIter > 0 ? "POSITIF" :
      scoreIter < 0 ? "NEGATIF" : "NETRAL";

    labels.push(n);
    iterTimes.push((t2 - t1).toFixed(3));
    recTimes.push((t4 - t3).toFixed(3));

    table.innerHTML += `
      <tr>
        <td>${n}</td>
        <td>${sentiment}</td>
        <td>${(t2 - t1).toFixed(3)}</td>
        <td>${(t4 - t3).toFixed(3)}</td>
      </tr>
    `;
  });

  drawChart(labels, iterTimes, recTimes);
}

/* ===============================
   GRAFIK
================================ */
function drawChart(labels, iter, rec) {
  const ctx = document.getElementById("performanceChart");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Iterative (ms)",
          data: iter,
          borderColor: "green",
          fill: false
        },
        {
          label: "Recursive (ms)",
          data: rec,
          borderColor: "red",
          fill: false
        }
      ]
    }
  });
}
