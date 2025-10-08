"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSku = exports.generateSlug = void 0;
const generateSlug = (name) => {
    return name
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\u0980-\u09FF\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
};
exports.generateSlug = generateSlug;
const generateSku = (name, count) => {
    const subCategorySkuName = name
        .toString()
        .toUpperCase()
        .trim()
        .replace(/[^A-Z0-9\u0980-\u09FF\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "")
        .substring(0, 3);
    const serial = String(count + 1).padStart(5, "0");
    const sku = `${subCategorySkuName}-${serial}`;
    return sku;
};
exports.generateSku = generateSku;
