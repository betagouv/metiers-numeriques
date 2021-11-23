const CACHE = {}
const GLOBAL = {}

/**
 * @param {Function} call
 * @param {number=} timeout
 */
const debounce = (call, timeout = 300) => {
  let timer

  return (...args) => {
    clearTimeout(timer)

    timer = setTimeout(() => {
      call.apply(this, args)
    }, timeout)
  }
}

/**
 * @param {string} url
 * @param {() => void} callback
 */
const httpGet = (path, callback) => {
  const url = `${window.location.protocol}//${window.location.host}${path}`
  var xhr = new XMLHttpRequest()

  xhr.onreadystatechange = function () {
    if (this.readyState !== 4) return
    if (this.status === 200) {
      callback(this.responseText)
    }
  }
  xhr.open('GET', url, true)
  xhr.send()
}

/**
 * @param {HTMLElement} $node
 */
const hideNode = $node => {
  if (!$node.classList.contains('hidden')) {
    $node.classList.add('hidden')
  }
}

/**
 * @param {HTMLElement} $parentNode
 */
const removeAllChildNodesFrom = $parentNode => {
  while ($parentNode.firstChild) {
    $parentNode.removeChild($parentNode.firstChild)
  }
}

/**
 * @param {HTMLElement} $node
 * @param {string} htmlSource
 */
const setInnerHtml = ($node, htmlSource) => {
  $node.innerHTML = htmlSource

  Array.from($node.querySelectorAll('script')).forEach(oldScript => {
    const newScript = document.createElement('script')
    Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value))
    newScript.appendChild(document.createTextNode(oldScript.innerHTML))
    oldScript.parentNode.replaceChild(newScript, oldScript)
  })
}

/**
 * @param {HTMLElement} $node
 */
const showNode = $node => {
  if ($node.classList.contains('hidden')) {
    $node.classList.remove('hidden')
  }
}
