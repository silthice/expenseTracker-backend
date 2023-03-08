import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import CategoryModel from "../models/category";
import CurrencyRateModel from "../models/currencyRate";
import TransactionModel from "../models/transaction";
import { assertIsDefined } from "../utils/assertIsDefined";

interface CreateTransactionBody {
    t_user_id?: string;
    t_cat_id?: number;
    t_amt?: number;
    t_r_id?: string;
}

export const createTransaction: RequestHandler<unknown, unknown, CreateTransactionBody, unknown> = async (req, res, next) => {

    const t_user_id = req.body.t_user_id;
    const t_cat_id = req.body.t_cat_id;
    const t_amt = req.body.t_amt;
    const t_r_id = req.body.t_r_id;

    try {
        assertIsDefined(t_user_id);

        if (!t_user_id || !t_cat_id || !t_amt || !t_r_id) {
            throw createHttpError(400, "Parameters missing");
        }

        const category = await CategoryModel.findOne({ cat_id: t_cat_id }).exec();
        if (!category) {
            throw createHttpError(404, "Category not found.");
        }

        const currencyRate = await CurrencyRateModel.findById(t_r_id).exec();
        if (!currencyRate) {
            throw createHttpError(404, "Currency rate not found.");
        }

        const newTransaction = await TransactionModel.create({
            t_user_id: t_user_id,
            t_cat_id: category?.cat_id,
            t_cat_name: category?.cat_name,
            t_amt: t_amt,
            t_r_id: currencyRate?._id,
            t_r_name: currencyRate?.cr_name,
            t_rate_during_transaction: currencyRate?.cr_exchange_rate
        });

        res.status(201).json({ status: true, transaction: newTransaction });
    } catch (error) {
        next(error);
    }
};

interface GetTransactionBody {
    t_user_id?: string;
}

export const getTransactionList: RequestHandler<unknown, unknown, GetTransactionBody, unknown> = async (req, res, next) => {

    const t_user_id = req.body.t_user_id;

    try {
        if (!t_user_id) {
            throw createHttpError(400, "Parameters missing");
        }

        assertIsDefined(t_user_id);

        const transactions = await TransactionModel.find({ t_user_id: t_user_id }).exec();

        //Authentication to be implemented

        res.status(200).json({"status": true, "transactions": transactions});
    } catch (error) {
        next(error);
    }
};

interface GetTransactionDetailBody {
    t_user_id?: string;
    t_id: string
}

export const getTransactionDetail: RequestHandler<unknown, unknown, GetTransactionDetailBody, unknown> = async (req, res, next) => {
    
    const t_user_id = req.body.t_user_id;
    const t_id = req.body.t_id;

    try {

        if (!t_user_id || !t_id) {
            throw createHttpError(400, "Parameters missing");
        }

        assertIsDefined(t_user_id);

        if (!mongoose.isValidObjectId(t_user_id)) {
            throw createHttpError(400, "Invalid User Id.");
        }

        if (!mongoose.isValidObjectId(t_id)) {
            throw createHttpError(400, "Invalid Transaction Id.");
        }

        const transaction = await TransactionModel.findById(t_id).exec();

        if (!transaction) {
            throw createHttpError(404, "Transaction not found.");
        }

        if (!transaction.t_user_id.equals(t_user_id)) {
            throw createHttpError(401, "You cannot access this transaction");
        }

        res.status(200).json(transaction);
    } catch (error) {
        next(error);
    }
};