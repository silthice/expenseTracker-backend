import express from "express";
import * as CurrencyRateController from "../controllers/currenciesRateController";

const router = express.Router();

//Create Currency Rates
router.post("/create", CurrencyRateController.createCurrencyRate);
//Edit Currency Rate
router.put("/edit/:cr_id", CurrencyRateController.editCurrencyRate);

export default router;
