function toggleNavActive() {
  var navs = document.querySelectorAll('#header-navigation li')
  for (var nav of navs) {
    var link = nav.querySelector('a')
    var href = link.getAttribute('href')
    var pathname = window.location.pathname

    if (pathname === '/') {
      break
    }

    if (href.substring(1) && pathname.includes(href.substring(1, href.length - 2))) {
      nav.setAttribute('aria-current', 'page')
      link.setAttribute('aria-current', 'page')
    } else {
      nav.removeAttribute('aria-current')
      link.removeAttribute('aria-current')
    }
  }
}

toggleNavActive()

const $scrollToTopButton = document.querySelector('#scroll-to-top-button')

document.addEventListener('scroll', () => {
  if (window.scrollY < window.innerHeight) {
    $scrollToTopButton.style.opacity = Math.round((100 * window.scrollY) / window.innerHeight) / 100

    return
  }

  $scrollToTopButton.style.opacity = 1
})

$scrollToTopButton.addEventListener('click', () => {
  window.scroll({
    behavior: 'smooth',
    top: 0,
  })
})
