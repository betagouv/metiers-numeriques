-- DropIndex
DROP INDEX "Address_sourceId_key";

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "sourceId" DROP NOT NULL;
