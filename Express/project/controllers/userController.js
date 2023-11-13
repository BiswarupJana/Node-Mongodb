const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields)=>{
 const newObj ={};
 Object.keys(obj).forEach(el=>{
   if(allowedFields.includes(el)){
     newObj[el] = obj[el];
   }
 })
 return newObj;
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This router is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filter out unwanted fields name that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  // 3) Update users document

  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {new: true, runValidators: true});


  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
    },
  })
});

  exports.deleteMe=catchAsync( async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {active: false});
    res.status(204).json({
      status: "success",
      message: "User deleted successfully",
      data: null,
    });
  })

exports.getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined yet",
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined yet",
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined yet",
  });
};
exports.deleteUser = factory.deleteOne(User)