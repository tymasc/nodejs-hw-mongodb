import { Contact } from '../models/contact.js';

export const getAllContacts = async () => {
  return await Contact.find();
};

export const getContactById = async (id) => {
  return await Contact.findById(id);
};

export const createContact = async (payload) => {
  return await Contact.create(payload);
};

export const deleteContact = async (id) => {
  return await Contact.findByIdAndDelete(id);
};

export const updateContact = async (id, payload) => {
  return await Contact.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

export const replaceContact = async (id, payload) => {
  return await Contact.findOneAndReplace({ _id: id }, payload, {
    new: true,
    runValidators: true,
  });
};
