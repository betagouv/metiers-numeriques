-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('EXTERNAL', 'DOC', 'DOCX', 'JPG', 'PDF', 'PNG', 'PPT', 'PPTX', 'SVG');

-- CreateEnum
CREATE TYPE "JobSource" AS ENUM ('MNB', 'MNN', 'PEP', 'SKB');

-- CreateEnum
CREATE TYPE "LegacyInstitutionSection" AS ENUM ('address', 'joinTeam', 'keyNumbers', 'motivation', 'organization', 'project', 'testimonial', 'value');

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "FileType" NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FilesOnLegacyInstitutions" (
    "legacyInstitutionId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "section" "LegacyInstitutionSection" NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FilesOnLegacyInstitutions_pkey" PRIMARY KEY ("legacyInstitutionId","fileId")
);

-- CreateTable
CREATE TABLE "LegacyEntity" (
    "id" TEXT NOT NULL,
    "fullName" TEXT,
    "logoUrl" TEXT,
    "name" TEXT,

    CONSTRAINT "LegacyEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegacyInstitution" (
    "id" TEXT NOT NULL,
    "address" TEXT,
    "challenges" TEXT,
    "fullName" TEXT,
    "hiringProcess" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "joinTeam" TEXT,
    "keyNumbers" TEXT,
    "logoFileId" TEXT,
    "missions" TEXT,
    "motivation" TEXT,
    "organization" TEXT,
    "profile" TEXT,
    "project" TEXT,
    "schedule" TEXT,
    "slug" TEXT,
    "socialNetworkUrls" TEXT[],
    "testimonial" TEXT,
    "thumbnailFileId" TEXT,
    "title" TEXT,
    "value" TEXT,
    "websiteUrls" TEXT[],

    CONSTRAINT "LegacyInstitution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegacyJob" (
    "id" TEXT NOT NULL,
    "advantages" TEXT,
    "conditions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "department" TEXT[],
    "entity" TEXT,
    "experiences" TEXT[],
    "hiringProcess" TEXT,
    "limitDate" TIMESTAMP(3),
    "locations" TEXT[],
    "mission" TEXT,
    "more" TEXT,
    "openedToContractTypes" TEXT[],
    "profile" TEXT,
    "publicationDate" TIMESTAMP(3),
    "reference" TEXT NOT NULL,
    "salary" TEXT,
    "slug" TEXT NOT NULL,
    "source" "JobSource" NOT NULL,
    "tasks" TEXT,
    "team" TEXT,
    "teamInfo" TEXT,
    "title" TEXT NOT NULL,
    "toApply" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "legacyServiceId" TEXT,

    CONSTRAINT "LegacyJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegacyService" (
    "id" TEXT NOT NULL,
    "fullName" TEXT,
    "name" TEXT,
    "region" TEXT,
    "shortName" TEXT,
    "url" TEXT,
    "legacyEntityId" TEXT,

    CONSTRAINT "LegacyService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "File_url_key" ON "File"("url");

-- CreateIndex
CREATE UNIQUE INDEX "LegacyJob_slug_key" ON "LegacyJob"("slug");

-- AddForeignKey
ALTER TABLE "FilesOnLegacyInstitutions" ADD CONSTRAINT "FilesOnLegacyInstitutions_legacyInstitutionId_fkey" FOREIGN KEY ("legacyInstitutionId") REFERENCES "LegacyInstitution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilesOnLegacyInstitutions" ADD CONSTRAINT "FilesOnLegacyInstitutions_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegacyInstitution" ADD CONSTRAINT "LegacyInstitution_logoFileId_fkey" FOREIGN KEY ("logoFileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegacyInstitution" ADD CONSTRAINT "LegacyInstitution_thumbnailFileId_fkey" FOREIGN KEY ("thumbnailFileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegacyJob" ADD CONSTRAINT "LegacyJob_legacyServiceId_fkey" FOREIGN KEY ("legacyServiceId") REFERENCES "LegacyService"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegacyService" ADD CONSTRAINT "LegacyService_legacyEntityId_fkey" FOREIGN KEY ("legacyEntityId") REFERENCES "LegacyEntity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
