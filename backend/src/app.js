const express = require("express");
const cors = require("cors");

const path = require("path");
const api = require("./api");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
    .split(",")
    .map((origin) => origin.trim());

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
);
app.use(express.json());

// Admin-uploaded images (category/food/offer/banner/logo).
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api", api);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
