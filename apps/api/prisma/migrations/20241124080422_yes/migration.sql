/*
  Warnings:

  - You are about to drop the column `companyLogoUrl` on the `admin` table. All the data in the column will be lost.
  - You are about to drop the column `resumeUrl` on the `application` table. All the data in the column will be lost.
  - You are about to drop the column `profilePictureUrl` on the `user` table. All the data in the column will be lost.
  - Added the required column `resume` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `admin` DROP COLUMN `companyLogoUrl`,
    ADD COLUMN `companyLogo` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `application` DROP COLUMN `resumeUrl`,
    ADD COLUMN `resume` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `profilePictureUrl`,
    ADD COLUMN `profilePicture` VARCHAR(191) NULL;
