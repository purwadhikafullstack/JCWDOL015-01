/*
  Warnings:

  - You are about to drop the column `username` on the `admin` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `auth` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `developer` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Auth` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Auth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `admin` DROP COLUMN `username`;

-- AlterTable
ALTER TABLE `auth` DROP COLUMN `username`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `developer` DROP COLUMN `username`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `username`,
    MODIFY `name` VARCHAR(191) NULL,
    MODIFY `birthDate` DATETIME(3) NULL,
    MODIFY `gender` VARCHAR(191) NULL,
    MODIFY `education` VARCHAR(191) NULL,
    MODIFY `address` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Auth_email_key` ON `Auth`(`email`);
