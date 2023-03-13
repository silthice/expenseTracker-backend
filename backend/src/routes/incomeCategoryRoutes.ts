import express from "express";
import * as IncomeCategoryController from "../controllers/incomeCategoriesController";

const router = express.Router();

//Create Income Category
router.post("/create", IncomeCategoryController.createIncomeCategory);
//Edit Income Category
router.put("/edit/:cat_uniq_id", IncomeCategoryController.editIncomeCategory);
//Get Income Category List
router.get("/getCategoryList", IncomeCategoryController.getIncomeCategoryList);

export default router;
