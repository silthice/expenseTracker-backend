import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import CategoryModel from "../models/category";
import { assertIsDefined } from "../utils/assertIsDefined";

interface CreateCategoryBody {
    cat_name?: string;
}

export const createCategory: RequestHandler<unknown, unknown, CreateCategoryBody, unknown> = async (req, res, next) => {
    const cat_name = req.body.cat_name;

    try {
        if (!cat_name) {
            return next(createHttpError(400, "Parameters missings"));
        }

        const existingCategory = await CategoryModel.findOne({ cat_name: cat_name }).exec();
        if (existingCategory) {
            return next(createHttpError(409, "Category: " + cat_name + " already exists"));
        }

        const counter = await CategoryModel.countDocuments();

        const newCategory = await CategoryModel.create({
            cat_name: cat_name,
            cat_id: counter + 1
        });

        res.status(201).json({ status: true, category: newCategory });
    } catch (error) {
        next(error);
    }
};

interface EditCategoryParams {
    cat_uniq_id?: string;
}

interface EditCategoryBody {
    cat_name?: string;
}

export const editCategory: RequestHandler<EditCategoryParams, unknown, EditCategoryBody, unknown> = async (req, res, next) => {
    const cat_uniq_id = req.params.cat_uniq_id;
    const cat_name = req.body.cat_name;

    try {
        if (!mongoose.isValidObjectId(cat_uniq_id)) {
            return next(createHttpError(400, "Invalid Category Id"));
        }

        if (!cat_name) {
            return next(createHttpError(400, "Parameters missing"));
        }

        const category = await CategoryModel.findById(cat_uniq_id).exec();

        if (!category) {
            return next(createHttpError(404, "Category not found."));
        }

        category.cat_name = cat_name;

        const updatedCategory = await category.save();

        res.status(201).json({ status: true, category: updatedCategory });
    } catch (error) {
        next(error);
    }
};

export const getCategoryList: RequestHandler<unknown, unknown, unknown, unknown> = async (req, res, next) => {
    try {
        const categories = await CategoryModel.find().exec();

        res.status(200).json({ status: true, category_list: categories });
    } catch (error) {
        next(error);
    }
};
