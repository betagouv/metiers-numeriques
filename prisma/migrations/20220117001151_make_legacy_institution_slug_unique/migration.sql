/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `LegacyInstitution` will be added. If there are existing duplicate values, this will fail.
  - Made the column `slug` on table `LegacyInstitution` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "LegacyInstitution" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LegacyInstitution_slug_key" ON "LegacyInstitution"("slug");
