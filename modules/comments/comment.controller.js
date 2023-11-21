import commentModel from "../../DB/model/comments.model.js";
import postModel from "../../DB/model/posts.model.js";

export const addComment = async (req, res, next) => {
  const { commBody, postId } = req.body;
  const { _id } = req.user;
  const post = await postModel.findOne({ _id: postId });
  if (!post) {
    return next(new Error("in-valid post id", { cause: 400 }));
  }
  const comment = new commentModel({
    commBody,
    postId,
    commBy: _id,
  });
  const saveComment = await comment.save();
  const check = await postModel.updateOne(
    { _id: postId },
    {
      $push: {
        comments: comment._id,
      },
    }
  );
  if (!check.modifiedCount) {
    return next(new Error("add comment fail", { cause: 400 }));
  }

  res.status(201).json({ massage: "Done", saveComment });
};

//updatecomment
export const updateComment = async (req, res) => {
  try {
    const { commId, commBody } = req.body;
    const { _id } = req.user;
    const comment = await commentModel.findOneAndUpdate(
      {
        _id: commId,
        commBy: _id,
      },
      {
        commBody,
    
      },
      {
        new: true,
      }
    );
    post ? res.json({ messgae: "Done", post }) : res.json({ messgae: "Fail" });
  } catch (error) {
    console.log(error);
    res.json({ messgae: "Catch error" });
  }
};

//delete commet
export const deleteComment = async (req, res) => {
  try {
    const { commId } = req.body;
    const { _id } = req.user;
    const commExist = await commentModel.findOneAndDelete({
      _id: commId,
      commBy: _id,
    });
    commExist
      ? res.json({ message: "Deleted Done" })
      : res.json({ message: "Deleted Fail" });
  } catch (error) {
    console.log(error);
    res.json({ message: "Catch error" });
  }
};