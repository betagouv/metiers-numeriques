import Head from 'next/head'

export default function LegalNoticesPage() {
  const pageTitle = 'Déclaration d’accessibilité | metiers.numerique.gouv.fr'

  return (
    <article className="fr-pt-4w fr-pb-8w">
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <h1>Déclaration d’accessibilité</h1>

      <p>
        La Direction Interministérielle du Numérique (DINUM) s’engage à rendre ses sites internet, intranet, extranet,
        ses progiciels, ses applications mobiles et son mobilier urbain numérique accessibles conformément à l’article
        47 de la loi n°2005-102 du 11 février 2005.
      </p>
      <p>
        Cette déclaration d’accessibilité s’applique au site <strong>Métiers du Numérique</strong> (
        <a href="https://metiers.numerique.gouv.fr">https://metiers.numerique.gouv.fr</a>).
      </p>

      <section className="fr-mt-4w">
        <h2>État de conformité</h2>
        <p>
          Le site <strong>Métiers du Numérique</strong> (
          <a href="https://metiers.numerique.gouv.fr">https://metiers.numerique.gouv.fr</a>) est déclaré non conforme en
          attendant la finalisation de son premier audit d’accessibilité prévue pour la fin de l’année 2022.
        </p>
      </section>

      <section className="fr-mt-4w">
        <h2>Établissement de cette déclaration d’accessibilité</h2>
        <p>Cette déclaration a été établie le 02/05/2022.</p>
      </section>

      <section className="fr-mt-4w">
        <h2>Retour d’information et contact</h2>
        <p>Il est important de rappeler qu’en vertu de l’article 11 de la loi de février 2005 :</p>
        <blockquote>
          La personne handicapée a droit à la compensation des conséquences de son handicap, quels que soient l’origine
          et la nature de sa déficience, son âge ou son mode de vie.
        </blockquote>
        <p>
          La Direction Interministérielle du Numérique s’engage à prendre les moyens nécessaires afin de donner accès,
          dans un délai raisonnable, aux informations et fonctionnalités recherchées par la personne handicapée, que le
          contenu fasse l’objet d’une dérogation ou non.
        </p>
        <p>
          La Direction Interministérielle du Numérique invite les personnes qui rencontreraient des difficultés à{' '}
          <span aria-hidden="true">envoyer un email à </span>
          <a
            aria-label="envoyer un email à contact-pep-accessibilite.dgafp@finances.gouv.fr depuis mon logiciel de messagerie"
            className="rf-text-no-wrap"
            href="contact@metiers.numerique.gouv.fr"
            rel="noopener noreferrer"
          >
            <span aria-hidden="true" className="fr-fi-mail-line fr-fi--sm" /> contact@metiers.numerique.gouv.fr
          </a>{' '}
          afin qu’une assistance puisse être apportée (alternative accessible, information et contenu donnés sous une
          autre forme).
        </p>
      </section>

      <section className="fr-mt-4w">
        <h2>Voies de recours</h2>
        <p>
          Si vous constatez un défaut d’accessibilité vous empêchant d’accéder à un contenu ou une fonctionnalité du
          site, que vous nous le signalez et que vous ne parvenez pas à obtenir une réponse de notre part, vous êtes en
          droit de faire parvenir vos doléances ou une demande de saisine au Défenseur des droits.
        </p>
        <p>Plusieurs moyens sont à votre disposition :</p>
        <ul>
          <li>
            <a
              aria-label="formulaire de contact - nouvelle fenêtre"
              href="https://formulaire.defenseurdesdroits.fr/defenseur/code/afficher.php?ETAPE=informations"
              rel="noreferrer noopener"
              target="_blank"
            >
              Écrire un message au Défenseur des droits
            </a>
          </li>
          <li>
            <a
              aria-label="liste du ou des délégués de votre région - nouvelle fenêtre"
              href="http://www.defenseurdesdroits.fr/office/"
              rel="noreferrer noopener"
              target="_blank"
            >
              Contacter le délégué du Défenseur des droits dans votre région
            </a>
          </li>
          <li>Appeler le numéro de téléphone suivant : 09 69 39 00 00</li>
          <li>
            Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre):
            <br />
            Le Défenseur des droits
            <br />
            Libre réponse 71120
            <br />
            75342 Paris CEDEX 07
          </li>
        </ul>
      </section>
    </article>
  )
}
