/*
  Warnings:

  - The values [ARCHIVED] on the enum `JobState` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "JobState_new" AS ENUM ('DRAFT', 'PUBLISHED');
ALTER TABLE "Job" ALTER COLUMN "state" DROP DEFAULT;
ALTER TABLE "LegacyJob" ALTER COLUMN "state" DROP DEFAULT;
ALTER TABLE "Job" ALTER COLUMN "state" TYPE "JobState_new" USING ("state"::text::"JobState_new");
ALTER TABLE "LegacyJob" ALTER COLUMN "state" TYPE "JobState_new" USING ("state"::text::"JobState_new");
ALTER TYPE "JobState" RENAME TO "JobState_old";
ALTER TYPE "JobState_new" RENAME TO "JobState";
DROP TYPE "JobState_old";
ALTER TABLE "Job" ALTER COLUMN "state" SET DEFAULT 'DRAFT';
ALTER TABLE "LegacyJob" ALTER COLUMN "state" SET DEFAULT 'DRAFT';
COMMIT;
