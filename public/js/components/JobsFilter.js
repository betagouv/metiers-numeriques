;(window => {
  let HAS_LOADER = false
  const STATE = {
    query: '',
    region: '',
  }

  const $jobsSearchInput = window.document.querySelector('#JobsSearchInput')
  if ($jobsSearchInput === null) {
    return
  }

  const $JobsRegionSelect = window.document.querySelector('#JobsRegionSelect')
  if ($JobsRegionSelect === null) {
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

  const updateResults = debounce(() => {
    let lastJobsListHtmlSource = ''
    const { query, region } = STATE

    if (query.length === 0 && region.length === 0) {
      httpGet(`/emplois?isUpdate=1`, jobsListHtmlSource => {
        removeLoaderFrom($jobsList)
        HAS_LOADER = false

        setInnerHtml($jobsList, jobsListHtmlSource)
        showNode($loadMoreSection)
      })

      return
    }

    const searchParams = new URLSearchParams(STATE)
    httpGet(`/jobs/search?${searchParams.toString()}`, jobsListHtmlSource => {
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

  const handleFilters = ({ query, region }) => {
    if (query !== undefined) {
      STATE.query = query
    }
    if (region !== undefined) {
      STATE.region = region
    }

    if (STATE.query.length === 0 && STATE.region.length === 0) {
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

    updateResults()
  }

  $jobsSearchInput.addEventListener('input', () => {
    const query = $jobsSearchInput.value

    handleFilters({
      query,
    })
  })

  $JobsRegionSelect.addEventListener('change', () => {
    const region = $JobsRegionSelect.value

    handleFilters({
      region,
    })
  })
})(window)
