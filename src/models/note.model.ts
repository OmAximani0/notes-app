import { Date, Schema, SchemaTypes, Types, model } from "mongoose";

export interface INote {
    title: string;
    content: string;
    user: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const noteSchema = new Schema<INote>(
    {
        title: {
            type: SchemaTypes.String,
            required: [true, "Title is required"],
        },
        content: {
            type: SchemaTypes.String,
        },
        user: {
            type: SchemaTypes.ObjectId,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const userModel = model<INote>("Note", noteSchema);

export default userModel;
