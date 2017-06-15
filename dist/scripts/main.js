'use strict';

var $ = function $(elem) {
  return document.querySelector(elem);
};

function hasClass(el, className) {
  return el.classList ? el.classList.contains(className) : new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
};
function addClass(el, className) {
  if (el.classList) {
    el.classList.add(className);
  } else {
    el.className += ' ' + className;
  }
};
function removeClass(el, className) {
  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
};

var startBgLoop = function startBgLoop() {
  var img1 = $('.block-intro-bg').getAttribute('data-img1');
  var img2 = $('.block-intro-bg').getAttribute('data-img2');
  var img3 = $('.block-intro-bg').getAttribute('data-img3');
  var img4 = $('.block-intro-bg').getAttribute('data-img4');

  $('.block-intro-bg').style.backgroundImage = "url(" + img1 + ")";
  $('.block-intro-bg').style.paddingBottom = 0;
  $('.block-intro-bg').style.height = $('.block-intro .inner-wrapper').offsetHeight + "px";

  var style = "<style> @keyframes bgloop {";
  style += "0%{ background-image: url(" + img1 + ");}";
  style += "25%{background-image: url(" + img2 + ");}";
  style += "50%{background-image: url(" + img3 + ");}";
  style += "75%{background-image: url(" + img4 + ");}";
  style += "90%{background-image: url(" + img1 + ");}";
  //style += "100%{background-image: url("+img1+");}";
  style += "} @-webkit-keyframes bgloop {";
  style += "0%{ background-image: url(" + img1 + ");}";
  style += "25%{background-image: url(" + img2 + ");}";
  style += "50%{background-image: url(" + img3 + ");}";
  style += "75%{background-image: url(" + img4 + ");}";
  style += "90%{background-image: url(" + img1 + ");}";
  //style += "100%{background-image: url("+img1+");}";
  style += "} @-moz-keyframes bgloop {";
  style += "0%{ background-image: url(" + img1 + ");}";
  style += "25%{background-image: url(" + img2 + ");}";
  style += "50%{background-image: url(" + img3 + ");}";
  style += "75%{background-image: url(" + img4 + ");}";
  style += "90%{background-image: url(" + img1 + ");}";
  style += "}</style>";

  $('head').innerHTML += style;
};

var tab = function tab(idx) {
  var tabW = $('.block-programs .tab-wrapper .tab').offsetWidth;
  var tabs = document.querySelectorAll('.block-programs .tab-wrapper .tab');
  var tabcont = document.querySelectorAll('.block-programs .tab-content');
  for (var i = 0; i < tabcont.length; i++) {
    removeClass(tabs[i], 'active');
    removeClass(tabcont[i], 'active');
  }
  addClass(tabs[idx - 1], 'active');
  addClass(tabcont[idx - 1], 'active');
  $('.block-programs .tab-wrapper .slidebar').style.left = (idx - 1) * 100 / tabs.length + 6.65 + '%';
};

var cityList_im = {};
var getIM = function getIM() {
  var cityList = {};

  var ajaxGenIMList = function ajaxGenIMList(res) {
    var imdata = JSON.parse(res);
    var imdataL = imdata.length;
    for (var i = 0; i < imdataL; i++) {
      var imDate = imdata[i].DateFormat;
      imDate = imDate.replace('yyyy', imdata[i].Year).replace('MM', imdata[i].Monthnum).replace('dd', imdata[i].Day).replace(' dddd', '<br/>' + imdata[i].Starttime + ' - ' + imdata[i].Endtime);
      var comDate = imDate.replace('yyyy', imdata[i].Year).replace('MM', imdata[i].Monthnum);
      if (imdata[i].Day < 10) {
        imdata[i].Day = "0" + imdata[i].Day;
      }
      comDate = comDate.replace('dd', imdata[i].Day).replace(' dddd', '<br/>' + imdata[i].Starttime + ' - ' + imdata[i].Endtime);

      if (cityList.hasOwnProperty(imdata[i].City) == false) {
        cityList[imdata[i].City] = {};
      }
      cityList[imdata[i].City][comDate] = { topic: imdata[i].Topic, date: imDate };
    }
  };

  var sortDateNappend = function sortDateNappend(cityN, curIM) {
    Object.keys(cityList[cityN]).sort().forEach(function (imNowD, i) {
      curIM += '<div class="row im-content">\
                  <div class="col-dk-6-12 col-mo-4-12 im-date">' + cityList[cityN][imNowD]['date'] + '</div>';
      curIM += '<div class="col-dk-6-12 col-mo-8-12 im-title">' + cityList[cityN][imNowD]['topic'] + '</div>\
              </div>';
    });
    return curIM;
  };

  var appendIMs = function appendIMs() {
    for (var cityN in cityList) {
      var curIM = '';
      if (document.querySelectorAll('.im-item[data-city="' + cityN + '"]').length == 0) {
        curIM += '<div class="col-dk-3-12 im-item" data-city="' + cityN + '">\
          <a href="javascript:void(0);" onclick="toggleIM(this); return false;" class="im-tab">\
          <span class="im-title">' + cityN + '</span>\
          <span class="im-arrow"></span>\
        </a>';
        curIM = sortDateNappend(cityN, curIM);
        curIM += '</div>';
        $('.ims-wrapper').innerHTML += curIM;
      } else {
        curIM = sortDateNappend(cityN, curIM);
        $('.im-item[data-city="' + cityN + '"]').innerHTML += curIM;
      }
    }
  };

  var newAjax = function newAjax(link, isLast) {
    xhr = new XMLHttpRequest();
    xhr.open('GET', link, false);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE && xhr.status === 200) {
        // on success
        ajaxGenIMList(xhr.responseText);
        if (isLast === true) {
          appendIMs();
          console.log(cityList);
        }
      }
    };
    xhr.send();
  };

  var xhr;

  //ils --> aya --> lsp
  newAjax('http://www.efjapan.co.jp/Sites/LanguageSites/Services/LanguageSitesService.svc/GetInfoMeetings/?itemId={F2AB1D8A-732B-4F51-990F-CCA6B5C77D36}&marketcode=JP&culture=ja-JP&count=8', false);
  newAjax('http://www.efjapan.co.jp/Sites/LanguageSites/Services/LanguageSitesService.svc/GetInfoMeetings/?itemId={D5211C24-F3F6-4E62-B137-506CCD60A098}&marketcode=JP&culture=ja-JP&count=8', false);
  newAjax('http://www.efjapan.co.jp/Sites/LanguageSites/Services/LanguageSitesService.svc/GetInfoMeetings/?itemId={D921F999-CB55-4C30-8D90-BF9EE77388B1}&marketcode=JP&culture=ja-JP&count=8', true);
};

var togglingIM = false;
var toggleIM = function toggleIM($this) {
  if (togglingIM == false) {
    togglingIM = true;
    if (hasClass($this, 'active')) {
      removeClass($this, 'active');
    } else {
      addClass($this, 'active');
    }
    togglingIM = false;
  }
};

var toggleMenu = function toggleMenu() {
  if (hasClass($('.menu-items'), 'show-menu')) {
    removeClass($('.menu-items'), 'show-menu');
  } else {
    addClass($('.menu-items'), 'show-menu');
  }
};

var scrollTo = function scrollTo(tar) {
  var tarTop = $('.block-' + tar).offsetTop - 46;
  window.scroll(0, tarTop);
};

var b4formscrolltop;

function popupClose() {
  $('.popup-form').style.display = 'none';
  var forms = $('.popup-form').querySelectorAll('.inner-wrapper');
  for (var i = 0; i < forms.length; i++) {
    removeClass(forms[i], 'show');
  }
  removeClass($('.blocks-wrapper'), 'show-form');
  window.scroll(0, b4formscrolltop);
}

var ctas = document.querySelectorAll('.cta-button');
for (var i = 0; i < ctas.length; i++) {
  ctas[i].addEventListener('click', function () {}, false);
}

var showForm = function showForm(formtype) {
  //$('.popup-form').style.top = document.body.scrollTop + 'px';
  b4formscrolltop = document.body.scrollTop;
  addClass($('.blocks-wrapper'), 'show-form');
  $('.popup-form').style.display = 'table';
  addClass($('.popup-form .form-' + formtype), 'show');
};

var city = function city(idx) {
  var tabW = $('.block-consultants .tab-wrapper .tab').offsetWidth;
  var tabs = document.querySelectorAll('.block-consultants .tab-wrapper .tab');
  for (var i = 0; i < tabs.length; i++) {
    removeClass(tabs[i], 'active');
  }
  addClass(tabs[idx - 1], 'active');
  setCityonMap(idx);
};

getIM();

tab(1);

startBgLoop();

var form_bro_config = {
  //twoStep: false,
  wrapper: '.form-bro .form-wrapper',
  formLogic: {
    WantsBrochure: {
      prechecked: true,
      showOnForm: false,
      labelText: 'I want to order a free brochure.'
    },
    WantsInfo: {
      prechecked: true,
      showOnForm: true,
      labelText: 'I want to receive more information.'
    },
    AcceptTnC: {
      prechecked: true,
      showOnForm: true,
      labelText: 'I accept the <a href="//www.ef.com/legal/privacy-policy/" target="_blank">Privacy Policy</a>.'
    }
  },
  placeholders: { // if form is not rendered already
    first_name: 'First Name',
    last_name: 'Last Name',
    full_name: 'Full Name',
    birthdate: 'Date of Birth',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    loc: 'Prefecture',
    next: 'Next',
    submit: 'Submit'
  },
  additionalQuestions: [{ // if form is not rendered already
    step: 1,
    isQQ: true,
    isMC: false, // **** make dropdown
    radio_or_dropdown: 'dropdown', // if isMC is true, this is ignored
    required: true,
    question: 'Duration',
    answers: {
      'Please choose': '',
      'short term (2 weeks to 5 months)': 'ils',
      'long term (more than 5 months)': 'aya'
    }
  }, { // if form is not rendered already
    step: 2,
    isMC: false, // **** make dropdown
    radio_or_dropdown: 'dropdown', // if isMC is true, this is ignored
    required: true,
    question: 'City',
    answers: {
      'Please choose': '',
      'Osaka': 'Osaka',
      'Tokyo': 'Tokyo',
      'Sapporo': 'Sapporo'
    }
  }],
  customSubmitSuccess: function customSubmitSuccess() {
    $('.form-bro .form-wrapper').style.display = "none";
    $('.form-bro .thanks').innerHTML = 'Thanks for your enquiry! We will contact you as soon as possible!';
    $('.form-bro .ty-wrapper').style.display = 'block';
  },
  locList: { // text: value
    '下記より選択': '',
    '東京都': '13|東京都',
    '北海道': '01|北海道',
    '青森県': '02|青森県',
    '岩手県': '03|岩手県',
    '宮城県': '04|宮城県',
    '秋田県': '05|秋田県',
    '山形県': '06|山形県',
    '福島県': '07|福島県',
    '茨城県': '08|茨城県',
    '栃木県': '09|栃木県',
    '群馬県': '10|群馬県',
    '埼玉県': '11|埼玉県',
    '千葉県': '12|千葉県',
    '神奈川県': '14|神奈川県',
    '新潟県': '15|新潟県',
    '富山県': '16|富山県',
    '石川県': '17|石川県',
    '福井県': '18|福井県',
    '山梨県': '19|山梨県',
    '長野県': '20|長野県',
    '岐阜県': '21|岐阜県',
    '静岡県': '22|静岡県',
    '愛知県': '23|愛知県',
    '三重県': '24|三重県',
    '滋賀県': '25|滋賀県',
    '京都府': '26|京都府',
    '大阪府': '27|大阪府',
    '兵庫県': '28|兵庫県',
    '奈良県': '29|奈良県',
    '和歌山県': '30|和歌山県',
    '鳥取県': '31|鳥取県',
    '島根県': '32|島根県',
    '岡山県': '33|岡山県',
    '広島県': '34|広島県',
    '山口県': '35|山口県',
    '徳島県': '36|徳島県',
    '香川県': '37|香川県',
    '愛媛県': '38|愛媛県',
    '高知県': '39|高知県',
    '福岡県': '40|福岡県',
    '佐賀県': '41|佐賀県',
    '長崎県': '42|長崎県',
    '熊本県': '43|熊本県',
    '大分県': '44|大分県',
    '宮崎県': '45|宮崎県',
    '鹿児島県': '46|鹿児島県',
    '沖縄県': '47|沖縄県'
  }
};

var form_pq_config = {
  //twoStep: false,
  wrapper: '.form-pq .form-wrapper',
  formLogic: {
    WantsBrochure: {
      prechecked: true,
      showOnForm: false,
      labelText: 'I want to order a free brochure.'
    },
    WantsInfo: {
      prechecked: true,
      showOnForm: true,
      labelText: 'I want to receive more information.'
    },
    AcceptTnC: {
      prechecked: true,
      showOnForm: true,
      labelText: 'I accept the <a href="//www.ef.com/legal/privacy-policy/" target="_blank">Privacy Policy</a>.'
    }
  },
  placeholders: { // if form is not rendered already
    first_name: 'First Name',
    last_name: 'Last Name',
    full_name: 'Full Name',
    birthdate: 'Date of Birth',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    loc: 'Prefecture',
    next: 'Next',
    submit: 'Submit'
  },
  additionalQuestions: [{ // if form is not rendered already
    step: 1,
    isMC: false, // **** make dropdown
    radio_or_dropdown: 'dropdown', // if isMC is true, this is ignored
    required: true,
    question: 'Destination',
    answers: {
      'Please choose': '',
      'San Diego': 'San Diego',
      'London': 'London'
    }
  }, { // if form is not rendered already
    step: 1,
    isMC: false, // **** make dropdown
    radio_or_dropdown: 'dropdown', // if isMC is true, this is ignored
    required: true,
    question: 'Programme',
    answers: {
      'Please choose': '',
      'Language Courses': 'LC',
      'University Abroad': 'UA'
    }
  }, { // if form is not rendered already
    step: 1,
    isMC: false, // **** make dropdown
    radio_or_dropdown: 'dropdown', // if isMC is true, this is ignored
    required: true,
    question: 'Duration',
    answers: {
      'Please choose': '',
      '2 weeks': '2w',
      '3 weeks': '3w',
      '4 weeks': '4w',
      '5 weeks': '5w',
      '6 weeks': '6w',
      '7 weeks': '7w',
      '8 weeks': '8w'
    }
  }, { // if form is not rendered already
    step: 1,
    isMC: false, // **** make dropdown
    radio_or_dropdown: 'dropdown', // if isMC is true, this is ignored
    required: true,
    question: 'Accommodation',
    answers: {
      'Please choose': '',
      'Campus': 'Campus',
      'Host Family': 'Host Family',
      'Residence EF': 'Residence EF'
    }
  }, { // if form is not rendered already
    step: 2,
    isMC: false, // **** make dropdown
    radio_or_dropdown: 'dropdown', // if isMC is true, this is ignored
    required: true,
    question: 'City',
    answers: {
      'Please choose': '',
      'Osaka': 'Osaka',
      'Tokyo': 'Tokyo',
      'Sapporo': 'Sapporo'
    }
  }],
  customSubmitSuccess: function customSubmitSuccess() {
    $('.form-pq .form-wrapper').style.display = "none";
    $('.form-pq .thanks').innerHTML = 'Thanks for your enquiry! We will contact you as soon as possible!';
    $('.form-pq .ty-wrapper').style.display = 'block';
  },
  locList: { // text: value
    'Choose': '',
    'prefecture 1': 'pre 1',
    'prefecture 2': 'pre 2',
    'prefecture 3': 'pre 3'
  }
};

document.addEventListener('completedStep1', function (e) {
  console.log(e.detail.wrapper);
}, false);

var form_con_config = {
  //twoStep: false,
  wrapper: '.form-con .form-wrapper',
  formLogic: {
    WantsBrochure: {
      prechecked: true,
      showOnForm: false,
      labelText: 'I want to order a free brochure.'
    },
    WantsInfo: {
      prechecked: true,
      showOnForm: true,
      labelText: 'I want to receive more information.'
    },
    AcceptTnC: {
      prechecked: true,
      showOnForm: true,
      labelText: 'I accept the <a href="//www.ef.com/legal/privacy-policy/" target="_blank">Privacy Policy</a>.'
    }
  },
  placeholders: { // if form is not rendered already
    first_name: 'First Name',
    last_name: 'Last Name',
    full_name: 'Full Name',
    birthdate: 'Date of Birth',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    loc: 'Prefecture',
    next: 'Next',
    submit: 'Submit'
  },
  additionalQuestions: [{ // if form is not rendered already
    step: 1,
    isMC: false, // **** make dropdown
    radio_or_dropdown: 'dropdown', // if isMC is true, this is ignored
    required: true,
    question: 'Duration',
    answers: {
      'Please choose': '',
      'short term (2 weeks to 5 months)': '2w-5m',
      'long term (more than 5 months)': '>5m'
    }
  }, { // if form is not rendered already
    step: 1,
    isMC: false, // **** make dropdown
    radio_or_dropdown: 'textarea', // if isMC is true, this is ignored
    required: false,
    question: 'What information would you like to know?'
  }, { // if form is not rendered already
    step: 2,
    isMC: false, // **** make dropdown
    radio_or_dropdown: 'dropdown', // if isMC is true, this is ignored
    required: true,
    question: 'City',
    answers: {
      'Please choose': '',
      'Osaka': 'Osaka',
      'Tokyo': 'Tokyo',
      'Sapporo': 'Sapporo'
    }
  }],
  customSubmitSuccess: function customSubmitSuccess() {
    $('.form-con .form-wrapper').style.display = "none";
    $('.form-con .thanks').innerHTML = 'Thanks for your enquiry! We will contact you as soon as possible!';
    $('.form-con .ty-wrapper').style.display = 'block';
  },
  locList: { // text: value
    'Choose': '',
    'prefecture 1': 'pre 1',
    'prefecture 2': 'pre 2',
    'prefecture 3': 'pre 3'
  }
};

var form_im_config = {
  //twoStep: false,
  wrapper: '.form-im .form-wrapper',
  formLogic: {
    WantsBrochure: {
      prechecked: true,
      showOnForm: false,
      labelText: 'I want to order a free brochure.'
    },
    WantsInfo: {
      prechecked: true,
      showOnForm: true,
      labelText: 'I want to receive more information.'
    },
    AcceptTnC: {
      prechecked: true,
      showOnForm: true,
      labelText: 'I accept the <a href="//www.ef.com/legal/privacy-policy/" target="_blank">Privacy Policy</a>.'
    },
    DataCollection: {
      prechecked: true,
      showOnForm: true,
      labelText: 'I accept the <a href="javascript:void(0);" target="_blank">Data Collection Policy</a>.'
    }
  },
  placeholders: { // if form is not rendered already
    first_name: 'First Name',
    last_name: 'Last Name',
    full_name: 'Full Name',
    birthdate: 'Date of Birth',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    loc: 'Prefecture',
    next: 'Next',
    submit: 'Submit'
  },
  additionalQuestions: [{ // if form is not rendered already
    step: 1,
    isMC: false, // **** make dropdown
    radio_or_dropdown: 'dropdown', // if isMC is true, this is ignored
    required: true,
    question: 'City',
    answers: {
      'Please choose': '',
      'Osaka': 'Osaka',
      'Tokyo': 'Tokyo',
      'Sapporo': 'Sapporo'
    }
  }],
  customSubmitSuccess: function customSubmitSuccess() {
    $('.form-im .form-wrapper').style.display = "none";
    $('.form-im .thanks').innerHTML = 'Thanks for your enquiry! We will contact you as soon as possible!';
    $('.form-im .ty-wrapper').style.display = 'block';
  },
  locList: { // text: value
    'Choose': '',
    'prefecture 1': 'pre 1',
    'prefecture 2': 'pre 2',
    'prefecture 3': 'pre 3'
  }
};

var form_bro = new fifi_form(form_bro_config);
var form_pq = new fifi_form(form_pq_config);
var form_con = new fifi_form(form_con_config);
var form_im = new fifi_form(form_im_config);

var dest_sliders = [];
var d_sliders = document.querySelectorAll('.slider');
for (var _i = 0; _i < d_sliders.length; _i++) {
  var tar = d_sliders[_i];
  dest_sliders[_i] = new fifi_slider({
    target: tar,
    autoHeight: true,
    dotsWrapper: $('#dots-wrapper-' + _i)
  });
}

var test_slider = new fifi_slider({
  target: $('.test-slider'),
  dotsWrapper: $('#dots-wrapper-4'),
  arrowLeft: $('.test-arrow-left'),
  arrowRight: $('.test-arrow-right'),
  afterChangeSlide: function afterChangeSlide(_) {
    var player = document.querySelectorAll('.ytvid');
    for (var i = 0; i < player.length; i++) {
      player[i].innerHTML = player[i].innerHTML;
    }
    $('#test-name').innerHTML = _.def.target.querySelectorAll('.slide')[_.curSlide].getAttribute('data-name');
    $('#test-country').innerHTML = _.def.target.querySelectorAll('.slide')[_.curSlide].getAttribute('data-country');
  }
});

function addListenerMulti(el, s, fn) {
  s.split(' ').forEach(function (e) {
    return el.addEventListener(e, fn, false);
  });
}

//inview fn & animate stat bars
var isBarFirst = true;
addListenerMulti(window, 'scroll DOMMouseScroll', function (e) {
  var bodyTop = (document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight / 2;
  var testTop = $('.block-testimonial').offsetTop;
  if (bodyTop >= testTop && isBarFirst) {
    animateBars();
    isBarFirst = false;
  }
});

var animateBars = function animateBars() {
  var statrows = document.querySelectorAll('.stat-row');

  var _loop = function _loop(_i2) {
    var tarper = parseInt(statrows[_i2].getAttribute('data-num'));
    setTimeout(function () {
      statrows[_i2].querySelectorAll('.theBar')[0].style.width = tarper + "%";
      var cur = 0;
      var timer = setInterval(function () {
        if (cur < tarper) {
          statrows[_i2].querySelectorAll('.perNum')[0].innerHTML = cur + "%";
          cur++;
        } else {
          clearInterval(timer);
        }
      }, 20);
    }, 600 * _i2 * 0.8);
  };

  for (var _i2 = 0; _i2 < statrows.length; _i2++) {
    _loop(_i2);
  }
};

var map, offices;
var markers = [];
function initMap() {
  var styles = {
    default: null,
    retro: [{ elementType: 'geometry', stylers: [{ color: '#ebe3cd' }] }, { elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] }, { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] }, {
      featureType: 'administrative',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#c9b2a6' }]
    }, {
      featureType: 'administrative.land_parcel',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#dcd2be' }]
    }, {
      featureType: 'administrative.land_parcel',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#ae9e90' }]
    }, {
      featureType: 'landscape.natural',
      elementType: 'geometry',
      stylers: [{ color: '#dfd2ae' }]
    }, {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [{ color: '#dfd2ae' }]
    }, {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#93817c' }]
    }, {
      featureType: 'poi.park',
      elementType: 'geometry.fill',
      stylers: [{ color: '#a5b076' }]
    }, {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#447530' }]
    }, {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#f5f1e6' }]
    }, {
      featureType: 'road.arterial',
      elementType: 'geometry',
      stylers: [{ color: '#fdfcf8' }]
    }, {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#f8c967' }]
    }, {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#e9bc62' }]
    }, {
      featureType: 'road.highway.controlled_access',
      elementType: 'geometry',
      stylers: [{ color: '#e98d58' }]
    }, {
      featureType: 'road.highway.controlled_access',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#db8555' }]
    }, {
      featureType: 'road.local',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#806b63' }]
    }, {
      featureType: 'transit.line',
      elementType: 'geometry',
      stylers: [{ color: '#dfd2ae' }]
    }, {
      featureType: 'transit.line',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#8f7d77' }]
    }, {
      featureType: 'transit.line',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#ebe3cd' }]
    }, {
      featureType: 'transit.station',
      elementType: 'geometry',
      stylers: [{ color: '#dfd2ae' }]
    }, {
      featureType: 'water',
      elementType: 'geometry.fill',
      stylers: [{ color: '#b9d3c2' }]
    }, {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#92998d' }]
    }]
  };

  offices = [{ lat: 35.658769, lng: 139.705267 }, { lat: 43.064593, lng: 141.350434 }, { lat: 35.468254, lng: 139.621311 }, { lat: 35.168511, lng: 136.894026 }, { lat: 35.003964, lng: 135.757011 }, { lat: 34.69916, lng: 135.499127 }, { lat: 33.587739, lng: 130.3969 }];
  // tokyo // sapporo // yokohama // nagoya // kyoto // osaka // fukuoka

  map = new google.maps.Map($('#map'), {
    center: { lat: 38.458769, lng: 136.705267 },
    zoom: 4,
    styles: styles.retro
  });
}

function setCityonMap(idx) {
  map.setZoom(14);
  map.setCenter(offices[idx - 1]);

  var cities = document.querySelectorAll('.block-consultants .tab');
  $('.map-info .city-address').innerHTML = cities[idx - 1].getAttribute('data-add');
  $('.map-info .city-email').innerHTML = cities[idx - 1].getAttribute('data-email');
  $('.map-info .city-tel').innerHTML = cities[idx - 1].getAttribute('data-tel');
  $('.map-info .city-tel').href = 'tel:' + cities[idx - 1].getAttribute('data-tel');
  $('.consultant-info .name').innerHTML = cities[idx - 1].getAttribute('data-name');
  $('.block-consultants .cta-button .name').innerHTML = cities[idx - 1].getAttribute('data-name');
  $('.consultant-info .title').innerHTML = cities[idx - 1].getAttribute('data-title');
  $('.consultant-info .quote').innerHTML = '"' + cities[idx - 1].getAttribute('data-quote') + '"';
  $('.consultant-info .propic').setAttribute('src', cities[idx - 1].getAttribute('data-pic'));
}

function addMarkerWithTimeout(position, timeout) {
  setTimeout(function () {
    markers.push(new google.maps.Marker({
      map: map,
      draggable: true,
      position: position,
      animation: google.maps.Animation.DROP
    }));
  }, timeout);
}

if (!hasClass($('body'), '.mkt-cn')) {
  var script = document.createElement('script');
  script.src = "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places";
  script.onload = function () {
    initMap();
    //inview fn & animate google map pins
    var isMapFirst = true;
    addListenerMulti(window, 'scroll DOMMouseScroll', function (e) {
      var bodyTop = (document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight / 2;
      var mapTop = $('.block-consultants').offsetTop;
      if (bodyTop >= mapTop && isMapFirst) {
        for (var i = 0; i < offices.length; i++) {
          addMarkerWithTimeout(offices[i], i * 400);
        }
        setTimeout(function () {
          city(1);
        }, 1600 + 400 * offices.length);
        isMapFirst = false;
      }
    });
  };
  $('body').appendChild(script);
}