-- DropForeignKey
ALTER TABLE `context` DROP FOREIGN KEY `Context_messageid_fkey`;

-- DropForeignKey
ALTER TABLE `conversation` DROP FOREIGN KEY `Conversation_userId_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_conversationId_fkey`;

-- DropForeignKey
ALTER TABLE `roll` DROP FOREIGN KEY `Roll_messageid_fkey`;

-- AlterTable
ALTER TABLE `message` MODIFY `content` VARCHAR(2000) NULL;

-- AlterTable
ALTER TABLE `roll` MODIFY `content` VARCHAR(2000) NULL;

-- AddForeignKey
ALTER TABLE `Conversation` ADD CONSTRAINT `Conversation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `Conversation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Roll` ADD CONSTRAINT `Roll_messageid_fkey` FOREIGN KEY (`messageid`) REFERENCES `Message`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Context` ADD CONSTRAINT `Context_messageid_fkey` FOREIGN KEY (`messageid`) REFERENCES `Message`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
