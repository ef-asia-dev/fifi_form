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
			imDate = imDate.replace('dddd, ', '').replace('yyyy', imdata[i].Year).replace('MM', imdata[i].Monthnum).replace('dd', imdata[i].Day);
			imDate += '<br/>' + imdata[i].Starttime + ' - ' + imdata[i].Endtime;
			var comDate = imDate.replace('dddd, ', '').replace('yyyy', imdata[i].Year).replace('MM', imdata[i].Monthnum).replace('dd', imdata[i].Day);
			if (imdata[i].Day < 10) {
				imdata[i].Day = "0" + imdata[i].Day;
			}
			comDate += '<br/>' + imdata[i].Starttime + ' - ' + imdata[i].Endtime;

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

	var ajaxDomain = "http://liuxue.ef.com.cn";
	if(ajaxDomain == "http://sitecore.ef.com"){
		ajaxDomain = "http://www.ef.co.kr";
	}

	var ajaxEndpoints = ["/Sites/LanguageSites/Services/LanguageSitesService.svc/GetInfoMeetings/?itemId={F2AB1D8A-732B-4F51-990F-CCA6B5C77D36}&marketcode={marketcode}&culture={culture}&count=8", "/Sites/LanguageSites/Services/LanguageSitesService.svc/GetInfoMeetings/?itemId={D5211C24-F3F6-4E62-B137-506CCD60A098}&marketcode={marketcode}&culture={culture}&count=8", "/Sites/LanguageSites/Services/LanguageSitesService.svc/GetInfoMeetings/?itemId={D921F999-CB55-4C30-8D90-BF9EE77388B1}&marketcode={marketcode}&culture={culture}&count=8"];

	//ils --> aya --> lsp
	for(var i=0; i<ajaxEndpoints.length;i++){
		var isEnd = i == (ajaxEndpoints.length-1) ? true:false;
		var url = ajaxDomain+ajaxEndpoints[i];
		url = url.replace("{marketcode}", bs_marketCode == "WE" ? "KR":bs_marketCode );
		url = url.replace("{culture}", getLangCode(bs_marketCode));
		newAjax(url, isEnd);
	}

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

$('.block-intro-bg').style.height = "200px";

var form_bro_config = {
	//twoStep: false,
	marketCode: 'CN',
	campaignName: 'BO',
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
	askFullName: false,
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
		question: '你想出国多久？',
		answers: {
			'----- 请选择 -----': '',
			'三个月以內': 'ILS',
			'三个月以上': 'AYA'
		}
	}],
	customSubmitSuccess: function customSubmitSuccess() {
		$('.form-bro .form-wrapper').style.display = "none";
		$('.form-bro .thanks').innerHTML = $('#label_form_thank_you').innerHTML;
		$('.form-bro .ty-wrapper').style.display = 'block';
	},
	locList: { // text: value
		'----- 请选择 -----': '',
		'安徽' : '34|安徽',
		'北京' : '11|北京',
		'重庆' : '50|重庆',
		'福建' : '35|福建',
		'甘肃' : '62|甘肃',
		'广东' : '44|广东',
		'广东 （深圳/珠海/中山/东莞）' : '广东 (深圳/珠海/中山/东莞)|广东 （深圳/珠海/中山/东莞）',
		'广西' : '45|广西',
		'贵州' : '52|贵州',
		'海南' : '46|海南',
		'河北' : '13|河北',
		'黑龙江' : '23|黑龙江',
		'河南' : '41|河南',
		'湖北' : '42|湖北',
		'湖南' : '43|湖南',
		'江苏' : '32|江苏',
		'江西' : '36|江西',
		'吉林' : '22|吉林',
		'辽宁' : '21|辽宁',
		'内蒙古' : '15|内蒙古',
		'宁夏' : '64|宁夏',
		'青海' : '63|青海',
		'陕西' : '61|陕西',
		'山东' : '37|山东',
		'上海' : '31|上海',
		'山西' : '14|山西',
		'四川' : '51|四川',
		'天津' : '12|天津',
		'新疆' : '65|新疆',
		'西藏' : '54|西藏',
		'云南' : '53|云南',
		'浙江' : '33|浙江'
	}
};

var form_pq_config = {
	//twoStep: false,
	marketCode: 'CN',
	campaignName: 'BO',
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
	askFullName: false,
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
		question: '目的地',
		answers: {
			'----- 请选择 -----': '',
			'伦敦': 'London',
	    '牛津': 'Oxford',
	    '剑桥': 'Cambridge',
	    '伊斯特本': 'Eastbourne',
	    '布莱顿': 'Brighton',
	    '伯恩茅斯': 'Bournemouth',
	    '布里斯托': 'Bristol',
	    '曼彻斯特': 'Manchester',
	    '都柏林': 'Dublin',
	    '纽约': 'New York',
	    '波士顿': 'Boston',
	    '华盛顿': 'Washington D.C.',
	    '迈阿密': 'Miami',
	    '芝加哥': 'Chicago',
	    '圣地亚哥': 'San Diego',
	    '圣塔芭芭拉': 'Santa Barbara',
	    '洛杉矶': 'Los Angeles',
	    '旧金山': 'San Francisco',
	    '西雅图': 'Seattle',
	    '夏威夷': 'Honolulu',
	    '多伦多': 'Toronto',
	    '温哥华': 'Vancouver',
	    '圣朱利安': 'St. Julians',
	    '开普敦': 'Cape Town',
	    '布里斯班': 'Brisbane',
	    '悉尼': 'Sydney',
	    '奥克兰': 'Auckland',
	    '新加坡': 'Singapore',
	    '巴黎': 'Paris',
	    '尼斯': 'Nice',
	    '柏林': 'Berlin',
	    '慕尼黑': 'Munich',
	    '马拉加': 'Malaga',
	    '巴塞罗纳': 'Barcelona',
	    '马德里': 'Madrid',
	    '塔玛琳多河岸': 'Playa Tamarindo',
	    '罗马': 'Rome',
			'东京': 'Tokyo'
		}
	}, { // if form is not rendered already
		step: 1,
		isMC: false, // **** make dropdown
		isQQ: true,
		radio_or_dropdown: 'dropdown', // if isMC is true, this is ignored
		required: true,
		question: '你想出国多久？',
		answers: {
			'----- 请选择 -----': '',
			'三个月以內': 'ILS',
			'三个月以上': 'AYA'
		}
	}, { // if form is not rendered already
		step: 1,
		isMC: false, // **** make dropdown
		radio_or_dropdown: 'dropdown', // if isMC is true, this is ignored
		required: true,
		question: '住宿',
		answers: {
			'----- 请选择 -----': '',
			'EF校内国际学生宿舍': 'EF Campus',
			'EF寄宿家庭': 'EF Homestay',
			'EF校外学生公寓': 'EF Residence',
			'我还不确定': 'Not sure'
		}
	}],
	customSubmitSuccess: function customSubmitSuccess() {
		$('.form-pq .form-wrapper').style.display = "none";
		$('.form-pq .thanks').innerHTML = $('#label_form_thank_you').innerHTML;
		$('.form-pq .ty-wrapper').style.display = 'block';
	},
	locList: { // text: value
		'----- 请选择 -----': '',
		'安徽' : '34|安徽',
		'北京' : '11|北京',
		'重庆' : '50|重庆',
		'福建' : '35|福建',
		'甘肃' : '62|甘肃',
		'广东' : '44|广东',
		'广东 （深圳/珠海/中山/东莞）' : '广东 (深圳/珠海/中山/东莞)|广东 （深圳/珠海/中山/东莞）',
		'广西' : '45|广西',
		'贵州' : '52|贵州',
		'海南' : '46|海南',
		'河北' : '13|河北',
		'黑龙江' : '23|黑龙江',
		'河南' : '41|河南',
		'湖北' : '42|湖北',
		'湖南' : '43|湖南',
		'江苏' : '32|江苏',
		'江西' : '36|江西',
		'吉林' : '22|吉林',
		'辽宁' : '21|辽宁',
		'内蒙古' : '15|内蒙古',
		'宁夏' : '64|宁夏',
		'青海' : '63|青海',
		'陕西' : '61|陕西',
		'山东' : '37|山东',
		'上海' : '31|上海',
		'山西' : '14|山西',
		'四川' : '51|四川',
		'天津' : '12|天津',
		'新疆' : '65|新疆',
		'西藏' : '54|西藏',
		'云南' : '53|云南',
		'浙江' : '33|浙江'
	}
};

var form_con_config = {
	//twoStep: false,
	marketCode: 'CN',
	campaignName: 'BO',
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
	askFullName: false,
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
		question: '你想出国多久？',
		answers: {
			'----- 请选择 -----': '',
			'三个月以內': 'ILS',
			'三个月以上': 'AYA'
		}
	}, { // if form is not rendered already
		step: 1,
		isMC: false, // **** make dropdown
		radio_or_dropdown: 'textarea', // if isMC is true, this is ignored
		required: false,
		question: '请告诉我们你还有什么特别想知道的：'
	}],
	customSubmitSuccess: function customSubmitSuccess() {
		$('.form-con .form-wrapper').style.display = "none";
		$('.form-con .thanks').innerHTML = $('#label_form_thank_you').innerHTML;
		$('.form-con .ty-wrapper').style.display = 'block';
	},
	locList: { // text: value
		'----- 请选择 -----': '',
		'安徽' : '34|安徽',
		'北京' : '11|北京',
		'重庆' : '50|重庆',
		'福建' : '35|福建',
		'甘肃' : '62|甘肃',
		'广东' : '44|广东',
		'广东 （深圳/珠海/中山/东莞）' : '广东 (深圳/珠海/中山/东莞)|广东 （深圳/珠海/中山/东莞）',
		'广西' : '45|广西',
		'贵州' : '52|贵州',
		'海南' : '46|海南',
		'河北' : '13|河北',
		'黑龙江' : '23|黑龙江',
		'河南' : '41|河南',
		'湖北' : '42|湖北',
		'湖南' : '43|湖南',
		'江苏' : '32|江苏',
		'江西' : '36|江西',
		'吉林' : '22|吉林',
		'辽宁' : '21|辽宁',
		'内蒙古' : '15|内蒙古',
		'宁夏' : '64|宁夏',
		'青海' : '63|青海',
		'陕西' : '61|陕西',
		'山东' : '37|山东',
		'上海' : '31|上海',
		'山西' : '14|山西',
		'四川' : '51|四川',
		'天津' : '12|天津',
		'新疆' : '65|新疆',
		'西藏' : '54|西藏',
		'云南' : '53|云南',
		'浙江' : '33|浙江'
	}
};

var form_im_config = {
	//twoStep: false,
	marketCode: 'CN',
	campaignName: 'BO',
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
	},
	askFullName: false,
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
		question: '你想出国多久？',
		answers: {
			'----- 请选择 -----': '',
			'三个月以內': 'ILS',
			'三个月以上': 'AYA'
		}
	}, { // if form is not rendered already
		step: 1,
		isMC: false, // **** make dropdown
		radio_or_dropdown: 'textarea', // if isMC is true, this is ignored
		required: false,
		question: '请告诉我们你还有什么特别想知道的：'
	}],
	customSubmitSuccess: function customSubmitSuccess() {
		$('.form-im .form-wrapper').style.display = "none";
		$('.form-im .thanks').innerHTML = $('#label_form_thank_you').innerHTML;
		$('.form-im .ty-wrapper').style.display = 'block';
	},
	locList: { // text: value
		'----- 请选择 -----': '',
		'安徽' : '34|安徽',
		'北京' : '11|北京',
		'重庆' : '50|重庆',
		'福建' : '35|福建',
		'甘肃' : '62|甘肃',
		'广东' : '44|广东',
		'广东 （深圳/珠海/中山/东莞）' : '广东 (深圳/珠海/中山/东莞)|广东 （深圳/珠海/中山/东莞）',
		'广西' : '45|广西',
		'贵州' : '52|贵州',
		'海南' : '46|海南',
		'河北' : '13|河北',
		'黑龙江' : '23|黑龙江',
		'河南' : '41|河南',
		'湖北' : '42|湖北',
		'湖南' : '43|湖南',
		'江苏' : '32|江苏',
		'江西' : '36|江西',
		'吉林' : '22|吉林',
		'辽宁' : '21|辽宁',
		'内蒙古' : '15|内蒙古',
		'宁夏' : '64|宁夏',
		'青海' : '63|青海',
		'陕西' : '61|陕西',
		'山东' : '37|山东',
		'上海' : '31|上海',
		'山西' : '14|山西',
		'四川' : '51|四川',
		'天津' : '12|天津',
		'新疆' : '65|新疆',
		'西藏' : '54|西藏',
		'云南' : '53|云南',
		'浙江' : '33|浙江'
	}
};

var form_bro = new fifi_form(form_bro_config);
var form_pq = new fifi_form(form_pq_config);
var form_con = new fifi_form(form_con_config);
var form_im = new fifi_form(form_im_config);

var formWrappers = document.querySelectorAll('.form-wrapper');
for (var i = 0; i < formWrappers.length; i++) {
	document.addEventListener('completedStep1', function(e) {
		$(e.detail.wrapper).nextElementSibling.style.display = 'block';
	}, false);
}

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

	offices = [];
	/* have to un-comment
	var bs_offices = document.querySelectorAll('.block-consultants .tab');
	for (var i = 0; i < document.querySelectorAll('.block-consultants .tab').length; i++) {
		offices.push({ lat: parseFloat(bs_offices[i].getAttribute('data-lat')), lng: parseFloat(bs_offices[i].getAttribute('data-lng')) });
	}*/

	var bs_offices = document.querySelectorAll('.block-consultants .tab');
  offices = [
    {
      lat: 39.913439, //bj
      lng: 116.477085
    },
    {
      lat: 30.658274, //cd
      lng: 104.068819
    },
    {
      lat: 23.132826, //gz
      lng: 113.329095
    },
    {
      lat: 30.273449, //hz
      lng: 120.154209
    },
    {
      lat: 31.232420, //sh0
      lng: 121.477786
    },
    {
      lat: 31.229633, //shpd
      lng: 121.515562
    },
    {
      lat: 31.109292, //shxz
      lng: 121.377631
    },
    {
      lat: 22.545379, //sz
      lng: 114.110527
    },
    {
      lat: 39.118852, //tj
      lng: 117.195722
    },
    {
      lat: 30.537152, //wh
      lng: 114.332859
    },
    {
      lat: 34.223475, //xa
      lng: 108.947390
    }
  ];

}

function setCityonMap(idx) {
	map.setCenter(new BMap.Point(offices[idx - 1]['lng'], offices[idx - 1]['lat']));
	map.setZoom(19);
	var bmpt = new BMap.Point(offices[idx - 1]['lng'], offices[idx - 1]['lat']);
	var bmmk = new BMap.Marker(bmpt);
	map.addOverlay(bmmk);

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

//inview fn & animate stat bars
addListenerMulti(window, 'scroll DOMMouseScroll', function (e) {
	var bodyTop = (document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight / 2;
	var gmapTop = $('.block-consultants').offsetTop;
	if (bodyTop >= gmapTop && document.querySelector("#map").innerHTML == '') {
		initMap();
		window.InitializeCnMap = function(a,b){
			if(a>0&&b>0){
				map = new BMap.Map("map");
				var d = new BMap.Point(a,b);
				map.centerAndZoom(d,19);
				city(1);
			}
		}
		InitializeCnMap(offices[0]['lng'], offices[0]['lat']);
	}

});
