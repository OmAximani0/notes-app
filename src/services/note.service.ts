import { Request, Response } from "express";
import { checkFields } from "../utils/helper";
import { Note } from "../models";
import { INote } from "../models/note.model";
import { Types, isValidObjectId } from "mongoose";

interface CustomResponseExtended extends CustomResponse {
    notes?: Array<INote>;
    note?: INote;
}

export async function getAllNotes(req: Request, res: Response) {
    let response: CustomResponseExtended = {};

    try {
        const allNotes = await Note.find({ user: req.user?._id });
        response["notes"] = allNotes;
        return res.status(200).json(response);
    } catch (error: any) {
        response["error"] = [error.message];
        return res.status(500).json(response);
    }
}

export async function getNotesById(req: Request, res: Response) {
    let response: CustomResponseExtended = {};

    let noteId = req.params.id;
    noteId = typeof noteId === "string" ? noteId : String(noteId);

    if (Types.ObjectId.isValid(noteId)) {
        try {
            const note = await Note.findOne({
                _id: noteId,
                user: req.user?._id,
            });

            if (note) {
                response["note"] = note;
                return res.status(200).json(response);
            }
            response["error"] = ["Note was not found!"];
            return res.status(404).json(response);
        } catch (error: any) {
            response["error"] = [error.message];
            return res.status(500).json(response);
        }
    }

    response["error"] = ["Invalid Note Id"];
    return res.status(400).json(response);
}

export async function createNote(req: Request, res: Response) {
    let response: CustomResponse = {};

    checkFields(req.body, ["title"], response);
    if (response.error) {
        return res.status(400).json(response);
    }

    const note = await Note.findOne({
        title: req.body.title,
        user: req.user?._id,
    });
    if (note) {
        response["error"] = ["Note title is already taken"];
        return res.status(401).json(response);
    }

    if (req.body.content) {
        try {
            const newNote = new Note({
                title: req.body.title,
                content: req.body.content,
                user: req.user?._id,
            });
            await newNote.save();
            response["message"] = "Note created successfully";
            return res.status(201).json(response);
        } catch (error: any) {
            response["error"] = [error.message];
            return res.status(500).json(response);
        }
    }

    try {
        const newNote = new Note({
            title: req.body.title,
            user: req.user?._id,
        });
        await newNote.save();
        response["message"] = "Note created successfully";
        return res.status(201).json(response);
    } catch (error: any) {
        response["error"] = [error.message];
        return res.status(500).json(response);
    }
}

export async function updateNote(req: Request, res: Response) {
    let response: CustomResponseExtended = {};

    checkFields(req.body, ["noteId", "note"], response);
    if (response.error) {
        return res.status(400).json(response);
    }

    const noteId =
        typeof req.body.noteId === "string"
            ? req.body.noteId
            : String(req.body.noteId);

    if (Types.ObjectId.isValid(noteId)) {
        try {
            const note = await Note.findOneAndUpdate(
                {
                    _id: noteId,
                    user: req.user?._id,
                },
                {
                    ...req.body.note,
                },
                {
                    new: true,
                    fields: [
                        "-_id",
                        "-user",
                        "-__v"
                    ]
                }
            );

            if (note) {
                response["message"] = "Note updated successfully!";
                response["note"] = note;
                return res.status(200).json(response);
            }

            response["error"] = ["Note not found"];
            return res.status(404).json(response);
        } catch (error: any) {
            response["error"] = [error.message];
            return res.status(500).json(response);
        }
    }

    response["error"] = ["Invalid note id"];
    return res.status(400).json(response);
}

export async function deleteNote(req: Request, res: Response) {
    let response: CustomResponse = {};

    checkFields(req.body, ["noteId"], response);
    if (response.error) {
        return res.status(400).json(response);
    }

    let noteId =
        typeof req.body.noteId === "string"
            ? req.body.noteId
            : String(req.body.noteId);

    if (Types.ObjectId.isValid(noteId)) {
        try {
            const note = await Note.findOneAndDelete({
                _id: noteId,
                user: req.user?._id,
            });
            if (note) {
                response["message"] = "Note deleted successfully!";
                return res.status(200).json(response);
            }
            response["error"] = ["Note not found!"];
            return res.status(404).json(response);
        } catch (error: any) {
            response["error"] = [error.message];
            return res.status(500).json(response);
        }
    }

    response["error"] = ["Invalid note id!"];
    return res.status(400).json(response);
}
