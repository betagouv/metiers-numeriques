-- CreateEnum
CREATE TYPE "JobContractType" AS ENUM ('CONTRACTOR', 'FREELANCER', 'FULL_TIME', 'INTERN', 'LOCAL_CIVIL_SERVANT', 'NATIONAL_CIVIL_SERVANT', 'PART_TIME', 'TEMPORARY');

-- CreateEnum
CREATE TYPE "JobRemoteStatus" AS ENUM ('FULL', 'NONE', 'PARTIAL');

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "applicationDescription" TEXT,
    "missionDescription" TEXT NOT NULL,
    "missionVideoUrl" TEXT,
    "particularitiesDescription" TEXT,
    "tasksDescription" TEXT,
    "teamDescription" TEXT,
    "perksDescription" TEXT,
    "processDescription" TEXT,
    "profileDescription" TEXT,
    "contractTypes" "JobContractType"[],
    "remoteStatus" "JobRemoteStatus" NOT NULL DEFAULT E'NONE',
    "salaryMax" INTEGER,
    "salaryMin" INTEGER,
    "seniorityInMonths" INTEGER NOT NULL DEFAULT 0,
    "state" "JobState" NOT NULL DEFAULT E'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contactId" TEXT NOT NULL,
    "recruiterId" TEXT NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "Recruiter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
