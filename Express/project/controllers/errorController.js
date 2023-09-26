const sentErrorDev=(err, res)=>{
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack 
  });
}

const sentErrorProd = (err, res)=>{
  // Operational or trusted error : sent message to client
  if(err.isOpertional){
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
    // console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
     sentErrorDev(err, res);
    }else if(process.env.NODE_ENV === 'production'){
      sentErrorProd(err, res);
    }
  
    next();
  };