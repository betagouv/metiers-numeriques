var _paq = window._paq || []
/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
_paq.push(['trackPageView'])
_paq.push(['enableLinkTracking'])
;(function () {
  var u = 'https://stats.data.gouv.fr/'
  _paq.push(['setTrackerUrl', u + 'piwik.php'])
  _paq.push(['setSiteId', '191'])
  var d = document,
    g = d.createElement('script'),
    s = d.getElementsByTagName('script')[0]
  g.type = 'text/javascript'
  g.async = true
  g.defer = true
  g.src = u + 'piwik.js'
  s.parentNode.insertBefore(g, s)
})()

const lireoffrebutton = document.querySelectorAll('.trk-lire-offre')
if (lireoffrebutton) {
  for (let i = 0; i < lireoffrebutton.length; i++) {
    lireoffrebutton[i].addEventListener('click', function () {
      _paq.push(['trackEvent', 'conversion', 'Click bouton lire offre'])
    })
  }
}

const candidature = document.querySelector('.trk-candidature')
if (candidature) {
  var liens = candidature.getElementsByTagName('a')
  if (liens) {
    for (var i = 0, len = liens.length; i < len; i++) {
      liens[i].onclick = function () {
        _paq.push(['trackEvent', 'conversion', 'Click lien postuler'])
      }
    }
  }
}
