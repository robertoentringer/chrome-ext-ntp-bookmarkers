import Sortable from "sortablejs"

const ntp = document.getElementById("ntp")

const dumpBookmarkers = subTree => {
  const iconSize = 24

  for (const bookmark of subTree[0].children) {
    const img = new Image()
    img.src = `chrome://favicon/size/${iconSize}@1x/${bookmark.url}`
    img.height = iconSize
    img.width = iconSize
    img.alt = bookmark.title
    img.draggable = false

    const icon = document.createElement("div")
    icon.appendChild(img)
    icon.className = "icon"

    const text = document.createElement("div")
    text.textContent = bookmark.title
    text.className = "text"

    const moveHandler = document.createElement("div")
    moveHandler.className = "moveHandler"
    moveHandler.innerHTML = "&vellip;"

    const el = document.createElement("a")
    el.className = "item"
    el.href = bookmark.url
    el.dataset.id = bookmark.id
    el.appendChild(icon)
    el.appendChild(text)
    el.appendChild(moveHandler)

    eventHandlers(el)

    ntp.appendChild(el)
    sortable(ntp)
  }
}

const eventHandlers = el => {
  let showInfo

  el.addEventListener("click", e => {
    e.preventDefault()
    e.target.classList.remove("hover", "showInfo")
    chrome.tabs.update({ url: el.href })
  })

  el.addEventListener("mouseenter", e => {
    if (!ntp.classList.contains("is-dragging")) {
      e.target.classList.add("hover")
      showInfo = setTimeout(() => e.target.classList.add("showInfo"), 1000)
    }
  })

  el.addEventListener("mouseleave", e => {
    clearTimeout(showInfo)
    e.target.classList.remove("hover", "showInfo")
  })
}

const sortable = ntp =>
  new Sortable(ntp, {
    handle: ".moveHandler",
    animation: 150,
    onStart(e) {
      e.to.classList.add("is-dragging")
    },
    onEnd(e) {
      e.to.classList.remove("is-dragging")
      saveOrder(e.to.children)
    }
  })

const saveOrder = items => {
  for (let i = 0, size = items.length; i < size; i++)
    chrome.bookmarks.move(items[i].dataset.id, { index: i })
}

document.addEventListener("DOMContentLoaded", chrome.bookmarks.getSubTree("1", dumpBookmarkers))
