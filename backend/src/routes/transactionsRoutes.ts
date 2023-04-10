import express from "express";
import * as TransactionController from "../controllers/transactionsController";

const router = express.Router();

//Create Transaction
router.post("/create", TransactionController.createTransaction);

//Get Transaction List
router.post("/getTransactionList", TransactionController.getTransactionList);

//Get Transaction Detail
router.get("/getTransactionDetail", TransactionController.getTransactionDetail);

// Edit Transaction
router.put("/edit", TransactionController.editTransaction);

//Delete Transaction
router.delete("/delete", TransactionController.deleteTransaction);

export default router;
