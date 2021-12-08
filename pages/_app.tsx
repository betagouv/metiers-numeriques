import '../public/css/index.css'

// This default export is required in a new `pages/_app.js` file.
export default function MetiersNumeriquesApp({ Component, pageProps }) {
  return (
    <>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />

      <script defer src="/js/externals/matomo.js" type="text/javascript" />
      <script defer src="/js/externals/crisp.js" type="text/javascript" />
    </>
  )
}
