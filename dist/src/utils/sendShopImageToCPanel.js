"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendShopImageToCPanel = (req) => {
    let fileUrls = {};
    if (req.files && typeof req.files === "object") {
        const files = req.files;
        for (const field in files) {
            fileUrls[field] = files[field].map((file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`);
        }
    }
    return fileUrls;
};
exports.default = sendShopImageToCPanel;
