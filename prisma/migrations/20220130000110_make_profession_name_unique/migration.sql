/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Profession` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Profession_name_key" ON "Profession"("name");
