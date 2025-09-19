import express from 'express';
import {
  getContact,
  getContacts,
  createContactController,
  deleteContactController,
  putContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/', ctrlWrapper(getContacts));
router.get('/:contactId', ctrlWrapper(getContact));
router.post('/', ctrlWrapper(createContactController));
router.delete('/:contactId', ctrlWrapper(deleteContactController));
router.put('/:contactId', ctrlWrapper(putContactController));
router.patch('/:contactId', ctrlWrapper(patchContactController));

export default router;
