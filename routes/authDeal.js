const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Deal = mongoose.model("Deal");
mongoose.set("useFindAndModify", false);

router.get("/deal/:id", requireLogin, (req, res) => {
  Deal.findOne({ _id: req.body.dealId })
    .then((item) => {
      res.json({ item });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/alldeals", (req, res) => {
  Deal.find()
    .populate("dealsBy", "_id name")
    .then((deals) => {
      res.json({ deals });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/createdeal", requireLogin, (req, res) => {
  const {
    title,
    location,
    numOfUnit,
    dimension,
    price,
    body,
    pic,
  } = req.body;
  if (!title || !body || !location || !numOfUnit || !dimension || !price) {
    return res.status(422).json({ error: "Please add all the fields!" });
  }
  /*req.user.password = undefined*/
  console.log(req.user);
  const deal = new Deal({
    title,
    location,
    numOfUnit,
    dimension,
    price,
    body,
    dealsBy: req.user,
  });
  deal
    .save()
    .then((result) => {
      console.log(result);
      res.json({ deal: result });
    })
    .catch((err) => {
      console.log(err);
    });
});
/*   Deals by seller.user   {dealsBy:req.user._id})*/
router.get("/mydeal", requireLogin, (req, res) => {
  Deal.find({ dealsBy: req.user })
    .populate("dealsBy", "_id name")
    .then((mydeal) => {
      res.json({ mydeal });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/like", requireLogin, (req, res) => {
  Deal.findByIdAndUpdate(
    req.body.dealId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});
router.put("/deal", requireLogin, (req, res) => {
  Deal.findByIdAndUpdate(
    req.body.dealId,
    {},
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

router.put("/unlike", requireLogin, (req, res) => {
  Deal.findByIdAndUpdate(
    req.body.dealId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

router.get("/mylikes", requireLogin, (req, res) => {
  Deal.find({ likes: req.user })
    .populate("likes", "_id name")
    .then((mydeal) => {
      res.json({ mydeal });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
