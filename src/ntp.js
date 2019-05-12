const bookmarkTreeNodes = chrome.bookmarks.getTree(bookmarkTreeNodes => {
  const size = 24

  for (const item of bookmarkTreeNodes[0].children[0].children) {
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

    el.appendChild(icon)
    el.appendChild(text)

    el.addEventListener("click", () => chrome.tabs.update({ url: item.url }))

    window.app.appendChild(el)
  }
})

document.addEventListener("DOMContentLoaded", bookmarkTreeNodes)
