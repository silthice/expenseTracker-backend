import { InferSchemaType, model, Schema } from "mongoose";

const incomeCategorySchema = new Schema({
    cat_name: { type: String, required: true, unique: true },
    cat_id: { type: Number, unique: true }
});

type IncomeCategory = InferSchemaType<typeof incomeCategorySchema>;

export default model<IncomeCategory>("IncomeCategory", incomeCategorySchema);
