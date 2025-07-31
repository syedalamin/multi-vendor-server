-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "subCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
