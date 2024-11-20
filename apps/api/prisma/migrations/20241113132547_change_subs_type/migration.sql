-- AlterTable
ALTER TABLE `subscription` MODIFY `type` ENUM('NORMAL', 'STANDARD', 'PROFESSIONAL') NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `subscriptionType` ENUM('NORMAL', 'STANDARD', 'PROFESSIONAL') NULL;
