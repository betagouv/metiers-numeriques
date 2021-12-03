;(window => {
  const $scrollToTopButton = window.document.querySelector('#TopScrollerButton')
  if ($scrollToTopButton === null) {
    return
  }

  window.document.addEventListener('scroll', () => {
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
})(window)
