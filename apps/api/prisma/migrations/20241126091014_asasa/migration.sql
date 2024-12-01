/*
  Warnings:

  - You are about to drop the column `currentLatitude` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `currentLongitude` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `currentLatitude`,
    DROP COLUMN `currentLongitude`,
    ADD COLUMN `latitude` DOUBLE NULL,
    ADD COLUMN `longitude` DOUBLE NULL;
