import MongoStore from "connect-mongo";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import createHttpError, { isHttpError } from "http-errors";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes";
import currencyRateRoutes from "./routes/currencyRateRoutes";
import env from "./utils/validateEnv";

const app = express();

//Middleware
app.use(morgan("dev"));

app.use(express.json());

app.use(
    session({
        secret: env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60 * 60 * 1000
        },
        rolling: true,
        store: MongoStore.create({
            mongoUrl: env.MONGO_CONNECTION_STRING
        })
    })
);

//Routing for API
//Users
app.use("/api/users", userRoutes);
//Currency Rates
app.use("/api/currencyRates", currencyRateRoutes);

//Error handling forwarder
app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});

//Error handling
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMsg = "Error occured";
    let statusCode = 500;

    if (isHttpError(error)) {
        statusCode = error.statusCode;
        errorMsg = error.message;
    }
    res.status(statusCode).json({ error: errorMsg });
});

//End of Middleware
export default app;
