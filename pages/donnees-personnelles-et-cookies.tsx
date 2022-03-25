import Head from 'next/head'

export default function PrivacyPage() {
  const pageTitle = 'Données personnelles et cookies | metiers.numerique.gouv.fr'

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <main id="contenu" role="main">
        <div className="fr-container fr-py-4w">
          <h1>Données personnelles et cookies</h1>

          <h2>Cookies déposés et opt-out</h2>
          <section>
            <p>
              Ce site dépose un petit fichier texte (un « cookie ») sur votre ordinateur lorsque vous le consultez. Cela
              nous permet de mesurer le nombre de visites et de comprendre quelles sont les pages les plus consultées.
            </p>

            <iframe
              className="optout ui raised segment fr-mb-2w"
              src="https://stats.data.gouv.fr/index.php?module=CoreAdminHome&action=optOut&language=fr"
              style={{
                backgroundColor: '#F0F0F0',
                borderWidth: 0,
                height: '7rem',
                overflow: 'hidden',
                width: '100%',
              }}
              title="Exclusion statistique"
            />
          </section>

          <h2>Ce site n’affiche pas de bannière de consentement aux cookies, pourquoi ?</h2>
          <section>
            <p>
              C’est vrai, vous n’avez pas eu à cliquer sur un bloc qui recouvre la moitié de la page pour dire que vous
              êtes d’accord avec le dépôt de cookies — même si vous ne savez pas ce que ça veut dire !
            </p>
            <p>
              Rien d’exceptionnel, pas de passe-droit lié à un <code>.gouv.fr</code>. Nous respectons simplement la loi,
              qui dit que certains outils de suivi d’audience, correctement configurés pour respecter la vie privée,
              sont exemptés d’autorisation préalable.
            </p>
            <p>
              Nous utilisons pour cela{' '}
              <a href="https://matomo.org" rel="noopener noreferrer" target="_blank">
                Matomo
              </a>
              , un outil{' '}
              <a href="https://matomo.org/free-software/" rel="noopener noreferrer" target="_blank">
                libre
              </a>
              , paramétré pour être en conformité avec la{' '}
              <a
                href="https://www.cnil.fr/fr/solutions-pour-la-mesure-daudience"
                rel="noopener noreferrer"
                target="_blank"
              >
                recommandation « Cookies »
              </a>{' '}
              de la <abbr title="Commission Nationale de l'Informatique et des Libertés">CNIL</abbr>. Cela signifie que
              votre adresse IP, par exemple, est anonymisée avant d’être enregistrée. Il est donc impossible d’associer
              vos visites sur ce site à votre personne.
            </p>
          </section>

          <h2>Je contribue à enrichir vos données, puis-je y accéder ?</h2>
          <section>
            <p>
              Bien sûr ! Les statistiques d’usage de la majorité de nos produits, dont <code>beta.gouv.fr</code>, sont
              disponibles en accès libre sur{' '}
              <a
                href="https://stats.data.gouv.fr/index.php?module=CoreHome&action=index&idSite=191&period=range&date=previous30&updated=1"
                rel="noopener noreferrer"
                target="_blank"
              >
                stats.data.gouv.fr
              </a>
              .
            </p>
          </section>
        </div>
      </main>
    </>
  )
}
