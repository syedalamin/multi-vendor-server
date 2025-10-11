"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSortCondition = void 0;
const buildSortCondition = (options, allowedSortFields, allowedSortOrder) => {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10000;
    const skip = (page - 1) * limit;
    const sortBy = allowedSortFields.includes(options.sortBy || "")
        ? options.sortBy
        : "createdAt";
    const sortOrder = allowedSortOrder.includes(options.sortOrder || "")
        ? options.sortOrder
        : "desc";
    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder,
    };
};
exports.buildSortCondition = buildSortCondition;
