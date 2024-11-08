-- AlterTable
ALTER TABLE `user` ADD COLUMN `verifiedCompany` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_verifiedCompany_fkey` FOREIGN KEY (`verifiedCompany`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
