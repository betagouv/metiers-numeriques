/*
  Warnings:

  - The values [FULL_TIME] on the enum `JobContractType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "JobContractType_new" AS ENUM ('CONTRACT_WORKER', 'FREELANCER', 'INTERN', 'INTERNATIONAL_VOLUNTEER', 'NATIONAL_CIVIL_SERVANT', 'PART_TIME', 'PERMANENT', 'TEMPORARY');
ALTER TABLE "Job" ALTER COLUMN "contractTypes" TYPE "JobContractType_new"[] USING ("contractTypes"::text::"JobContractType_new"[]);
ALTER TYPE "JobContractType" RENAME TO "JobContractType_old";
ALTER TYPE "JobContractType_new" RENAME TO "JobContractType";
DROP TYPE "JobContractType_old";
COMMIT;
