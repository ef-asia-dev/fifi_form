'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var fifi_form = window.fifi_form || {};

function $(elem) {
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
function getCookie(key) {
  var result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie);
  return result ? result[1] : null;
}; // readCookie
function ajaxPost(link, data, onSuccess, _) {
  var request = new XMLHttpRequest();
  request.open('POST', link, true);
  request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  request.send(JSON.stringify(data));
  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == 200) {
      var _data = JSON.parse(request.responseText);
      if (_.cusId == '') {
        _.cusId = _data.FormId;
      }
      onSuccess();
    }
  };
};
function $extendObj(_def, addons) {
  if (typeof addons !== "undefined") {
    for (var prop in _def) {
      if (addons[prop] != undefined) {
        _def[prop] = addons[prop];
      }
    }
  }
};

fifi_form = function fifi_form(settings) {
  var _ = this;
  function ajaxGet(link) {
    var request = new XMLHttpRequest();
    request.open('GET', link, true);

    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var data = JSON.parse(request.responseText);
      } else {
        // We reached our target server, but it returned an error

      }
    };
    request.onerror = function () {
      // There was a connection error of some sort
    };
    request.send();
  };

  _.def = {
    submitToLive: false,
    formRendered: false,
    wrapper: '.form-wrapper',
    formType: 'CAMP', // CAMP or BR
    marketCode: 'hk',
    campaignName: 'Form Testing Campaign',
    campaignAllocationPrograms: ['LT', 'ILC', 'ILS'],
    phoneTypeInPos: 'MobilePhone', // or HomePhone
    twoStep: true,
    addressTBC: {
      required: false
    },
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
        labelText: 'I accept the <a href="javascript: void(0);" target="_blank">Terms and Conditions</a>.'
      }
    },
    additionalQuestions: [{ // if form is not rendered already
      step: 2,
      isMC: true, // **** make dropdown
      radio_or_dropdown: false, // if isMC is true, this is ignored
      required: true,
      question: 'How did you hear about EF?',
      answers: ['from Facebook', 'from Friends', 'from Google']
    }, {
      step: 2,
      isMC: false,
      radio_or_dropdown: 'radio',
      required: false,
      question: 'How long do you want to travel?',
      answers: ['2 weeks', '4 weeks', '3 months']
    }, {
      step: 2,
      isMC: false,
      radio_or_dropdown: 'dropdown',
      required: true,
      isQQ: true,
      question: 'How long do you want to travel?',
      answers: { // text: value
        'Please choose': '',
        '2 weeks': '2w',
        '4 weeks': '4w',
        '3 months': '3m'
      }
    }, {
      step: 1,
      isMC: true,
      radio_or_dropdown: false,
      required: true,
      question: 'Which animals do you like?',
      answers: [// text: value
      'Cats', 'Dogs', 'Dolphins', 'Pigs', 'Ducks', 'Elephants', 'Giraffe']
    }],
    askFullName: false, // if form is not rendered already
    showPlaceholder: false,
    placeholders: { // if form is not rendered already
      first_name: 'First Name',
      last_name: 'Last Name',
      full_name: 'Full Name',
      birthdate: 'Birth Date',
      email: 'Email',
      phone: 'Mobile Phone',
      loc: 'City',
      address: 'Address',
      next: 'Next',
      submit: 'Submit'
    },
    autocomplete: {
      use: true,
      autolist: {
        first_name: {
          name: 'fname',
          auto: 'given-name'
        },
        last_name: {
          name: 'lname',
          auto: 'family-name'
        },
        full_name: {
          name: 'fname',
          auto: 'name'
        },
        email: {
          name: 'email',
          auto: 'email'
        },
        phone: {
          name: 'phone',
          auto: 'tel'
        },
        address: {
          name: 'address',
          auto: 'street-address'
        }
      }
    },
    locList: { // text: value
      'Choose': '',
      '北京': '11|北京',
      '重庆': '50|重庆'
    },
    customSubmitSuccess: function customSubmitSuccess() {},
    customSubmitError: function customSubmitError() {},
    onEachValidationSuccess: function onEachValidationSuccess() {
      //document.querySelector('body').style.background = 'red';
    },
    onEachValidationError: function onEachValidationError() {
      //document.querySelector('body').style.background = 'red';
    },
    customValidation: {
      first_name: {
        min: 1,
        max: 50,
        required: true,
        regex: /^[^0-9]+$/
      },
      last_name: {
        min: 1,
        max: 50,
        required: true,
        regex: /^[^0-9]+$/
      },
      full_name: {
        min: 1,
        max: 50,
        required: true,
        regex: /^[^0-9]+$/
      },
      birthdate: {
        min: '1911-01-01',
        max: '2011-12-31',
        default: '',
        required: true,
        regex: /^[\d\s\+\-]{4}-[\d\s\+\-]{2}-[\d\s\+\-]{2}$/
      },
      email: {
        min: 1,
        max: 50,
        required: true,
        regex: /^[\w+.-]+@([\w+.-]+\.)+[A-Za-z]{2,6}$/
      },
      phone: {
        min: 5,
        max: 20,
        required: true,
        regex: /^[\d\s\+\-]{5,20}$/
      },
      address: {
        min: 1,
        max: 200,
        required: true,
        regex: /./
      }
    }
  };

  $extendObj(_.def, settings);

  _.fields = {};

  if (_.def.askFullName) {
    _.fields['full_name'] = 'text';
  }
  _.fields['first_name'] = 'text';
  _.fields['last_name'] = 'text';
  _.fields['birthdate'] = 'date';
  _.fields['email'] = 'email';
  _.fields['phone'] = 'tel';
  _.fields['address'] = 'text';

  _.invalidNum = 0;

  _.curStep = 1;
  _.cusId = '';
  _.clickedBtn = false;

  _.init();
};

fifi_form.prototype.appendAdditionalQ = function (appendHTML, curStep) {
  var _ = this;
  if (_.def.twoStep === false) {
    curStep = 1;
  }
  if (_.def.additionalQuestions.length > 0) {
    for (var g = 0; g < _.def.additionalQuestions.length; g++) {
      if (_.def.twoStep === true && curStep === _.def.additionalQuestions[g]['step'] || _.def.twoStep === false) {
        appendHTML += '<div class="form-row add-Question';
        if (curStep == 1 && _.def.additionalQuestions[g]['required'] == true) {
          appendHTML += ' add-Q-required';
        }
        if (_.def.additionalQuestions[g]['isMC'] == false && _.def.additionalQuestions[g]['radio_or_dropdown'] == 'dropdown') {
          appendHTML += ' add-Q-select';
        }
        if (_.def.additionalQuestions[g]['isQQ']) {
          appendHTML += ' is-qualifying';
        }
        appendHTML += '">';
        appendHTML += '<div class="label">' + _.def.additionalQuestions[g]['question'] + '</div>';
        if (_.def.additionalQuestions[g]['isMC'] == false && _.def.additionalQuestions[g]['radio_or_dropdown'] == 'dropdown') {
          appendHTML += '<select id="aq-' + g + '">';
        }
        if (_.def.additionalQuestions[g]['isMC'] == true || _.def.additionalQuestions[g]['isMC'] == false && _.def.additionalQuestions[g]['radio_or_dropdown'] == 'radio') {
          for (var p = 0; p < _.def.additionalQuestions[g]['answers'].length; p++) {
            var fldN = 'aq-' + g + '_' + _.def.additionalQuestions[g]['answers'][p].replace(' ', '');
            appendHTML += '<div class="form-subrow">';
            var isRadio = _.def.additionalQuestions[g]['isMC'] == false ? 'radio' : 'checkbox';
            appendHTML += '<input type="' + isRadio + '" name="aq-' + g + '" id="' + fldN + '" value="' + _.def.additionalQuestions[g]['answers'][p] + '"/>';
            appendHTML += '<label for="' + fldN + '">';
            appendHTML += '<span class="label-subtext">' + _.def.additionalQuestions[g]['answers'][p] + '</span>';
            appendHTML += '</label></div>';
          }
        } else {
          for (var p in _.def.additionalQuestions[g]['answers']) {
            appendHTML += '<option value="' + _.def.additionalQuestions[g]['answers'][p] + '">' + p + '</option>';
          }
        }
        if (_.def.additionalQuestions[g]['isMC'] == false && _.def.additionalQuestions[g]['radio_or_dropdown'] == 'dropdown') {
          appendHTML += '</select>';
        }
        if (_.def.additionalQuestions[g]['isMC'] == false && _.def.additionalQuestions[g]['radio_or_dropdown'] == 'input') {
          appendHTML += '<input type="text"/>';
        }
        if (_.def.additionalQuestions[g]['isMC'] == false && _.def.additionalQuestions[g]['radio_or_dropdown'] == 'textarea') {
          appendHTML += '<textarea rows="3" ></textarea>';
        }
        appendHTML += '</div>';
      }
    }
  }
  return appendHTML;
};

fifi_form.prototype.appendForm = function () {
  var _ = this;
  var appendHTML = '<form>';

  if (_.def.twoStep == true) {
    appendHTML += '<div class="form-step-1">';
  }

  for (var k in _.fields) {
    var extraClass = '';
    if (k == "address") {
      extraClass = ' form-address-row form-hidden';
      if (!_.def.addressTBC.required) {
        _.def.customValidation.address.required = false;
      }
    }
    if (k !== 'last_name') {
      if (_.def.askFullName && k === 'first_name') {
        extraClass = ' form-hidden';
      }
      appendHTML += '<div class="form-row' + extraClass + '">';
    }
    if (k === 'first_name' || k === 'last_name') {
      appendHTML += '<div class="name-row">';
    }
    if (typeof _.def.autocomplete.autolist[k] === "undefined") {
      _.def.autocomplete.autolist[k] = {};
      _.def.autocomplete.autolist[k].name = _.def.placeholders[k];
      _.def.autocomplete.autolist[k].auto = _.def.placeholders[k];
    }
    appendHTML += '<div class="label">' + _.def.placeholders[k] + '</div>';
    appendHTML += '<input class="field_' + k + '" name="' + _.def.autocomplete.autolist[k].name + '" autocomplete="' + _.def.autocomplete.autolist[k].auto + '" type="' + _.fields[k] + '"';
    if (_.def.showPlaceholder == true) {
      appendHTML += ' placeholder="' + _.def.placeholders[k] + '"';
    }
    if (k === 'birthdate') {
      appendHTML += ' value="' + _.def.customValidation.birthdate.default + '"';
    }
    appendHTML += ' />' + '</div>';
    if (k === 'last_name') {
      appendHTML += '</div>';
    }
  }

  var hideLoc = Object.keys(_.def.locList).length > 2 ? '' : ' form-hidden';
  appendHTML += '<div class="form-row' + hideLoc + '">';
  appendHTML += '<div class="label">' + _.def.placeholders['loc'] + '</div>';
  appendHTML += '<select id="locList">';
  for (var l in _.def.locList) {
    appendHTML += '<option value="' + _.def.locList[l] + '">' + l + '</option>';
  }
  appendHTML += '</select></div>';

  appendHTML = _.appendAdditionalQ(appendHTML, 1);

  if (_.def.twoStep == true) {
    appendHTML += '</div>';
    appendHTML += '<div class="form-step-2">';
    appendHTML = _.appendAdditionalQ(appendHTML, 2);
    appendHTML += '</div>';
  }

  appendHTML += '</form>';

  $(_.def.wrapper).innerHTML += appendHTML;

  if (_.def.twoStep) {
    var add_field = $(_.def.wrapper + ' .form-address-row').cloneNode(true);
    $(_.def.wrapper + ' .form-step-2').appendChild(add_field);
    document.addEventListener('keyup', function (e) {
      if (e.target == $(_.def.wrapper + ' .form-step-2 .field_address')) {
        $(_.def.wrapper + ' .form-step-1 .field_address').value = e.target.value;
      }
    }, false);
    //$(`${_.def.wrapper} .form-step-2`).insertBefore(add_field, document.querySelectorAll(`${_.def.wrapper} .form-step-2 .form-row`)[0]);
  }

  _.createCheckrows();
  _.createSubmitButton();
};

fifi_form.prototype.clickedSubmit = function () {
  var _ = this;

  if (!_.clickedBtn) {
    (function () {

      // from Roberto's
      var computeTrackingData = function computeTrackingData(trackingData) {
        var trackingObj = {};
        if (trackingData) {
          var trackingDataBits = trackingData.split('|');
          for (var i = 0; i < trackingDataBits.length; i += 1) {
            var trackingEntryBits = trackingDataBits[i].split(':');
            trackingObj[trackingEntryBits[0]] = trackingEntryBits[1];
          } // for
        } // if
        return trackingObj;
      }; // computeTrackingData

      var getTrackingData = function getTrackingData() {
        var trackingDetails = {
          TritonId: getCookie('triton'),
          ExternalreferringUrl: getCookie('OriginalReferringURl'),
          EntryPage: getCookie('OriginalEntryUrl'),
          EntrySourceCode: window.location.href.indexOf('source=') > -1 ? window.location.search.split('source=')[1].split(',')[0] : "00700",
          Etag: window.location.href.indexOf('source=') > -1 ? window.location.search.split('source=')[1].split(',')[1] : "",
          TritonPageViewID: getCookie('pageview'),
          ReferringUrl: document.referrer,
          FormUrl: window.location.href
        };

        var tritonVisitId = getCookie('tts');
        if (tritonVisitId) {
          var tritonVisitIdBits = tritonVisitId.split('&');
          var tritonVisitValues = tritonVisitIdBits[0].split('='); // id
          trackingDetails.tritonVisitId = tritonVisitValues[1];
        } // if

        var trackingObj = computeTrackingData(getCookie('TrackingData'));
        $extendObj(trackingDetails, trackingObj);
        trackingDetails.EntrySourceCode = trackingDetails.SourceCode;
        trackingDetails.PartnerCode = typeof trackingDetails.PartnerName !== 'string' || trackingDetails.PartnerName.toLowerCase() === 'unknown' ? '' : trackingDetails.PartnerName;

        return trackingDetails;
      }; // getTrackingData


      var createComments = function createComments() {
        var comments = '';
        var addQ = void 0;
        if (_.def.twoStep) {
          if (_.curStep === 1) {
            addQ = document.querySelectorAll(_.def.wrapper + ' .form-step-1 [class*="add-Question"]');
          } else {
            addQ = document.querySelectorAll(_.def.wrapper + ' [class*="add-Question"]');
          }
        }
        if (typeof addQ !== "undefined") {
          for (var j = 0; j < addQ.length; j++) {
            comments += '\u3010' + addQ[j].querySelector('.label').textContent + '\u3011';
            if (addQ[j].querySelectorAll('select').length > 0) {
              var val = addQ[j].querySelector('select').value == '' ? 'empty answer' : addQ[j].querySelector('select').value;
              comments += val;
            } else if (addQ[j].querySelectorAll('input[type="text"]').length > 0) {
              comments += addQ[j].querySelectorAll('input[type="text"]')[0].value + ';';
            } else if (addQ[j].querySelectorAll('textarea').length > 0) {
              comments += addQ[j].querySelectorAll('textarea')[0].value + ';';
            } else {
              for (var k = 1; k < addQ[j].children.length; k++) {
                if (addQ[j].children[k].querySelector('input').checked) {
                  comments += addQ[j].children[k].querySelector('input').value + ';';
                }
              }
            }
          }
        }
        return comments;
      };

      var createSubmissionObject = function createSubmissionObject(closing) {
        var prod = "LS";
        var prog = "ILS";
        var allocation = _.def.campaignAllocationPrograms.toString();
        if ($(_.def.wrapper + ' .is-qualifying')) {
          if ($(_.def.wrapper + ' .is-qualifying').querySelectorAll('select').length > 0) {
            prog = $(_.def.wrapper + ' .is-qualifying').querySelector('select').value;
          } else {
            prog = $(_.def.wrapper + ' .is-qualifying').querySelector('input:checked').value;
          }
        } else {
          prog = _.def.campaignAllocationPrograms[Math.floor(_.def.campaignAllocationPrograms.length * Math.random())];
        }
        if (prog.toLowerCase() == 'ils' || prog.toLowerCase() == 'ilc' || prog.toLowerCase() == 'lsp') {
          prod = "LS";
          allocation = "ILS";
        } else {
          prod = "LY";
          allocation = "LY";
        }

        var obj = {
          customer: {
            FirstName: $(_.def.wrapper + ' .field_first_name').value,
            LastName: $(_.def.wrapper + ' .field_last_name').value,
            Email: $(_.def.wrapper + ' .field_email').value,
            AddressLine1: $(_.def.wrapper + ' .field_address').value,
            DateOfBirth: $(_.def.wrapper + ' .field_birthdate').value + "T00:00:00.000Z",
            City: "",
            PostalCode: "",
            CountryCode: _.def.marketCode,
            PhoneRadio: _.def.phoneTypeInPos == 'MobilePhone' ? 'MP' : 'HP',
            HomePhone: _.def.phoneTypeInPos == 'MobilePhone' ? "" : $(_.def.wrapper + ' .field_phone').value,
            MobilePhone: _.def.phoneTypeInPos == 'MobilePhone' ? $(_.def.wrapper + ' .field_phone').value : "",
            WantsBrochure: $(_.def.wrapper + ' #WantsBrochure').checked,
            HasAcceptedTerms: $(_.def.wrapper + ' #AcceptTnC').checked,
            YesEmailMarketing: $(_.def.wrapper + ' #WantsInfo').checked,
            StateRegionCode: Object.keys(_.def.locList).length > 2 ? $(_.def.wrapper + ' #locList').value.split('|')[0] : '',
            StateRegionName: Object.keys(_.def.locList).length > 2 ? $(_.def.wrapper + ' #locList').value.split('|')[1] : '',
            Comments: createComments()
          },
          extendedDetail: {
            ProductCode: prod,
            ProgramCode: prog,
            EFComMarketCode: _.def.marketCode,
            BrowseCountryCode: getCookie('efcc'), // Default cookie name
            WantsMoreInfo: $(_.def.wrapper + ' #WantsInfo').checked,
            WantsBrochure: $(_.def.wrapper + ' #WantsBrochure').checked,
            DeviceType: EF.isMobile.any ? 'MobilePhone' : 'Desktop' //, // isMobile
            // EnqFormType:"BRF", // fixed?
            // "EnqFormId":"BRF-Campaign"
          },
          tracking: getTrackingData(),
          internalData: {
            PhoneType: _.def.phoneTypeInPos,
            FormType: _.def.formType,
            AddressType: '',
            Latitude: 0,
            Longitude: 0,
            RouteAddress: '',
            LongRouteAddress: '',
            GoogleCountryCode: '',
            GooglePartialMatch: '',
            GoogleLocationType: '',
            Neighborhood: '',
            SubLocality: ''
          },
          CampaignData: {
            CampaignName: _.def.campaignName,
            CampaignAllocationPrograms: allocation,
            CampaignAllocationCode: _.def.campaignAllocationPrograms.toString().indexOf(',') > -1 ? "mixed" : "single",
            CampaignQuestionAnswer: [{
              Question: "",
              Answer: ""
            }]
          }
        };

        if (_.curStep === 2 && typeof closing === "undefined") {
          obj = {
            EFComMarketCode: _.def.marketCode,
            StateRegionCode: Object.keys(_.def.locList).length > 2 ? $(_.def.wrapper + ' #locList').value.split('|')[0] : '',
            StateRegionName: Object.keys(_.def.locList).length > 2 ? $(_.def.wrapper + ' #locList').value.split('|')[1] : '',
            AddressLine1: $(_.def.wrapper + ' .field_address').value
          };
        }
        if (typeof closing != "undefined" && closing === true) {
          obj.extendedDetail.isCompleted = true;
        }
        return obj;
      };

      var hideFormLogicRow = function hideFormLogicRow(tar) {
        if ($(_.def.wrapper + ' .form-' + tar).querySelector('#' + tar).checked) {
          $(_.def.wrapper + ' .form-' + tar).style.display = 'none';
          if (tar == 'WantsBrochure') {
            _.def.customValidation.address.required = false;
            $(_.def.wrapper + ' .form-step-' + (_.curStep - 1) + ' .form-address-row').style.display = 'none';
            $(_.def.wrapper + ' .form-step-' + _.curStep + ' .form-address-row').style.display = 'block';
          }
        }
      };

      var createUrl = function createUrl() {
        var url = _.def.submitToLive ? 'https://services.ef.com/secureformsapi/campaign/' : 'https://stg-efcom-lb.eflangtech.com/secureformsapi/campaign/';
        /*if (window.location.href.indexOf('qa') > -1 || window.location.href.indexOf('sitecore') > -1 || window.location.href.indexOf('localhost') > -1) {
          url = 'https://stg-efcom-lb.eflangtech.com/secureformsapi/';
        } else {*/
        url = 'https://services.ef.com/secureformsapi/';
        //}
        if (_.curStep === 2) {
          url += 'ConfirmAddressCampaign/';
        } else {
          url += 'Campaign/';
        }
        url += _.cusId;
        return url;
      };

      _.clickedBtn = true;

      addClass($(_.def.wrapper + ' .form-submit'), 'submitting');

      if (_.runValidation(_.def.onEachValidationSuccess, _.def.onEachValidationError)) {
        (function () {
          //success
          //https://services.ef.com/secureformsapi/campaign/
          var event = void 0;
          ajaxPost(createUrl(), createSubmissionObject(), function () {
            if (_.def.twoStep) {
              $(_.def.wrapper + ' .form-submit').innerHTML = _.def.placeholders.submit;
              $(_.def.wrapper + ' .form-step-' + _.curStep).style.display = 'none';
              _.curStep++;
              if (_.curStep === 2) {
                $(_.def.wrapper + ' .form-step-' + _.curStep).style.display = 'block';
                hideFormLogicRow('WantsBrochure');
                hideFormLogicRow('WantsInfo');
                hideFormLogicRow('AcceptTnC');
                if (window.CustomEvent) {
                  event = new CustomEvent('completedStep1', { detail: { wrapper: _.def.wrapper } });
                } else {
                  event = document.createEvent('CustomEvent');
                  event.initCustomEvent('completedStep1', true, true, { wrapper: _.def.wrapper });
                }
                document.dispatchEvent(event);
              }
              if (_.curStep > 2) {
                var logicQ = document.querySelectorAll(_.def.wrapper + ' .form-logic-Q');
                for (var i = 0; i < logicQ.length; i++) {
                  logicQ[i].style.display = 'none';
                }
                ajaxPost(createUrl(), createSubmissionObject(true), function () {
                  $(_.def.wrapper + ' .form-button-row').style.display = 'none';
                  _.def.customSubmitSuccess();
                  if (window.CustomEvent) {
                    event = new CustomEvent('finalThank', { detail: { wrapper: _.def.wrapper } });
                  } else {
                    event = document.createEvent('CustomEvent');
                    event.initCustomEvent('finalThank', true, true, { wrapper: _.def.wrapper });
                  }
                  document.dispatchEvent(event);
                }, _);
              }
            } else {
              _.def.customSubmitSuccess();
              if (window.CustomEvent) {
                event = new CustomEvent('finalThank', { detail: { wrapper: _.def.wrapper } });
              } else {
                event = document.createEvent('CustomEvent');
                event.initCustomEvent('finalThank', true, true, { wrapper: _.def.wrapper });
              }
              document.dispatchEvent(event);
            }
            removeClass($(_.def.wrapper + ' .form-submit'), 'submitting');
            _.clickedBtn = false;
          }, _);
        })();
      } else {
        //error
        _.def.customSubmitError();
        removeClass($(_.def.wrapper + ' .form-submit'), 'submitting');
        _.clickedBtn = false;
      }
    })();
  }
};

fifi_form.prototype.createCheckrows = function () {
  var _ = this;
  var appendHTML = void 0;

  function addressShowHide(val, first) {
    first = typeof first === "undefined" ? false : true;
    val = (typeof val === 'undefined' ? 'undefined' : _typeof2(val)) === "object" ? val.target.checked : val;
    var addRows = $(_.def.wrapper).querySelectorAll('.form-address-row');
    if (val === true) {
      if (_.def.addressTBC.required === true) {
        for (var k = 0; k < addRows.length; k++) {
          removeClass(addRows[k], 'form-hidden');
          _.def.customValidation.address.required = true;
        }
      } else {
        addClass(addRows[0], 'form-hidden');
        if (addRows.length > 1) {
          removeClass(addRows[1], 'form-hidden');
        }
        _.def.customValidation.address.required = false;
      }
    } else {
      for (var _k = 0; _k < addRows.length; _k++) {
        addClass(addRows[_k], 'form-hidden');
        _.def.customValidation.address.required = false;
        if (first === false) {
          if (hasClass(addRows[_k].children[1], 'input-invalid')) {
            _.invalidNum--;
            removeClass(addRows[_k].children[1], 'input-invalid');
          }
        }
      }
    }
  }

  for (var i in _.def.formLogic) {
    appendHTML = '<div class="form-row form-logic-Q form-' + i;
    if (_.def.formLogic[i].showOnForm === false) {
      appendHTML += ' form-hidden';
    }
    appendHTML += '"></div>';

    $(_.def.wrapper + ' form').innerHTML += appendHTML;

    var chkbox = document.createElement('input');
    chkbox.type = "checkbox";
    chkbox.name = i;
    chkbox.id = i;
    if (_.def.formLogic[i].prechecked === true) {
      chkbox.setAttribute('checked', true);
      addressShowHide(true, true);
    }

    if (i == "DataCollection") {
      var stment = document.createElement('div');
      stment.className = "data-collection-statement";
      var stmentText = "<h4>개인정보 수집 및 이용에 대한 안내</h4>\
      개인정보 수집이용 동의는 고객의 개인정보 보호를 위하여 EF Education First Korea이 실시하는 개인정보 수집의 목적과 그 정보의 항목, 보유 및 이용기간에 대한 취급방침을 반드시 읽어보시고, 동의 여부를 선택하여 주시기 바랍니다.<br/>\
      ------------------------------<br/>\
      1. 수집하는 개인정보 항목<br/>\
      - 필수항목 : 성명, 이메일 주소, 휴대 전화번호, 집 전화번호,  주소<br/>\
      - 선택항목 : 우편번호, 생년월일, 성별, 어학연수 계획, 정보수신 동의 등<br/>\
      - 자동수집항목 : IP Address, 서비스 이용기록 등<br/>\
      ------------------------------<br/>\
      2. 개인정보의 수집 및 이용 목적<br/>\
      - 이름 : 서비스 이용에 따른 처리를 위한 본인식별<br/>\
      - 이메일 주소, 휴대 전화번호, 집 전화번호, 주소 : 고지사항 전달, 본인 의사확인, 불만처리 등 의사소통 경로의 확보, 새로운 프로그램 또는 서비스, 이벤트 정보 등 최신 정보안내, 청구서, 경품 등 물품배송 시 정확한 배송지의 확보, 인구통계학적 분석자료(이용자의 연령별, 성별, 지역별 통계분석) 등을 위하여 사용됩니다.<br/>\
      - 그 외 선택항목: 개인맞춤서비스를 제공하기 위한 자료로 사용됩니다.<br/>\
      ------------------------------<br/>\
      3. 개인정보의 보유 및 이용기간<br/>\
      EF Education First Korea가 서비스를 위해 제공 받는 이용자 정보에 대하여 회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 관계법령이 정한 일정한 기간 동안 회원정보를 보관합니다.<br/>\
      - 정보요청/상담의 경우 : 수신거부의사를 밝힌 경우까지 이용<br/>\
      - 계약 또는 청약 철회 등에 관한 기록: 5년<br/>\
      - 대금결제 및 재화 등의 공급에 관한 기록: 5년<br/>\
      - 소비자 불만 또는 분쟁 처리에 관한 기록: 3년<br/>\
      ------------------------------<br/>\
      4. 개인정보 제공 동의 거부할 권리가 있다는 사실 및 동의 거부에 따른 불이익의 내용<br/>\
      고객님의 개인정보 제공 동의를 거부할 수 있으며, 거부 시 서비스 제공이 제한될 수 있습니다";

      $(_.def.wrapper + (' form .form-' + i)).appendChild(stment);
      $(_.def.wrapper + (' form .form-' + i) + ' .data-collection-statement').innerHTML = stmentText;
    }

    var lbl = document.createElement('label');
    lbl.setAttribute('for', i);
    var lblSpan = document.createElement('span');
    lblSpan.className = "label-subtext";
    lbl.appendChild(chkbox);
    lblSpan.innerHTML = _.def.formLogic[i].labelText;
    lbl.appendChild(lblSpan);
    $(_.def.wrapper + (' form .form-' + i)).appendChild(lbl);
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (_.def.addressTBC.required) {
      $(_.def.wrapper + ' #WantsBrochure').onchange = addressShowHide;
    }
  }, false);
};

fifi_form.prototype.createSubmitButton = function () {
  var _ = this;
  var btn = document.createElement("a");
  var btnText = _.def.twoStep == true ? _.def.placeholders.next : _.def.placeholders.submit;
  var btnTextNode = document.createTextNode(btnText);
  btn.setAttribute('class', 'form-submit');
  btn.setAttribute('href', 'javascript:void(0);');
  btn.appendChild(btnTextNode);
  btn.addEventListener('click', _.clickedSubmit.bind(this), false);
  $(_.def.wrapper + ' form').innerHTML += '<div class="form-row form-button-row"></div>';
  $(_.def.wrapper + ' .form-button-row').appendChild(btn);
};

fifi_form.prototype.init = function () {
  var _ = this;
  if (_.def.formRendered === false) {
    _.appendForm();
  }
};

/**
 * isMobile.js v0.4.1
 *
 * A simple library to detect Apple phones and tablets,
 * Android phones and tablets, other mobile devices (like blackberry, mini-opera and windows phone),
 * and any kind of seven inch device, via user agent sniffing.
 *
 * @author: Kai Mallea (kmallea@gmail.com)
 * @author: Roberto Baldin (roberto.baldin@ef.com) -> Adaptations
 *
 * @license: http://creativecommons.org/publicdomain/zero/1.0/
 */

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
};

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD modules support
    define([], factory);
  } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
    // RequireJS support
    module.exports = factory();
  } else {
    // Browser global object / window
    root.EF = root.EF || {};
    root.EF.isMobile = factory();
  } // else
})(window || {}, function () {

  var apple_phone = /iPhone/i,
      apple_ipod = /iPod/i,
      apple_tablet = /iPad/i,
      android_phone = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i,
      // Match 'Android' AND 'Mobile'
  android_tablet = /Android/i,
      amazon_phone = /(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,
      amazon_tablet = /(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,
      windows_phone = /Windows Phone/i,
      windows_tablet = /(?=.*\bWindows\b)(?=.*\bARM\b)/i,
      // Match 'Windows' AND 'ARM'
  other_blackberry = /BlackBerry/i,
      other_blackberry_10 = /BB10/i,
      other_opera = /Opera Mini/i,
      other_chrome = /(CriOS|Chrome)(?=.*\bMobile\b)/i,
      other_firefox = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i,
      // Match 'Firefox' AND 'Mobile'
  seven_inch = new RegExp('(?:' + // Non-capturing group

  'Nexus 7' + // Nexus 7

  '|' + // OR

  'BNTV250' + // B&N Nook Tablet 7 inch

  '|' + // OR

  'Kindle Fire' + // Kindle Fire

  '|' + // OR

  'Silk' + // Kindle Fire, Silk Accelerated

  '|' + // OR

  'GT-P1000' + // Galaxy Tab 7 inch

  ')', // End non-capturing group

  'i'); // Case-insensitive matching

  var match = function match(regex, userAgent) {
    return regex.test(userAgent);
  };

  var IsMobileClass = function IsMobileClass(userAgent) {
    var ua = userAgent || navigator.userAgent;

    // Facebook mobile app's integrated browser adds a bunch of strings that
    // match everything. Strip it out if it exists.
    var tmp = ua.split('[FBAN');
    if (typeof tmp[1] !== 'undefined') {
      ua = tmp[0];
    }

    // Twitter mobile app's integrated browser on iPad adds a "Twitter for
    // iPhone" string. Same probable happens on other tablet platforms.
    // This will confuse detection so strip it out if it exists.
    tmp = ua.split('Twitter');
    if (typeof tmp[1] !== 'undefined') {
      ua = tmp[0];
    }

    this.apple = {
      phone: match(apple_phone, ua),
      ipod: match(apple_ipod, ua),
      tablet: !match(apple_phone, ua) && match(apple_tablet, ua),
      device: match(apple_phone, ua) || match(apple_ipod, ua) || match(apple_tablet, ua)
    };
    this.amazon = {
      phone: match(amazon_phone, ua),
      tablet: !match(amazon_phone, ua) && match(amazon_tablet, ua),
      device: match(amazon_phone, ua) || match(amazon_tablet, ua)
    };
    this.android = {
      phone: match(amazon_phone, ua) || match(android_phone, ua),
      tablet: !match(amazon_phone, ua) && !match(android_phone, ua) && (match(amazon_tablet, ua) || match(android_tablet, ua)),
      device: match(amazon_phone, ua) || match(amazon_tablet, ua) || match(android_phone, ua) || match(android_tablet, ua)
    };
    this.windows = {
      phone: match(windows_phone, ua),
      tablet: match(windows_tablet, ua),
      device: match(windows_phone, ua) || match(windows_tablet, ua)
    };
    this.other = {
      blackberry: match(other_blackberry, ua),
      blackberry10: match(other_blackberry_10, ua),
      opera: match(other_opera, ua),
      firefox: match(other_firefox, ua),
      chrome: match(other_chrome, ua),
      device: match(other_blackberry, ua) || match(other_blackberry_10, ua) || match(other_opera, ua) || match(other_firefox, ua) || match(other_chrome, ua)
    };
    this.seven_inch = match(seven_inch, ua);
    this.any = this.apple.device || this.android.device || this.windows.device || this.other.device || this.seven_inch;

    // excludes 'other' devices and ipods, targeting touchscreen phones
    this.phone = this.apple.phone || this.android.phone || this.windows.phone;

    // excludes 7 inch devices, classifying as phone or tablet is left to the user
    this.tablet = this.apple.tablet || this.android.tablet || this.windows.tablet;

    if (typeof window === 'undefined') {
      return this;
    }
  };

  var instantiate = function instantiate() {
    var IM = new IsMobileClass();
    IM.Class = IsMobileClass;
    return IM;
  };

  return instantiate();
});

fifi_form.prototype.runValidation = function (validCB, invalidCB) {
  var _ = this;

  function onValid(cur) {
    if (hasClass(cur, 'input-invalid')) {
      _.invalidNum--;
      removeClass(cur, 'input-invalid');
    }
    validCB();
  };

  function onInvalid(cur) {
    if (!hasClass(cur, 'input-invalid')) {
      addClass(cur, 'input-invalid');
      if (cur.querySelectorAll('input[type="checkbox"]').length > 0) {
        // is checkbox row
        cur.querySelector('input[type="checkbox"]').addEventListener('change', checkHandler, false);
      } else {
        // not checkbox row
        if (hasClass(cur, 'add-Question')) {
          if (cur.querySelectorAll('select').length > 0) {
            cur.querySelector('select').addEventListener('change', function (e) {
              inputHandler(e, cur);
            }, false);
          } else {
            if (cur.querySelectorAll('input').length > 0) {
              cur.querySelector('input').addEventListener('change', function (e) {
                inputHandler(e, cur);
              }, false);
            }
          }
        } else {
          cur.addEventListener('change', function (e) {
            inputHandler(e, cur);
          }, false);
        }
      }
      _.invalidNum++;
    }
    invalidCB();
  };

  function inputHandler(e, targ) {
    var curField = void 0;
    if (hasClass(targ, 'add-Question')) {
      curField = targ;
    } else {
      if (e.target.tagName == "SELECT") {
        curField = "#locList";
      } else {
        curField = e.target.className.split(' ')[0].split('field_')[1];
      }
    }
    validate(e.target.value, curField);
  }

  function checkHandler(e) {
    if (e.target.checked) {
      onValid(e.target.parentNode.parentNode);
    } else {
      onInvalid(e.target.parentNode.parentNode);
    }
  }

  function isValidDate(dateVal) {
    var year = parseInt(dateVal.split('-')[0]);
    var month = parseInt(dateVal.split('-')[1]);
    var day = parseInt(dateVal.split('-')[2]);
    if (typeof year !== 'number' || typeof month !== 'number' || typeof day !== 'number' || year < 1900 || year > 2100 || month < 1 || month > 12) {
      // Check value ranges
      return false;
    } // if
    var isLeap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    var maxDayValue = {
      1: 31,
      2: isLeap ? 29 : 28,
      3: 31,
      4: 30,
      5: 31,
      6: 30,
      7: 31,
      8: 31,
      9: 30,
      10: 31,
      11: 30,
      12: 31
    };
    return day >= 1 && day <= maxDayValue[month];
  } // isValidDate

  function validate(fval, curField) {
    if (_.def.customValidation[curField]) {
      var curVali = _.def.customValidation[curField];
      var curMin = curVali.min;
      var curMax = curVali.max;
      var curReq = curVali.required;
      var curRegex = curVali.regex;

      if (curReq === true) {
        if (curRegex.test(fval) === true && (curField == "birthdate" && fval >= curMin || fval.length >= curMin) && (curField == "birthdate" && fval <= curMax || fval.length <= curMax) && (curField == "birthdate" && isValidDate(fval) || true)) {
          onValid($(_.def.wrapper + ' .field_' + curField));
        } else {
          onInvalid($(_.def.wrapper + ' .field_' + curField));
        }
      }
    } else if (curField == "#locList") {
      if (Object.keys(_.def.locList).length > 2) {
        if (fval != '') {
          onValid($(_.def.wrapper + ' #locList'));
        } else {
          onInvalid($(_.def.wrapper + ' #locList'));
        }
      }
    } else {
      var curFulfilled = false;

      for (var k = 1; k < curField.children.length; k++) {
        if (curField.querySelectorAll('select').length > 0) {
          if (curField.querySelector('select').value == '') {
            break;
          } else {
            curFulfilled = true;
            break;
          }
        } else {
          if (curField.children[k].querySelector('input').checked) {
            curFulfilled = true;
            break;
          }
        }
      }
      if (curFulfilled) {
        onValid(curField);
      } else {
        onInvalid(curField);
      }
    }
  }

  if (_.def.askFullName) {
    $(_.def.wrapper + ' .field_first_name').value = $(_.def.wrapper + ' .field_full_name').value;
    $(_.def.wrapper + ' .field_last_name').value = ' ';
  }

  var exSelector = _.def.twoStep ? '.form-step-' + _.curStep : '';

  var fields = $(_.def.wrapper).querySelectorAll(exSelector + ' [class*="field_"]');
  var requiredAddQ = $(_.def.wrapper).querySelectorAll('[class*="add-Q-required"]');

  for (var k = 0; k < fields.length; k++) {
    var curField = fields[k].className.split(' ')[0].split('field_')[1];
    validate(fields[k].value, curField);
  }

  validate($(_.def.wrapper + ' #locList').value, "#locList");

  for (var j = 0; j < requiredAddQ.length; j++) {
    validate('', requiredAddQ[j]);
  }

  // form logic
  var formLogicQs = document.querySelectorAll(_.def.wrapper + ' .form-logic-Q');
  for (var i = 0; i < formLogicQs.length; i++) {
    if (!hasClass(formLogicQs[i], 'form-hidden')) {
      if (hasClass(formLogicQs[i], 'form-AcceptTnC')) {
        if (!formLogicQs[i].querySelectorAll('input')[0].checked) {
          onInvalid(formLogicQs[i]);
        } else {
          if (hasClass(formLogicQs[i], 'input-invalid')) {
            onValid(formLogicQs[i]);
          }
        }
      }
    }
  }

  if (_.invalidNum === 0) {
    return true;
  } else {
    return false;
  }
};