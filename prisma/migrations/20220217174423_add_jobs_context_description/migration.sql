/*
  Warnings:

  - You are about to drop the column `applicationDescription` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `pepUrl` on the `Job` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "applicationDescription",
DROP COLUMN "pepUrl",
ADD COLUMN     "contextDescription" TEXT;
