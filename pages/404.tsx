import Footer from '../app/molecules/Footer'
import Header from '../app/molecules/Header'

export default function NotFoundPage() {
  return (
    <>
      <Header />

      <main>
        <div className="fr-container fr-my-4w">
          <div className="fr-grid-row Header">
            <div className="fr-col-12 fr-col-md-5">
              <h1>Page introuvable…</h1>
              <p className="text-grey">
                Cette page n’existe pas ou plus,
                <br />
                voulez-vous <a href="/">revenir à la page d’accueil ?</a>
              </p>
            </div>
            <div className="fr-col-12 fr-col-offset-md-2 fr-col-md-5">
              <img alt="Page introuvable" src="/images/header-404.svg" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
