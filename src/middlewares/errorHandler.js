export function errorHandler(error, req, res, next) {
  console.error(error);
 if (error.status) {
   return res.status(error.status).json({
     status: error.status,
     message: error.message,
   });
 }

 if (error.name === 'CastError') {
   return res.status(404).json({
     status: 404,
     message: 'Contact not found',
     data: null,
   });
 }

 res.status(500).json({
   status: 500,
   message: 'Internal server error!',
 });
}
