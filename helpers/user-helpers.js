var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
const { FAVORITE_COLLECTION, PACKAGE_COLLECTION } = require('../config/collections')
const { response } = require('express')
var objectId = require('mongodb').ObjectId
const Razorpay = require('razorpay');
const { resolve } = require('path')
const moment = require("moment");
const { default: Swal } = require('sweetalert2')
const { truncate } = require('fs')
var instance = new Razorpay({
    key_id: 'rzp_test_oWdBPupObz1oBC',
    key_secret: 'yDWkWC8bEMABBmO5K4HoM76N',
});

module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ $or: [{ Email: userData.Email }, { Mobile: userData.Mobile }] })
            if (!user) {

                userData.Password = await bcrypt.hash(userData.Password, 10)
                userDetails = {
                    Name: userData.Name,
                    Email: userData.Email,
                    Mobile: `+91${userData.Mobile}`,
                    Password: userData.Password,
                    status: true
                }
                db.get().collection(collection.USER_COLLECTION).insertOne(userDetails).then((data) => {
                    resolve(data.insertedId)
                })
            } else {
                response.status = true
                resolve(response)
            }

        })
    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email })
            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if (status) {
                        console.log("login success");
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        console.log("login failed")
                        resolve({ status: false })
                    }

                })
            } else {
                console.log("Email not available");
                resolve({ status: false })
            }
        })
    },
    getAllUsers: () => {
        return new Promise(async (resolve, reject) => {
            let users = await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)
        })

    },
    deleteUser: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).remove({ _id: objectId(userId) }).then((response) => {
                resolve({ userRemoved: true });

            })
        })
    },
    addUser: (user, callback) => {
        db.get().collection('user').insertOne(user).then((data) => {
            callback(data.insertedId)

        })
    },
    getUserDetails: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(userId) }).then((user) => {
                resolve(user)
            })
        })
    },
    getUserNumber: (No) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Mobile: No })
            resolve(user)
        })
    },
    updateUser: (userId, userDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION)
                .updateOne({ _id: objectId(userId) }, {
                    $set: {
                        Name: userDetails.Name,
                        Email: userDetails.Email,
                    }
                }).then((response) => {
                    Swal.fire("DEtails updated")
                    resolve()
                })
        })
    },
    changePassword: (userId, data) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(userId) })
            if (user) {
                data1 = await bcrypt.hash(data.Password1, 10)
                bcrypt.compare(data.Current, user.Password).then((status) => {
                    if (status) {
                        response.status = true;
                        console.log("The passwords matched successfully");
                        db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectId(userId) },
                            {
                                $set: {
                                    Password: data1
                                }
                            }
                        ).then(() => {
                            resolve(response)
                        })
                    } else {
                        response.status = false;
                        resolve(response)
                        console.log("Current password is invalid");
                    }
                })
            }

        })

    },

    blockusers: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectId(userId) }, {
                $set: {
                    status: false
                }
            }).then((response) => {
                resolve(response)
            })
        })
    },
    unblockusers: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectId(userId) }, {
                $set: {
                    status: true
                }
            }).then((response) => {
                resolve(response)
            })
        })
    },
    updateUserInfo: (userId, userdetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectId(userId) },
                {
                    $set: {
                        Name: userdetails.Name,
                        Email: userdetails.Email,
                        Mobile: `+91${userdetails.Mobile}`
                    }
                }
            ).then((response) => {
                resolve(response)
            })
        })
    },
    addNewAddress: (userId, address) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(userId) })
            address._id = objectId()
            if (user.address) {
                db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectId(userId) }, {
                    $push: {
                        address: address
                    }
                }).then(() => {
                    resolve()
                })
            } else {
                addr = [address]
                db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectId(userId) }, {
                    $set: {
                        address: addr
                    }
                }).then((user) => {
                    resolve(user)
                })
            }
        })
    },
    getSingleAddress: (userId) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).find({ _id: objectId(userId) }).toArray()
            resolve(user)
        })


    },
    deleteAddress: (user, addressId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectId(user) },
                {
                    $pull: { address: { _id: objectId(addressId) } }
                }
            ).then((response) => {
                console.log(response);
                resolve(response)
            })
        })
    },

    makeDefault: (userId, addressId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectId(userId), "address._id": objectId(addressId) },
                {
                    $set: {
                        "address.$.Status": true
                    }
                }
            )
                .then((response) => {
                    resolve(response)
                })
        })
    },
    removeDefault: (userId, addressId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectId(userId), "address._id": objectId(addressId) },
                {
                    $set: {
                        "address.$.Status": false
                    }
                }
            ).then((response) => {
                resolve(response)
            })
        })
    },

    addToFavs: (packageId, userId) => {
        let packageObj = {
            item: objectId(packageId),
            quantity: 1,
            status: true

        }
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(userId) })
            if (user.favorites) {
                let packageExist = user.favorites.findIndex(favorite => favorite.item == packageId)
                if (packageExist != -1) {
                    db.get().collection(collection.USER_COLLECTION).updateOne({ 'favorites.item': objectId(packageId) },
                        {
                            $pull: {
                                favorites: packageObj
                            },

                        }
                    ).then((response) => {
                        resolve({added:true})
                    })
                } else {
                    db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectId(userId) },
                        {
                            $push: {
                                favorites: packageObj
                            },

                        }
                    ).then((response) => {
                        resolve({removed:true})
                        
                    })
                }
            }
            else {
                console.log(packageId)
                let favObj = {
                    favorites: packageObj
                }
                db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectId(userId) },
                    {
                        $push: { favorites: packageObj }
                    }
                ).then((fav) => {
                    resolve({added:true})
                })

            }
        })

    },
    getFavPackages: (userId) => {
        return new Promise(async (resolve, reject) => {
            let userfavs = await db.get().collection(collection.USER_COLLECTION).aggregate([
                {
                    $match: { _id: objectId(userId) }
                },
                {
                    $lookup: {
                        from: collection.PACKAGE_COLLECTION,
                        localField: 'favorites.item',
                        foreignField: '_id',
                        as: 'favs'
                    }
                },
            ]).toArray()
            resolve(userfavs)

        })
    },
    getFavCount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let count = 0
            let favorites = await db.get().collection(collection.USER_COLLECTION).findOne({ user: objectId(userId) })
            if (favorites) {
                count = favorites.size()
            }
            resolve(count)

        })
    },
    removeFav: (userId, favId) => {
        let favObj = {
            item: objectId(favId),
            quantity: 1
        }
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(userId) })
            if (user.favorites) {
                let packageExist = user.favorites.findIndex(favorite => favorite.item == favId)
                if (packageExist != -1) {
                    db.get().collection(collection.USER_COLLECTION).updateOne({ 'favorites.item': objectId(favId) },
                        {
                            $pull: {
                                favorites: favObj
                            },

                        }
                    ).then((response) => {
                        resolve()
                    })
                }
            }

        })


    },
    placeBooking: (order) => {
        console.log(order,'order test')
        return new Promise((resolve, reject) => {
            let status = order['payment-method'] === 'COD' ? 'placed' : 'pending'
            let dat = moment(new Date()).format('YYYY/MM/DD')
            
            let bookingObj = {
                address: {
                    name: order.name,
                    house: order.house,
                    post: order.post,
                    town: order.town,
                    district: order.district,
                    state: order.state,
                    pin: order.pin
                },
                userId: objectId(order.userId),
                paymentMethod: order['payment-method'],
                packageId: objectId(order.packageId),
                packageName : order.packageName,
                totalAmount: order.totalAmount,
                couponSelected : order.couponSelect,
                payableAmount : order.payable,
                couponName : order.couponName,
                persons: order.persons,
                status: status,
                travelDate: order.travelDate,
                date: dat
            }
            db.get().collection(collection.BOOKING_COLLECTION).insertOne(bookingObj).then((response) => {
                resolve(response.insertedId)
            })
        })

    },
    generateRazorpay: (orderId, data) => {
        return new Promise((resolve, reject) => {
            var options = {
                amount: (data.totalAmount) * 100,
                currency: "INR",
                receipt: "" + orderId,
            }
            instance.orders.create(options, function (err, order) {
                if (err) {
                    console.log(err);
                    reject(err)
                } else {
                    console.log("new order", order);
                    resolve(order)

                }
            })
        })
    },
    verifyPayment: (details) => {
        return new Promise((resolve, reject) => {
            const crypto = require('crypto')
            let hmac = crypto.createHmac('sha256', 'yDWkWC8bEMABBmO5K4HoM76N');
            hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]']);
            hmac = hmac.digest('hex')
            if (hmac == details['payment[razorpay_signature]']) {
                resolve(response)
            } else {
                reject(error)
            }

        })
    },

    changePaymentStatus: (orderId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.BOOKING_COLLECTION)
                .updateOne({ _id: objectId(orderId) },
                    {
                        $set: {
                            status: "placed",
                            booked: true
                        }
                    }
                ).then(() => {
                    resolve()
                }).catch(() => {
                    reject()
                })
        })
    },

    removeCouponcode:(orderId,userId)=>{
        return new Promise(async(resolve,reject)=>{
            let order = await db.get().collection(collection.BOOKING_COLLECTION).findOne({_id:objectId(orderId)})
            resolve(order)
            if(order){
                let couponName = order.couponName
                

                    db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(userId)},
                    {
                        $pull:{
                            'coupons': {'couponCode':couponName}
                        }
                    }
                    ).then(()=>{
                        resolve()
                    })
                

            }   
        })
    },

    getBookings: (userId) => {
        return new Promise(async (resolve, reject) => {
            let bookings = await db.get().collection(collection.BOOKING_COLLECTION).aggregate([
                {
                    $match: { userId: objectId(userId) }
                },
                {
                    $lookup: {
                        from: collection.PACKAGE_COLLECTION,
                        localField: 'packageId',
                        foreignField: '_id',
                        as: 'packageDetails'

                    }
                },
               
            ]).toArray()
            resolve(bookings)
        })
    },
    cancelBooking: (body) => {
        let orderId = body.orderId
        // let userId = body.userId
        return new Promise((resolve, reject) => {
            db.get().collection(collection.BOOKING_COLLECTION).updateOne({ _id: objectId(orderId) }, {
                $set: {
                    status: "cancelled",
                    cancel: true,
                    booked: true
                }
            }).then((response) => {
                console.log("cancelled");
                resolve({ cancelBooking: true })

            }).catch((response) => {

                resolve(error)
            })
        })
    },
    cancelRazor: (orderId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.BOOKING_COLLECTION).updateOne({ _id: objectId(orderId) },
                {
                    $set: {
                        status: "failed"
                    }
                }
            ).then(() => {
                resolve(response)
            })
        })

    },

    searchKey: (regex) => {
        return new Promise(async (resolve, reject) => {
            let searchResult = await db.get().collection(collection.PACKAGE_COLLECTION).find({ Name: regex }).toArray()
            resolve(searchResult)

        })
    }

}    