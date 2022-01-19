-- CreateEnum
CREATE TYPE "JobState" AS ENUM ('DRAFT', 'EXPIRED', 'PUBLISHED');

-- AlterTable
ALTER TABLE "LegacyJob" ADD COLUMN     "state" "JobState" NOT NULL DEFAULT E'DRAFT';
