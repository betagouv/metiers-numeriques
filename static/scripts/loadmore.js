/**
 * @param {HTMLElement} $parentNode
 */
const appendLoaderTo = $parentNode => {
  const $loadingSpinner = document.createElement('div')
  $loadingSpinner.id = 'loader'
  $loadingSpinner.className = 'fr-my-4w'
  $loadingSpinner.style = 'text-align: center; width: 100%;'
  $loadingSpinner.innerHTML = '<i class="ri-loader-4-fill rotating" style="font-size: 2em; display: inline-block;"></i>'

  $parentNode.appendChild($loadingSpinner)
}

/**
 * @param {HTMLElement} $parentNode
 */
const prependLoaderTo = $parentNode => {
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
const removeLoaderFrom = $parentNode => {
  const $loadingSpinner = $parentNode.querySelector('#loader')
  if ($loadingSpinner === null) {
    return
  }

  $parentNode.removeChild($loadingSpinner)
}

const $jobsList = document.querySelector('#jobs-list')
const $loadMoreButton = document.querySelector('#load-more-button')

$loadMoreButton.addEventListener('click', () => {
  appendLoaderTo($jobsList)

  const fromIndex = $jobsList.childElementCount

  // Load 10 more jobs
  httpGet(`/emplois?isUpdate=1&fromIndex=${fromIndex}`, jobsListHtmlSource => {
    removeLoaderFrom($jobsList)
    appendInnerHtmlTo($jobsList, jobsListHtmlSource)
  })
})
