import Head from 'next/head'

export default function LegalNoticesPage() {
  const pageTitle = 'Mentions légales | metiers.numerique.gouv.fr'

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <main id="contenu" role="main">
        <div className="fr-container fr-py-4w">
          <h1>Mentions légales</h1>

          <h2>Éditeur de la Plateforme</h2>
          <p>
            La Plateforme metiers.numerique.gouv.fr est éditée par l’Incubateur de services numériques de la Direction
            interministérielle du numérique (DINUM).
          </p>
          <p>
            Coordonnées :<br />
            Adresse : DINUM, 20 avenue de Ségur, 75007 Paris
            <br />
            Tel. accueil : 01.71.21.01.70
            <br />
            SIRET : 12000101100010 (secrétariat général du gouvernement)
            <br />
            SIREN : 120 001 011
          </p>

          <h2>Directrice.eur de la publication</h2>
          <p>Directeur interministériel du numérique.</p>

          <h2>Hébergement de la Plateforme</h2>
          <p>Ce site est hébergé en propre par Scalingo SAS, 15 avenue du Rhin, 67100 Strasbourg, France.</p>

          <h2>Accessibilité</h2>
          <p>
            La conformité aux normes d’accessibilité numérique est un objectif ultérieur. En attendant, nous tâchons de
            rendre ce site accessible à toutes et à tous :
          </p>
          <ul>
            <li>Utilisation de composants accessibles (Système de Design de l’État)</li>
            <li>Respect des bonnes pratiques (Pilida, Opquast...)</li>
            <li>Tests manuels</li>
          </ul>

          <h2>Signaler un dysfonctionnement</h2>
          <p>
            Si vous rencontrez un défaut d’accessibilité vous empêchant d’accéder à un contenu ou une fonctionnalité du
            site, merci de nous en faire part en
            <a
              href="mailto:contact@metiers.numerique.gouv.fr"
              rel="noopener noreferrer"
              target="_blank"
              title="Contactez-nous"
            >
              nous contactant à l’adresse contact@metiers.numerique.gouv.fr
            </a>
            .
          </p>
          <p>
            Si vous n’obtenez pas de réponse rapide de notre part, vous êtes en droit de faire parvenir vos doléances ou
            une demande de saisine au Défenseur des droits.
          </p>

          <h2>En savoir plus</h2>
          <p>
            Pour en savoir plus sur la politique d’accessibilité numérique de l’État :
            <a
              href="http://references.modernisation.gouv.fr/accessibilite-numerique"
              rel="noopener noreferrer"
              target="_blank"
            >
              http://references.modernisation.gouv.fr/accessibilite-numerique
            </a>
            .
          </p>

          <h2>Sécurité</h2>
          <p>
            Le site est protégé par un certificat électronique, matérialisé pour la grande majorité des navigateurs par
            un cadenas. Cette protection participe à la confidentialité des échanges. En aucun cas les services associés
            à la plateforme ne seront à l’origine d’envoi de courriels pour demander la saisie d’informations
            personnelles.
          </p>
        </div>
      </main>
    </>
  )
}
