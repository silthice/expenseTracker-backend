import express from "express";
import * as CategoryController from "../controllers/categoriesController";

const router = express.Router();

//Create Category
router.post("/create", CategoryController.createCategory);
//Edit Category
router.put("/edit/:cat_uniq_id", CategoryController.editCategory);

export default router;
