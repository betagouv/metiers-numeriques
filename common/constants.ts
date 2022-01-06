import type { FileType, JobSource } from '@prisma/client'

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

export const JOB_SOURCE: Record<JobSource, JobSource> = {
  MNB: 'MNB',
  MNN: 'MNN',
  PEP: 'PEP',
  SKB: 'SKB',
}

export const USER_ROLE: Record<Common.User.Role, Common.User.Role> = {
  ADMINISTRATOR: 'ADMINISTRATOR',
  ENTITY_MANAGER: 'ENTITY_MANAGER',
  SERVICE_MANAGER: 'SERVICE_MANAGER',
}

export const USER_ROLE_LABEL: Record<Common.User.Role, string> = {
  ADMINISTRATOR: 'Administeur·rice',
  ENTITY_MANAGER: 'Responsable d’entité',
  SERVICE_MANAGER: 'Responsable de service',
}

export const USER_ROLES = Object.values(USER_ROLE)
