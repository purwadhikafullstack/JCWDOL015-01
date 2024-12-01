/*
  Warnings:

  - You are about to drop the `currentposition` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `currentposition` DROP FOREIGN KEY `CurrentPosition_userId_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `currentLatitude` DOUBLE NULL,
    ADD COLUMN `currentLongitude` DOUBLE NULL;

-- DropTable
DROP TABLE `currentposition`;
