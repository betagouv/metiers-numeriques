/*
  Warnings:

  - The values [CONTRACTOR] on the enum `JobContractType` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[addressId]` on the table `Job` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addressId` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "JobContractType_new" AS ENUM ('CONTRACT_WORKER', 'FREELANCER', 'FULL_TIME', 'INTERN', 'LOCAL_CIVIL_SERVANT', 'NATIONAL_CIVIL_SERVANT', 'PART_TIME', 'PERMANENT', 'TEMPORARY');
ALTER TABLE "Job" ALTER COLUMN "contractTypes" TYPE "JobContractType_new"[] USING ("contractTypes"::text::"JobContractType_new"[]);
ALTER TYPE "JobContractType" RENAME TO "JobContractType_old";
ALTER TYPE "JobContractType_new" RENAME TO "JobContractType";
DROP TYPE "JobContractType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "addressId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT E'FR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Job_addressId_key" ON "Job"("addressId");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
