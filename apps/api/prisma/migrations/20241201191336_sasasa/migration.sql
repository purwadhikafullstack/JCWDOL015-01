/*
  Warnings:

  - You are about to drop the `_savedjobs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_savedjobs` DROP FOREIGN KEY `_SavedJobs_A_fkey`;

-- DropForeignKey
ALTER TABLE `_savedjobs` DROP FOREIGN KEY `_SavedJobs_B_fkey`;

-- DropTable
DROP TABLE `_savedjobs`;

-- CreateTable
CREATE TABLE `SavedJob` (
    `userId` INTEGER NOT NULL,
    `jobId` INTEGER NOT NULL,
    `savedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`userId`, `jobId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SavedJob` ADD CONSTRAINT `SavedJob_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SavedJob` ADD CONSTRAINT `SavedJob_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
