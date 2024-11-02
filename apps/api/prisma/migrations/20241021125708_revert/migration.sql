/*
  Warnings:

  - You are about to drop the column `email` on the `auth` table. All the data in the column will be lost.
  - Added the required column `username` to the `Auth` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Auth_email_key` ON `auth`;

-- AlterTable
ALTER TABLE `auth` DROP COLUMN `email`,
    ADD COLUMN `username` VARCHAR(191) NOT NULL;
