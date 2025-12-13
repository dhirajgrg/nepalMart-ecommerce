const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const adminRoutes = require("./routes/adminRoutes");
const usersRoutes = require("./routes/usersRoutes");
const authRoutes = require("./routes/authRoutes");
const productsRoutes = require("./routes/productsRoutes");
const cartsRoutes = require("./routes/cartRoutes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");

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
app.use("/api/v1/auths", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/products", productsRoutes);
app.use("/api/v1/cart", cartsRoutes);

// undefined routes error
app.all(/.*/, (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

// global error handle
app.use(globalErrorHandler);

module.exports = app;
