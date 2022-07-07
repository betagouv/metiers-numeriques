import { File, Institution, Testimony } from '@prisma/client'

type TestimonyWithRelation = Testimony & { avatarFile: File }
export type InstitutionWithRelation = Institution & { logoFile?: File; testimonies: TestimonyWithRelation[] }
