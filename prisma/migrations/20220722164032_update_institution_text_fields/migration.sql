/*
  Warnings:

  - You are about to drop the column `structure` on the `Institution` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Institution" DROP COLUMN "structure",
ADD COLUMN     "figures" TEXT,
ADD COLUMN     "projects" TEXT,
ADD COLUMN     "recruitmentProcess" TEXT,
ADD COLUMN     "values" TEXT,
ADD COLUMN     "wantedSkills" TEXT,
ADD COLUMN     "workingWithUs" TEXT;
