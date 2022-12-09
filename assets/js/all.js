"use strict";

document.addEventListener('DOMContentLoaded', function () {
  var ele = document.querySelector('.recommendation-wall');
  ele.style.cursor = 'grab';
  var pos = {
    top: 0,
    left: 0,
    x: 0,
    y: 0
  };

  var mouseDownHandler = function mouseDownHandler(e) {
    ele.style.cursor = 'grabbing';
    ele.style.userSelect = 'none';
    pos = {
      left: ele.scrollLeft,
      top: ele.scrollTop,
      // Get the current mouse position
      x: e.clientX,
      y: e.clientY
    };
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  var mouseMoveHandler = function mouseMoveHandler(e) {
    // How far the mouse has been moved
    var dx = e.clientX - pos.x;
    var dy = e.clientY - pos.y; // Scroll the element

    ele.scrollTop = pos.top - dy;
    ele.scrollLeft = pos.left - dx;
  };

  var mouseUpHandler = function mouseUpHandler() {
    ele.style.cursor = 'grab';
    ele.style.removeProperty('user-select');
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  }; // Attach the handler


  ele.addEventListener('mousedown', mouseDownHandler);
}); // menu 切換

var menuOpenBtn = document.querySelector('.menuToggle');
var linkBtn = document.querySelectorAll('.topBar-menu a');
var menu = document.querySelector('.topBar-menu');
menuOpenBtn.addEventListener('click', menuToggle);
linkBtn.forEach(function (item) {
  item.addEventListener('click', closeMenu);
});

function menuToggle() {
  if (menu.classList.contains('openMenu')) {
    menu.classList.remove('openMenu');
  } else {
    menu.classList.add('openMenu');
  }
}

function closeMenu() {
  menu.classList.remove('openMenu');
} //開始寫作業


var api_path = 'jslive2022';
var https = 'https://livejs-api.hexschool.io/api/livejs/v1/customer/'; //重構：初始化部分

function init() {
  getProductList();
}

;
init(); //重構：組字串函式

function addProductHTML(item) {
  return "\n  <li class=\"productCard\">\n    <h4 class=\"productType\">\u65B0\u54C1</h4>\n    <img src=\"".concat(item.images, "\" alt=\"\">\n    <a href=\"#\" class=\"addCardBtn\" data-id=\"").concat(item.id, "\">\u52A0\u5165\u8CFC\u7269\u8ECA</a>\n    <h3>").concat(item.title, "</h3>\n    <del class=\"originPrice\">NT$").concat(item.origin_price, "</del>\n    <p class=\"nowPrice\">NT$").concat(item.price, "</p>\n  </li>");
}

function addCartListHTML(item) {
  return "\n  <tr>\n    <td>\n      <div class=\"cardItem-title\">\n          <img src=\"".concat(item.product.images, "\" alt=\"\">\n          <p>").concat(item.product.title, "</p>\n      </div>\n    </td>\n    <td>NT$").concat(item.product.price, "</td>\n    <td>").concat(item.quantity, "</td>\n    <td>NT$").concat(item.product.price * item.quantity, "</td>\n    <td class=\"discardBtn\">\n      <a href=\"#\" class=\"material-icons\" data-id=\"").concat(item.id, "\">\n          clear\n      </a>\n    </td>\n  </tr>");
}

;
var productData = [];
var cartData = [];
var productList = document.querySelector('.productWrap');
var productSelect = document.querySelector('.productSelect');
var cartList = document.querySelector('.shoppingCart-tableBody'); //產品列表：接 API

function getProductList() {
  axios.get("".concat(https).concat(api_path, "/products")).then(function (res) {
    productData = res.data.products;
    renderProductList(productData);
  })["catch"](function (error) {
    console.log(error);
  });
}

; //產品列表：渲染

function renderProductList(productData) {
  var str = '';
  productData.forEach(function (item) {
    str += addProductHTML(item);
    productList.innerHTML = str;
  });
}

; //下拉選單：監聽

productSelect.addEventListener('change', function (e) {
  var category = e.target.value; //下拉選單：判斷篩選

  if (category == '全部') {
    renderProductList(productData);
    return;
  }

  var str = '';
  productData.forEach(function (item) {
    //篩選出相同的category
    if (item.category == category) {
      str += addProductHTML(item);
      productList.innerHTML = str;
    }
  });
}); //加入購物車：監聽按鈕

productList.addEventListener('click', function (e) {
  //取消預設
  e.preventDefault();
  var addCartClass = e.target.getAttribute('class'); //排除按鈕以外（按鈕一顆一顆綁監聽，會降低效能 => 監聽都寫在外層）

  if (addCartClass !== 'addCardBtn') {
    return;
  }

  ;
  var productId = e.target.getAttribute('data-id');
  var numCheck = 1;
  cartData.forEach(function (item) {
    //判斷點擊到的id：有的話在原本 data 的 quantity +1
    if (item.product.id === productId) {
      numCheck = item.quantity += 1;
    }
  }); //post

  axios.post("".concat(https).concat(api_path, "/carts"), {
    "data": {
      "productId": productId,
      "quantity": numCheck
    }
  }).then(function (res) {
    alert('加入購物車'); //重新渲染，刷新狀態

    getCartList();
  });
}); //購物車列表：接 API

function getCartList() {
  axios.get("".concat(https).concat(api_path, "/carts")).then(function (res) {
    document.querySelector('.totalPrice').textContent = res.data.finalTotal;
    cartData = res.data.carts;
    var str = '';
    cartData.forEach(function (item) {
      str += addCartListHTML(item);
      cartList.innerHTML = str;
    });
  });
}

; //刪除購物車-單筆

cartList.addEventListener('click', function (e) {
  e.preventDefault();
  var cartId = e.target.getAttribute('data-id');

  if (cartId == null) {
    return;
  }

  axios["delete"]("".concat(https).concat(api_path, "/carts/").concat(cartId)).then(function (res) {
    alert('單筆刪除成功');
    getCartList();
  });
}); //刪除購物車-全部

var discardAllBtn = document.querySelector('.discardAllBtn');
discardAllBtn.addEventListener('click', function (e) {
  e.preventDefault();
  axios["delete"]("".concat(https).concat(api_path, "/carts")).then(function (res) {
    alert('全部刪除成功');
    getCartList();
  }) //錯誤判斷：已清空
  ["catch"](function (res) {
    alert('購物車已清空，請勿重複點擊');
  });
}); //產生訂單

var orderInfoBtn = document.querySelector('.orderInfo-btn');
orderInfoBtn.addEventListener('click', function (e) {
  e.preventDefault(); //確認條件

  if (cartData.length === 0) {
    alert('請加入商品至購物車');
    return;
  }

  ;
  var customerName = document.querySelector('#customerName').value;
  var customerPhone = document.querySelector('#customerPhone').value;
  var customerEmail = document.querySelector('#customerEmail').value;
  var customerAddress = document.querySelector('#customerAddress').value;
  var tradeWay = document.querySelector('#tradeWay').value;

  if (customerName == '' || customerPhone == '' || customerEmail == '' || customerAddress == '' || tradeWay == '') {
    alert('請輸入訂單資訊');
    return;
  }

  ;
  axios.post("".concat(https).concat(api_path, "/orders"), {
    "data": {
      "user": {
        "name": customerName,
        "tel": customerPhone,
        "email": customerEmail,
        "address": customerAddress,
        "payment": tradeWay
      }
    }
  }).then(function (res) {
    alert('訂單建立成功'); //清空填寫資料

    document.querySelector('#customerName').value = '';
    document.querySelector('#customerPhone').value = '';
    document.querySelector('#customerEmail').value = '';
    document.querySelector('#customerAddress').value = '';
    document.querySelector('#tradeWay').value = 'ATM';
    getCartList();
  });
});
//# sourceMappingURL=all.js.map
