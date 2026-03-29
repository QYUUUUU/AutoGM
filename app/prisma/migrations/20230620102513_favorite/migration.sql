-- CreateTable
CREATE TABLE `FavoriteCharacter` (
    `userId` INTEGER NOT NULL,
    `characterId` INTEGER NOT NULL,

    UNIQUE INDEX `FavoriteCharacter_userId_key`(`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FavoriteCharacter` ADD CONSTRAINT `FavoriteCharacter_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FavoriteCharacter` ADD CONSTRAINT `FavoriteCharacter_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id_Character`) ON DELETE RESTRICT ON UPDATE CASCADE;
