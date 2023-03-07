import { InferSchemaType, model, Schema } from "mongoose";

const categorySchema = new Schema({
    cat_name: { type: String, required: true, unique: true },
    cat_id: { type: Number, unique: true }
});

type Category = InferSchemaType<typeof categorySchema>;

export default model<Category>("Category", categorySchema);
