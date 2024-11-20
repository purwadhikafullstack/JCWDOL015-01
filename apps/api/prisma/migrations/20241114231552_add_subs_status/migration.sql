/*
  Warnings:

  - Added the required column `status` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `subscription` ADD COLUMN `status` ENUM('Operating', 'Terminated') NOT NULL;
