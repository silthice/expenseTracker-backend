import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import CurrencyRateModel from "../models/currencyRate";

interface CreateCurrencyRateBody {
    cr_name?: string;
    cr_long_name?: string;
    cr_exchange_rate?: string;
}

export const createCurrencyRate: RequestHandler<unknown, unknown, CreateCurrencyRateBody, unknown> = async (req, res, next) => {
    const cr_name = req.body.cr_name;
    const cr_long_name = req.body.cr_long_name;
    const cr_exchange_rate = req.body.cr_exchange_rate;

    try {
        if (!cr_name || !cr_long_name || !cr_exchange_rate) {
            return next(createHttpError(400, "Parameters missing"));
        }

        const existingCurrencyRate = await CurrencyRateModel.findOne({ cr_name: cr_name }).exec();
        if (existingCurrencyRate) {
            return next(createHttpError(409, "Currency rate: " + cr_name + " already exists"));
        }

        const newCurrencyRate = await CurrencyRateModel.create({
            cr_name: cr_name.toUpperCase(),
            cr_long_name: cr_long_name.toUpperCase(),
            cr_exchange_rate: cr_exchange_rate
        });

        res.status(201).json({ status: true, currencyRate: newCurrencyRate });
    } catch (error) {
        next(error);
    }
};

interface EditCurrencyRateParams {
    cr_id?: string;
}

interface EditCurrencyRateBody {
    cr_name?: string;
    cr_long_name?: string;
    cr_exchange_rate?: number;
}

export const editCurrencyRate: RequestHandler<EditCurrencyRateParams, unknown, EditCurrencyRateBody, unknown> = async (req, res, next) => {
    const cr_id = req.params.cr_id;
    const cr_name = req.body.cr_name;
    const cr_long_name = req.body.cr_long_name;
    const cr_exchange_rate = req.body.cr_exchange_rate;

    try {
        if (!mongoose.isValidObjectId(cr_id)) {
            return next(createHttpError(400, "Invalid Currency Rate Id."));
        }

        if (!cr_name || !cr_long_name || !cr_exchange_rate) {
            return next(createHttpError(400, "Parameters missing"));
        }

        const currencyRate = await CurrencyRateModel.findById(cr_id).exec();

        if (!currencyRate) {
            return next(createHttpError(404, "Currency Rate not found."));
        }

        currencyRate.cr_name = cr_name.toUpperCase();
        currencyRate.cr_long_name = cr_long_name.toUpperCase();
        currencyRate.cr_exchange_rate = cr_exchange_rate;

        const updatedCurrencyRate = await currencyRate.save();

        res.status(201).json({ status: true, currencyRate: updatedCurrencyRate });
    } catch (error) {
        next(error);
    }
};
