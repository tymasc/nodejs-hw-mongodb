import * as contactsService from '../services/contacts.js';

export const getContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await contactsService.getContactById(contactId);

    if (!contact) {
      res.status(404).json({ message: 'Contact not found' });
      return;
    }
    res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}`,
      data: contact,
    });
  } catch (e) {
    next(e);
  }
};

export const getContacts = async (req, res, next) => {
  try {
    const contacts = await contactsService.getAllContacts();

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (e) {
    next(e);
  }
};
