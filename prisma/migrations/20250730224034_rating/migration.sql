-- DropForeignKey
ALTER TABLE "Vendor" DROP CONSTRAINT "Vendor_userId_fkey";

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "averageRating" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_email_fkey" FOREIGN KEY ("email") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
