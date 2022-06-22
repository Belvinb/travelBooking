

(function ($) {
  'use strict';

  //  Count Up
  function counter() {
    var oTop;
    if ($('.counter').length !== 0) {
      oTop = $('.counter').offset().top - window.innerHeight;
    }
    if ($(window).scrollTop() > oTop) {
      $('.counter').each(function () {
        var $this = $(this),
          countTo = $this.attr('data-count');
        $({
          countNum: $this.text()
        }).animate({
          countNum: countTo
        }, {
          duration: 1000,
          easing: 'swing',
          step: function () {
            $this.text(Math.floor(this.countNum));
          },
          complete: function () {
            $this.text(this.countNum);
          }
        });
      });
    }
  }
  $(window).on('scroll', function () {
    counter();
  });

  // bottom to top
  $('#top').click(function () {
    $('html, body').animate({
      scrollTop: 0
    }, 'slow');
    return false;
  });
  // bottom to top

  $(document).on('ready', function () {

    // Nice Select
    $('select').niceSelect();
    // -----------------------------
    //  Client Slider
    // -----------------------------
    $('.category-slider').slick({
      slidesToShow: 8,
      infinite: true,
      arrows: false,
      autoplay: false,
      autoplaySpeed: 2000
    });
    // -----------------------------
    //  Select Box
    // -----------------------------
    // $('.select-box').selectbox();
    // -----------------------------
    //  Video Replace
    // -----------------------------
    $('.video-box img').click(function () {
      var video = '<iframe allowfullscreen src="' + $(this).attr('data-video') + '"></iframe>';
      $(this).replaceWith(video);
    });
    // -----------------------------
    //  Coupon type Active switch
    // -----------------------------
    $('.coupon-types li').click(function () {
      $('.coupon-types li').not(this).removeClass('active');
      $(this).addClass('active');
    });
    // -----------------------------
    // Datepicker Init
    // -----------------------------
    $('.input-group.date').datepicker({
      format: 'dd/mm/yy'
    });
    // -----------------------------
    // Datepicker Init
    // -----------------------------

    // -----------------------------
    // Button Active Toggle
    // -----------------------------
    $('.btn-group > .btn').click(function () {
      $(this).find('i').toggleClass('btn-active');
    });
    // -----------------------------
    // Coupon Type Select
    // -----------------------------
    $('#online-code').click(function () {
      $('.code-input').fadeIn(500);
    });
    $('#store-coupon, #online-sale').click(function () {
      $('.code-input').fadeOut(500);
    });
    /***ON-LOAD***/
    jQuery(window).on('load', function () {

    });

  });

  // niceSelect

  $('select:not(.ignore)').niceSelect();

  // blog post-slider
  $('.post-slider').slick({
    dots: false,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    fade: true
  });

  // Client Slider 
  $('.category-slider').slick({
    dots: false,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    nextArrow: '<i class="fa fa-chevron-right arrow-right"></i>',
    prevArrow: '<i class="fa fa-chevron-left arrow-left"></i>',
    responsive: [{
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
        infinite: true,
        dots: false
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false
      }
    }
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ]
  });

  // trending-ads-slide 

  $('.trending-ads-slide').slick({
    dots: true,
    arrows: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [{
      breakpoint: 1024,
      
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
        dots: false,
        unslick:true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ]
  });


  // product-slider
  $('.product-slider').slick({
    dots: true,
    arrows: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: false,
    nextArrow: '<i class="fa fa-chevron-right arrow-right"></i>',
    prevArrow: '<i class="fa fa-chevron-left arrow-left"></i>',
    // customPaging: function (slider, i) {
    //   var image = $(slider.$slides[i]).data('image');
    //   return '<img class="img-fluid" src="' + image + '" >';
    // }
  });



  // tooltip
  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });

  // bootstrap slider range
  $('.range-track').slider({});
  $('.range-track').on('slide', function (slideEvt) {
    $('.value').text('$' + slideEvt.value[0] + ' - ' + '$' + slideEvt.value[1]);
  });


})(jQuery);

function scrollfunction() {
  window.addEventListener('scroll', function () {
    let navcolor =
      document.querySelector('.nav-fixed');
    navcolor.classList.toggle('scrolling-active', window.scrollY > 0)
  })
}

/*!     
        jquery.picZoomer.js
        v 1.0
        David
        http://www.CodingSerf.com' 
*/

//放大镜控件
; (function ($) {
  $.fn.picZoomer = function (options) {
    var opts = $.extend({}, $.fn.picZoomer.defaults, options),
      $this = this,
      $picBD = $('<div class="picZoomer-pic-wp"></div>').css({ 'width': opts.picWidth + 'px', 'height': opts.picHeight + 'px' }).appendTo($this),
      $pic = $this.children('img').addClass('picZoomer-pic').appendTo($picBD),
      $cursor = $('<div class="picZoomer-cursor"><i class="f-is picZoomCursor-ico"></i></div>').appendTo($picBD),
      cursorSizeHalf = { w: $cursor.width() / 2, h: $cursor.height() / 2 },
      $zoomWP = $('<div class="picZoomer-zoom-wp"><img src="" alt="" class="picZoomer-zoom-pic"></div>').appendTo($this),
      $zoomPic = $zoomWP.find('.picZoomer-zoom-pic'),
      picBDOffset = { x: $picBD.offset().left, y: $picBD.offset().top };


    opts.zoomWidth = opts.zoomWidth || opts.picWidth;
    opts.zoomHeight = opts.zoomHeight || opts.picHeight;
    var zoomWPSizeHalf = { w: opts.zoomWidth / 2, h: opts.zoomHeight / 2 };

    //初始化zoom容器大小
    $zoomWP.css({ 'width': opts.zoomWidth + 'px', 'height': opts.zoomHeight + 'px' });
    $zoomWP.css(opts.zoomerPosition || { top: 0, left: opts.picWidth + 30 + 'px' });
    //初始化zoom图片大小
    $zoomPic.css({ 'width': opts.picWidth * opts.scale + 'px', 'height': opts.picHeight * opts.scale + 'px' });

    //初始化事件
    $picBD.on('mouseenter', function (event) {
      $cursor.show();
      $zoomWP.show();
      $zoomPic.attr('src', $pic.attr('src'))
    }).on('mouseleave', function (event) {
      $cursor.hide();
      $zoomWP.hide();
    }).on('mousemove', function (event) {
      var x = event.pageX - picBDOffset.x,
        y = event.pageY - picBDOffset.y;

      $cursor.css({ 'left': x - cursorSizeHalf.w + 'px', 'top': y - cursorSizeHalf.h + 'px' });
      $zoomPic.css({ 'left': -(x * opts.scale - zoomWPSizeHalf.w) + 'px', 'top': -(y * opts.scale - zoomWPSizeHalf.h) + 'px' });

    });
    return $this;

  };
  $.fn.picZoomer.defaults = {
    picHeight: 460,
    scale: 2.5,
    zoomerPosition: { top: '0', left: '380px' },

    zoomWidth: 400,
    zoomHeight: 460
  };
})(jQuery);



$(document).ready(function () {
  $('.picZoomer').picZoomer();
  $('.piclist li').on('click', function (event) {
    var $pic = $(this).find('img');
    $('.picZoomer-pic').attr('src', $pic.attr('src'));
  });

  var owl = $('#recent_post');
  owl.owlCarousel({
    margin: 20,
    dots: false,
    nav: true,
    navText: [
      "<i class='fa fa-chevron-left'></i>",
      "<i class='fa fa-chevron-right'></i>"
    ],
    autoplay: true,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 2
      },
      600: {
        items: 3
      },
      1000: {
        items: 5
      },
      1200: {
        items: 4
      }
    }
  });

  $('.decrease_').click(function () {
    decreaseValue(this);
  });
  $('.increase_').click(function () {
    increaseValue(this);
  });
  function increaseValue(_this) {
    var value = parseInt($(_this).siblings('input#number').val(), 10);
    value = isNaN(value) ? 0 : value;
    value++;
    $(_this).siblings('input#number').val(value);
  }

  function decreaseValue(_this) {
    var value = parseInt($(_this).siblings('input#number').val(), 10);
    value = isNaN(value) ? 0 : value;
    value < 1 ? value = 1 : '';
    value--;
    $(_this).siblings('input#number').val(value);
  }
});
function addToFavs(packageId) {
  $.ajax({
    url: '/add-to-favorites/' + packageId,
    method: 'get',
    success: (response) => {
      if (response.added) {
        swal.fire("removed from favorites")
        let count = $('#fav-count').html()
        count = parseInt(count) + 1
        $('#fav-count').html(count)
      }else if (response.removed){
        swal.fire("added to favorites")
      }
    }
  })
}


var options = {
  width: 670,
  zoomWidth: 530,
  offset: { vertical: 0, horizontal: 12 },


};
new ImageZoom(document.getElementById("img-container"), options);

function increment() {

  var value = parseInt(document.getElementById('a').value, 10);
  value = isNaN(value) ? 0 : value;
  value++;


  document.getElementById('number').value = value;
}
function decrement() {
  var value = parseInt(document.getElementById('a').value, 10);
  if (value > 1) {

    value = isNaN(value) ? 0 : value;
    value--;
    document.getElementById('number').value = value;
  }
}
//address reveal
$(".Click-here").on('click', function () {
  $(".custom-model-main").addClass('model-open');
});
$(".close-btn, .bg-overlay").click(function () {
  $(".custom-model-main").removeClass('model-open');
});

//choose address
function autoFill(name, house, post, town, district, state, pin) {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  Toast.fire({
    icon: 'success',
    title: 'Address selected'
  })

  document.getElementById('name').value = name
  document.getElementById('house').value = house
  document.getElementById('post').value = post
  document.getElementById('town').value = town
  document.getElementById('district').value = district
  document.getElementById('state').value = state
  document.getElementById('pin').value = pin


};

function removeBooking(orderId, userId, total, paymentMethod, status) {
  console.log("calleddd");
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Cancel it!'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: '/cancel-booking',
        data: {
          orderId: orderId,
          userId: userId,
          total: total,
          paymentMethod: paymentMethod,
          status: status
        },
        method: 'post',
        success: (response) => {
          if (response.cancelBooking) {
            swal.fire('Booking cancelled')
            location.reload()
          }
        }
      })
    };
  }
  )
}

function viewBookedDetails(bookingId,packageId,userId){
  $.ajax({
    url:'bookedPkgDetails'+packageId,
    data:{
      bookingId:bookingId,
      userId:userId
    },
    method:'get'
  })


}

function removePackage(packageId) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: '/admin/delete-package/' + packageId,
        data: {
          packageId: packageId
        },
        method: 'get',
        success: (response) => {
          if (response.removePackage) {
            let alert2 = swal.fire('Package Deleted')
            if (alert2) {
              location.reload()
            }
          }

        }

      })

    }
  })
}

function removeUser(userId){
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url:'/admin/delete-user/'+userId,
        data:{
          userId:userId
        },
        method:'get',
        success:(response)=>{
          if(response.userRemoved){
            swal.fire('User Removed')
            location.reload()
          }
        }
      })
    }
  })
}

function hideCategory(categoryId){
  Swal.fire({
    title: 'Are you sure ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Hide !'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url:'/admin/hidecategory/'+categoryId,
        data:{
          categoryId:categoryId
        },
        method:'get',
        success:(response)=>{
          if(response.categoryHide){
            swal.fire('Category is Hidden')
            location.reload()
          }
        }
      })
    }
  })
}

function showCategory(categoryId){
  Swal.fire({
    title: 'Are you sure ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Make visible !'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url:'/admin/showcategory/'+categoryId,
        data:{
          categoryId:categoryId
        },
        method:'get',
        success:(response)=>{
          if(response.categoryShow){
            swal.fire('Category is now visible')
            location.reload()
          }
        }
      })
    }
  })
}

function deleteCategory(categoryId){
  Swal.fire({
    title: 'Are you sure ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Delete  !'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url:'/admin/delete-category/'+categoryId,
        data:{
          categoryId:categoryId
        },
        method:'get',
        success:(response)=>{
          if(response.categoryDelete){
            swal.fire('Category Deleted')
            location.reload()
          }
        }
      })
    }
  })
}

function disbleBanner(bannerId){
  Swal.fire({
    title: 'Are you sure ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Disable Banner  !'
  }).then((result)=>{
    if(result.isConfirmed){
      $.ajax({
        url:'/admin/disableBanner/'+bannerId,
        data:{
          bannerId: bannerId
        },
        method:'get',
        success:(response)=>{
          if(response.disableBanner){
            swal.fire("Banner Disabled")
            location.reload()
          }
        }
      })
    }

  })
}

function activateBanner(bannerId){
  Swal.fire({
    title: 'Are you sure ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Activate Banner  !'
  }).then((result)=>{
    if(result.isConfirmed){
      $.ajax({
        url:'/admin/activateBanner/'+bannerId,
        data:{
          bannerId:bannerId
        },
        method:'get',
        success:(response)=>{
          if(response.activateBanner){
            swal.fire("Banner activated")
            location.reload()
          }
        }
      })
    }
  })
}

function removeBanner(bannerId){
  Swal.fire({
    title: 'Are you sure ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Delete this Banner!'
  }).then((result)=>{
    if(result.isConfirmed){
      $.ajax({
        url:'/admin/removeBanner/'+bannerId,
        data:{
          bannerId:bannerId
        },
        method:'delete',
        success:(response)=>{
          if(response.bannerDeleted){
            swal.fire("Banner deleted Successfully")
            location.reload()

          }
        }

      })
    }
  })
}

function deleteCoupon(couponId){
  Swal.fire({
    title: 'Are you sure ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Delete this Coupon!'
  }).then((result)=>{
    if(result.isConfirmed){
      $.ajax({
        url:'/admin/removeCoupon/'+couponId,
        data:{
          couponId:couponId
        },
        method:'post',
        success:(response)=>{
          if(response.couponDeleted){
            swal.fire("Coupon deleted Successfully")
            location.reload()

          }
        }

      })
    }
  })

}




// /* When the user clicks on the button,
// toggle between hiding and showing the dropdown content */
// function myFunction() {
//   document.getElementById("myDropdown").classList.toggle("show");
// }

// // Close the dropdown menu if the user clicks outside of it
// window.onclick = function(event) {
//   if (!event.target.matches('.dropbtn')) {
//     var dropdowns = document.getElementsByClassName("dropdown-content");
//     var i;
//     for (i = 0; i < dropdowns.length; i++) {
//       var openDropdown = dropdowns[i];
//       if (openDropdown.classList.contains('show')) {
//         openDropdown.classList.remove('show');
//       }
//     }
//   }
// }

//countdown for otp resend

let timerOn = true;
function timer(remaining) {
  var m = Math.floor(remaining / 60);
  var s = remaining % 60;
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;
  document.getElementById("countdown").innerHTML = `Time left: ${m} : ${s}`;
  remaining -= 1;
  if (remaining >= 0 && timerOn) {
    setTimeout(function () {
      timer(remaining);
    }, 1000);
    document.getElementById("resend").innerHTML = `
    `;
    return;
  }
  if (!timerOn) {
    return;
  }
  document.getElementById("resend").innerHTML = "Resend the code ! ";
  //     <span class="font-weight-bold text-color cursor" onclick="timer(60)">Resend
  //     </span>;
  // }
}
timer(30);


//price calcultation for adults and kids
function adultValue(){
  let adultCount = document.getElementById("Adults").value
  let kidCount = document.getElementById("Kids").value
  let packagePrice = document.getElementById("packagePrice").innerHTML
  let adultTotal = parseInt(adultCount)*parseInt(packagePrice)
  let kidsPrice = parseInt(packagePrice) - parseInt((packagePrice*(20/100)))
  let kidTotal = parseInt(kidCount)*parseInt(kidsPrice)
  let totalPrice = adultTotal+kidTotal
  document.getElementById("totalPrice").innerHTML = totalPrice
}

function kidValue(){
  let adultCount = document.getElementById("Adults").value
  let kidCount = document.getElementById("Kids").value
  let packagePrice = document.getElementById("packagePrice").innerHTML
  let adultTotal = parseInt(adultCount)*parseInt(packagePrice)
  let kidsPrice = parseInt(packagePrice) - parseInt((packagePrice*(20/100)))
  let kidTotal = parseInt(kidCount)*parseInt(kidsPrice)
  let totalPrice = adultTotal+kidTotal
  document.getElementById("totalPrice").innerHTML = totalPrice
}



