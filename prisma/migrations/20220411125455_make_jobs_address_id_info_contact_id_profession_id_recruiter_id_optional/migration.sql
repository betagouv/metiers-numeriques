-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_addressId_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_infoContactId_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_professionId_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_recruiterId_fkey";

-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "recruiterId" DROP NOT NULL,
ALTER COLUMN "addressId" DROP NOT NULL,
ALTER COLUMN "professionId" DROP NOT NULL,
ALTER COLUMN "infoContactId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_infoContactId_fkey" FOREIGN KEY ("infoContactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_professionId_fkey" FOREIGN KEY ("professionId") REFERENCES "Profession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "Recruiter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
