const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  const customError={
    msg: err.message || "something went wrong",
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  }
  
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',')
    customError.statusCode = 400
  }

  if(err.code && err.code == 11000){
    customError.msg=`duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
    customError.statusCode=400;
  }

  if (err.name === 'CastError') {
    customError.msg = `No item found with id : ${err.value}`
    customError.statusCode = 404
  }
  return res.status(customError.statusCode).json({msg:customError.msg});
  
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
}

module.exports = errorHandlerMiddleware