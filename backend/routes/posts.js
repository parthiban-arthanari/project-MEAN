const express = require("express");
const multer = require("multer");
const Post = require("../models/post");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination : (req , file , cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error ("Invalid Mime Type");
    if (isValid){
      error = null;
    }
    cb(error,"backend/images");
  },
  filename : (req,file,cb) => {
    const name = file.originalname
    .toLowerCase()
    .split(" ")
    .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

router.post("",checkAuth,multer({storage : storage}).single("image"),(req,res,next)=>{
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator : req.userData.userId
  });
  post.save().then(createdPost =>{
    res.status(201).json({
      message: "Post sent Successfully",
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  })
  .catch(error => {
    res.status(500).json({
      message : "Post Creation Failed!"
    });
  });
});

router.put(
  "/:id",checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator : req.userData.userId
    });
    console.log(post);
    Post.updateOne({ _id: req.params.id , creator: req.userData.userId}, post).then(result => {
      console.log(result);
      if(result.matchedCount > 0){
        res.status(200).json({ message: "Update successful!" });
      }
      else {
        res.status(401).json({ message: "Not Authorized" });
      }

    }).catch(error => {
      res.status(500).json({
        message : "Couldn't Update Post!"
      });
    });
  }
);

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPost;
  if(pageSize && currentPage){
    postQuery
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }
  postQuery.then(documents => {
    fetchedPost = documents;
    return Post.count();
  }).then(count => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: fetchedPost,
      maxPosts : count
    });
  }).catch(error => {
    res.status(500).json({
      message : "Fetching Posts Failed!"
    });
  });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  }).catch(error => {
    res.status(500).json({
      message : "Fetching Post Failed!"
    });
  });
});

router.delete("/:id",checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id , creator : req.userData.userId}).then(result => {
    console.log(result);
    if(result.deletedCount > 0){
      res.status(200).json({ message: "Deletion successful!" });
    }
    else {
      res.status(401).json({ message: "Not Authorized" });
    }
  }).catch(error => {
    res.status(500).json({
      message : "Posts Deletion Failed!"
    });
  });
});

module.exports = router;
