export default function HomePage() {
  return (
    <main className="fr-mt-4w" id="contenu" role="main">
      <div className="fr-container">
        <div className="fr-grid-row fr-grid-row--center fr-grid-row--middle">
          <div className="fr-col-md-5 fr-col-xs-6w fr-px-6w fr-my-5w">
            <h1>L’Etat Numérique : Des projets à découvrir, des missions à pourvoir !</h1>
            <p className="text-grey">
              Découvrez les projets numériques au sein des ministères et entités numériques, rencontrez des acteurs et
              co-construisons ensemble l’Etat Numérique de demain !
            </p>
            <div className="fr-mt-4w">
              <a className="fr-btn fr-btn--secondary btn-home--secondary" href="/institutions">
                Découvrir
              </a>
              <a className="fr-btn btn-home" href="/emplois">
                Candidater
              </a>
            </div>
          </div>
          <div className="fr-col-md-5 fr-col-xs-6">
            <div>
              <img alt="L’Etat Numérique" src="/images/main-illu.svg" />
            </div>
          </div>
        </div>
      </div>

      <section className="fr-py-8w home-bg--alt">
        <div className="fr-container" id="decouvrir">
          <div className="fr-fr-grid-row fr-grid-row--center rf-centered">
            <div className="fr-mb-6w fr-px-6w">
              <h2 className="fr-pb-6v">Qu’est-ce que l’État Numérique ?</h2>
              <span className="text-grey">Le numérique est devenu le premier canal d’accès aux services publics.</span>
              <br />
              <span className="text-grey">
                Cette évolution numérique repose sur trois enjeux majeurs : la qualité du numérique public, l’ouverture
                et la transparence, la souveraineté et la sécurité. Le secteur public offre un cadre sécurisant avec de
                multiples perspectives de postes sur l’ensemble du territoire et permet d’évoluer sur des problématiques
                concrètes.
              </span>
              <p className="text-grey">
                Travaillez sur les SI les plus vastes de France et ayez de l’impact auprès de 67 millions d’utilisateurs
                !
              </p>
            </div>
          </div>
        </div>
        <div className="fr-container">
          <div className="fr-grid-row fr-mt-4v">
            <div className="fr-col-12 fr-col-md-4 fr-mb-3w">
              <div className="rf-centered fr-mx-3w">
                <img alt="Icone d’information" className="card-icon " src="/images/picto-metiersnumeriques-1.png" />
                <h4>Plus de 200</h4>
                <p className="fr-text--md">nouvelles offres d’emplois à pourvoir chaque mois !</p>
              </div>
            </div>

            <div className="fr-col-12 fr-col-md-4 fr-mb-3w">
              <div className="rf-centered fr-mx-3w">
                <img alt="Icone de montagne" className="card-icon " src="/images/picto-metiersnumeriques-2.png" />
                <h4>Des missions ambitieuses &amp; challengeantes</h4>
                <p className="fr-text--md" />
              </div>
            </div>

            <div className="fr-col-12 fr-col-md-4 fr-mb-3w">
              <div className="rf-centered fr-mx-3w">
                <img
                  alt="Icone de main avec un coeur"
                  className="card-icon "
                  src="/images/picto-metiersnumeriques-3.png"
                />
                <h4>Des projets qui ont de l’impact</h4>
                <p className="fr-text--md">&amp; touchent des milliers d’utilisateurs</p>
              </div>
            </div>

            <div className="fr-col-12 fr-col-md-4 fr-mb-3w">
              <div className="rf-centered fr-mx-3w">
                <img
                  alt="Icone d’avion qui décole"
                  className="card-icon "
                  src="/images/picto-metiersnumeriques-4.png"
                />
                <h4>Un univers pérenne &amp; plein d’avenir</h4>
                <p className="fr-text--md" />
              </div>
            </div>

            <div className="fr-col-12 fr-col-md-4 fr-mb-3w">
              <div className="rf-centered fr-mx-3w">
                <img
                  alt="Icone de quatres flèches"
                  className="card-icon "
                  src="/images/picto-metiersnumeriques-5.png"
                />
                <h4>Des secteurs très différents</h4>
                <p className="fr-text--md">santé, éducation, économie, finance...</p>
              </div>
            </div>

            <div className="fr-col-12 fr-col-md-4 fr-mb-3w">
              <div className="rf-centered fr-mx-3w">
                <img alt="Icone d’ampoule" className="card-icon " src="/images/picto-metiersnumeriques-6.png" />
                <h4>Des métiers divers &amp; très variés</h4>
                <p className="fr-text--md">pour tous les profils</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="fr-py-8w">
        <div className="fr-container">
          <div className="fr-grid-row fr-grid-row--center rf-centered">
            <div className="fr-col-8">
              <h2 className="fr-pb-6v">Rencontres</h2>
              <span className="text-grey">
                Marine, Laetitia, Pierre et tant d’autres travaillent dans le Numérique pour l’Etat : ils vous racontent
                leur histoire et leur métier ! Découvrez une variété et une richesse de profils, de métiers et de
                projets au sein des ministères.
              </span>
            </div>
          </div>
        </div>
        <div className="fr-container">
          <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-mt-4v fr-pb-4v">
            <div className="stories fr-col-9 fr-col-xs-6 fr-my-5w">
              <img alt="Marine" className="stories-picture fr-my-3w" src="/images/marine-boudeau.png" />
              <div className="fr-col-8 fr-col-xs-6 fr-mx-6w">
                <h4 className="stories-name">Marine</h4>
                <h5 className="stories-title">Responsable du pôle design - DINUM</h5>
                <p className="stories-text">
                  “On peut faire tout ce qui est possible et imaginable pour atteindre cet objectif (de rendre meilleur
                  les services) et on nous donne [..] l’espace pour le faire. Un peu comme si on était une mini start-up
                  au sein de l’Etat.“
                </p>
                <a
                  className="fr-fi-arrow-right-s-line stories-link"
                  href="https://www.dailymotion.com/video/x81o96d?playlist=x74h65"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Voir la vidéo
                </a>
              </div>
            </div>
            <div className="stories fr-col-9 fr-col-xs-6  fr-my-5w">
              <div className="fr-col-8 fr-col-xs-6 fr-mx-6w">
                <h4 className="stories-name">Laetitia</h4>
                <h5 className="stories-title">
                  Cheffe de projet numérique - Direction Numérique des Ministères Sociaux
                </h5>
                <p className="stories-text">
                  “Au sein des Ministères sociaux, on a un grand champ : travail, santé, jeunesses et sport donc il y a
                  énormément de projets ! Avoir toujours l’usager en ligne de mire, ça nous donne envie de faire
                  toujours mieux. Le sens du service, plus le collectif c’est vraiment une force qu’on a pas forcément
                  ailleurs.“
                </p>
                <a
                  className="fr-fi-arrow-right-s-line stories-link"
                  href="https://www.dailymotion.com/video/x81o9e8?playlist=x74h65"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Voir la vidéo
                </a>
              </div>
              <img alt="Laetitia" className="stories-picture fr-my-3w" src="/images/laetitia-herbin-collot.png" />
            </div>
            <div className="stories fr-col-9 fr-col-xs-6  fr-my-5w">
              <img alt="Pierre" className="stories-picture fr-my-3w" src="/images/pierre-dubreuil.png" />
              <div className="fr-col-8 fr-col-xs-6 fr-mx-6w">
                <h4 className="stories-name">Pierre</h4>
                <h5 className="stories-title">Chef de l’unité Régulation par la donnée - ARCEP</h5>
                <p className="stories-text">
                  “Mon métier, c’est utiliser la puissance de l’information pour mieux orienter le marché comme par
                  exemple pour la plateforme :<a href="https://monreseaumobile.arcep.fr">mon réseau mobile</a>. Je viens
                  du milieu des start-up et moderniser l’action de l’Etat c’est quelque chose qui me motive beaucoup.“
                </p>
                <a
                  className="fr-fi-arrow-right-s-line stories-link"
                  href="https://www.dailymotion.com/video/x81pp3d?playlist=x74h65"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Voir la vidéo
                </a>
              </div>
            </div>
          </div>
          <div className="fr-grid-row fr-grid-row--center fr-mt-4w">
            <a
              className="rf-centered fr-btn btn-home"
              href="https://www.dailymotion.com/playlist/x74h65"
              rel="noopener noreferrer"
              target="_blank"
            >
              Voir tous les témoignages
            </a>
          </div>
        </div>
      </section>

      <section className="newsletter home-bg--alt">
        <div className="fr-container">
          <div className="fr-grid-row fr-grid-row--center fr-grid-row--middle">
            <div className="fr-col-md-5 fr-col-xs-6w fr-px-4w fr-my-5w">
              <h2>Restons en contact</h2>
              <p className="fr-text--md fr-mb-2v">
                Laissez-nous votre email, nous vous tiendrons au courant du lancement du site metiers.numerique.gouv.fr
              </p>
            </div>
            <div className="fr-col-md-5 fr-col-xs-6w fr-px-6w fr-my-5w">
              <form
                action="https://37514839.sibforms.com/serve/MUIEAOgcYYVkwK99rKzuk18o6wa3w6nhnGuj90p7o3BcsF_T99rnIirowA1TMeGdmqUoydZRSanzi2jiaWyf8xcRwgXHs4QwrxQV4c0N_D7tNnzG_9Zwg-ZSrDboWs-DGUaIr3FG1WkdjLAR7zjS06dNXHIwLXqRqVRh06n04HoebXTqZgLn1jG-XkVeTKhx1iKF9r9qkVglSxfx"
                id="newsletter"
                method="post"
              >
                <input
                  id="csrf_token"
                  name="csrf_token"
                  type="hidden"
                  value="f78e2e104a5f4ef5e8408644c40f2d0a996d6b6e183eebb7c3ab437775be5295"
                />
                <div className="fr-input-group">
                  <input
                    autoComplete="off"
                    className="fr-input"
                    data-required="true"
                    // id="EMAIL"
                    id="subscribe-email"
                    name="EMAIL"
                    placeholder="e-mail"
                    required
                    type="email"
                  />
                  <button className="fr-btn btn-home" id="form-submit" name="subscribe" type="submit">
                    S’inscrire
                  </button>

                  <br />
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label>
                    <input className="input_replaced" id="OPT_IN" name="OPT_IN" required type="checkbox" value="1" />
                    <span className="consent-text">J’accepte de recevoir des emails de metiers numérique</span>
                  </label>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
