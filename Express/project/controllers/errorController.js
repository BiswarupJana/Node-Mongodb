const AppError = require('./../utils/appError');

const handleCastErrorDb = err => {
  const message = `Invalid ${err.path} :  ${err.value}.`;
  return new AppError(message, 400);
}

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400)
}

const handleValidationErrorDb=err=>{
  const error = Object.values(err.errors).map(el=>el.message);
  const message = `Invalid Input data. ${error.join('. ')}`;
  return new AppError ( message, 400);
}

const handleJWTError = () => new AppError('Invalid token. Please log in again!', 404);
const handleJWTExpiredError =() => new AppError('Your token has expired! Please log in again', 401);

const sentErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
}

const sentErrorProd = (err, res) => {
  // Operational or trusted error : sent message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
    // Programing or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('Error 💥', err);
    // 2) Sent generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    })
  }

}

module.exports = (err, req, res, next) => {
  // console.log(err);
  // console.log(err.statusCode);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sentErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    console.log(err.code);
    console.log(err.errmsg);
    let error = { ...err };
    // console.log(error);

    //  console.log(error, 'okkk2');
    if (err.name === 'CastError') error = handleCastErrorDb(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDb(err);
    if(err.name === 'JsonWebTokenError') error = handleJWTError();
    if(err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sentErrorProd(error, res);

  }
  next();
};