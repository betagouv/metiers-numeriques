/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Institution` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Institution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Institution" ADD COLUMN     "slug" TEXT NOT NULL,
ALTER COLUMN "fullName" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Institution_slug_key" ON "Institution"("slug");
