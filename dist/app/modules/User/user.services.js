"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = require("../../../utils/pagination/pagination");
const buildSearchAndFilterCondition_1 = require("../../../utils/search/buildSearchAndFilterCondition");
const buildSortCondition_1 = require("../../../utils/search/buildSortCondition");
const sendCloudinary_1 = __importDefault(require("../../../utils/sendCloudinary"));
const apiError_1 = __importDefault(require("../../../utils/share/apiError"));
const prisma_1 = __importDefault(require("../../../utils/share/prisma"));
const generateSlug_1 = require("../../../utils/slug/generateSlug");
const user_constants_1 = require("./user.constants");
const createAdmin = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.admin.findFirst({
        where: {
            email: req.body.admin.email,
        },
    });
    if (isUserExist) {
        throw new apiError_1.default(http_status_1.default.CONFLICT, "User is already exists ");
    }
    if (req.file) {
        const { secure_url } = (yield (0, sendCloudinary_1.default)(req.file));
        req.body.admin.profilePhoto = secure_url;
    }
    const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 12);
    const userData = {
        email: req.body.admin.email,
        password: hashedPassword,
        role: client_1.UserRole.ADMIN,
    };
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield transactionClient.user.create({
            data: userData,
        });
        const createdAdminData = yield transactionClient.admin.create({
            data: req.body.admin,
        });
        return createdAdminData;
    }));
    return result;
});
const createVendor = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    const vendorData = req.body;
    const isVendorExist = yield prisma_1.default.vendor.findFirst({
        where: {
            email: req.body.vendor.email,
        },
    });
    if (isVendorExist) {
        throw new apiError_1.default(http_status_1.default.CONFLICT, "Vendor is Already Exists");
    }
    if (files) {
        if (files.logo) {
            const uploadResult = yield Promise.all(files.logo.map((file) => (0, sendCloudinary_1.default)(file)));
            const imageUrl = uploadResult.map((result) => result === null || result === void 0 ? void 0 : result.secure_url);
            vendorData.vendor.logo = imageUrl[0];
        }
        if (files.banner) {
            const uploadResult = yield Promise.all(files.banner.map((file) => (0, sendCloudinary_1.default)(file)));
            const imageUrl = uploadResult.map((result) => result === null || result === void 0 ? void 0 : result.secure_url);
            vendorData.vendor.banner = imageUrl[0];
        }
    }
    const hashedPassword = yield bcrypt_1.default.hash(vendorData.password, 12);
    const userData = {
        email: vendorData.vendor.email,
        password: hashedPassword,
        role: client_1.UserRole.VENDOR,
    };
    if (vendorData.vendor.shopName) {
        const slug = (0, generateSlug_1.generateSlug)(vendorData.vendor.shopName);
        const isExistsShopName = yield prisma_1.default.vendor.findUnique({
            where: {
                shopSlug: slug,
            },
        });
        if (isExistsShopName) {
            throw new apiError_1.default(http_status_1.default.CONFLICT, "Shop name is already exists");
        }
        else {
            vendorData.vendor.shopSlug = slug;
        }
    }
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield transactionClient.user.create({
            data: userData,
        });
        const createdVendorData = yield transactionClient.vendor.create({
            data: vendorData.vendor,
        });
        return createdVendorData;
    }));
    return result;
});
const createCustomer = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.customer.findFirst({
        where: {
            email: req.body.customer.email,
        },
    });
    if (req.file) {
        const { secure_url } = (yield (0, sendCloudinary_1.default)(req.file));
        req.body.customer.profilePhoto = secure_url;
    }
    if (isUserExist) {
        throw new apiError_1.default(http_status_1.default.CONFLICT, "Customer is Already Exists");
    }
    const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 12);
    const userData = {
        email: req.body.customer.email,
        password: hashedPassword,
        role: client_1.UserRole.CUSTOMER,
    };
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        yield transactionClient.user.create({
            data: userData,
        });
        const createdCustomerData = yield transactionClient.customer.create({
            data: req.body.customer,
        });
        return createdCustomerData;
    }));
    return result;
});
const getAllUserFromDB = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = (0, buildSortCondition_1.buildSortCondition)(options, pagination_1.allowedUserSortFields, pagination_1.allowedSortOrder);
    // search
    const whereConditions = (0, buildSearchAndFilterCondition_1.buildSearchAndFilterCondition)(filters, user_constants_1.userSearchAbleFields);
    const result = yield prisma_1.default.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: sortBy && sortOrder
            ? {
                [sortBy]: sortOrder,
            }
            : {
                createdAt: "desc",
            },
    });
    const total = yield prisma_1.default.user.count({
        where: whereConditions,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: id,
        },
    });
    return result;
});
const getMyProfile = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findFirstOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: client_1.UserStatus.ACTIVE,
        },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
        },
    });
    let profileInfo;
    if (userInfo.role == client_1.UserRole.ADMIN) {
        profileInfo = yield prisma_1.default.admin.findUniqueOrThrow({
            where: {
                email: userInfo.email,
            },
        });
    }
    else if (userInfo.role == client_1.UserRole.CUSTOMER) {
        profileInfo = yield prisma_1.default.customer.findUniqueOrThrow({
            where: {
                email: userInfo.email,
            },
        });
    }
    else {
        profileInfo = yield prisma_1.default.vendor.findUniqueOrThrow({
            where: {
                email: userInfo.email,
            },
        });
    }
    return Object.assign(Object.assign({}, userInfo), profileInfo);
});
const updateMyProfile = (req, user) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findFirstOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: client_1.UserStatus.ACTIVE,
        },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
        },
    });
    if (!userInfo) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "User is not found");
    }
    let updatedData = Object.assign({}, req.body);
    if (req.file) {
        const { secure_url } = (yield (0, sendCloudinary_1.default)(req.file));
        updatedData.profilePhoto = secure_url;
    }
    let profileInfo;
    if (userInfo.role == client_1.UserRole.ADMIN) {
        profileInfo = yield prisma_1.default.admin.update({
            where: {
                email: userInfo.email,
            },
            data: updatedData,
        });
    }
    else if (userInfo.role == client_1.UserRole.CUSTOMER) {
        profileInfo = yield prisma_1.default.customer.update({
            where: {
                email: userInfo.email,
            },
            data: updatedData,
        });
    }
    return Object.assign(Object.assign({}, userInfo), profileInfo);
});
const changeUserStatus = (email) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const isUserExist = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email,
        },
        select: {
            id: true,
            email: true,
            status: true,
            role: true,
            admin: { select: { isDeleted: true } },
            customer: { select: { isDeleted: true } },
        },
    });
    if (!isUserExist) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, "User is not found");
    }
    const newStatus = isUserExist.status == "ACTIVE" ? "BLOCKED" : "ACTIVE";
    const newAdminIsDeleted = ((_a = isUserExist.admin) === null || _a === void 0 ? void 0 : _a.isDeleted) ? false : true;
    const newCustomerIsDeleted = ((_b = isUserExist.customer) === null || _b === void 0 ? void 0 : _b.isDeleted) ? false : true;
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const changeUserStatus = yield transactionClient.user.update({
            where: {
                email: isUserExist.email,
            },
            data: {
                status: newStatus,
            },
            select: {
                email: true,
                status: true,
            },
        });
        let changeIsDeleted;
        if (isUserExist.role == "ADMIN") {
            changeIsDeleted = yield transactionClient.admin.update({
                where: {
                    email: isUserExist.email,
                },
                data: {
                    isDeleted: newAdminIsDeleted,
                },
                select: {
                    isDeleted: true,
                },
            });
        }
        else if (isUserExist.role == "CUSTOMER") {
            changeIsDeleted = yield transactionClient.customer.update({
                where: {
                    email: isUserExist.email,
                },
                data: {
                    isDeleted: newCustomerIsDeleted,
                },
                select: {
                    isDeleted: true,
                },
            });
        }
        return Object.assign(Object.assign({}, changeUserStatus), changeIsDeleted);
    }));
    return result;
});
const updateUserRole = (email, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findFirstOrThrow({
        where: {
            email,
            status: client_1.UserStatus.ACTIVE,
        },
        select: {
            id: true,
            email: true,
            role: true,
        },
    });
    const updatedUserRole = yield prisma_1.default.user.update({
        where: {
            email: isUserExist.email,
        },
        data: payload,
        select: {
            email: true,
            password: true,
            role: true,
            needPasswordChange: true,
            status: true,
        },
    });
    return updatedUserRole;
});
exports.UserServices = {
    createAdmin,
    createCustomer,
    getAllUserFromDB,
    getByIdFromDB,
    getMyProfile,
    updateMyProfile,
    changeUserStatus,
    updateUserRole,
    createVendor,
};
