import postModel from "../../DB/model/posts.model.js";
import userModel from "../../DB/model/user.model.js";

export const addPost = async (req, res) => {
  try {
    const { title, body } = req.body;
    // console.log({ user: req.user });
    const { _id } = req.user;
    const newPost = new postModel({ title, body, createdBy: _id });
    const savePost = await newPost.save();
    savePost
      ? res.json({ messgae: "Added success", savePost })
      : res.json({ messgae: "Added fail" });
  } catch (error) {
    console.log(error);
    res.json({ messgae: "Catch er" });
  }
};

export const deletepost = async (req, res) => {
  try {
    const { postId } = req.body;
    const { _id } = req.user;
    const postExist = await postModel.findOneAndDelete({
      _id: postId,
      createdBy: _id,
    });
    postExist
      ? res.json({ message: "Deleted Done" })
      : res.json({ message: "Deleted Fail" });
  } catch (error) {
    console.log(error);
    res.json({ message: "Catch error" });
  }
};

export const upadtePost = async (req, res) => {
  try {
    const { postId, title, body, onlyMe } = req.body;
    const { _id } = req.user;
    const post = await postModel.findOneAndUpdate(
      {
        _id: postId,
        createdBy: _id,
      },
      {
        title,
        body,
        onlyMe,
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

export const getUserPosts = async (req, res) => {
  try {
    const { _id } = req.user;
    const posts = await postModel.find({ createdBy: _id }).populate([
        {
          path: "comments",
        }])
    if (posts.length) {
      return res.json({ message: "Done", Your_posts: posts });
    }
    res.json({ message: "there are no posts" });
  } catch (error) {
    console.log(error);
    res.json({ message: "Catch error" });
  }
};



export const getAllPosts = async (req, res) => {
  try {
    const { isLoggedIn } = req.user;
    if (isLoggedIn) {
      const posts = await postModel.find({ onlyMe: false }).populate([
        {
          path: "comments",
        },
      ]); //.select("-onlyMe");
      if (posts.length) {
        return res.json({ message: "Done", All_posts: posts });
      }
      res.json({ message: "there are no posts" });
    } else {
      res.json({ message: "please login first" });
    }
  } catch (error) {
    console.log(error);
    res.json({ message: "Catch error" });
  }
};

//============ likes unlikes ===============================//
export const likePost = async (req, res, next) => {
  const { postId } = req.body;
  const { _id } = req.user;
  const post = await postModel.findOneAndUpdate({_id:postId},{
    $push:{
      likes:_id 
    }
  })
  post.totalLikes = post.likes.length +1
  post.save()
  res.status(200).json({massage:"Done", post})
};

export const unlikePost = async (req, res, next) => {
  const { postId } = req.body;
  const { _id } = req.user;
  const post = await postModel.findOneAndUpdate(
    { _id: postId },
    {
      $pull: {
        likes: _id,
      },
    }
  );
  post.totalLikes = post.likes.length - 1;
  post.save();
  res.status(200).json({ massage: "Done", post });
};
