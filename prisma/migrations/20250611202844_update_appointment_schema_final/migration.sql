/*
  Warnings:

  - You are about to drop the column `month` on the `appointments` table. All the data in the column will be lost.
  - Added the required column `hour` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `day` on the `appointments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('0', '1', '2', '3', '4', '5', '6');

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "month",
ADD COLUMN     "hour" TEXT NOT NULL,
DROP COLUMN "day",
ADD COLUMN     "day" "DayOfWeek" NOT NULL;
