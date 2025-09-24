import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export function isValidId(req, res, next) {
  if (isValidObjectId(req.params.contactId) !== true) {
    throw new createHttpError.BadRequest('ID is not valid');
  }

  next();
}
