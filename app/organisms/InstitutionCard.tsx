import Link from 'next/link'

import type { File, LegacyInstitution } from '@prisma/client'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      acronym: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
    }
  }
}

export type LegacyInstitutionWithRelation = LegacyInstitution & {
  logoFile?: File
  thumbnailFile?: File
}

type InstitutionCardProps = {
  institution: LegacyInstitutionWithRelation
}
export default function InstitutionCard({ institution }: InstitutionCardProps) {
  return (
    <div className="fr-card fr-enlarge-link">
      <div className="fr-card__body">
        <h4 className="fr-card__title">
          <Link href={`/institution/${institution.slug}`}>
            <a className="fr-card__link" href={`/institution/${institution.slug}`}>
              {institution.title}
            </a>
          </Link>
        </h4>
        <p className="fr-card__desc">{institution.fullName}</p>
      </div>
      <div className="fr-card__img">
        <img alt="" className="fr-responsive-img" src={institution.thumbnailFile?.url} />
      </div>
    </div>
  )
}
