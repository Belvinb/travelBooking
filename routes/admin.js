var express = require("express");
const { ReturnDocument } = require("mongodb");
var router = express.Router();
var packageHelpers = require("../helpers/package-helpers");
var adminHelpers = require("../helpers/admin-helpers");
var userHelpers = require("../helpers/user-helpers");
const { response } = require("express");
//middleware to check if the admin is logged is in or not
const verifyAdmin = (req, res, next) => {
  if (req.session.adminloggedIn) {
    next();
  } else {
    res.redirect("/admin");
  }
};

/* GET users listing. */
router.get("/", function (req, res) {
  if (req.session.adminloggedIn) {
    res.redirect("/view-packages");
  } else {
    res.render("admin/admin-login", { admin: true,'loginErr':req.session.loginErr });
  }
});

// router.get('/admin-signup',(req,res)=>{
//   res.render('admin/admin-signup',{admin:true})

// })

// router.post('/admin-signup',(req,res)=>{
//   let data = req.body
//   adminHelpers.adminSignup(data).then((response)=>{
//     console.log(response)
//     console.log(response.admin)
//     res.redirect('./')
//   })

// })

//admin-login start
router.get("/admin-login", verifyAdmin, (req, res) => {
  let today = new Date()
  packageHelpers.checkExpiry(today)
  packageHelpers.getAllPackages().then((packages) => {
    res.render("admin/view-packages", { admin: true, packages });
  }).catch((error)=>{
    res.redirect("/admin")
  })
});
//admin login post
router.post("/admin-login", (req, res) => {
  adminHelpers.adminLogin(req.body).then((response) => {
    if (response.status) {
      packageHelpers.getAllPackages().then((packages) => {
        req.session.adminloggedIn = true;
        req.session.admin = response.admin;
        res.render("admin/view-packages", { admin: true, packages });
      }).catch((error)=>{
        res.render("/error",{admin:true,error})
      })
    } else {
      req.session.loginErr = "Invalid username or password";
      res.redirect("/admin");
    }
  });
});
//admin login end

//package management
router.get("/add-packages", verifyAdmin, function (req, res) {
  packageHelpers.getCategories().then((categories) => {
    res.render("admin/add-packages", { admin: true, categories });
  });
});
//add package post
router.post("/add-packages", (req, res) => {
  packageHelpers.addPackage(req.body, (id) => {
    let image = req.files?.Image;
    let image2 = req.files?.Image2;
    let image3 = req.files?.Image3;
    let image4 = req.files?.Image4;

    if (image) {
      image.mv("./public/package-images/" + id + ".jpg")
    } 
    if (image2) {
      image2.mv("./public/package-images/" + id + "b.jpg")    
    } 
    if (image3) {
      image3.mv("./public/package-images/" + id + "c.jpg")
    } 
    if (image4) {
      image4.mv("./public/package-images/" + id + "d.jpg")
    }
    res.redirect('/admin/add-packages')
  });
});
//delete package delete
router.get("/delete-package/:id", verifyAdmin, (req, res) => {
  let packageId = req.params.id;
  packageHelpers.deletePackage(packageId).then((response) => {
    res.json(response)
  });
});
//edit package get
router.get("/edit-packages/:id", verifyAdmin, async (req, res) => {
  let packageId = req.params.id;
  let package = await packageHelpers.getPackageDetails(packageId);
  packageHelpers.getCategories().then((categories) => {
    res.render("admin/edit-packages", { admin: true, package, categories });
  });
});
//edit package post
router.post("/edit-packages/:id", (req, res) => {
  let id = req.params.id;
  packageHelpers.updatePackage(req.params.id, req.body).then(() => {
    let image = req.files?.Image;
    let image2 = req.files?.Image2;
    let image3 = req.files?.Image3;
    let image4 = req.files?.Image4;
    if (image) {
      image.mv("./public/package-images/" + id + ".jpg", (err, done) => {
      });
    }
    if (image2) {
      image2.mv("./public/package-images/" + id + "b.jpg", (err, done) => {
      });
    }
    if (image3) {
      image3.mv("./public/package-images/" + id + "c.jpg", (err, done) => {
      });
    }
    if (image4) {
      image4.mv("./public/package-images/" + id + "d.jpg", (err, done) => {
      });
    } else {
      res.redirect("/admin/admin-login");

    }
  });
});
//view all expired packages
router.get("/expired-packages",verifyAdmin,(req,res)=>{
  packageHelpers.getAllPackages().then((packages)=>{

    res.render("admin/expired-packages",{admin:true,packages})
  })
})
//package management end


//Banner management start
router.get("/view-banners",verifyAdmin,(req,res)=>{
  packageHelpers.viewAllBanners().then((banners)=>{
    res.render("admin/view-banners",{admin:true,banners})
  })
})
//view all banners details
router.get("/add-banners",verifyAdmin,(req,res)=>{
  res.render("admin/add-banners",{admin:true})
})

//add banner details to database
router.post("/add-banners",verifyAdmin,(req,res)=>{
  let bannerDetails = req.body
  packageHelpers.addBanners(bannerDetails).then((response)=>{
    let id = response.insertedId
    let banner = req.files?.Image6
    if(banner){
      banner.mv("./public/banner-images/"+id+".jpg")
    }
    res.redirect("/admin/view-banners")

  })
})

//disable banner 
router.get("/disableBanner/:id",verifyAdmin,(req,res)=>{
  let bannerId = req.params.id
  packageHelpers.disableBanner(bannerId).then((response)=>{
    res.json(response)
  })
})

//delete banner
router.delete("/removeBanner/:id",verifyAdmin,(req,res)=>{
  let bannerId = req.params.id
  packageHelpers.deleteBanner(bannerId).then((response)=>{
    res.json(response)
  })
})

//activate banner
router.get("/activateBanner/:id",verifyAdmin,(req,res)=>{
  let bannerId = req.params.id
  packageHelpers.activateBanner(bannerId).then((response)=>{
    res.json(response)

  })
})


//category management start
//view all categories
router.get("/view-category", verifyAdmin, (req, res) => {
  packageHelpers.getCategories().then((categories) => {
    res.render("admin/view-categories", { admin: true, categories });
  });
});

//add category get
router.get("/add-category", verifyAdmin, (req, res) => {
  res.render("admin/add-categories", { admin: true });
});

//add catergory post
router.post("/add-category", (req, res) => {
  category = req.body;
  packageHelpers.addCategory(category).then(() => {
    res.redirect("./add-category");
  });
});

//delete catergory get
router.get("/delete-category/:id", verifyAdmin, (req, res) => {
  let categoryId = req.params.id;
  packageHelpers.deleteCategory(categoryId).then((response) => {
    res.json(response)
  });
});

//hide catergory get
router.get("/hidecategory/:id", verifyAdmin, (req, res) => {
  let categoryId = req.params.id;
  packageHelpers.hideCategory(categoryId).then((response) => {
    res.json(response)
  });
});

//show catergory user side
router.get("/showcategory/:id", verifyAdmin, (req, res) => {
  let categoryId = req.params.id;
  packageHelpers.showCategory(categoryId).then((response) => {
    res.json(response)
  });
});
//catergory management end

//user management start
//view all users
router.get("/view-user", verifyAdmin, function (req, res) {
  userHelpers.getAllUsers().then((users) => {
    res.render("admin/view-user", { users, admin: true });
  });
});

//delete user
router.get("/delete-user/:id", verifyAdmin, (req, res) => {
  let userId = req.params.id;
  userHelpers.deleteUser(userId).then((response) => {
    res.json(response)
  });
});

//add user get
router.get("/add-user", verifyAdmin, function (req, res) {
  res.render("admin/add-user", { admin: true });
});

//add user post
router.post("/add-user", (req, res) => {
  userHelpers.addUser(req.body, (err) => {
    res.render("admin/add-user");
  });
});

//edit user get
router.get("/edit-user/:id", verifyAdmin, async (req, res) => {
  let user = await userHelpers.getUserDetails(req.params.id);
  res.render("admin/edit-user", { user, admin: true });
});

//edit user post
router.post("/edit-user/:id", (req, res) => {
  console.log(req.params);
  let id = req.params.id;
  userHelpers.updateUser(req.params.id, req.body).then(() => {
    res.redirect("/admin/view-user");
  });
});

//block user
router.get("/blockuser/:id", verifyAdmin, (req, res) => {
  let userId = req.params.id;
  userHelpers.blockusers(userId).then((response) => {
    res.redirect("/admin/view-user");
  });
});

//unblock user
router.get("/unblockuser/:id", verifyAdmin, (req, res) => {
  let userId = req.params.id;
  userHelpers.unblockusers(userId).then((response) => {
    res.redirect("/admin/view-user");
  });
});

//view bookings admin side
router.get("/view-booking", verifyAdmin, (req, res) => {
  packageHelpers.getallBookings().then((bookings) => {
    res.render("admin/view-bookings", { admin: true, bookings });
  });
});

//change booking status by admin
router.get("/placedBooking", verifyAdmin, (req, res) => {
  let status = req.query.name;
  if (status == "placed") {
    packageHelpers.updatestatus(req.query.id, status).then((resp) => {
      res.redirect("/admin/view-booking");
    });
  } else if (status == "cancelled") {
    packageHelpers.cancelStatus(req.query.id, status).then((resp) => {
      res.redirect("/admin/view-booking");
    });
  } else if (status == "completed") {
    packageHelpers.updatestatus(req.query.id, status).then((resp) => {
      res.redirect("/admin/view-booking");
    });
  }
});

//view offers
router.get("/packageOffer-view", verifyAdmin, (req, res) => {
  packageHelpers.getAllPackageOffers().then((proOffer) => {
    res.render("admin/packageOffer-view", { admin: true, proOffer });
  });
});

//add package offers get
router.get("/packageOffer-add", verifyAdmin, (req, res) => {
  packageHelpers.getAllPackage().then((packages) => {
    res.render("admin/packageOffer-add", { admin: true, packages,'offerError':req.session.proOfferExist });
    req.session.proOfferExist = false
  });
});

//add package offers post
router.post("/packageOffers-add", (req, res) => {
  let today = new Date()
  packageHelpers.addPackageOffer(req.body).then((response) => {
    if (response.exist) {
      req.session.proOfferExist = true;
      req.session.proOfferExist="Offer already exist for the same package"
      res.redirect("/admin/packageOffer-add");
    } else {
      packageHelpers.startPackageOffer(today)
      res.redirect("/admin/packageOffer-view");
    }
  });
});

//delete package offer
router.get("/delete-packageOffer", (req, res) => {
  packageHelpers.deletePackageOffer(req.query.id).then(() => {
    res.redirect("/admin/packageOffer-view");
  });
});

//view coupons
router.get("/coupons-view",(req,res)=>{
  packageHelpers.getAllcoupons().then((coupons)=>{
    res.render('admin/view-coupons',{admin:true,coupons})
  })
})

//add coupons get
router.get("/add-coupons",verifyAdmin,(req,res)=>{
  packageHelpers.getAllcoupons().then(()=>{
  res.render('admin/add-coupons',{admin:true})
  })
})


//add coupons post
router.post("/add-coupons",verifyAdmin,(req,res)=>{
  let couponData = req.body
  packageHelpers.addCoupon(couponData).then((couponInfo)=>{
    res.redirect("./add-coupons")

  })
})

//remove coupon
router.post("/removeCoupon/:id",verifyAdmin,(req,res)=>{
  let couponId = req.params.id
  packageHelpers.removeCoupon(couponId).then((response)=>{
    res.json(response)
  })
})

//get sales report
router.get('/salesReport',(req,res)=>{
  packageHelpers.getallBookings().then((bookings)=>{
    packageHelpers.dashboard().then((data)=>{
      res.render('./admin/salesReport',{admin:true,bookings,data})
    })
  })
})

//sales report post
router.post('/salesReport', (req, res) => {
  packageHelpers.getallBookings().then((bookings) => {
    packageHelpers.salesreport(req.body).then((data) => {
      res.render('./admin/salesReport', { admin: true, bookings, data })
    })
  })
})

//view dashboard
router.get('/dashboard', (req, res) => {
    packageHelpers.dashboard().then((data) => {
      packageHelpers.allReviews().then((reviews)=>{
        packageHelpers.recentBookings().then((recent)=>{
          res.render('admin/dashboard', { admin: true, data,reviews,recent })
        })
      })
    }) 
})

//logout
router.get("/logout", (req, res) => {
  req.session.adminloggedIn = false;
  req.session.admin = null;
  res.redirect("/admin");
});

module.exports = router;
