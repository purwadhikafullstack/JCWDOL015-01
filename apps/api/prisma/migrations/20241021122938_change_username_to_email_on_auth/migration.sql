/*
  Warnings:

  - You are about to drop the column `username` on the `auth` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Auth` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Auth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `auth` DROP COLUMN `username`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Auth_email_key` ON `Auth`(`email`);
