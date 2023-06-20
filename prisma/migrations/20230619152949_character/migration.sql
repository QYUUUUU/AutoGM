-- CreateTable
CREATE TABLE `Character` (
    `id_Character` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NULL,
    `age` VARCHAR(191) NULL,
    `genre` VARCHAR(191) NULL,
    `instinct` VARCHAR(191) NULL,
    `signeastro` VARCHAR(191) NULL,
    `origine` VARCHAR(191) NULL,
    `reputation` VARCHAR(191) NULL,
    `depensee` INTEGER NULL,
    `totale` INTEGER NULL,
    `puissance` INTEGER NULL,
    `resistance` INTEGER NULL,
    `precicion` INTEGER NULL,
    `reflexes` INTEGER NULL,
    `connaissance` INTEGER NULL,
    `perception` INTEGER NULL,
    `volonte` INTEGER NULL,
    `arts` INTEGER NULL,
    `cite` INTEGER NULL,
    `civilisations` INTEGER NULL,
    `relationnel` INTEGER NULL,
    `soins` INTEGER NULL,
    `animalisme` INTEGER NULL,
    `faune` INTEGER NULL,
    `montures` INTEGER NULL,
    `pistage` INTEGER NULL,
    `territoire` INTEGER NULL,
    `adresse` INTEGER NULL,
    `armurerie` INTEGER NULL,
    `artisanat` INTEGER NULL,
    `mecanisme` INTEGER NULL,
    `runes` INTEGER NULL,
    `athletisme` INTEGER NULL,
    `discretion` INTEGER NULL,
    `flore` INTEGER NULL,
    `vigilance` INTEGER NULL,
    `voyage` INTEGER NULL,
    `bouclier` INTEGER NULL,
    `cac` INTEGER NULL,
    `lancer` INTEGER NULL,
    `melee` INTEGER NULL,
    `tir` INTEGER NULL,
    `eclats` INTEGER NULL,
    `lunes` INTEGER NULL,
    `mythes` INTEGER NULL,
    `pantheons` INTEGER NULL,
    `rituels` INTEGER NULL,
    `malusphysique` INTEGER NULL,
    `malusmanuel` INTEGER NULL,
    `malussocial` INTEGER NULL,
    `malushumain` INTEGER NULL,
    `malusanimal` INTEGER NULL,
    `malusoutils` INTEGER NULL,
    `malusterres` INTEGER NULL,
    `malusarme` INTEGER NULL,
    `malusinconnu` INTEGER NULL,
    `malusmental` INTEGER NULL,
    `empathie` INTEGER NULL,
    `maxblessurelegere` INTEGER NULL,
    `blessurelegere` INTEGER NULL,
    `maxblessuregrave` INTEGER NULL,
    `blessuregrave` INTEGER NULL,
    `maxblessuremortelle` INTEGER NULL,
    `blessuremortelle` INTEGER NULL,
    `maxeffort` INTEGER NULL,
    `effort` INTEGER NULL,
    `maxsangfroid` INTEGER NULL,
    `sangfroid` INTEGER NULL,
    `userId` INTEGER NULL,

    PRIMARY KEY (`id_Character`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Character` ADD CONSTRAINT `Character_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
