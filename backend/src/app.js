import express from "express";
import productRoutes from "./routes/productRoutes.js";
import productVariantRoutes from "./routes/productVariantRoutes.js";
import productImageRoutes from "./routes/productImageRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import cartItemRoutes from "./routes/cartItemRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import subCategoryRoutes from "./routes/subcategoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import orderItemRoutes from "./routes/orderItemRoutes.js";
import promoCodeRoutes from "./routes/promoCodeRoutes.js";
import packageRouter from "./routes/packageRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";
import sizeRoutes from "./routes/sizeRoutes.js";

const app = express();
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/product-variants", productVariantRoutes);
app.use("/api/product-images", productImageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/cart-items", cartItemRoutes);
app.use("/api/inventories", inventoryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/order-items", orderItemRoutes);
app.use("/api/promo-codes", promoCodeRoutes);
app.use("/api/packages", packageRouter);
app.use("/api/sales", saleRoutes);
app.use("/api/sizes", sizeRoutes);

export default app;
