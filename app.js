const wikiRoot = document.getElementById("wiki-root")
const breadcrumbsEl = document.getElementById("breadcrumbs")
const movesEl = document.getElementById("moves")

let breadcrumbs = []
let moves = 0
let startTime = Date.now()

const START_PAGE = "Panama_Canal"

loadPage(START_PAGE)

function loadPage(title) {
  fetch(`https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(title)}`)
    .then(r => r.text())
    .then(html => {
      wikiRoot.innerHTML = html
      interceptLinks()
      addBreadcrumb(title)
    })
}

function interceptLinks() {
  wikiRoot.querySelectorAll("a").forEach(a => {
    const href = a.getAttribute("href")
    if (!href) return

    if (href.startsWith("./")) {
      a.onclick = e => {
        e.preventDefault()
        const next = href.replace("./", "")
        moves++
        movesEl.textContent = `${moves} moves`
        loadPage(next)
      }
    }
  })
}

function addBreadcrumb(title) {
  breadcrumbs.push(title)
  breadcrumbsEl.innerHTML = breadcrumbs
    .map(t => `<span>${decodeURIComponent(t)}</span>`)
    .join(" → ")
}

setInterval(() => {
  document.getElementById("timer").textContent =
    `${Math.floor((Date.now() - startTime) / 1000)}s`
}, 1000)
