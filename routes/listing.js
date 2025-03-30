const express = require("express");
const router = express.Router();
const warpAsync = require("../utils/warpAsync.js"); //for error
const ExpressError = require("../utils/expressErrors.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js")
const upload = multer({storage});


const listingController = require("../controllers/listings.js");

// Middleware for validation
const validListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

router.route("/")
   .get( warpAsync(listingController.index))
   .post(isLoggedIn ,
   
   upload.single('listing[image]'), 
   validListing , 
   warpAsync(listingController.createListing)
);




// Create New Route - Form Page
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get( warpAsync(listingController.showListing)
)
.put(isLoggedIn,isOwner,upload.single('listing[image]'), validListing, warpAsync(listingController.updateListing)
)
.delete( isLoggedIn,isOwner, warpAsync(listingController.destroyListing)
);



// Show Route - Display Single Listing
// router.get("/:id", warpAsync(listingController.showListing)
// );

//Create Route - Add New Listing
// router.post("/",isLoggedIn, validListing, warpAsync(listingController.createListing)
// );


// Edit Route - Form Page
router.get("/:id/edit",isLoggedIn, isOwner, warpAsync(listingController.renderEditForm)
);

// Update Route - Modify Listing
// router.put("/:id",isLoggedIn,validListing,isOwner, warpAsync(listingController.updateListing)
// );

// Delete Listing
// router.delete("/:id", validListing, warpAsync(async (req, res) => {
//   let { id } = req.params;
//   await Listing.findByIdAndDelete(id);
//   res.redirect("/listings");
// }));
// router.delete("/:id" , isLoggedIn,isOwner, warpAsync(listingController.destroyListing)
// );

module.exports = router;
