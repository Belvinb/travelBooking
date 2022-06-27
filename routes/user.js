var express = require('express');
var router = express.Router();
const paypal = require('paypal-rest-sdk');
var packageHelpers = require('../helpers/package-helpers')
var userHelpers = require('../helpers/user-helpers')
var adminHelpers = require("../helpers/admin-helpers");
// const otpAuth = require('../config/otp_auth');
const { response } = require('express');
const { USER_COLLECTION, PACKAGE_COLLECTION } = require('../config/collections');
var collection = require('../config/collections')

const accountSID = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const serviceSID = process.env.SERVICESID;
console.log(serviceSID)
const client = require('twilio')(accountSID, authToken)


const moment = require('moment');

//Paypal 
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': process.env.PAYPAL_CLIENT_ID,
  'client_secret': process.env.PAYPAL_CLIENT_SECRET
});


const verifyLogin = (req, res, next) => {
  if (req.session.userloggedIn) {
    next()
  } else {
    res.redirect('/user-login')
  }
}

// home page
router.get('/', async function (req, res) {
  let user = req.session.user
  let favCount = null
  let today = new Date()
  if (req.session.user) {
    favCount = await userHelpers.getFavCount(req.session.user._id)
  }
  let categories = await packageHelpers.getCategories()
  let packages = await packageHelpers.categorySort()
  let banner = await packageHelpers.viewAllBanners()
  packageHelpers.startPackageOffer(today)
  packageHelpers.checkExpiry(today)
  packageHelpers.endPackageOffer(today)

  res.render('./user/user-view-packages', { admin: false, packages, categories, user, favCount,banner })

})
// search result page
router.get('/search', async(req, res) => {
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    let searchResult = await userHelpers.searchKey(regex)
    let banner = await packageHelpers.viewAllBanners()
    res.render('./user/searchResults', { admin: false, searchResult, user: req.session.user,banner })
  }
  console.log(req.query.search);
})


// user login 
router.get('/user-login', (req, res) => {
  if (req.session.userloggedIn) {
    res.redirect('/')
  } else {

    res.render('user/user-login', { admin: false, "loginErr": req.session.loginErr, "blockErr": req.session.blockErr })
    req.session.loginErr = false
  }


});

// otp login
router.get('/otpLogin', (req, res) => {
  if (req.session.userloggedIn) {
    res.redirect('/')
  } else {
    res.render('user/otp-login', { admin: false, "numErr": req.session.numErr, "blockErr": req.session.blockErr })
    req.session.numErr = false
    req.session.blockErr = false
  }

});

// otp login post
router.post('/otpLogin', (req, res) => {
  let No = req.body.mobileNo;
  let no = `+91${No}`
  console.log(no);
  userHelpers.getUserNumber(no).then((user) => {
    if (user) {
      if (user.status) {
        client.verify
          .services(serviceSID)
          .verifications.create({
            to: `+91${No}`,
            channel: "sms"
          }).then((resp) => {
            req.session.number = resp.to
            console.log(resp);
            res.redirect('/login/otp')
          })
      } else {
        req.session.blockErr = true
        req.session.blockErr = "This number is temporarily blocked";
        res.redirect('/otpLogin')

      }
    } else {
      req.session.numErr = true
      req.session.numErr = "This number is not registered"
      res.redirect('/otpLogin')
    }
  })
})
// otp get
router.get('/login/otp', async (req, res) => {
  if (req.session.userloggedIn) {
    res.redirect('/')
  } else {
    res.render('user/otp-verification', { otp: true, "invalidOtp": req.session.invalidOtp })
    req.session.invalidOtp = false
  }
})
//otp submit
router.post('/login/otp', (req, res) => {
  let otp = req.body.otp;
  number = req.session.number
  client.verify
    .services(serviceSID)
    .verificationChecks.create({
      to: number,
      code: otp
    }).then((response) => {
      if (response.valid) {
        userHelpers.getUserNumber(number).then(async (user) => {
          req.session.userloggedIn = true;
          req.session.user = user
          res.redirect('/')
        })
      } else {
        req.session.invalidOtp = true
        req.session.invalidOtp = "PLease enter a valid OTP"
        res.redirect('/login/otp')
      }
    })
})

//resend otp
router.get('/login/resend-otp', (req, res) => {
  let number = req.session.number;

  client.verify
    .services(serviceSID)
    .verifications.create({
      to: `${number}`,
      channel: "sms",
    })
    .then((resp) => {
      req.session.number = resp.to;
      res.redirect("/login/otp");
    });
})

//user signup page
router.get('/user-signup', (req, res) => {
  if (req.session.userloggedIn) {
    res.redirect('/user-login')
  } else {

    res.render('user/user-signup', { admin: false, "signupErr": req.session.signupErr })
    req.session.signupErr = false
  }

});
//user signup details post
router.post('/user-signup', (req, res) => {
  let data = req.body
  userHelpers.doSignup(data).then((response) => {
    if (!response.status) {
      req.session.user = response.user
      // req.session.userloggedIn=true
      res.redirect('/')
    } else {
      req.session.signupErr = "The mobile or Email already exists"
      // req.session.signupErr = true

      res.redirect('/user-signup')
    }
  })

});
//user login post
router.post('/user-login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      let status = response.user.status
      if (status) {
        req.session.user = response.user
        req.session.userloggedIn = true
        res.redirect('/')

      } else {
        req.session.user = null
        req.session.userloggedIn = false
        req.session.blockErr = "This account is temporarly blocked";
        res.redirect('/user-login')
      }
    } else {
      req.session.loginErr = "Invalid Email or Password"
      // res.session.loginErr=true
      res.redirect('/user-login')
    }
  })

})
//view individual package details
router.get("/view-details/:id",verifyLogin, async (req, res) => {
  let packageId = req.params.id;
  let userId = req.session.user._id
  let package = await packageHelpers.getPackageDetails(packageId);
  
  let reviews = await packageHelpers.getReviews(packageId)
  let booked = await packageHelpers.bookedCheck(packageId,userId)

  res.render("user/view-packageinfo", { admin: false, package, user: req.session.user,reviews,booked });
});
//booked package details
router.get("/bookedPkgDetails/:id", verifyLogin, async (req, res) => {
  let packageId = req.params.id;
  let package = await packageHelpers.getPackageDetails(packageId)
  let booking = await userHelpers.getBookings(req.session.user._id)
  let reviews = await packageHelpers.getReviews(packageId)
  res.render("user/bookedPkgDetails", { admin: false, package, booking, user: req.session.user ,reviews})
})
//user favorites
router.get("/user-favorites", verifyLogin, async (req, res) => {
  let favCount = null
  if (req.session.user) {
    favCount = await userHelpers.getFavCount(req.session.user._id)
  }
  let favpackages = await userHelpers.getFavPackages(req.session.user._id)
  res.render('user/user-favorites', { admin: false, favpackages, user: req.session.user, favCount })

})
//add to favorites
router.get('/add-to-favorites/:id', verifyLogin, (req, res) => {
  userHelpers.addToFavs(req.params.id, req.session.user._id).then((response) => {
    res.json(response)
  })
})
//remove from favorites
router.get('/remove-favorite/:id', verifyLogin, (req, res) => {
  userId = req.session.user._id
  favId = req.params.id
  userHelpers.removeFav(userId, favId).then((response) => {
    res.redirect('/user-favorites')
  })
})
//view user bookings
router.get('/user-bookings', verifyLogin, async (req, res) => {
  let bookings = await userHelpers.getBookings(req.session.user._id)
  res.render('user/user-bookings', { admin: false, user: req.session.user, bookings })
})
//cancel booking
router.post('/cancel-booking', verifyLogin, (req, res) => {
  let paymentMethod = req.body.paymentMethod
  userHelpers.cancelBooking(req.body).then((response) => {
    if (paymentMethod == "PAYPAL" || paymentMethod == "RAZORPAY" || paymentMethod == "COD") {
      res.json(response)
    }

  })

})
//view user profile
router.get('/my-profile', verifyLogin, async (req, res) => {
  let user2 = req.session.user._id
  var user1 = req.session.user;
  let user = await userHelpers.getUserDetails(user2)
  user1 = await userHelpers.getUserDetails(user2)
  let address = await userHelpers.getSingleAddress(user2)
  req.session.user = user1
  res.render('user/my-profile', { user: true, admin: false, user, user1, address, "currentPwdErr": req.session.currentPwdErr, "newPwdErr": req.session.newPwdErr })
  req.session.currentPwdErr = false
  req.session.newPwdErr = false
})
//add new address-user
router.get('/add-new-address', verifyLogin, async (req, res) => {
  res.render('user/add-new-address', { admin: false, user: req.session.user })
})
//submit new address details
router.post('/add-new-address', (req, res) => {
  userHelpers.addNewAddress(req.session.user._id, req.body).then((response) => {
    res.redirect('/my-profile')

  })

})
//view address
router.get('/address', verifyLogin, (req, res) => {
  user1 = req.session.user._id
  user = req.session.user
  userHelpers.getSingleAddress(user1).then((address) => {
    res.render('user/view-address', { address, admin: false, user })
  })
})
//delete address
router.get('/delete-address/:id', (req, res) => {
  let addressId = req.params.id
  let user = req.session.user._id
  userHelpers.deleteAddress(user, addressId).then((response) => {
    res.redirect('/address')

  })

});
//make address default
router.get('/makeDefault/:id', (req, res) => {
  userId = req.session.user._id
  addressId = req.params.id
  userHelpers.makeDefault(userId, addressId).then((response) => {
    res.redirect('/address')
  })
});

//remove address default
router.get('/removeDefault/:id', (req, res) => {
  userId = req.session.user._id
  addressId = req.params.id
  userHelpers.removeDefault(userId, addressId).then((response) => {
    res.redirect('/address')

  })
})
//update user info
router.post('/updateUserInfo/:id', (req, res) => {
  userId = req.session.user._id
  userdetails = req.body
  userHelpers.updateUserInfo(userId, userdetails).then((response) => {
    let profile = req.files?.Image5
    if (profile) {
      profile.mv("./public/profile-images/" + userId + ".jpg")
    }
    res.redirect('/my-profile')


  })
});

//update password
router.post('/updateUserPwd/:id', (req, res) => {
  userId = req.session.user._id
  pass1 = req.body.Password1
  pass2 = req.body.Password2
  if (pass1 == pass2) {
    userHelpers.changePassword(userId, req.body).then((response) => {
      if (response.status) {
        req.session.userloggedIn = false
        req.session.user = null
        res.redirect('/user-login')
      } else {
        req.session.currentPwdErr = true
        req.session.currentPwdErr = "current password is wrong"
        res.redirect('/my-profile')


      }
    })
  } else {
    req.session.newPwdErr = true
    req.session.newPwdErr = "The passwords does not match"
    res.redirect('/my-profile')

  }


})

//submit review
router.post('/submit-review/',verifyLogin,(req,res)=>{
  let data = req.body
  packageHelpers.addReview(data).then((response)=>{
    let id = response.insertedId
    let review = req.files?.Image7
    if(review){
      review.mv("./public/review-images/"+id+".jpg")
    }
    res.redirect('back')
  })
})
//proceed to checkout page
router.post("/proceed-to-checkout/:id", verifyLogin, async (req, res) => {
  let user2 = req.session.user._id
  var user1 = req.session.user;
  let packageId = req.params.id;
  let data = req.body
  let total = await packageHelpers.getpackageTotal(packageId, data, user2)
  let package = await packageHelpers.getPackageDetails(packageId);
  let user = await userHelpers.getUserDetails(user2)
  // user1 = await userHelpers.getUserDetails(user2)
  let address = await userHelpers.getSingleAddress(user2)
  let coupons = await packageHelpers.getAllcoupons(user2)
  res.render('user/checkout', { admin: false, user: true, user, user1, address, package, total,coupons })
})


//checkout post
router.post('/checkout', verifyLogin, (req, res) => {
  userHelpers.placeBooking(req.body).then((orderId) => {
    if (req.body['payment-method'] === 'COD') {
      res.json({ codSuccess: true })
    } else if (req.body['payment-method'] === 'RAZORPAY') {
      userHelpers.generateRazorpay(orderId, req.body).then((response) => {
        res.json({ ...response, razorpay: true })
      }).catch((err) => {
        console.log(err, 'razor fail')
      })
    } else if (req.body['payment-method'] === 'PAYPAL') {
      order = req.body
      total = order.totalAmount
      val = total / 74
      totalPrice = val.toFixed(2)
      let totals = totalPrice.toString()
      req.session.total = totals
      
      const create_payment_json = {
        "intent": "sale",
        "payer": {
          "payment_method": "paypal"
        },
        "redirect_urls": {
          "return_url": "http://belvin.world/success",
          "cancel_url": "http://belvin.world/cancel"
        },
        "transactions": [{
          "item_list": {
            "items": [{
              "name": "Cart items",
              "sku": "001",
              "price": totals,
              "currency": "USD",
              "quantity": 1
            }]
          },
          "amount": {
            "currency": "USD",
            "total": totals
          },
          "description": "Hat for the best team ever"
        }]
      };


      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          throw error;
        } else {
          for (let i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel === 'approval_url') {
              let url = payment.links[i].href
              res.json({ url })
            } else {

            }
          }
        }
      });

    }
  })

})

//order succsess
router.get("/success", async (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  let total = req.session.total
  let totals = total.toString()
  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: totals,
        },
      },
    ],
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (
    error,
    payment
  ) {
    if (error) {
      console.log(error.response);
      throw error;
    } else {
  
      userHelpers.changePaymentStatus(req.session.orderId).then(() => {

        res.redirect('/ordersuccess')
      })
    }
  })
})
//order success
router.get('/ordersuccess', verifyLogin, (req, res) => {
  res.render('user/ordersuccess', { admin: false, user: req.session.user })
})
//order cancel
router.get('/cancel', (req, res) => {
  res.render('user/orderfailure', { admin: false, user: req.session.user })
})
//cancel razor pay
router.post('/cancel-razorpay', (req, res) => {
  const { id } = req.body
  console.log(req.body);
  userHelpers.cancelRazor(id).then((response) => {
    if (response) {
      res.json({ status: true })
    }
  })
})
//verify payment
router.post('/verify-payment', (req, res) => {
  let orderId = req.body['order[receipt]']
  let userId = req.session.user._id
  userHelpers.verifyPayment(req.body).then(() => {
    userHelpers.changePaymentStatus(req.body['order[receipt]']).then(() => {
      userHelpers.removeCouponcode(orderId,userId)
      res.json({ status: true })
    }).catch((err) => {
      console.log("payment failed", err);
    })
  }).catch((err) => {
    console.log('errorr occccc', err)
    res.json({ status: false, errMsg: 'err' })
  })
})

//user logout
router.get('/logout', (req, res) => {
  req.session.destroy(function (err) {
    res.redirect('/')
  })
})

//regex for search feature
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};



module.exports = router;
