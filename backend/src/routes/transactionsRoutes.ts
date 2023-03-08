import express from "express";
import * as TransactionController from "../controllers/transactionsController";

const router = express.Router();

//Create Transaction
router.post("/create", TransactionController.createTransaction);

//Get Transaction List
router.get("/getTransactionList", TransactionController.getTransactionList);

//Edit Transaction
// router.put("/edit/:transaction_id", TransactionController.editTransaction);

export default router;
