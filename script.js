"use strict";

/* 1. In-memory knowledge base ---------------------------------------- */
const articles = [
  { id: 1,  title: "Array.prototype.filter()", category: "JavaScript", summary: "Creates a new array containing only the elements that pass a test implemented by a callback function.", tags: ["array", "functional", "es6"] },
  { id: 2,  title: "Array.prototype.map()", category: "JavaScript", summary: "Transforms every element of an array with a callback and returns a new array of the results.", tags: ["array", "functional", "es6"] },
  { id: 3,  title: "Array.prototype.reduce()", category: "JavaScript", summary: "Runs a reducer function over each element to collapse an array into a single value such as a sum or object.", tags: ["array", "functional", "aggregation"] },
  { id: 4,  title: "Promises and async/await", category: "JavaScript", summary: "Handle asynchronous operations with promises, then write them in a readable, synchronous-looking style using async/await.", tags: ["async", "promise", "es2017"] },
  { id: 5,  title: "DOM Event Listeners", category: "JavaScript", summary: "Attach behaviour to elements with addEventListener, and learn how event bubbling and delegation work.", tags: ["dom", "events", "browser"] },
  { id: 6,  title: "localStorage and JSON", category: "JavaScript", summary: "Persist data in the browser by serialising objects with JSON.stringify and reading them back with JSON.parse.", tags: ["storage", "json", "browser"] },
  { id: 7,  title: "Semantic HTML Elements", category: "HTML", summary: "Use header, nav, main, article and footer to give your page meaning for screen readers and search engines.", tags: ["accessibility", "seo", "structure"] },
  { id: 8,  title: "Accessible Form Validation", category: "HTML", summary: "Build forms with labels, required attributes and aria-live error messages that work for every user.", tags: ["forms", "a11y", "validation"] },
  { id: 9,  title: "CSS Flexbox Layout", category: "CSS", summary: "Align and distribute space between items in one dimension using flex containers, direction, wrap and gap.", tags: ["layout", "responsive", "flexbox"] },
  { id: 10, title: "CSS Grid Layout", category: "CSS", summary: "Create two-dimensional layouts with rows and columns, auto-fill tracks and named grid areas.", tags: ["layout", "responsive", "grid"] },
  { id: 11, title: "CSS Custom Properties", category: "CSS", summary: "Define reusable design tokens such as colours and spacing with variables that cascade and can change at runtime.", tags: ["variables", "theming", "design-system"] },
  { id: 12, title: "Git Branching and Merging", category: "Git", summary: "Work on features in isolated branches and combine them back into main using merge or rebase.", tags: ["git", "branch", "workflow"] },
  { id: 13, title: "Resolving Merge Conflicts", category: "Git", summary: "Understand conflict markers, choose the right changes and finish the merge with a clean commit.", tags: ["git", "conflict", "collaboration"] },
  { id: 14, title: "Fetch API Basics", category: "Web APIs", summary: "Request data from servers with fetch, check response status and parse JSON bodies safely.", tags: ["http", "api", "json"] },
  { id: 15, title: "REST API Design", category: "Web APIs", summary: "Model resources with clear URLs, use HTTP verbs correctly and return meaningful status codes.", tags: ["rest", "http", "backend"] },
  { id: 16, title: "Responsive Design with Media Queries", category: "CSS", summary: "Adapt layouts to different screen sizes using mobile-first breakpoints and fluid units.", tags: ["mobile", "responsive", "media-query"] }
];

const palette = { JavaScript: "#b7791f", HTML: "#c2410c", CSS: "#2563eb", Git: "#be123c", "Web APIs": "#0f766e" };

/* DOM references ------------------------------------------------------ */
const input   = document.getElementById("searchInput");
const results = document.getElementById("results");
const empty   = document.getElementById("emptyState");
const status  = document.getElementById("status");
const chips   = document.getElementById("chips");
const resetBtn = document.getElementById("resetBtn");

let activeCategory = "All";

/* Helpers ------------------------------------------------------------- */
const escapeHTML = s => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const escapeRegExp = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function highlight(text, query) {
  const safe = escapeHTML(text);
  if (!query) return safe;
  return safe.replace(new RegExp(`(${escapeRegExp(escapeHTML(query))})`, "gi"), "<mark>$1</mark>");
}

/* 2. Search + filter logic -------------------------------------------- */
function getMatches(query) {
  const q = query.trim().toLowerCase();
  return articles
    .filter(a => activeCategory === "All" || a.category === activeCategory)
    .filter(a => !q || a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q));
}

/* 3. Rendering + empty state ------------------------------------------ */
function cardTemplate(a, q) {
  return `
    <article class="card" style="--c:${palette[a.category] || "#3347c9"}">
      <span class="cat">${escapeHTML(a.category)}</span>
      <h3>${highlight(a.title, q)}</h3>
      <p>${highlight(a.summary, q)}</p>
      <div class="tags">${a.tags.map(t => `<span>#${escapeHTML(t)}</span>`).join("")}</div>
    </article>`;
}

function render() {
  const q = input.value.trim();
  const matches = getMatches(q);

  results.innerHTML = matches.map(a => cardTemplate(a, q)).join("");
  empty.hidden = matches.length > 0;

  const label = matches.length === 1 ? "article" : "articles";
  status.textContent = matches.length
    ? `Showing ${matches.length} ${label}${q ? ` for “${q}”` : ""}${activeCategory !== "All" ? ` in ${activeCategory}` : ""}`
    : "";
}

function renderChips() {
  const cats = ["All", ...new Set(articles.map(a => a.category))];
  chips.innerHTML = cats
    .map(c => `<button type="button" class="chip" data-cat="${c}" aria-pressed="${c === activeCategory}">${c}</button>`)
    .join("");
}

/* Events -------------------------------------------------------------- */
input.addEventListener("input", render);

chips.addEventListener("click", e => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  activeCategory = btn.dataset.cat;
  renderChips();
  render();
});

resetBtn.addEventListener("click", () => {
  input.value = "";
  activeCategory = "All";
  renderChips();
  render();
  input.focus();
});

document.addEventListener("keydown", e => {
  if (e.key === "/" && document.activeElement !== input) {
    e.preventDefault();
    input.focus();
  }
});

renderChips();
render();
