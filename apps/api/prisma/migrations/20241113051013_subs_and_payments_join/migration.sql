/*
  Warnings:

  - Added the required column `subscripstionId` to the `PaymentHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `paymenthistory` ADD COLUMN `subscripstionId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `PaymentHistory` ADD CONSTRAINT `PaymentHistory_subscripstionId_fkey` FOREIGN KEY (`subscripstionId`) REFERENCES `Subscription`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
