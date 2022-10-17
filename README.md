# Let's Go - Travel Booking website <br/>
Let's go allow users to choose and book their favorite travel package.<br/>
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




