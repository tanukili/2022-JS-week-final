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


var api_path = 'jslive2022'; //重構：初始化部分

function init() {
  getProductList();
}

;
init(); //重構：組字串函式

function addProductHTML(item) {
  return "\n  <li class=\"productCard\">\n    <h4 class=\"productType\">\u65B0\u54C1</h4>\n    <img src=\"".concat(item.images, "\" alt=\"\">\n    <a href=\"#\" class=\"addCardBtn\" data-id=\"").concat(item.id, "\">\u52A0\u5165\u8CFC\u7269\u8ECA</a>\n    <h3>").concat(item.title, "</h3>\n    <del class=\"originPrice\">NT$").concat(item.origin_price, "</del>\n    <p class=\"nowPrice\">NT$").concat(item.price, "</p>\n  </li>");
} //產品列表：接 API


var productData = [];

function getProductList() {
  var url = "https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/products");
  axios.get(url).then(function (res) {
    productData = res.data.products;
    renderProductList(productData);
  })["catch"](function (error) {
    console.log(error);
  });
}

;
var productList = document.querySelector('.productWrap'); //產品列表：渲染

function renderProductList(productData) {
  var str = '';
  productData.forEach(function (item) {
    str += addProductHTML(item);
    productList.innerHTML = str;
  });
}

; //下拉選單

var productSelect = document.querySelector('.productSelect'); //下拉選單：監聽

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
  var addCartClass = e.target.getAttribute('class'); //排除按鈕以外

  if (addCartClass !== 'addCardBtn') {
    return;
  }

  ;
  var productId = e.target.getAttribute('data-id');
});
//# sourceMappingURL=all.js.map
