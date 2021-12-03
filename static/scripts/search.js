const $jobsSearchInput = document.querySelector('#jobs-search-input')
const $loadMoreSection = document.querySelector('#load-more-section')

$jobsSearchInput.addEventListener(
  'input',
  debounce(() => {
    let lastJobsListHtmlSource = ''
    const query = $jobsSearchInput.value

    if (query.length === 0) {
      removeAllChildNodesFrom($jobsList)
      appendLoaderTo($jobsList)

      httpGet(`/emplois?isUpdate=1`, jobsListHtmlSource => {
        removeLoaderFrom($jobsList)
        setInnerHtml($jobsList, jobsListHtmlSource)
        showNode($loadMoreSection)
      })

      return
    }

    hideNode($loadMoreSection)

    httpGet(`/jobs/search?query=${query}`, jobsListHtmlSource => {
      removeLoaderFrom($jobsList)
      if (jobsListHtmlSource === lastJobsListHtmlSource) {
        removeLoaderFrom($jobsList)

        return
      }

      lastJobsListHtmlSource = jobsListHtmlSource

      removeAllChildNodesFrom($jobsList)
      setInnerHtml($jobsList, jobsListHtmlSource)
    })
  }, 500),
)
