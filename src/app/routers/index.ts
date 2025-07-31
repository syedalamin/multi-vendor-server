import express from "express";
import { UserRoutes } from "../modules/User/user.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { AdminRoutes } from "../modules/Admin/admin.routes";
import { CategoryRoutes } from "../modules/Category/category.routes";
import { SubCategoryRoutes } from "../modules/SubCategory/sub.category.routes";
import { ProductRoutes } from "../modules/Product/product.routes";
import { CartRoutes } from "../modules/Cart/cart.routes";

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
    path: "/category",
    route: CategoryRoutes,
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
];

moduleRouters.forEach((route) => router.use(route.path, route.route));

export const Routers = router;
