"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formDataParser = (req, res, next) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    next();
};
exports.default = formDataParser;
