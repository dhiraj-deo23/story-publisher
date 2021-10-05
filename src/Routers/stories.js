const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const Story = require("../Models/Story");

router.get("/stories/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});

router.post("/stories", ensureAuth, async (req, res) => {
  try {
    req.body.owner = req.user._id;
    const story = await Story.create(req.body);
    if (!story) {
      return res.redirect("/stories");
    }
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.render("errors/500");
  }
});

router.get("/stories", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("owner")
      .sort({ createdAt: "desc" })
      .lean();
    res.render("stories/index", {
      stories,
      user: req.user,
    });
  } catch (error) {
    console.log(error);
    res.render("errors/500");
  }
});

router.get("/stories/edit/:id", ensureAuth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).lean();
    if (!story) {
      return res.render("errors/404");
    }
    if (story.owner.toString() !== req.user.id) {
      return res.redirect("/stories");
    }
    res.render("stories/edit", {
      story,
    });
  } catch (error) {
    console.log(error);
    res.render("errors/500");
  }
});

router.put("/stories/:id", ensureAuth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.render("errors/404");
    }
    if (story.owner.toString() !== req.user.id) {
      return res.redirect("/stories");
    }
    await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });
    res.redirect("/dashboard");
  } catch (error) {
    res.render("errors/500");
  }
});

router.delete("/stories/:id", ensureAuth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.render("errors/404");
    }
    if (story.owner.toString() !== req.user.id) {
      return res.redirect("/stories");
    }
    await Story.findOneAndDelete({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    res.render("errors/500");
  }
});

router.get("/stories/:id", ensureAuth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).populate("owner").lean();
    if (!story) {
      return res.render("errors/404");
    }
    res.render("stories/show", {
      story,
      user: req.user,
    });
  } catch (error) {
    console.log(error);
    res.render("errors/500");
  }
});

router.get("/stories/user/:id", ensureAuth, async (req, res) => {
  const stories = await Story.find({ owner: req.params.id, status: "public" })
    .populate("owner")
    .lean();
  if (!stories) {
    return res.render("errors/404");
  }
  res.render("stories/index", {
    stories,
    user: req.user,
  });
});

module.exports = router;
