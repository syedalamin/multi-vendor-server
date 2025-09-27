"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routers = void 0;
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("../modules/User/user.routes");
const auth_routes_1 = require("../modules/Auth/auth.routes");
const admin_routes_1 = require("../modules/Admin/admin.routes");
const category_routes_1 = require("../modules/Category/category.routes");
const sub_category_routes_1 = require("../modules/SubCategory/sub.category.routes");
const product_routes_1 = require("../modules/Product/product.routes");
const cart_routes_1 = require("../modules/Cart/cart.routes");
const vendor_routes_1 = require("../modules/Vendor/vendor.routes");
const order_routes_1 = require("../modules/Order/order.routes");
const meta_routes_1 = require("../modules/MetaData/meta.routes");
const district_routes_1 = require("../modules/District/district.routes");
const city_routes_1 = require("../modules/City/city.routes");
const review_routes_1 = require("../modules/Review/review.routes");
const invoice_routes_1 = require("../modules/Invoice/invoice.routes");
const router = express_1.default.Router();
const moduleRouters = [
    {
        path: "/user",
        route: user_routes_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/admin",
        route: admin_routes_1.AdminRoutes,
    },
    {
        path: "/vendor",
        route: vendor_routes_1.VendorRoutes,
    },
    {
        path: "/category",
        route: category_routes_1.CategoryRoutes,
    },
    {
        path: "/district",
        route: district_routes_1.DistrictRoutes,
    },
    {
        path: "/city",
        route: city_routes_1.CityRoutes,
    },
    {
        path: "/sub-category",
        route: sub_category_routes_1.SubCategoryRoutes,
    },
    {
        path: "/product",
        route: product_routes_1.ProductRoutes,
    },
    {
        path: "/cart",
        route: cart_routes_1.CartRoutes,
    },
    {
        path: "/order",
        route: order_routes_1.OrderRoutes,
    },
    {
        path: "/meta-data",
        route: meta_routes_1.VendorMetaRoutes,
    },
    {
        path: "/review",
        route: review_routes_1.ReviewRoutes,
    },
    {
        path: "/invoice",
        route: invoice_routes_1.InvoiceRoutes,
    },
];
moduleRouters.forEach((route) => router.use(route.path, route.route));
exports.Routers = router;
