-- AlterTable
ALTER TABLE `subscription` MODIFY `status` ENUM('Wait', 'Operating', 'Terminated') NOT NULL;
