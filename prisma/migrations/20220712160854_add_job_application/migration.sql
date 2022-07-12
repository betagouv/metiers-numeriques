-- CreateEnum
CREATE TYPE "JobApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'CANDIDATE';

-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "contractTypes" "JobContractType"[],
    "currentJob" TEXT NOT NULL,
    "yearsOfExperience" INTEGER NOT NULL,
    "githubUrl" TEXT,
    "portfolioUrl" TEXT,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "candidateId" TEXT NOT NULL,
    "applicationLetter" TEXT NOT NULL,
    "status" "JobApplicationStatus" NOT NULL DEFAULT E'PENDING',
    "rejectionReason" TEXT NOT NULL,
    "cvFileId" TEXT NOT NULL,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CandidateDomains" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CandidateHiddenFromInstitutions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_userId_key" ON "Candidate"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "JobApplication_cvFileId_key" ON "JobApplication"("cvFileId");

-- CreateIndex
CREATE UNIQUE INDEX "_CandidateDomains_AB_unique" ON "_CandidateDomains"("A", "B");

-- CreateIndex
CREATE INDEX "_CandidateDomains_B_index" ON "_CandidateDomains"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CandidateHiddenFromInstitutions_AB_unique" ON "_CandidateHiddenFromInstitutions"("A", "B");

-- CreateIndex
CREATE INDEX "_CandidateHiddenFromInstitutions_B_index" ON "_CandidateHiddenFromInstitutions"("B");

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_cvFileId_fkey" FOREIGN KEY ("cvFileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CandidateDomains" ADD CONSTRAINT "_CandidateDomains_A_fkey" FOREIGN KEY ("A") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CandidateDomains" ADD CONSTRAINT "_CandidateDomains_B_fkey" FOREIGN KEY ("B") REFERENCES "Domain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CandidateHiddenFromInstitutions" ADD CONSTRAINT "_CandidateHiddenFromInstitutions_A_fkey" FOREIGN KEY ("A") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CandidateHiddenFromInstitutions" ADD CONSTRAINT "_CandidateHiddenFromInstitutions_B_fkey" FOREIGN KEY ("B") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
