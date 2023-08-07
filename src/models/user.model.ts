import { Schema, SchemaTypes, Model, model } from "mongoose";
import { genSalt, hash } from "bcrypt";

export interface IUser {
    name: string;
    email: string;
    password: string;
}

interface IUserMethods {
    hashPassword(password: string): Promise<string>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema: Schema = new Schema<IUser, UserModel, IUserMethods>({
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
    },
});

userSchema.method("hashPassword", async function (password: string) {
    const salt = await genSalt(12);
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
});

const userModel = model<IUser, UserModel>("User", userSchema);

export default userModel;
