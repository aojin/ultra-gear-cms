import express from "express";
import productRoutes from "./routes/productRoutes";
import productVariantRoutes from "./routes/productVariantRoutes";
import productImageRoutes from "./routes/productImageRoutes";
import userRoutes from "./routes/userRoutes";
import cartRoutes from "./routes/cartRoutes";
import cartItemRoutes from "./routes/cartItemRoutes";
import inventoryRoutes from "./routes/inventoryRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import subCategoryRoutes from "./routes/subcategoryRoutes";
import orderRoutes from "./routes/orderRoutes";
import orderItemRoutes from "./routes/orderItemRoutes";
import promoCodeRoutes from "./routes/promoCodeRoutes";
import packageRouter from "./routes/packageRoutes";
import saleRoutes from "./routes/saleRoutes";
import sizeRoutes from "./routes/sizeRoutes";

const app = express();
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/product-variants", productVariantRoutes);
app.use("/api/product-images", productImageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
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
