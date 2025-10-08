import fs from "fs/promises";
import path from "path";

const deleteImageFromCPanel = async (imageUrl: string) => {
  if (!imageUrl || typeof imageUrl !== "string") return;

  try {
    const fileName = imageUrl.split("/uploads/")[1];
    if (!fileName) return;

    const filePath = path.join(process.cwd(), "uploads", fileName);

    await fs.unlink(filePath);
  } catch (err: any) {
    if (err.code === "ENOENT") {
      console.warn(`⚠️ File not found: ${imageUrl}`);
    } else {
      console.error(`❌ Error deleting ${imageUrl}:`, err);
    }
  }
};

export default deleteImageFromCPanel;
