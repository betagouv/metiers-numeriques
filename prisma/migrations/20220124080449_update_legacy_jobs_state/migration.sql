/*
  Warnings:

  - The values [EXPIRED] on the enum `JobState` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "JobState_new" AS ENUM ('ARCHIVED', 'DRAFT', 'PUBLISHED');
ALTER TABLE "LegacyJob" ALTER COLUMN "state" DROP DEFAULT;
ALTER TABLE "LegacyJob" ALTER COLUMN "state" TYPE "JobState_new" USING ("state"::text::"JobState_new");
ALTER TYPE "JobState" RENAME TO "JobState_old";
ALTER TYPE "JobState_new" RENAME TO "JobState";
DROP TYPE "JobState_old";
ALTER TABLE "LegacyJob" ALTER COLUMN "state" SET DEFAULT 'DRAFT';
COMMIT;
