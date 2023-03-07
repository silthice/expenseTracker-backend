import { InferSchemaType, model, Schema } from "mongoose";

const currencyRateSchema = new Schema(
    {
        cr_name: { type: String, required: true, unique: true },
        cr_long_name: { type: String, required: true },
        cr_exchange_rate: { type: Number, required: true }
    },
    {
        timestamps: true
    }
);

type CurrencyRate = InferSchemaType<typeof currencyRateSchema>;

export default model<CurrencyRate>("CurrencyRate", currencyRateSchema);
