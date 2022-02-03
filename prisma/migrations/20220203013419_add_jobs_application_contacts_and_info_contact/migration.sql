/*
  Warnings:

  - You are about to drop the column `contactId` on the `Job` table. All the data in the column will be lost.
  - Added the required column `infoContactId` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_contactId_fkey";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "contactId",
ADD COLUMN     "infoContactId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_JobApplicationContacts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_JobApplicationContacts_AB_unique" ON "_JobApplicationContacts"("A", "B");

-- CreateIndex
CREATE INDEX "_JobApplicationContacts_B_index" ON "_JobApplicationContacts"("B");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_infoContactId_fkey" FOREIGN KEY ("infoContactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobApplicationContacts" ADD FOREIGN KEY ("A") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobApplicationContacts" ADD FOREIGN KEY ("B") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
