import { Router } from "express";
import {
    getAllNotes,
    getNotesById,
    createNote,
    updateNote,
    deleteNote,
} from "../services/note.service";
import { auth } from "../middlewares/auth";

const noteRouter = Router();

noteRouter.get("/", auth, getAllNotes);
noteRouter.get("/:id", auth, getNotesById);
noteRouter.post("/create", auth, createNote);
noteRouter.patch("/update", auth, updateNote);
noteRouter.delete("/delete", auth, deleteNote);

export default noteRouter;
