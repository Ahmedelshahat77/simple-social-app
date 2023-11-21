import userModel from "../DB/model/user.model.js";
import { tokenFunction } from "../utils/tokenFunction.js";

export const auth = () => {
  return async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      //   console.log(authorization);
      if (!authorization) {
        return res.json({ message: "please enter your token" });
      }
      // perfix She7ta__
      if (!authorization.startsWith(process.env.PREFIX_TOKEN)) {
        return res.json({ message: "Wrong prefix" });
      }

      const token = authorization.split(process.env.PREFIX_TOKEN)[1];
      //   console.log(token);
      // const decode = jwt.verify(token, process.env.TOKEN_SIGNATURE);
      const decode = tokenFunction({ payload: token, generate: false });
      // console.log(decode);
      if (!decode || !decode.id) {
        return res.json({ message: "in-valid token" });
      }
      const user = await userModel.findById(decode.id);
      if (user) {
        req.user = user;
        next();
      } else {
        res.json({ message: "in-valid userId" });
      }
    } catch (error) {
      console.log(error);
      if (error == "TokenExpiredError: jwt expired") {
        res.json({ message: "Your session expired" });
      }
      res.json({ message: "catch error in authentication" });
    }
  };
};
