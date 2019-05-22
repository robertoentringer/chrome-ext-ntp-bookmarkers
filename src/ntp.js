import Sortable from "@shopify/draggable/lib/sortable"

const init = chrome.bookmarks.getSubTree("1", subTree => {
  const size = 24
  const ntp = document.getElementById("ntp")

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

    el.appendChild(icon)
    el.appendChild(text)

    el.addEventListener("click", () => chrome.tabs.update({ url: item.url }))

    ntp.appendChild(el)
  }

  const sortable = new Sortable(ntp, { draggable: ".item" })

  sortable.on("sortable:stop", sort => {
    const items = sortable.getDraggableElementsForContainer(ntp)
    for (let i = 0, size = items.length; i < size; i++)
      chrome.bookmarks.move(items[i].dataset.id, { index: i })
  })
})

document.addEventListener("DOMContentLoaded", init)
