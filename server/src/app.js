const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const AppError = require("./utils/appError");

const globalErrorHandler = require("./controller/errorController");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const healthRoutes = require("./routes/healthRoutes");
const storeRoutes = require("./routes/storeRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const vendorRoutes=require("./routes/vendorRoutes")
const riderRoutes=require("./routes/riderRoutes")

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// main routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/stores", storeRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/vendor", vendorRoutes);
app.use("/api/v1/rider", riderRoutes);




// undefined routes error
app.all(/.*/, (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

// global error handle
app.use(globalErrorHandler);

module.exports = app;
