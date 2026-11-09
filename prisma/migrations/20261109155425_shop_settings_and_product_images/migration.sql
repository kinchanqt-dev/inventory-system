-- AlterTable
ALTER TABLE `Product` ADD COLUMN `imagePath` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `ShopSettings` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'default',
    `shopTitle` VARCHAR(191) NOT NULL DEFAULT 'Inventory POS',
    `tagline` VARCHAR(191) NULL DEFAULT 'Local Food',
    `logoPath` VARCHAR(191) NULL,
    `primaryColor` VARCHAR(191) NOT NULL DEFAULT '#1a1a1a',
    `accentColor` VARCHAR(191) NOT NULL DEFAULT '#2f5d50',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
