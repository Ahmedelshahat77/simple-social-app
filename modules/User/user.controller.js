//======================== Sign Up ===================
import userModel from "../../DB/model/user.model.js";
import cloudinary from "../../services/cloudinary.js";
import { sendEmail } from "../../services/sendEmail.js";
import { asyncHandler } from "../../utils/ErrorHandling.js";
import { compareFunction, hashFunction } from "../../utils/hashFunction.js";
import { tokenFunction } from "../../utils/tokenFunction.js";
// import { StatusCodes } from "http-status-codes";
// import asyncHandler from "express-async-handler";
export const signUp = async (req, res, next) => {
  const { userName, email, password, gender, age } = req.body;

  const hashPassword = hashFunction({ payload: password });
  // hashPassword = 5;
  const newUser = new userModel({
    userName,
    email,
    password: hashPassword,
    gender,
    age,
  });
  console.log(newUser);
  const token = tokenFunction({ payload: { _id: newUser._id } });
  const confirmationLink = `${req.protocol}://${req.headers.host}/api/exam/v1/user/confirmEmail/${token}`;
  const refershToken = `${req.protocol}://${req.headers.host}/api/exam/v1/user/refresh/${email}`;
  const message = `<a href=${confirmationLink}>Click to confirm your email</a>
  <br>
  <a href=${refershToken}> Refresh you token </a>`;
  const emailSent = await sendEmail({
    to: newUser.email,
    message: message,
    subject: "Confrimation Email",
  });
  if (emailSent) {
    await newUser.save();
    return res.status(201).json({ message: "please confirm you email" });
  }
  // res.status(201).json({ message: "unknown error , please try again" });
  next(new Error("unknown error , please try again", { cause: 500 }));
};
//======================================= confirmation Email =================================
export const confirmEmail = async (req, res, next) => {
  const { token } = req.params;
  const decode = tokenFunction({ payload: token, generate: false });
  if (decode._id) {
    await userModel.findByIdAndUpdate(decode._id, { confirmed: true });
    return res.status(201).json({ message: "confirmed done, you can login" });
  }

  res.status(201).json({ message: "unknow error" });
};

export const refreshToken = async (req, res, next) => {
  const { email } = req.params;
  const Token = tokenFunction({ payload: { email } });
  if (Token) {
    return res.status(201).json({ message: "New token", Token });
  }
  next(new Error("UnkownError", { cause: 500 }));
};


//============================= Sign In ====================
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const userExist = await userModel.findOne({ email });

  if (userExist) {
    const match = compareFunction({
      payload: password,
      referenceData: userExist.password,
    });
    if (match) {
      const token = tokenFunction({
        payload: {
          id: userExist._id,
          email: userExist.email,
          // isLoggedIn: true,
        },
      });
      await userModel.findOneAndUpdate({ email }, { isLoggedIn: true });
      if (token) {
        return res.json({ message: "Login Success", token });
      }
      res.json({ message: "Token generation Fail" });
    } else {
      // res.json({ message: "in-valid login information" });
      next(new Error("in-valid login information", { cause: 400 }));
    }
  } else {
    res.json({ message: "in-valid login information" });
  }
});

//============ upload profile pic ===================
export const profilePic = async (req,res,next)=>{
  const {_id,userName}= req.user
  if(!req.file){
    return next(new Error('please upload your picture',{cause:400}))
  }
  const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path,{
    folder: `profiles/${userName}/profile`
  })
  const user = await userModel.findByIdAndUpdate(_id,{
    profile_pic:secure_url,
    publicId:public_id
  })
  if(!user){
    return next(new Error('please login first',{cause:400}))
  }
  const deleteData = await cloudinary.uploader.destroy(user.publicId)
  res.status(200).json({massage:'done'})
}



// ==================== Log Out ==============
export const logOut = async (req, res, next) => {
  const { _id } = req.user;
  // console.log(req.user);
  const user = await userModel.findByIdAndUpdate(_id, {
    isLoggedIn: false,
  });
  if (user) {
    return res.status(200).json({ message: "Logge Out" });
  }
  // return res.status(200).json({ message: "Logge Out" });
  next(new Error("Unknown Error"));
};


//forget password
export const forgetPass = async(req,res,next)=>{
const { email } = req.body;
const emailExist = await userModel.findOne({email})
if(!emailExist){
  next(new Error("in-Valid Email", { cause: 401 }));
}else{
  const token = tokenFunction({ payload: { _id:emailExist._id } });
  const resetLink = `${req.protocol}://${req.headers.host}/api/exam/v1/user/reset/${token}`;
  const message = `<a href=${resetLink}>Click to Reset your Possword</a>`;
  
  const emailSent = await sendEmail({
    to: email,
    message: message,
    subject: "Reset Password",
  });
  if (emailSent) {
    return res.status(201).json({ message: "please check you email to reset password" });
  }
}
}
//reset pass
export const resetPassword = async (req,res,next)=>{
const {token} = req.params
const {newPass} = req.body
const decode = tokenFunction({payload:token})
if(!decode?._id){return next(new Error("token decode failed", { cause: 400 }));}
const hashPassword = hashFunction({ payload: newPass });
const user = await userModel.findOneAndUpdate({_id:decode._id},{password:hashPassword});
if(!user){
 return next(new Error("Fail to reset password"));
}
res.status(200).json({massage:'done, please try to login'})
}