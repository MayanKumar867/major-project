const express = require("express");
const router = express.Router({ mergeParams: true }); // Need to access id
const warpAsync = require("../utils/warpAsync.js");
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/expressErrors.js");
const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// Middleware for validation
const validReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Create Review
router.post("/", isLoggedIn, validReview, warpAsync(reviewController.createReviews)
);

// Delete Review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, warpAsync(reviewController.destroyReview)
);

module.exports = router;
