const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const usersRoutes = require("./routes/usersRoutes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");

app.use(express.json());
 app.use(morgan("dev"));
app.use(cookieParser());

// main routes
app.use("/api/v1/users", usersRoutes);

// undefined routes error
app.all(/.*/, (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

// global error handle
app.use(globalErrorHandler);

module.exports = app;
