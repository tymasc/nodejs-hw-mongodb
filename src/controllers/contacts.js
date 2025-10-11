import * as contactsService from '../services/contacts.js';
import { promises as fs } from 'node:fs';
import {
  createContact,
  deleteContact,
  updateContact,
  replaceContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsPaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

export const getContact = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await contactsService.getContactById(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  if (contact.contactId !== req.user._id) {
    throw new createHttpError.NotFound('Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}`,
    data: contact,
  });
};

export const getContacts = async (req, res, next) => {
  const { page, perPage } = parsPaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);

  const contacts = await contactsService.getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    userId: req.user.id,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const createContactController = async (req, res, next) => {
  let photo;

  if (req.file) {
    const response = await uploadToCloudinary(req.file.path);
    await fs.unlink(req.file.path); // удаляем временный файл
    photo = response.secure_url;
  }

  if (typeof req.body.name === 'undefined') {
    throw new createHttpError.BadRequest('Name is required');
  }
  const contacts = await createContact({
    ...req.body,
    photo,
    userId: req.user.id,
  });

  res.status(201).json({
    status: 201,
    message: 'Create contact successfully',
    data: contacts,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.sendStatus(204);
};

export const putContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await replaceContact(contactId, req.body);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Update contact successfully',
    data: contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await updateContact(contactId, req.body);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: contact,
  });
};
