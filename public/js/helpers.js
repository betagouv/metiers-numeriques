/**
 * @param {HTMLElement} $node
 * @param {string} htmlSource
 */
window.appendInnerHtmlTo = ($node, htmlSource) => {
  const oldHtmlSource = $node.innerHTML

  $node.innerHTML = `${oldHtmlSource}${htmlSource}`
}

/**
 * @param {HTMLElement} $parentNode
 */
window.appendLoaderTo = $parentNode => {
  const $loadingSpinner = document.createElement('div')
  $loadingSpinner.id = 'loader'
  $loadingSpinner.className = 'fr-my-4w'
  $loadingSpinner.style = 'text-align: center; width: 100%;'
  $loadingSpinner.innerHTML = '<i class="ri-loader-4-fill rotating" style="font-size: 2em; display: inline-block;"></i>'

  $parentNode.appendChild($loadingSpinner)
}

/**
 * @param {Function} call
 * @param {number=} timeout
 */
window.debounce = function (call, timeout = 300) {
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
window.httpGet = (path, callback) => {
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
window.hideNode = $node => {
  if (!$node.classList.contains('hidden')) {
    $node.classList.add('hidden')
  }
}

/**
 * @param {HTMLElement} $parentNode
 */
window.prependLoaderTo = $parentNode => {
  const $loadingSpinner = document.createElement('div')
  $loadingSpinner.id = 'loader'
  $loadingSpinner.className = 'fr-my-4w'
  $loadingSpinner.style = 'text-align: center; width: 100%;'
  $loadingSpinner.innerHTML = '<i class="ri-loader-4-fill rotating" style="font-size: 2em; display: inline-block;"></i>'

  $parentNode.prepend($loadingSpinner)
}

/**
 * @param {HTMLElement} $parentNode
 */
window.removeAllChildNodesFrom = $parentNode => {
  while ($parentNode.firstChild) {
    $parentNode.removeChild($parentNode.firstChild)
  }
}

/**
 * @param {HTMLElement} $parentNode
 */
window.removeLoaderFrom = $parentNode => {
  const $loadingSpinner = $parentNode.querySelector('#loader')
  if ($loadingSpinner === null) {
    return
  }

  $parentNode.removeChild($loadingSpinner)
}

/**
 * @param {HTMLElement} $node
 * @param {string} htmlSource
 */
window.setInnerHtml = ($node, htmlSource) => {
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
window.showNode = $node => {
  if ($node.classList.contains('hidden')) {
    $node.classList.remove('hidden')
  }
}
