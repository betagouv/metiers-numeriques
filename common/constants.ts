import type { FileType, JobSource, JobState, UserRole } from '@prisma/client'

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

export const JOB_SOURCE_LABEL: Record<JobSource, String> = {
  MNB: 'Interne',
  MNN: 'Notion',
  PEP: 'PEP',
  SKB: 'Seekube',
}

export const JOB_STATE_LABEL: Record<JobState, String> = {
  ARCHIVED: 'Archivée',
  DRAFT: 'Brouillon',
  PUBLISHED: 'Publiée',
}

export enum REGION {
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

export const REGIONS_AS_OPTIONS: Common.App.SelectOption<keyof typeof REGION>[] = [
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

export const USER_ROLE: Record<UserRole, UserRole> = {
  ADMINISTRATOR: 'ADMINISTRATOR',
  RECRUITER: 'RECRUITER',
}

export const USER_ROLE_LABEL: Record<UserRole, string> = {
  ADMINISTRATOR: 'Administeur·rice',
  RECRUITER: 'Recruteur·se',
}

export const USER_ROLES = Object.values(USER_ROLE)
