/*
  Warnings:

  - You are about to drop the column `messageid` on the `roll` table. All the data in the column will be lost.
  - You are about to drop the `context` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `context` DROP FOREIGN KEY `Context_messageid_fkey`;

-- DropForeignKey
ALTER TABLE `roll` DROP FOREIGN KEY `Roll_messageid_fkey`;

-- AlterTable
ALTER TABLE `character` ADD COLUMN `groupeId` INTEGER NULL;

-- AlterTable
ALTER TABLE `roll` DROP COLUMN `messageid`,
    ADD COLUMN `characterId_Character` INTEGER NULL;

-- DropTable
DROP TABLE `context`;

-- CreateTable
CREATE TABLE `Groupe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NULL,
    `instinct` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Character` ADD CONSTRAINT `Character_groupeId_fkey` FOREIGN KEY (`groupeId`) REFERENCES `Groupe`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Roll` ADD CONSTRAINT `Roll_characterId_Character_fkey` FOREIGN KEY (`characterId_Character`) REFERENCES `Character`(`id_Character`) ON DELETE SET NULL ON UPDATE CASCADE;
