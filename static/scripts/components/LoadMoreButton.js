;(window => {
  const $loadMoreButton = window.document.querySelector('#LoadMoreButton')
  if ($loadMoreButton === null) {
    return
  }

  const $jobsList = window.document.querySelector('#JobsList')
  if ($jobsList === null) {
    return
  }

  $loadMoreButton.addEventListener('click', () => {
    appendLoaderTo($jobsList)

    const fromIndex = $jobsList.childElementCount

    // Load 10 more jobs
    httpGet(`/emplois?isUpdate=1&fromIndex=${fromIndex}`, jobsListHtmlSource => {
      removeLoaderFrom($jobsList)
      appendInnerHtmlTo($jobsList, jobsListHtmlSource)
    })
  })
})(window)
