-- AlterTable
ALTER TABLE `character` MODIFY `reputation` VARCHAR(191) NULL DEFAULT '1',
    MODIFY `depensee` INTEGER NULL DEFAULT 1,
    MODIFY `totale` INTEGER NULL DEFAULT 1,
    MODIFY `puissance` INTEGER NULL DEFAULT 1,
    MODIFY `resistance` INTEGER NULL DEFAULT 1,
    MODIFY `precicion` INTEGER NULL DEFAULT 1,
    MODIFY `reflexes` INTEGER NULL DEFAULT 1,
    MODIFY `connaissance` INTEGER NULL DEFAULT 1,
    MODIFY `perception` INTEGER NULL DEFAULT 1,
    MODIFY `volonte` INTEGER NULL DEFAULT 1,
    MODIFY `arts` INTEGER NULL DEFAULT 0,
    MODIFY `cite` INTEGER NULL DEFAULT 0,
    MODIFY `civilisations` INTEGER NULL DEFAULT 0,
    MODIFY `relationnel` INTEGER NULL DEFAULT 0,
    MODIFY `soins` INTEGER NULL DEFAULT 0,
    MODIFY `animalisme` INTEGER NULL DEFAULT 0,
    MODIFY `faune` INTEGER NULL DEFAULT 0,
    MODIFY `montures` INTEGER NULL DEFAULT 0,
    MODIFY `pistage` INTEGER NULL DEFAULT 0,
    MODIFY `territoire` INTEGER NULL DEFAULT 0,
    MODIFY `adresse` INTEGER NULL DEFAULT 0,
    MODIFY `armurerie` INTEGER NULL DEFAULT 0,
    MODIFY `artisanat` INTEGER NULL DEFAULT 0,
    MODIFY `mecanisme` INTEGER NULL DEFAULT 0,
    MODIFY `runes` INTEGER NULL DEFAULT 0,
    MODIFY `athletisme` INTEGER NULL DEFAULT 0,
    MODIFY `discretion` INTEGER NULL DEFAULT 0,
    MODIFY `flore` INTEGER NULL DEFAULT 0,
    MODIFY `vigilance` INTEGER NULL DEFAULT 0,
    MODIFY `voyage` INTEGER NULL DEFAULT 0,
    MODIFY `bouclier` INTEGER NULL DEFAULT 0,
    MODIFY `cac` INTEGER NULL DEFAULT 0,
    MODIFY `lancer` INTEGER NULL DEFAULT 0,
    MODIFY `melee` INTEGER NULL DEFAULT 0,
    MODIFY `tir` INTEGER NULL DEFAULT 0,
    MODIFY `eclats` INTEGER NULL DEFAULT 0,
    MODIFY `lunes` INTEGER NULL DEFAULT 0,
    MODIFY `mythes` INTEGER NULL DEFAULT 0,
    MODIFY `pantheons` INTEGER NULL DEFAULT 0,
    MODIFY `rituels` INTEGER NULL DEFAULT 0,
    MODIFY `malusphysique` INTEGER NULL DEFAULT 0,
    MODIFY `malusmanuel` INTEGER NULL DEFAULT 0,
    MODIFY `malussocial` INTEGER NULL DEFAULT 0,
    MODIFY `malushumain` INTEGER NULL DEFAULT 0,
    MODIFY `malusanimal` INTEGER NULL DEFAULT 0,
    MODIFY `malusoutils` INTEGER NULL DEFAULT 0,
    MODIFY `malusterres` INTEGER NULL DEFAULT 0,
    MODIFY `malusarme` INTEGER NULL DEFAULT 0,
    MODIFY `malusinconnu` INTEGER NULL DEFAULT 0,
    MODIFY `malusmental` INTEGER NULL DEFAULT 0,
    MODIFY `empathie` INTEGER NULL DEFAULT 1,
    MODIFY `maxblessurelegere` INTEGER NULL DEFAULT 5,
    MODIFY `blessurelegere` INTEGER NULL DEFAULT 0,
    MODIFY `maxblessuregrave` INTEGER NULL DEFAULT 3,
    MODIFY `blessuregrave` INTEGER NULL DEFAULT 0,
    MODIFY `maxblessuremortelle` INTEGER NULL DEFAULT 2,
    MODIFY `blessuremortelle` INTEGER NULL DEFAULT 0,
    MODIFY `maxeffort` INTEGER NULL DEFAULT 15,
    MODIFY `effort` INTEGER NULL DEFAULT 15,
    MODIFY `maxsangfroid` INTEGER NULL DEFAULT 8,
    MODIFY `sangfroid` INTEGER NULL DEFAULT 8;
