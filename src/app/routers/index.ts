import express from "express";
import { UserRoutes } from "../modules/User/user.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { AdminRoutes } from "../modules/Admin/admin.routes";
import { CategoryRoutes } from "../modules/Category/category.routes";
import { SubCategoryRoutes } from "../modules/SubCategory/sub.category.routes";
import { ProductRoutes } from "../modules/Product/product.routes";
import { CartRoutes } from "../modules/Cart/cart.routes";
import { VendorRoutes } from "../modules/Vendor/vendor.routes";
import { OrderRoutes } from "../modules/Order/order.routes";
import { VendorMetaRoutes } from "../modules/MetaData/meta.routes";
import { DistrictRoutes } from "../modules/District/district.routes";
import { CityRoutes } from "../modules/City/city.routes";
import { ReviewRoutes } from "../modules/Review/review.routes";

const router = express.Router();

const moduleRouters = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/vendor",
    route: VendorRoutes,
  },
  {
    path: "/category",
    route: CategoryRoutes,
  },
  {
    path: "/district",
    route: DistrictRoutes,
  },
  {
    path: "/city",
    route: CityRoutes,
  },
  {
    path: "/sub-category",
    route: SubCategoryRoutes,
  },
  {
    path: "/product",
    route: ProductRoutes,
  },
  {
    path: "/cart",
    route: CartRoutes,
  },
  {
    path: "/order",
    route: OrderRoutes,
  },
  {
    path: "/meta-data",
    route: VendorMetaRoutes,
  },
  {
    path: "/review",
    route: ReviewRoutes,
  },
];

moduleRouters.forEach((route) => router.use(route.path, route.route));

export const Routers = router;
