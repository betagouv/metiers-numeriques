/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Institution` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Institution_name_key" ON "Institution"("name");
