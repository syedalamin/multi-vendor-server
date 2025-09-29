"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendToCPanel = (req) => {
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    return fileUrl;
};
exports.default = sendToCPanel;
