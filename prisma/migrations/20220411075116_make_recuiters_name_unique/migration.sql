/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Recruiter` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Recruiter_name_key" ON "Recruiter"("name");
