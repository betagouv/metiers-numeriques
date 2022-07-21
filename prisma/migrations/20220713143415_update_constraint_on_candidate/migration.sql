-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "linkedInUrl" TEXT,
ALTER COLUMN "yearsOfExperience" DROP NOT NULL,
ALTER COLUMN "yearsOfExperience" SET DEFAULT 0;
