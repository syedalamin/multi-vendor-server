export const generateSlug = (name: string) => {
  return name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
};

export const generateSku = (name: string, count: number) => {
  const subCategorySkuName = name
    .toString()
    .toUpperCase()
    .trim()
    .replace(/[^A-Z0-9\s-]/g, "")
    .replace(/\s+/g, "")
    .substring(0, 3);


  
  const serial = String(count + 1).padStart(5, "0");

  const sku = `${subCategorySkuName}-${serial}`;
  return sku;
};
