var db = require("../config/connection");
var collection = require("../config/collections");
const { ObjectId } = require("mongodb");
var objectId = require("mongodb").ObjectId;
const moment = require("moment");
const TrustedComms = require("twilio/lib/rest/preview/TrustedComms");
//add package using callback
module.exports = {
  addPackage: (packages, callback) => {
    console.log(packages);
    try{

      db.get()
        .collection(collection.PACKAGE_COLLECTION)
        .insertOne(packages)
        .then((data) => {
          console.log(data);
          callback(data.insertedId);
        })
    }catch(err){
      console.log(err)
    }
  },
  //getting all pacakges with details
  getAllPackages: () => {
    return new Promise(async (resolve, reject) => {
      try{
        let packages = await db
          .get()
          .collection(collection.PACKAGE_COLLECTION)
          .find()
          .toArray();
          resolve(packages);
      }catch(err){
        reject(err)
      }
    });
  },
  //delete a package
  deletePackage: (packageId) => {
    return new Promise((resolve, reject) => {
      try{

        db.get()
          .collection(collection.PACKAGE_COLLECTION)
          .remove({ _id: objectId(packageId) })
          .then((response) => {
            resolve({ removePackage: true });
          });
      }catch(err){
        reject(err)
      }
    });
  },
  //getting single package details
  getPackageDetails: (packageId) => {
    return new Promise((resolve, reject) => {
      try{
        db.get()
          .collection(collection.PACKAGE_COLLECTION)
          .findOne({ _id: objectId(packageId) })
          .then((package) => {
            resolve(package);
          });
      }catch(err){
        console.log(err)
      }
    });
  },
  //update a package from admin side
  updatePackage: (packageId, PackageDetails) => {
    return new Promise((resolve, reject) => {
      try{

        db.get()
          .collection(collection.PACKAGE_COLLECTION)
          .updateOne(
            { _id: objectId(packageId) },
            {
              $set: {
                Name: PackageDetails.Name,
                Category: PackageDetails.Category,
                Date: PackageDetails.Date,
                expiryDate:PackageDetails.expiryDate,
                Description: PackageDetails.Description,
                Itinerary: PackageDetails.Itinerary,
                Summary: PackageDetails.Summary,
                Price: PackageDetails.Price,
                expired:false
              },
            }
          )
          .then((response) => {
            resolve();
          });
      }catch(err){
        console.log(err)
      }
    });
  },
  //checkexpiry at pageload and admin side package view load to check for expired packages
  checkExpiry:(dateToday)=>{
    return new Promise(async(resolve,reject)=>{
      let currentDate = moment(dateToday).format("YYYY-MM-DD")
      try{

        db.get().collection(collection.PACKAGE_COLLECTION).updateMany({expiryDate:{$lt:currentDate}},
          {
            $set:{expired:true}
          },
          {multi:true}
          ).then(()=>{
          resolve()
        })
      }catch(err){
        console.log(err)
      }
    })

  },
  //check if a package is booked to verify if a user can add review
  bookedCheck:(packageDetails,userDetails)=>{
    return new Promise(async(resolve,reject)=>{
      try{

        let booked = await db.get().collection(collection.BOOKING_COLLECTION).find({"userId":objectId(userDetails),"packageId":objectId(packageDetails),booked:true}).toArray()
        resolve(booked)
      }catch(err){
        console.log(err)
      }
    })

  },


  //add catergory-admin side
  addCategory:(category)=>{
    return new Promise((resolve, reject) => {
      try{

        db.get()
          .collection(collection.CATEGORY_COLLECTIONs)
          .insertOne(category)
          .then((data) => {
            resolve(data.insertedId);
          });
      }catch(err){
        reject(err)
      }
    });
  },
  //view all catergories
  getCategories: () => {
    return new Promise(async (resolve, reject) => {
      try{

        let categories = await db
          .get()
          .collection(collection.CATEGORY_COLLECTION)
          .find()
          .toArray();
        resolve(categories);
      }catch(err){
        reject(err)
      }
    });
  },


  //delete a single category
  deleteCategory: (categoryId) => {
    return new Promise((resolve, reject) => {
      try{

        db.get()
          .collection(collection.CATEGORY_COLLECTION)
          .remove({ _id: objectId(categoryId) })
          .then((response) => {
            resolve({ categoryDelete: true });
          });
      }catch(err){
        reject(err)
      }
    });
  },


  //sort package into category for user view
  categorySort: () => {
    return new Promise(async (resolve, reject) => {
      try{

        let sortedCategory = await db
          .get()
          .collection(collection.CATEGORY_COLLECTION)
          .aggregate([
            {
              $lookup: {
                from: collection.PACKAGE_COLLECTION,
                localField: "Category",
                foreignField: "Category",
                as: "sortedPackages",
              },
            },
          ])
          .toArray();
        resolve(sortedCategory);
      }catch(err){
        reject(err)
      }
    });
  },
  //hide a category from users view
  hideCategory: (categoryId) => {
    return new Promise((resolve, reject) => {
      try{

        db.get()
          .collection(collection.CATEGORY_COLLECTION)
          .updateOne(
            { _id: objectId(categoryId) },
            {
              $set: {
                status: false,
              },
            }
          )
          .then((response) => {
            resolve({ categoryHide: true });
          });
      }catch(err){
        reject(err)
      }
    });
  },
  //show the hidden catergory
  showCategory: (categoryId) => {
    return new Promise((resolve, reject) => {
      try{

        db.get()
          .collection(collection.CATEGORY_COLLECTION)
          .updateOne(
            { _id: objectId(categoryId) },
            {
              $set: {
                status: true,
              },
            }
          )
          .then((response) => {
            resolve({ categoryShow: true });
          });
      }catch(err){
        reject(err)
      }
    });
  },


  //calculating package total according to adult and kids count
  getpackageTotal: (packageId, data, userId) => {
    return new Promise(async (resolve, reject) => {
      try{

        let package = await db
          .get()
          .collection(collection.PACKAGE_COLLECTION)
          .findOne({ _id: objectId(packageId) });
        if (package) {
          price = package.Price;
          adultsCount = data.Adults;
          kidsCount = data.Kids
          persons = parseInt(adultsCount)+parseInt(kidsCount)
          adultsTotal = parseInt(price)*parseInt(adultsCount)
          kidsPrice = parseInt(price)-parseInt((price*(20/100)))
          kidsTotal = kidsPrice*kidsCount
          total = adultsTotal + kidsTotal;
          db.get()
            .collection(collection.USER_COLLECTION)
            .updateOne(
              { _id: objectId(userId) },
              {
                $set: {
                  totalAmount: total,
                  persons: persons,
                  travelDate: data.travelDate
                },
              }
            )
            .then((response) => {
              resolve(response);
            });
        }
      }catch(err){
        console.log(err)
        reject(err)
      }
    });
  },


  //get all bookings
  getallBookings: () => {
    return new Promise(async (resolve, reject) => {
      try{

        let data = await db
          .get()
          .collection(collection.BOOKING_COLLECTION)
          .find({})
          .toArray();
        resolve(data);
      }catch(err){
        console.log(err)
      }
    });
  },


  //updating booked status as true, to store in db
  updatestatus: (id, status) => {
    return new Promise((resolve, reject) => {
      try{

        db.get()
          .collection(collection.BOOKING_COLLECTION)
          .updateOne(
            { _id: objectId(id) },
            {
              $set: {
                status: status,
                booked:true
              },
            }
          )
          .then((response) => {
            resolve(response);
          });
      }catch(err){
        console.log(err)
      }
    });
  },


  //changing booking status to cancel
  cancelStatus: (id, status) => {
    return new Promise((resolve, reject) => {
      try{

        db.get()
          .collection(collection.BOOKING_COLLECTION)
          .updateOne(
            { _id: objectId(id) },
            {
              $set: {
                status: status,
                cancel: true
              },
            }
          )
          .then((response) => {
            resolve(response);
          });
      }catch(err){
        console.log(err)
      }
    });
  },



  //view dashboard
  dashboard: () => {
    try{

      return new Promise(async (resolve, reject) => {
  
          let today = new Date();
          let end = moment(today).format("YYYY/MM/DD");
          // let start = moment(end).format("YYYY/MM/DD");
          let orderSuccess = await db
            .get()
            .collection(collection.BOOKING_COLLECTION)
            .find({ date: {$lte: end }, status: { $nin: ["canceled", "pending"] } })
            .toArray();
          let orderPending = await db
            .get()
            .collection(collection.BOOKING_COLLECTION)
            .find({ date: {$lte: end }, status: "pending" })
            .toArray();
          let orderCancel = await db
            .get()
            .collection(collection.BOOKING_COLLECTION)
            .find({ date: {$lte: end }, status: "canceled" })
            .toArray();
          let allUser = await db
            .get()
            .collection(collection.USER_COLLECTION)
            .find()
            .toArray();
          let products = await db
            .get()
            .collection(collection.PACKAGE_COLLECTION)
            .find()
            .toArray();
          let orderTotal = await db
            .get()
            .collection(collection.BOOKING_COLLECTION)
            .find({ date: {$lte: end } })
            .toArray();
          let orderSuccessLength = orderSuccess.length
          let orderPendingLength = orderPending.length;
          let orderCancelLength = orderCancel.length;
          let allUserLength = allUser.length;
          let productsLength = products.length;
    
          let orderTotalLength = orderTotal.length;
          let orderFailLength = orderTotalLength - orderSuccessLength;
          let total = 0;
          let paypal = 0;
          let razorpay = 0;
          let COD = 0;
          for (let i = 0; i < orderSuccessLength; i++) {
            total = total + parseInt(orderSuccess[i].totalAmount);
            if (orderSuccess[i].paymentMethod == "PAYPAL") {
              paypal++;
            } else if (orderSuccess[i].paymentMethod == "RAZORPAY") {
              razorpay++;
            } else {
              COD++;
            }
          }
          var data = {
            end: end,
            totalOrders: orderTotalLength,
            successOrders: orderSuccessLength,
            pendingOrder: orderPendingLength,
            cancelOrder: orderCancelLength,
            totalUser: allUserLength,
            totalProducts: productsLength,
            faildOrders: orderFailLength,
            totalSales: total,
            cod: COD,
            paypal: paypal,
            razorpay: razorpay
            //    currentOrders: orderSuccess
          };
          resolve(data);
      });
    }catch(err){
      console.log(err)
    }
  },


  //get all reviews for dashboard
  allReviews:()=>{
    return new Promise(async(resolve,reject)=>{
      try{

        let reviews = await db.get().collection(collection.REVIEW_COLLECTION).find().sort({_id:-1}).toArray()
        resolve(reviews)
      }catch(err){
        reject(err)
        console.log(err)
      }
    })
  },


  //get recent bookings
  recentBookings:()=>{
    return new Promise(async(resolve,reject)=>{
      try{

        let recent = await db.get().collection(collection.BOOKING_COLLECTION).find({}).limit(5).sort({_id:-1}).toArray()
        resolve(recent)
      }catch(err){
        reject(err)
        console.log(err)
      }
    })
  },


  //getting details for sales report
  salesreport: (details) => {
    return new Promise(async (resolve, reject) => {
      // let today=new Date()
      let end = moment(details.EndDate).format("YYYY/MM/DD");
      let start = moment(details.StartDate).format("YYYY/MM/DD");
      let allBookings = await db.get().collection(collection.BOOKING_COLLECTION).find({ date: { $gte: start, $lte: end }, status: "placed" }).toArray()
      let orderSuccess = await db
        .get()
        .collection(collection.BOOKING_COLLECTION)
        .find({ date: { $gte: start, $lte: end }, status: "placed" })
        .toArray();
      let orderPending = await db
        .get()
        .collection(collection.BOOKING_COLLECTION)
        .find({ date: { $gte: start, $lte: end }, status: "pending" })
        .toArray();
      let orderCancel = await db
        .get()
        .collection(collection.BOOKING_COLLECTION)
        .find({ date: { $gte: start, $lte: end }, status: "cancelled" })
        .toArray();
      let allUser = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .find()
        .toArray();
      let packages = await db
        .get()
        .collection(collection.PACKAGE_COLLECTION)
        .find()
        .toArray();
      let orderTotal = await db
        .get()
        .collection(collection.BOOKING_COLLECTION)
        .find({ date: { $gte: start, $lte: end } })
        .toArray();
      let orderSuccessLength = orderSuccess.length;
      let orderPendingLength = orderPending.length;
      let orderCancelLength = orderCancel.length;
      let allUserLength = allUser.length;
      let productsLength = packages.length;

      let orderTotalLength = orderTotal.length;
      let orderFailLength = orderTotalLength - orderSuccessLength;
      let total = 0;
      let paypal = 0;
      let razorpay = 0;
      let COD = 0;
      for (let i = 0; i < orderSuccessLength; i++) {
        total = total + parseInt(orderSuccess[i].totalAmount);
        if (orderSuccess[i].paymentMethod == "PAYPAL") {
          paypal++;
        } else if (orderSuccess[i].paymentMethod == "RAZORPAY") {
          razorpay++;
        } else {
          COD++;
        }
      }
      var data = {
        start: start,
        end: end,

        totalOrders: orderTotalLength,
        successOrders: orderSuccessLength,
        pendingOrder: orderPendingLength,
        cancelOrder: orderCancelLength,
        totalUser: allUserLength,
        totalProducts: productsLength,

        faildOrders: orderFailLength,
        totalSales: total,
        cod: COD,
        paypal: paypal,
        razorpay: razorpay,
        allBookings :allBookings
        //    currentOrders: orderSuccess
      };
      resolve(data);
    });
  },


  //get all packages for user views
  getAllPackage: () => {
    return new Promise((resolve, reject) => {
      let package = db
        .get()
        .collection(collection.PACKAGE_COLLECTION)
        .find()
        .toArray();
      resolve(package);
    });
  },


  //add offers for a package
  addPackageOffer: (data) => {
    return new Promise(async (resolve, reject) => {
      data.startDate = moment(data.startDate).format("YYYY/MM/DD");
      data.endDate = moment(data.endDate).format("YYYY/MM/DD");
      let response = {};
      let exist = await db
        .get()
        .collection(collection.PACKAGE_COLLECTION)
        .findOne({ Name: data.package, offer: { $exists: true } });
      if (exist) {
        response.exist = true;
        resolve(response);
      } else {
        db.get()
          .collection(collection.OFFERS_COLLECTION)
          .insertOne(data)
          .then((response) => {
            resolve(response);
          })
          .catch((err) => {
            rej(err);
          });
      }
    });
  },


  //view all package offers -admin side
  getAllPackageOffers: () => {
    return new Promise((res, rej) => {
      let productoff = db
        .get()
        .collection(collection.OFFERS_COLLECTION)
        .find()
        .toArray();
      res(productoff);
    });
  },


  //delete package offer
  deletePackageOffer: (Id) => {
    return new Promise(async (resolve, reject) => {
      let productoff = await db
        .get()
        .collection(collection.OFFERS_COLLECTION)
        .findOne({ _id: objectId(Id) });
      let proname = productoff.package;
      let Package = await db
        .get()
        .collection(collection.PACKAGE_COLLECTION)
        .findOne({ Name: proname });
      db.get()
        .collection(collection.OFFERS_COLLECTION)
        .deleteOne({ _id: objectId(Id) });
      db.get()
        .collection(collection.PACKAGE_COLLECTION)
        .updateOne(
          { Name: proname },
            {
              $set:{
                Price : Package?.actualPrice
              },
              $unset: {
                actualPrice: "",
                offer: "",
                percentage: "",
                offerExpired:""
              },
            }  
    
        )
        .then(() => {
          resolve();
        })
    });
  },


  //start package offer if startdate is equal to current date
  startPackageOffer: (todayDate) => {
    let proStartDate = moment(todayDate).format("YYYY/MM/DD");
    return new Promise(async (res, rej) => {
      let data = await db
        .get()
        .collection(collection.OFFERS_COLLECTION)
        .find({ startDate: { $lte: proStartDate } })
        .toArray();
      if (data) {
        await data.map(async (onedata) => {
          let package = await db
            .get()
            .collection(collection.PACKAGE_COLLECTION)
            .findOne({ Name: onedata.package, offer: { $exists: false },offerExpired:{$exists:false} });
          if (package) {
            let actualPrice = package.Price;
            let newP = (package.Price * onedata.percentage) / 100;
            let newPrice = actualPrice - newP;

            newPrice = newPrice.toFixed();
            db.get()
              .collection(collection.PACKAGE_COLLECTION)
              .updateOne(
                { _id: objectId(package._id) },
                {
                  $set: {
                    actualPrice: actualPrice,
                    Price: newPrice,
                    offer: true,
                    percentage: onedata.percentage,
                  },
                }
              );
            res();
          } else {
            res();
          }
        });
      } else {
        res();
      }
    });
  },


  //end package offer if end date is less than current date
  endPackageOffer: (todayDate) => {
    let proendDate = moment(todayDate).format("YYYY/MM/DD");
    return new Promise(async (res, rej) => {
      let data = await db
        .get()
        .collection(collection.OFFERS_COLLECTION)
        .find({ endDate: { $lt: proendDate } })
        .toArray();
      if (data) {
        await data.map(async (onedata) => {
          let package = await db
            .get()
            .collection(collection.PACKAGE_COLLECTION)
            .findOne({ Name: onedata.package, offer: { $exists: true } });
          if (package) {
            // let actualPrice = package.Price;
            // let newP = (package.Price * onedata.percentage) / 100;
            // let newPrice = actualPrice - newP;

            // newPrice = newPrice.toFixed();
            db.get()
              .collection(collection.PACKAGE_COLLECTION)
              .updateOne(
                { _id: objectId(package._id) },
                {
                  $set: {
                    Price: package?.actualPrice,
                    offerExpired :true
                    
                  },
                  $unset:{
                    offer: "",
                    percentage: "",
                  }
                }
              );
            res();
          } else {
            res();
          }
        });
      } else {
        res();
      }
    });
  },


  //view all coupons
  getAllcoupons: (userId) => {
    return new Promise(async(resolve, reject) => {
      let coupons = await db.get().collection(collection.COUPONS_COLLECTION).find().toArray()
      resolve(coupons)
    })
  },


  //add coupon-admin side
  addCoupon:(couponData)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.USER_COLLECTION).update({},
        
        {
          $push:{
            coupons:couponData
          }
        }).then(()=>{
          resolve()
        })
      db.get().collection(collection.COUPONS_COLLECTION).insertOne(couponData).then(()=>{
        resolve()
      })
    })
  },


  //remove coupon -admin side
  removeCoupon:(couponId)=>{
    return new Promise((resolve,reject)=>{
      try{

        db.get().collection(collection.COUPONS_COLLECTION).remove({_id:objectId(couponId)}).then(()=>{
          resolve({couponDeleted:true})
        })
        db.get().collection(collection.USER_COLLECTION).updateMany({},
          
          {
            $pull:{'coupons':{'_id':objectId(couponId)}}
          }).then(()=>{
            resolve()
          })
      }catch(err){
        reject(err)
      }
      
    })

  },


  //adding reviews to database
  addReview:(reviewData)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.REVIEW_COLLECTION).insertOne(reviewData).then((reviewData)=>{
        resolve(reviewData)
      })
    })
  },


  //view all reviews
  getReviews:(packageName)=>{
    return new Promise(async(resolve,reject)=>{
      let reviews = await db.get().collection(collection.REVIEW_COLLECTION).find({packageId:packageName}).sort({_id:-1}).toArray()
      resolve(reviews)
    })
  },


  //view all banners
  viewAllBanners:()=>{
    return new Promise(async(resolve,reject)=>{
      let banners = await db.get().collection(collection.BANNER_COLLECTION).find().toArray()
      resolve(banners)
    })
  },


  //add banners-admin side
  addBanners:(BannerDetails)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.BANNER_COLLECTION).insertOne(BannerDetails).then((BannerDetails)=>{
        resolve(BannerDetails) 
      })
    })
  },


  //disable an added banner
  disableBanner:(bannerId)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.BANNER_COLLECTION).updateOne({_id:objectId(bannerId)},
      {
        $set:{
          status:false
        }
      }
      ).then((response)=>{
        resolve({disableBanner:true})
      })
    })
  },

  
  //activate a disabled banner
  activateBanner:(bannerId)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.BANNER_COLLECTION).updateOne({_id:objectId(bannerId)},
      {
        $set:{
          status:true
        }
      }
      ).then((response)=>{
        resolve({activateBanner:true})
      })
    })
  },

  //delete a banner -admin side
  deleteBanner:(bannerId)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.BANNER_COLLECTION).remove({_id:objectId(bannerId)}).then((response)=>{
        resolve({bannerDeleted:true})
      })
    })
  }
};
