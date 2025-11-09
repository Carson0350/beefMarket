/*
  Warnings:

  - You are about to drop the column `availableStraws` on the `Bull` table. All the data in the column will be lost.
  - You are about to drop the column `pricePerStraw` on the `Bull` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bull" DROP COLUMN "availableStraws",
DROP COLUMN "pricePerStraw",
ADD COLUMN     "availabilityStatus" TEXT NOT NULL DEFAULT 'AVAILABLE',
ADD COLUMN     "currentWeight" DOUBLE PRECISION,
ADD COLUMN     "frameScore" INTEGER,
ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "scrotalCircumference" DOUBLE PRECISION,
ADD COLUMN     "semenAvailable" INTEGER NOT NULL DEFAULT 0;
