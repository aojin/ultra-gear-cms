const express = require("express");
const productRoutes = require("./routes/productRoutes");
const productVariantRoutes = require("./routes/productVariantRoutes");
const productImageRoutes = require("./routes/productImageRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const cartItemRoutes = require("./routes/cartItemRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const orderItemRoutes = require("./routes/orderItemRoutes");

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
app.use("/api/orders", orderRoutes);
app.use("/api/order-items", orderItemRoutes);

module.exports = app;
