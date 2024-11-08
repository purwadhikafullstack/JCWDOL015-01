-- CreateTable
CREATE TABLE `CompanyReview` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `salaryEstimate` DOUBLE NULL,
    `cultureScore` INTEGER NOT NULL,
    `workLifeBalanceScore` INTEGER NOT NULL,
    `facilitiesScore` INTEGER NOT NULL,
    `careerOpportunitiesScore` INTEGER NOT NULL,
    `comment` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CompanyReview` ADD CONSTRAINT `CompanyReview_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompanyReview` ADD CONSTRAINT `CompanyReview_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
