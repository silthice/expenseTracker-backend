import { InferSchemaType, model, Schema } from "mongoose";

const transactionSchema = new Schema(
    {
        t_user_id: { type: Schema.Types.ObjectId, required: true },
        t_cat_id: { type: Number, required: true },
        t_cat_name: { type: String, required: true },
        t_amt: { type: Number, required: true },
        t_r_id: { type: Schema.Types.ObjectId, required: true },
        t_r_name: { type: String, required: true },
        t_rate_during_transaction: { type: Number, required: true },
        t_is_income: { type: Boolean, required: true }
    },
    { timestamps: true }
);

type Transaction = InferSchemaType<typeof transactionSchema>;

export default model<Transaction>("Transaction", transactionSchema);
