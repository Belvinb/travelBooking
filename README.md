# Let's Go - Travel Booking website <br/>
Let's go allow users to choose and book their favorite travel package online.<br/>

## Table of contents
* [Technologies used](#technologies-used)
* [Features](#features)
* [Setup](#setup)
* [Screenshots](#screenshots)
## Technologies used<br/>
* Node.js
* Express.js
* MongoDB
* Hanlerbars
* AWS
* EC2
* Nginx
* Figma
* Bootstrap

## Features
### Admin<br/>
#### 1.Packages<br/>
* admin can create,edit and delete packages.admin can also create itenararies and travel summary with the help of an integrated text editor.
* Packages goes into auto expiry after the expiry date,which can be renewed by the admin.
#### 2.Users<br/>
* admin can view all registered users and they can be blocked or removed by the admin
#### 3. Bookings<br/>
* admin can view all the bookings made and change the booking status accordingly.
#### 4. Offers and coupons<br/>
* admin can create offers for different packages and add coupons to users profile.
* offers and coupons are automatically added and removed based on a start and end date.
#### 5. Categories and banners<br/>
* admin can create categories to easily filter packages.
* admin also has the option to update the main banner and banner contents.
#### 6. Dashboard and report<br/>
* dashboard provides details regarding:
    1. number of users
    2. number of packages
    3. total revenue
    4. pie chart displaying the number of payments received through paypal and razorpay
    5. customer ratings and reviews
    6. recent bookings
* report can be generated for the payments received after filtering by dates.The generated report can be then exported into PDF,CSV or other formats..
===============================================================================================================
### User<br/>
1. users can view different packages sorted into categories
2. users have the option search for favorite package or destination and add them into favorites
3. Detailed information about a package can be accessed after clicking on it, the details include:
   * multiple zoomable images of the location
   * detailed itinerary and package summary
   * price and related details
4. Prices are calculated seperately for adults and children.
5. Option to dynamically add traveller details according to the number of travellers.
6. Coupons can be applied if available
7. Payments can be made either with razorpay or paypal
8. Once after sucessfully making the payment,user can view bookings they have made.
9. User can add reviews and star ratings for a package. They can also add images along with the review.
10. User have the option to manage his profile and perform actions like
    * edit personal information
    * change password
    * change profile image
    * add or delete address, user can also an address as default
11. User login using OTP

## Setup
```
$ cd travelBooking
$ npm install
$ npm start
```

## Screenshots

### User

#### Home page
![Home](https://res.cloudinary.com/doxthu5pb/image/upload/v1666019897/Lets%20go/Screenshot_from_2022-10-17_20-33-33_flvzxv.png)
![Home2](https://res.cloudinary.com/doxthu5pb/image/upload/v1666019922/Lets%20go/Screenshot_from_2022-10-17_20-33-54_jydwjp.png)
#### Login
![Login](https://res.cloudinary.com/doxthu5pb/image/upload/v1666019883/Lets%20go/Screenshot_from_2022-10-17_20-34-34_pckodr.png)

#### Signup

![signup](https://res.cloudinary.com/doxthu5pb/image/upload/v1666019893/Lets%20go/Screenshot_from_2022-10-17_20-35-05_icdbtk.png)

#### OTP Login
![otp-login](https://res.cloudinary.com/doxthu5pb/image/upload/v1666019883/Lets%20go/Screenshot_from_2022-10-17_20-34-40_yltarf.png)

#### Profile
![profile](https://res.cloudinary.com/doxthu5pb/image/upload/v1666019884/Lets%20go/Screenshot_from_2022-10-17_20-37-19_ju6xqf.png)

#### Bookings
![Bookings](https://res.cloudinary.com/doxthu5pb/image/upload/v1666019894/Lets%20go/Screenshot_from_2022-10-17_20-37-43_accoww.png)

#### Favorites
![Favorites](https://res.cloudinary.com/doxthu5pb/image/upload/v1666019923/Lets%20go/Screenshot_from_2022-10-17_20-37-52_jjmutt.png)
#### Package Details
![view package details](https://res.cloudinary.com/doxthu5pb/image/upload/v1666019925/Lets%20go/Screenshot_from_2022-10-17_20-38-08_xufswz.png)
* Itinerary
![itinerary](https://res.cloudinary.com/doxthu5pb/image/upload/v1666019916/Lets%20go/Screenshot_from_2022-10-17_20-38-15_x7poir.png)
* Reviews
![reviews](https://res.cloudinary.com/doxthu5pb/image/upload/v1666019922/Lets%20go/Screenshot_from_2022-10-17_20-38-27_xxvf0r.png)
![reviews2](https://res.cloudinary.com/doxthu5pb/image/upload/v1666019940/Lets%20go/Screenshot_from_2022-10-17_20-38-46_z1ixyp.png)

#### Checkout page
![payment](https://res.cloudinary.com/doxthu5pb/image/upload/v1666019938/Lets%20go/Screenshot_from_2022-10-17_20-40-13_j51bsd.png)

### Admin
#### Dashboard
![Dashboard](https://res.cloudinary.com/doxthu5pb/image/upload/v1666019927/Lets%20go/Screenshot_from_2022-10-17_20-41-23_wkfalk.png)
![Dashboard2](https://res.cloudinary.com/doxthu5pb/image/upload/v1666019939/Lets%20go/Screenshot_from_2022-10-17_20-41-37_n2mg7p.png)

#### Package Management
![Package management](https://res.cloudinary.com/doxthu5pb/image/upload/v1666020034/Lets%20go/Screenshot_from_2022-10-17_20-42-24_ylyeai.png)
![pm 2](https://res.cloudinary.com/doxthu5pb/image/upload/v1666019943/Lets%20go/Screenshot_from_2022-10-17_20-43-12_mphxva.png)
![pm3](https://res.cloudinary.com/doxthu5pb/image/upload/v1666019942/Lets%20go/Screenshot_from_2022-10-17_20-43-20_lf3ohm.png)

#### Expired Packages
![expired packages](https://res.cloudinary.com/doxthu5pb/image/upload/v1666019942/Lets%20go/Screenshot_from_2022-10-17_20-42-34_jgow8i.png)

#### Banner Management
![Banners](https://res.cloudinary.com/doxthu5pb/image/upload/v1666020042/Lets%20go/Screenshot_from_2022-10-17_20-44-13_olyqav.png)

#### User Management
![Users](https://res.cloudinary.com/doxthu5pb/image/upload/v1666019942/Lets%20go/Screenshot_from_2022-10-17_20-41-45_q9fkpz.png)

#### Category Management
![Categories](https://res.cloudinary.com/doxthu5pb/image/upload/v1666020046/Lets%20go/Screenshot_from_2022-10-17_20-44-22_npslk3.png)

#### Coupons
![Coupons](https://res.cloudinary.com/doxthu5pb/image/upload/v1666020036/Lets%20go/Screenshot_from_2022-10-17_20-45-03_x2weae.png)

#### Package Offers
![offers](https://res.cloudinary.com/doxthu5pb/image/upload/v1666020035/Lets%20go/Screenshot_from_2022-10-17_20-44-49_lgkav5.png)
#### All Bookings
![all bookings](https://res.cloudinary.com/doxthu5pb/image/upload/v1666020035/Lets%20go/Screenshot_from_2022-10-17_20-44-32_vj6mmp.png)

#### Reports
![report1](https://res.cloudinary.com/doxthu5pb/image/upload/v1666020036/Lets%20go/Screenshot_from_2022-10-17_20-45-53_v4yukw.png)
![report2](https://res.cloudinary.com/doxthu5pb/image/upload/v1666020037/Lets%20go/Screenshot_from_2022-10-17_20-46-00_th2kbx.png)




