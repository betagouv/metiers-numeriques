/*
  Warnings:

  - You are about to drop the column `yearsOfExperience` on the `Candidate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "yearsOfExperience",
ADD COLUMN     "seniorityInYears" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "_CandidateProfessions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CandidateProfessions_AB_unique" ON "_CandidateProfessions"("A", "B");

-- CreateIndex
CREATE INDEX "_CandidateProfessions_B_index" ON "_CandidateProfessions"("B");

-- AddForeignKey
ALTER TABLE "_CandidateProfessions" ADD CONSTRAINT "_CandidateProfessions_A_fkey" FOREIGN KEY ("A") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CandidateProfessions" ADD CONSTRAINT "_CandidateProfessions_B_fkey" FOREIGN KEY ("B") REFERENCES "Profession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
