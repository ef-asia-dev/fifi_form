'use strict';

var $ = function $(elem) {
	return document.querySelector(elem);
};

function getLangCode(mktCode){
	mktCode = mktCode.toLowerCase();

	if(mktCode=="we"){return "ja-JP";}
	if(mktCode=="cn"){return "zh-CN";}
	if(mktCode=="hk"){return "zh-HK";}
	if(mktCode=="tw"){return "zh-TW";}
	if(mktCode=="jp"){return "ja-JP";}
	if(mktCode=="kr"){return "ko-KR";}
	if(mktCode=="id"){return "id-ID";}
	if(mktCode=="th"){return "th-TH";}
	if(mktCode=="vn"){return "vi-VN";}

	return mktCode;
}

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

	var css = '',
      head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style');

	var css = "<style> @keyframes bgloop {";
	css += "0%{ background-image: url(" + img1 + ");}";
	css += "25%{background-image: url(" + img2 + ");}";
	css += "50%{background-image: url(" + img3 + ");}";
	css += "75%{background-image: url(" + img4 + ");}";
	css += "90%{background-image: url(" + img1 + ");}";
	//css += "100%{background-image: url("+img1+");}";
	css += "} @-webkit-keyframes bgloop {";
	css += "0%{ background-image: url(" + img1 + ");}";
	css += "25%{background-image: url(" + img2 + ");}";
	css += "50%{background-image: url(" + img3 + ");}";
	css += "75%{background-image: url(" + img4 + ");}";
	css += "90%{background-image: url(" + img1 + ");}";
	//css += "100%{background-image: url("+img1+");}";
	css += "} @-moz-keyframes bgloop {";
	css += "0%{ background-image: url(" + img1 + ");}";
	css += "25%{background-image: url(" + img2 + ");}";
	css += "50%{background-image: url(" + img3 + ");}";
	css += "75%{background-image: url(" + img4 + ");}";
	css += "90%{background-image: url(" + img1 + ");}";
	css += "}</style>";

	style.type = 'text/css';
	if (style.styleSheet){
	  style.styleSheet.cssText = css;
	} else {
	  style.appendChild(document.createTextNode(css));
	}

	head.appendChild(style);
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
				}
			}
		};
		xhr.send();
	};

	var xhr;

	var ajaxDomain = location.origin;
	if(ajaxDomain == "http://sitecore.ef.com"){
		ajaxDomain = "http://www.efjapan.co.jp";
	}

	var ajaxEndpoints = ["/Sites/LanguageSites/Services/LanguageSitesService.svc/GetInfoMeetings/?itemId={F2AB1D8A-732B-4F51-990F-CCA6B5C77D36}&marketcode={marketcode}&culture={culture}&count=8", "/Sites/LanguageSites/Services/LanguageSitesService.svc/GetInfoMeetings/?itemId={D5211C24-F3F6-4E62-B137-506CCD60A098}&marketcode={marketcode}&culture={culture}&count=8", "/Sites/LanguageSites/Services/LanguageSitesService.svc/GetInfoMeetings/?itemId={D921F999-CB55-4C30-8D90-BF9EE77388B1}&marketcode={marketcode}&culture={culture}&count=8"];

	//ils --> aya --> lsp
	for(var i=0; i<ajaxEndpoints.length;i++){
		var isEnd = i == (ajaxEndpoints.length-1) ? true:false;
		var url = ajaxDomain+ajaxEndpoints[i];
		url = url.replace("{marketcode}", bs_marketCode == "WE" ? "JP":bs_marketCode );
		url = url.replace("{culture}", getLangCode(bs_marketCode));
		newAjax(url, isEnd);
	}

	//newAjax('http://www.efjapan.co.jp/Sites/LanguageSites/Services/LanguageSitesService.svc/GetInfoMeetings/?itemId={F2AB1D8A-732B-4F51-990F-CCA6B5C77D36}&marketcode=JP&culture=ja-JP&count=8', false);
	//newAjax('http://www.efjapan.co.jp/Sites/LanguageSites/Services/LanguageSitesService.svc/GetInfoMeetings/?itemId={D5211C24-F3F6-4E62-B137-506CCD60A098}&marketcode=JP&culture=ja-JP&count=8', false);
	//newAjax('http://www.efjapan.co.jp/Sites/LanguageSites/Services/LanguageSitesService.svc/GetInfoMeetings/?itemId={D921F999-CB55-4C30-8D90-BF9EE77388B1}&marketcode=JP&culture=ja-JP&count=8', true);

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

//startBgLoop();
$('.block-intro-bg').style.height = $('.block-intro .inner-wrapper').offsetHeight + "px";

var form_bro_config = {
	//twoStep: false,
	marketCode: 'JP',
	campaignName: 'Black_Ops',
	wrapper: '.form-bro .form-wrapper',
	campaignAllocationPrograms: ['BC', 'LY', 'ILC', 'ILS', 'ILSP'],
	formLogic: {
		WantsBrochure: {
			prechecked: true,
			showOnForm: false,
			labelText: $('#label_from_brochure').innerHTML
		},
		WantsInfo: {
			prechecked: true,
			showOnForm: true,
			labelText: $('#label_from_more_info').innerHTML
		},
		AcceptTnC: {
			prechecked: true,
			showOnForm: true,
			labelText: $('#label_form_privacy_policy').innerHTML
		}
	},
	placeholders: { // if form is not rendered already
		first_name: $('#label_first_name').innerHTML,
		last_name: $('#label_last_name').innerHTML,
		full_name: $('#label_full_name').innerHTML,
		birthdate: $('#label_birthdate').innerHTML,
		email: $('#label_email').innerHTML,
		phone: $('#label_phone').innerHTML,
		address: $('#label_address').innerHTML,
		loc: $('#label_loc').innerHTML,
		next: $('#label_next').innerHTML,
		submit: $('#label_submit').innerHTML
	},
	additionalQuestions: [{ // if form is not rendered already
		step: 1,
		isMC: false, // **** make dropdown
		isQQ: true,
		radio_or_dropdown: 'dropdown', // if isMC is true, this is ignored
		required: true,
		question: '渡航期間',
		answers: {
			'下記より選択': '',
			'短期（2週間から5か月）': 'ILS',
			'長期（5か月以上）': 'AYA'
		}
	}],
	customSubmitSuccess: function customSubmitSuccess() {
		$('.form-bro .form-wrapper').style.display = "none";
		$('.form-bro .thanks').innerHTML = $('#label_form_thank_you').innerHTML;
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
	marketCode: 'JP',
	campaignName: 'Black_Ops',
	wrapper: '.form-pq .form-wrapper',
	campaignAllocationPrograms: ['BC', 'LY', 'ILC', 'ILS', 'ILSP'],
	formLogic: {
		WantsBrochure: {
			prechecked: true,
			showOnForm: false,
			labelText: $('#label_from_brochure').innerHTML
		},
		WantsInfo: {
			prechecked: true,
			showOnForm: true,
			labelText: $('#label_from_more_info').innerHTML
		},
		AcceptTnC: {
			prechecked: true,
			showOnForm: true,
			labelText: $('#label_form_privacy_policy').innerHTML
		}
	},
	placeholders: { // if form is not rendered already
		first_name: $('#label_first_name').innerHTML,
		last_name: $('#label_last_name').innerHTML,
		full_name: $('#label_full_name').innerHTML,
		birthdate: $('#label_birthdate').innerHTML,
		email: $('#label_email').innerHTML,
		phone: $('#label_phone').innerHTML,
		address: $('#label_address').innerHTML,
		loc: $('#label_loc').innerHTML,
		next: $('#label_next').innerHTML,
		submit: $('#label_submit').innerHTML
	},
	additionalQuestions: [{ // if form is not rendered already
		step: 1,
		isMC: false, // **** make dropdown
		radio_or_dropdown: 'dropdown', // if isMC is true, this is ignored
		required: true,
		question: '場所で選ぶ',
		answers: {
			'下記より選択': '',
			'ロンドン': 'London',
	    'オックスフォード': 'Oxford',
	    'ケンブリッジ': 'Cambridge',
	    'イーストボーン': 'Eastbourne',
	    'ブライトン': 'Brighton',
	    'ボーンマス': 'Bournemouth',
	    'ブリストル': 'Bristol',
	    'マンチェスター': 'Manchester',
	    'ダブリン': 'Dublin',
	    'ニューヨーク': 'New York',
	    'ボストン': 'Boston',
	    'ワシントンDC': 'Washington D.C.',
	    'マイアミ': 'Miami Beach',
	    'シカゴ': 'Chicago',
	    'サンディエゴ': 'San Diego',
	    'サンタバーバラ': 'Santa Barbara',
	    'ロサンゼルス': 'Los Angeles',
	    'サンフランシスコシティ': 'San Francisco',
	    'シアトル': 'Seattle',
	    'ハワイ（ホノルル）': 'Honolulu',
	    'トロント': 'Toronto',
	    'バンクーバー': 'Vancouver',
	    'セントジュリアン': 'St. Julians',
	    'ケープタウン': 'Cape Town',
	    'ブリスベン': 'Brisbane',
	    'シドニー': 'Sydney',
	    'オークランド': 'Auckland',
	    'シンガポール': 'Singapore',
	    'ニース': 'Nice',
	    'パリ': 'Paris',
	    'ベルリン': 'Berlin',
	    'ミュンヘン': 'Munich',
	    'マラガ': 'Malaga',
	    'バルセロナ': 'Barcelona',
	    'マドリード': 'Madrid',
	    'プラヤタマリンド': 'Playa Tamarindo',
	    'ローマ': 'Rome',
	    '北京': 'Beijing'
		}
	}, { // if form is not rendered already
		step: 1,
		isMC: false, // **** make dropdown
		isQQ: true,
		radio_or_dropdown: 'dropdown', // if isMC is true, this is ignored
		required: true,
		question: '渡航期間',
		answers: {
			'下記より選択': '',
			'短期（2週間から5か月）': 'ILS',
			'長期（5か月以上）': 'AYA'
		}
	}, { // if form is not rendered already
		step: 1,
		isMC: false, // **** make dropdown
		radio_or_dropdown: 'dropdown', // if isMC is true, this is ignored
		required: true,
		question: '宿泊先',
		answers: {
			'下記より選択': '',
			'学生寮（キャンパス内）': 'EF Campus',
			'ホームステイ': 'EF Homestay',
			'学生寮': 'EF Residence'
		}
	}],
	customSubmitSuccess: function customSubmitSuccess() {
		$('.form-pq .form-wrapper').style.display = "none";
		$('.form-pq .thanks').innerHTML = $('#label_form_thank_you').innerHTML;
		$('.form-pq .ty-wrapper').style.display = 'block';
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

var form_con_config = {
	//twoStep: false,
	marketCode: 'JP',
	campaignName: 'Black_Ops',
	wrapper: '.form-con .form-wrapper',
	campaignAllocationPrograms: ['BC', 'LY', 'ILC', 'ILS', 'ILSP'],
	formLogic: {
		WantsBrochure: {
			prechecked: true,
			showOnForm: false,
			labelText: $('#label_from_brochure').innerHTML
		},
		WantsInfo: {
			prechecked: true,
			showOnForm: true,
			labelText: $('#label_from_more_info').innerHTML
		},
		AcceptTnC: {
			prechecked: true,
			showOnForm: true,
			labelText: $('#label_form_privacy_policy').innerHTML
		}
	},
	placeholders: { // if form is not rendered already
		first_name: $('#label_first_name').innerHTML,
		last_name: $('#label_last_name').innerHTML,
		full_name: $('#label_full_name').innerHTML,
		birthdate: $('#label_birthdate').innerHTML,
		email: $('#label_email').innerHTML,
		phone: $('#label_phone').innerHTML,
		address: $('#label_address').innerHTML,
		loc: $('#label_loc').innerHTML,
		next: $('#label_next').innerHTML,
		submit: $('#label_submit').innerHTML
	},
	additionalQuestions: [{ // if form is not rendered already
		step: 1,
		isMC: false, // **** make dropdown
		isQQ: true,
		radio_or_dropdown: 'dropdown', // if isMC is true, this is ignored
		required: true,
		question: '渡航期間',
		answers: {
			'下記より選択': '',
			'短期（2週間から5か月）': 'ILS',
			'長期（5か月以上）': 'AYA'
		}
	}, { // if form is not rendered already
		step: 1,
		isMC: false, // **** make dropdown
		radio_or_dropdown: 'textarea', // if isMC is true, this is ignored
		required: false,
		question: 'どのような情報をご希望ですか？'
	}],
	customSubmitSuccess: function customSubmitSuccess() {
		$('.form-con .form-wrapper').style.display = "none";
		$('.form-con .thanks').innerHTML = $('#label_form_thank_you').innerHTML;
		$('.form-con .ty-wrapper').style.display = 'block';
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

var form_im_config = {
	//twoStep: false,
	marketCode: 'JP',
	campaignName: 'Black_Ops',
	wrapper: '.form-im .form-wrapper',
	campaignAllocationPrograms: ['BC', 'LY', 'ILC', 'ILS', 'ILSP'],
	formLogic: {
		WantsBrochure: {
			prechecked: true,
			showOnForm: false,
			labelText: $('#label_from_brochure').innerHTML
		},
		WantsInfo: {
			prechecked: true,
			showOnForm: true,
			labelText: $('#label_from_more_info').innerHTML
		},
		AcceptTnC: {
			prechecked: true,
			showOnForm: true,
			labelText: $('#label_form_privacy_policy').innerHTML
		}
		// DataCollection: {
		// 	prechecked: true,
		// 	showOnForm: true,
		// 	labelText: $('#label_from_data_collection').innerHTML
		// }
	},
	placeholders: { // if form is not rendered already
		first_name: $('#label_first_name').innerHTML,
		last_name: $('#label_last_name').innerHTML,
		full_name: $('#label_full_name').innerHTML,
		birthdate: $('#label_birthdate').innerHTML,
		email: $('#label_email').innerHTML,
		phone: $('#label_phone').innerHTML,
		address: $('#label_address').innerHTML,
		loc: $('#label_loc').innerHTML,
		next: $('#label_next').innerHTML,
		submit: $('#label_submit').innerHTML
	},
	additionalQuestions: [{ // if form is not rendered already
		step: 1,
		isMC: false, // **** make dropdown
		isQQ: true,
		radio_or_dropdown: 'dropdown', // if isMC is true, this is ignored
		required: true,
		question: '渡航期間',
		answers: {
			'下記より選択': '',
			'短期（2週間から5か月）': 'ILS',
			'長期（5か月以上）': 'AYA'
		}
	}, { // if form is not rendered already
		step: 1,
		isMC: false, // **** make dropdown
		radio_or_dropdown: 'textarea', // if isMC is true, this is ignored
		required: false,
		question: 'どのような情報をご希望ですか？'
	}],
	customSubmitSuccess: function customSubmitSuccess() {
		$('.form-im .form-wrapper').style.display = "none";
		$('.form-im .thanks').innerHTML = $('#label_form_thank_you').innerHTML;
		$('.form-im .ty-wrapper').style.display = 'block';
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

var form_bro = new fifi_form(form_bro_config);
var form_pq = new fifi_form(form_pq_config);
var form_con = new fifi_form(form_con_config);
var form_im = new fifi_form(form_im_config);

var isInitWorld = true;
addListenerMulti(window, 'scroll DOMMouseScroll', function (e) {
	var bodyTop = (document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight / 2;
	var mapTop = $('.worldmap').offsetTop;
	if (bodyTop >= mapTop && isInitWorld) {
		$('.worldmap').src = $('.worldmap').getAttribute('data-src');
		isInitWorld = false;
	}
});

var dest_sliders = [];
var d_sliders = document.querySelectorAll('.slider');
for (var _i = 0; _i < d_sliders.length; _i++) {

	dest_sliders[_i] = new fifi_slider({
		target: d_sliders[_i],
		autoHeight: true,
		dotsWrapper: $('#dots-wrapper-' + _i)
	});

}

var isInitTabs = true;
addListenerMulti(window, 'scroll DOMMouseScroll', function (e) {
	var bodyTop = (document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight / 2;
	var tabsTop = $('.tab-content-wrapper').offsetTop;
	if (bodyTop >= tabsTop && isInitTabs) {
		var tabimg = $('.tab-content-wrapper').querySelectorAll('img');
		for (var j = 0; j < tabimg.length; j++) {
			tabimg[j].src = tabimg[j].getAttribute('data-src');
		}
		isInitTabs = false;
	}
});

var isInitSlider = true;
addListenerMulti(window, 'scroll DOMMouseScroll', function (e) {
	var bodyTop = (document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight / 2;
	var testTop = $('.test-slider').offsetTop;
	if (bodyTop >= testTop && isInitSlider) {
		var vids = $('.test-slider').querySelectorAll('iframe');
		for (var j = 0; j < vids.length; j++) {
			vids[j].src = vids[j].getAttribute('data-src');
		}
		var test_slider = new fifi_slider({
			target: $('.test-slider'),
			dotsWrapper: $('#dots-wrapper-4'),
			arrowLeft: $('.test-arrow-left'),
			arrowRight: $('.test-arrow-right'),
			afterChangeSlide: function afterChangeSlide(_) {
				if (isInitSlider != true) {
					var player = document.querySelectorAll('.ytvid');
					for (var i = 0; i < player.length; i++) {
						player[i].innerHTML = player[i].innerHTML;
					}
					$('#test-name').innerHTML = _.def.target.querySelectorAll('.slide')[_.curSlide].getAttribute('data-name');
					$('#test-country').innerHTML = _.def.target.querySelectorAll('.slide')[_.curSlide].getAttribute('data-country');
				}
				isInitSlider = false;
			}
		});
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

	offices = [];
	var bs_offices = document.querySelectorAll('.block-consultants .tab');
	for (var i = 0; i < document.querySelectorAll('.block-consultants .tab').length; i++) {
		offices.push({ lat: parseFloat(bs_offices[i].getAttribute('data-lat')), lng: parseFloat(bs_offices[i].getAttribute('data-lng')) });
	}

	map = new google.maps.Map($('#map'), {
		center: { lat: parseFloat(bs_offices[0].getAttribute('data-lat')), lng: parseFloat(bs_offices[0].getAttribute('data-lng')) },
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
	if($('.block-consultants .cta-button .name')){
		$('.block-consultants .cta-button .name').innerHTML = cities[idx - 1].getAttribute('data-name');
	}
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

//inview fn & animate stat bars
var isGMapFirst = true;
addListenerMulti(window, 'scroll DOMMouseScroll', function (e) {
	var bodyTop = (document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight / 2;
	var gmapTop = $('.block-consultants').offsetTop;
	if (bodyTop >= gmapTop && isGMapFirst) {
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
							addMarkerWithTimeout(offices[i], i * 200);
						}
						setTimeout(function () {
							city(1);
						}, 600 + 400 * offices.length);
						isMapFirst = false;
					}
				});
			};
			$('body').appendChild(script);
		}
		isGMapFirst = false;
	}

});
