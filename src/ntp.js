import Sortable from "sortablejs"

const ntp = document.getElementById("ntp")

const dumpBookmarkers = subTree => {
  const size = 24
  for (const item of subTree[0].children) {
    const url = `chrome://favicon/size/${size}@1x/${item.url}`

    const img = new Image()
    img.src = url
    img.height = size
    img.width = size
    img.alt = item.title

    const icon = document.createElement("div")
    icon.appendChild(img)
    icon.className = "icon"

    const text = document.createElement("div")
    text.textContent = item.title
    text.className = "text"

    const el = document.createElement("div")
    el.className = "item"
    el.dataset.id = item.id
    el.addEventListener("mouseenter", e => {
      if (!ntp.classList.contains("is-dragging")) e.target.classList.add("hover")
    })
    el.addEventListener("mouseleave", e => e.target.classList.remove("hover"))

    el.appendChild(icon)
    el.appendChild(text)
    el.addEventListener("click", () => chrome.tabs.update({ url: item.url }))

    ntp.appendChild(el)
    sortable.option("disabled", false)
  }
}

const sortable = new Sortable(ntp, {
  animation: 150,
  disabled: true,
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
