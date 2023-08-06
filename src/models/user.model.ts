import { Schema, SchemaTypes, model } from "mongoose";
import { genSalt, hash } from "bcrypt";

interface IUser {
    name: string;
    email: string;
    password: string;
}

const userSchema: Schema = new Schema<IUser>({
    name: {
        type: SchemaTypes.String,
        required: [true, "Name is required!"],
    },
    email: {
        type: SchemaTypes.String,
        required: [true, "Email is required!"],
        unique: true,
    },
    password: {
        type: SchemaTypes.String,
        required: [true, "Passowrd is required!"],
        minlength: [6, "Password should be at least 6 characters"]
    },
});

userSchema.method("hashPassword", async (password: string) => {
    const salt = await genSalt(12);
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
});

const userModel = model<IUser>("User", userSchema);

export default userModel;
