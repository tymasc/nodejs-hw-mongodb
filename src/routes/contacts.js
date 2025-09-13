import express from "express";
import { getContact, getContacts } from "../controllers/contacts.js";

const router = express.Router();

router.get("/", getContacts);
router.get('/:contactId', getContact);

export default router;
