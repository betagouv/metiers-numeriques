import { Link } from '../atoms/Link'

import type { File, FilesOnLegacyInstitutions, LegacyInstitution } from '@prisma/client'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      acronym: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
    }
  }
}

export type FilesOnLegacyInstitutionsWithRelation = FilesOnLegacyInstitutions & {
  file: File
}

export type LegacyInstitutionWithRelation = LegacyInstitution & {
  files?: FilesOnLegacyInstitutionsWithRelation[]
  logoFile?: File
  thumbnailFile?: File
}

type InstitutionCardProps = {
  institution: LegacyInstitutionWithRelation
}
export function InstitutionCard({ institution }: InstitutionCardProps) {
  return (
    <div className="fr-card fr-enlarge-link">
      <div className="fr-card__body">
        <h4 className="fr-card__title">
          <Link className="fr-card__link" href={`/institution/${institution.slug}`}>
            {institution.title}
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
