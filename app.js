const wikiRoot = document.getElementById("wiki-root")
const breadcrumbsEl = document.getElementById("breadcrumbs")
const movesEl = document.getElementById("moves")
const timerEl = document.getElementById("timer")
const targetEl = document.getElementById("target-name")
const toggle = document.getElementById("theme-toggle")

const START_PAGE = "Panama_Canal"
const TARGET_PAGE = "Banana"

let breadcrumbs = []
let moves = 0
let startTime = Date.now()
let hasWon = false

targetEl.textContent = TARGET_PAGE.replaceAll("_", " ")

loadPage(START_PAGE)

function loadPage(title) {
  fetch(`https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(title)}`)
    .then(r => r.text())
    .then(html => {
      wikiRoot.innerHTML = html
      interceptLinks()
      addBreadcrumb(title)
      checkWin(title)
    })
}

function interceptLinks() {
  wikiRoot.querySelectorAll("a").forEach(a => {
    const href = a.getAttribute("href")
    if (!href) return

    const blocked =
      href.includes("Wikipedia") ||
      href.includes("Help") ||
      href.includes("Special") ||
      href.includes("Talk") ||
      href.includes("File")

    if (href.startsWith("./") && !blocked) {
      a.onclick = e => {
        e.preventDefault()
        const next = href.replace("./", "").split("#")[0]
        moves++
        movesEl.textContent = `${moves} moves`
        loadPage(next)
      }
    } else {
      a.onclick = e => e.preventDefault()
      a.style.pointerEvents = "none"
      a.style.opacity = "0.35"
    }
  })
}

function addBreadcrumb(title) {
  breadcrumbs.push(title)
  breadcrumbsEl.textContent =
    breadcrumbs.map(t => t.replaceAll("_", " ")).join(" → ")
}

function checkWin(title) {
  if (title === TARGET_PAGE && !hasWon) {
    hasWon = true
    showWin()
  }
}

function showWin() {
  const overlay = document.createElement("div")
  overlay.id = "win-overlay"
  overlay.innerHTML = `
    <div class="win-card">
      <h2>You reached ${TARGET_PAGE.replaceAll("_"," ")}</h2>
      <p>${moves} moves</p>
      <p>${Math.floor((Date.now() - startTime) / 1000)} seconds</p>
      <button onclick="location.reload()">Play again</button>
    </div>
  `
  document.body.appendChild(overlay)
}

setInterval(() => {
  timerEl.textContent =
    `${Math.floor((Date.now() - startTime) / 1000)}s`
}, 1000)

/* theme toggle */
toggle.onclick = () => {
  document.body.classList.toggle("dark")
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  )
}

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark")
}
