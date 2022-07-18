import { UserRole } from '@prisma/client'
import * as R from 'ramda'

import { JOB_CONTRACT_TYPE_LABEL, JOB_REMOTE_STATUS_LABEL, SELECTABLE_JOB_CONTRACT_TYPES } from './constants.shared'

import type { FileType, JobSource, JobState } from '@prisma/client'

const mapLabelObjectToSelectOptions: <T extends string = string>(
  labelObject: Record<T, string>,
) => Common.App.SelectOption<T>[] = R.pipe(
  R.toPairs,
  R.map(([value, label]) => ({
    label,
    value,
  })),
) as any

export type FileTypeKey = FileType
export type FileTypeValue = {
  ext: string
  label: string
  mime: string
}
export const FILE_TYPE: Record<FileTypeKey, FileTypeValue> = {
  EXTERNAL: {
    ext: '',
    label: 'Lien',
    mime: '',
  },
  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  DOC: {
    ext: 'doc',
    label: 'Document',
    mime: 'application/msword',
  },
  DOCX: {
    ext: 'docx',
    label: 'Document',
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
  JPG: {
    ext: 'jpg',
    label: 'Image',
    mime: 'image/jpeg',
  },
  PDF: {
    ext: 'pdf',
    label: 'Document',
    mime: 'application/pdf',
  },
  PNG: {
    ext: 'png',
    label: 'Image',
    mime: 'image/png',
  },
  PPT: {
    ext: 'ppt',
    label: 'Présentation',
    mime: 'application/vnd.ms-powerpoint',
  },
  PPTX: {
    ext: 'pptx',
    label: 'Présentation',
    mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  },
  SVG: {
    ext: 'svg',
    label: 'Image',
    mime: 'image/svg+xml',
  },
}

export { JOB_CONTRACT_TYPE_LABEL }

export const JOB_CONTRACT_TYPES_AS_OPTIONS = mapLabelObjectToSelectOptions(
  R.pick(SELECTABLE_JOB_CONTRACT_TYPES, JOB_CONTRACT_TYPE_LABEL),
)

export const JOB_SOURCE_LABEL: Record<JobSource, string> = {
  CDLD: 'Civils de la Défense',
  MDN: 'Métiers du Numérique',
  PEP: 'Place de l’emploi public',
  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  MNB: 'LEGACY',
  MNN: 'LEGACY / Notion',
  SKB: 'LEGACY / Seekube)',
}

export const JOB_SOURCES_AS_OPTIONS = mapLabelObjectToSelectOptions(JOB_SOURCE_LABEL)

export { JOB_REMOTE_STATUS_LABEL }

export const JOB_REMOTE_STATUSES_AS_OPTIONS = mapLabelObjectToSelectOptions(JOB_REMOTE_STATUS_LABEL)

export const JOB_STATE_LABEL: Record<JobState, string> = {
  DRAFT: 'Brouillon',
  FILLED: 'Pourvue',
  PUBLISHED: 'Publiée',
}

export const JOB_STATES_AS_OPTIONS = mapLabelObjectToSelectOptions(JOB_STATE_LABEL)

export enum Region {
  'Auvergne-Rhône-Alpes' = 'Auvergne-Rhône-Alpes',
  'Bourgogne-Franche-Comté' = 'Bourgogne-Franche-Comté',
  'Bretagne' = 'Bretagne',
  'Centre-Val de Loire' = 'Centre-Val de Loire',
  'Corse' = 'Corse',
  'Grand Est' = 'Grand Est',
  'Guadeloupe' = 'Guadeloupe',
  'Guyane' = 'Guyane',
  'Hauts-de-France' = 'Hauts-de-France',
  'La Réunion' = 'La Réunion',
  'Martinique' = 'Martinique',
  'Mayotte' = 'Mayotte',
  'Normandie' = 'Normandie',
  'Nouvelle-Aquitaine' = 'Nouvelle-Aquitaine',
  'Occitanie' = 'Occitanie',
  'Pays de la Loire' = 'Pays de la Loire',
  'Provence-Alpes-Côte d’Azur' = 'Provence-Alpes-Côte d’Azur',
  'Île-de-France' = 'Île-de-France',
}

export const REGIONS_AS_OPTIONS: Common.App.SelectOption<keyof typeof Region>[] = [
  {
    label: `Auvergne-Rhône-Alpes`,
    value: `Auvergne-Rhône-Alpes`,
  },
  {
    label: `Bourgogne-Franche-Comté`,
    value: `Bourgogne-Franche-Comté`,
  },
  {
    label: `Bretagne`,
    value: `Bretagne`,
  },
  {
    label: `Centre-Val de Loire`,
    value: `Centre-Val de Loire`,
  },
  {
    label: `Corse`,
    value: `Corse`,
  },
  {
    label: `Grand Est`,
    value: `Grand Est`,
  },
  {
    label: `Guadeloupe`,
    value: `Guadeloupe`,
  },
  {
    label: `Guyane`,
    value: `Guyane`,
  },
  {
    label: `Hauts-de-France`,
    value: `Hauts-de-France`,
  },
  {
    label: `Île-de-France`,
    value: `Île-de-France`,
  },
  {
    label: `La Réunion`,
    value: `La Réunion`,
  },
  {
    label: `Martinique`,
    value: `Martinique`,
  },
  {
    label: `Mayotte`,
    value: `Mayotte`,
  },
  {
    label: `Normandie`,
    value: `Normandie`,
  },
  {
    label: `Nouvelle-Aquitaine`,
    value: `Nouvelle-Aquitaine`,
  },
  {
    label: `Occitanie`,
    value: `Occitanie`,
  },
  {
    label: `Pays de la Loire`,
    value: `Pays de la Loire`,
  },
  {
    label: `Provence-Alpes-Côte d’Azur`,
    value: `Provence-Alpes-Côte d’Azur`,
  },
]

export const USER_ROLE_LABEL: Record<UserRole, string> = {
  ADMINISTRATOR: 'Administration',
  RECRUITER: 'Gestion',
}

export const USER_ROLES = Object.values(UserRole)

export const USER_ROLES_AS_OPTIONS = mapLabelObjectToSelectOptions(USER_ROLE_LABEL)
