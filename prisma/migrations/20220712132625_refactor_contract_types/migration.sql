-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "JobContractType" ADD VALUE 'NATIONAL_CIVIL_SERVANT_OR_CONTRACT_WORKER';
ALTER TYPE "JobContractType" ADD VALUE 'CONTRACT_WORKER_ONLY';
ALTER TYPE "JobContractType" ADD VALUE 'APPRENTICESHIP';
