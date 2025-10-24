import fs from "fs/promises";
import path from "path";

const deleteImagesFromCPanel = async (imageUrls: string[]) => {
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) return;

  console.log(imageUrls)
  await Promise.all(
    imageUrls.map(async (imgUrl) => {
      try {
        const fileName = imgUrl.split("/uploads/")[1];
        if (!fileName) return;

        const filePath = path.join(process.cwd(), "uploads", fileName);
        await fs.unlink(filePath);
      } catch (err: any) {
        if (err.code === "ENOENT") {
          console.warn(`⚠️ File not found: ${imgUrl}`);
        } else {
          console.error(`❌ Error deleting ${imgUrl}:`, err);
        }
      }
    })
  );
};

export default deleteImagesFromCPanel;
