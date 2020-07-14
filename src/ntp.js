import Sortable from 'sortablejs'

const dumpBookmarkers = (subTree) => {
  const ntp = document.getElementById('ntp')
  for (const bookmark of subTree[0].children) ntp.appendChild(createItem(bookmark))
  ntp.appendChild(createItemEdit())
  sortable(ntp)
}

const createIcon = (src, title, size = '24') => {
  const img = new Image()
  img.src = `chrome://favicon/size/${size}@1x/${src}`
  img.height = size
  img.width = size
  img.alt = title
  img.draggable = false
  const icon = document.createElement('div')
  icon.appendChild(img)
  icon.className = 'icon'
  return icon
}

const createText = (title) => {
  const text = document.createElement('div')
  text.textContent = title
  text.className = 'text'
  return text
}

const createMoveHandler = () => {
  const handler = document.createElement('div')
  handler.className = 'moveHandler'
  handler.innerHTML = '&vellip;'
  return handler
}

const createItemEdit = () => {
  const icon = createIcon(chrome.extension.getURL('icons/icon48.png'))
  const text = createText('Edit')
  const item = document.createElement('a')
  item.className = 'edit'
  item.href = 'chrome://bookmarks'
  item.appendChild(icon)
  item.appendChild(text)
  clickEvent(item)
  return item
}

const createItem = (bookmark) => {
  const icon = createIcon(bookmark.url, bookmark.title)
  const text = createText(bookmark.title)
  const moveHandler = createMoveHandler()
  const item = document.createElement('a')
  item.className = 'item'
  item.href = bookmark.url
  item.dataset.id = bookmark.id
  item.appendChild(icon)
  item.appendChild(text)
  item.appendChild(moveHandler)
  hoverEvents(item)
  clickEvent(item)
  return item
}
const hoverEvents = (el) => {
  let showInfo
  el.addEventListener('mouseenter', (e) => {
    if (!el.parentNode.classList.contains('is-dragging')) {
      e.target.classList.add('hover')
      showInfo = setTimeout(() => e.target.classList.add('showInfo'), 1000)
    }
  })
  el.addEventListener('mouseleave', (e) => {
    clearTimeout(showInfo)
    e.target.classList.remove('hover', 'showInfo')
  })
}

const clickEvent = (el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault()
    e.target.classList.remove('hover', 'showInfo')
    chrome.tabs.update({ url: el.href })
  })
}

const sortable = (ntp) =>
  new Sortable(ntp, {
    filter: '.fix',
    handle: '.moveHandler',
    animation: 150,
    onStart(e) {
      e.to.classList.add('is-dragging')
    },
    onEnd(e) {
      e.to.classList.remove('is-dragging')
      saveOrder(e.to.querySelectorAll('.item'))
    }
  })

const saveOrder = (items) => {
  for (let i = 0, size = items.length; i < size; i++)
    chrome.bookmarks.move(items[i].dataset.id, { index: i })
}

document.addEventListener('DOMContentLoaded', chrome.bookmarks.getSubTree('1', dumpBookmarkers))
