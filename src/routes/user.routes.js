import {Router} from "express";
import { registerUser } from "../controllers/user.controller.js";
import { Notes } from "../controllers/Notes.controller.js";
import { flashcards } from "../controllers/Flashcard.controller.js";
const router = Router()

router.route('/register').post(registerUser)
router.route('/Notes').get(Notes)
router.route('/flashcards').get(flashcards)

export default router