import isError from 'http-errors';

export function errorHandler(error, req, res, next) {
  if (isError(error)) {
    return res
      .status(error.statusCode)
      .json({ status: 500, message: 'Internal server error' });
  }

  res.status(500).json({ status: 500, message: 'Internal server error!' });
}
