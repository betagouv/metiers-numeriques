;(window => {
  let HAS_LOADER = false

  const $jobsSearchInput = window.document.querySelector('#JobsSearchInput')
  if ($jobsSearchInput === null) {
    return
  }

  const $jobsList = window.document.querySelector('#JobsList')
  if ($jobsList === null) {
    return
  }

  const $loadMoreSection = window.document.querySelector('#LoadMoreSection')
  if ($loadMoreSection === null) {
    return
  }

  const onIput = debounce(() => {
    let lastJobsListHtmlSource = ''
    const query = $jobsSearchInput.value

    if (query.length === 0) {
      httpGet(`/emplois?isUpdate=1`, jobsListHtmlSource => {
        removeLoaderFrom($jobsList)
        HAS_LOADER = false

        setInnerHtml($jobsList, jobsListHtmlSource)
        showNode($loadMoreSection)
      })

      return
    }

    httpGet(`/jobs/search?query=${query}`, jobsListHtmlSource => {
      removeLoaderFrom($jobsList)
      HAS_LOADER = false

      if (jobsListHtmlSource === lastJobsListHtmlSource) {
        return
      }

      lastJobsListHtmlSource = jobsListHtmlSource

      removeAllChildNodesFrom($jobsList)
      setInnerHtml($jobsList, jobsListHtmlSource)
    })
  }, 500)

  $jobsSearchInput.addEventListener('input', () => {
    const query = $jobsSearchInput.value
    if (query.length === 0) {
      removeAllChildNodesFrom($jobsList)

      appendLoaderTo($jobsList)
      HAS_LOADER = true
    } else {
      hideNode($loadMoreSection)

      if (!HAS_LOADER) {
        prependLoaderTo($jobsList)
        HAS_LOADER = true
      }
    }

    onIput()
  })
})(window)
