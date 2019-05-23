import Sortable from "sortablejs"

const dumpBookmarkers = subTree => {
  const iconSize = 24
  const ntp = document.getElementById("ntp")

  for (const bookmark of subTree[0].children) {
    const img = new Image()
    img.src = `chrome://favicon/size/${iconSize}@1x/${bookmark.url}`
    img.height = iconSize
    img.width = iconSize
    img.alt = bookmark.title

    const icon = document.createElement("div")
    icon.appendChild(img)
    icon.className = "icon"

    const text = document.createElement("div")
    text.textContent = bookmark.title
    text.className = "text"

    const el = document.createElement("div")
    el.className = "item"
    el.dataset.id = bookmark.id
    el.appendChild(icon)
    el.appendChild(text)
    el.addEventListener("click", () => chrome.tabs.update({ url: bookmark.url }))
    el.addEventListener("mouseenter", e => {
      if (!ntp.classList.contains("is-dragging")) e.target.classList.add("hover")
    })
    el.addEventListener("mouseleave", e => e.target.classList.remove("hover"))

    ntp.appendChild(el)
    sortable(ntp)
  }
}

const sortable = ntp =>
  new Sortable(ntp, {
    animation: 150,
    onStart(e) {
      e.to.classList.add("is-dragging")
    },
    onEnd(e) {
      e.to.classList.remove("is-dragging")
      saveOrder(e.to.children)
    },
  })

const saveOrder = items => {
  for (let i = 0, size = items.length; i < size; i++)
    chrome.bookmarks.move(items[i].dataset.id, { index: i })
}

document.addEventListener("DOMContentLoaded", chrome.bookmarks.getSubTree("1", dumpBookmarkers))
