fifi_form.prototype.clickedSubmit = function() {
  var _ = this;

  if (!_.clickedBtn) {
    _.clickedBtn = true;

    addClass($(_.def.wrapper + ' .form-submit'), 'submitting');

    // from Roberto's
    function computeTrackingData(trackingData) {
      const trackingObj = {};
      if (trackingData) {
        const trackingDataBits = trackingData.split('|');
        for (let i = 0; i < trackingDataBits.length; i += 1) {
          const trackingEntryBits = trackingDataBits[i].split(':');
          trackingObj[trackingEntryBits[0]] = trackingEntryBits[1];
        } // for
      } // if
      return trackingObj;
    } // computeTrackingData

    function getTrackingData() {
      const trackingDetails = {
        TritonId: getCookie('triton'),
        ExternalreferringUrl: getCookie('OriginalReferringURl'),
        EntryPage: getCookie('OriginalEntryUrl'),
        EntrySourceCode: (window.location.href.indexOf('source=') > -1) ? window.location.search.split('source=')[1].split(',')[0] : "00700",
        Etag: (window.location.href.indexOf('source=') > -1) ? window.location.search.split('source=')[1].split(',')[1] : "",
        TritonPageViewID: getCookie('pageview'),
        ReferringUrl: document.referrer,
        FormUrl: window.location.href,
      };

      const tritonVisitId = getCookie('tts');
      if (tritonVisitId) {
        const tritonVisitIdBits = tritonVisitId.split('&');
        const tritonVisitValues = tritonVisitIdBits[0].split('='); // id
        trackingDetails.tritonVisitId = tritonVisitValues[1];
      } // if

      const trackingObj = computeTrackingData(getCookie('TrackingData'));
      $extendObj(trackingDetails, trackingObj);
      trackingDetails.EntrySourceCode = trackingDetails.SourceCode;
      trackingDetails.PartnerCode = typeof trackingDetails.PartnerName !== 'string' || trackingDetails.PartnerName.toLowerCase() === 'unknown' ? '' : trackingDetails.PartnerName;

      return trackingDetails;
    } // getTrackingData
    function createComments() {
      let comments = '';
      let addQ;
      if (_.def.twoStep) {
        if (_.curStep === 1) {
          addQ = document.querySelectorAll(`${_.def.wrapper} .form-step-1 [class*="add-Question"]`);
        } else {
          addQ = document.querySelectorAll(`${_.def.wrapper} [class*="add-Question"]`);
        }
      }
      if (typeof addQ !== "undefined") {
        for (let j = 0; j < addQ.length; j++) {
          comments += `【${addQ[j].querySelector('.label').textContent}】`;
          if (addQ[j].querySelectorAll('select').length > 0) {
            let val = (addQ[j].querySelector('select').value == '') ? 'empty answer' : addQ[j].querySelector('select').value;
            comments += val;
          } else if (addQ[j].querySelectorAll('input[type="text"]').length > 0) {
            comments += addQ[j].querySelectorAll('input[type="text"]')[0].value + ';';
          } else if (addQ[j].querySelectorAll('textarea').length > 0) {
            comments += addQ[j].querySelectorAll('textarea')[0].value + ';';
          } else {
            for (let k = 1; k < addQ[j].children.length; k++) {
              if (addQ[j].children[k].querySelector('input').checked) {
                comments += addQ[j].children[k].querySelector('input').value + ';';
              }
            }
          }
        }
      }
      return comments;
    }
    function createSubmissionObject(closing) {
      let prod = "LS";
      let prog = "ILS";
      let allocation = _.def.campaignAllocationPrograms.toString();
      if ($(`${_.def.wrapper} .is-qualifying`)) {
        if ($(`${_.def.wrapper} .is-qualifying`).querySelectorAll('select').length > 0) {
          prog = $(`${_.def.wrapper} .is-qualifying`).querySelector('select').value;
        } else {
          prog = $(`${_.def.wrapper} .is-qualifying`).querySelector('input:checked').value;
        }
      } else {
        prog = _.def.campaignAllocationPrograms[Math.floor(_.def.campaignAllocationPrograms.length*Math.random())];
      }
      if (prog.toLowerCase() == 'ils' || prog.toLowerCase() == 'ilc' || prog.toLowerCase() == 'lsp') {
        prod = "LS";
        allocation = "ILS";
      } else {
        prod = "LY";
        allocation = "LY";
      }

      let obj = {
        customer: {
          FirstName: $(`${_.def.wrapper} .field_first_name`).value,
          LastName: $(`${_.def.wrapper} .field_last_name`).value,
          Email: $(`${_.def.wrapper} .field_email`).value,
          AddressLine1: $(`${_.def.wrapper} .field_address`).value,
          DateOfBirth: $(`${_.def.wrapper} .field_birthdate`).value+"T00:00:00.000Z",
          City: "",
          PostalCode: "",
          CountryCode: _.def.marketCode,
          PhoneRadio: (_.def.phoneTypeInPos == 'MobilePhone') ? 'MP' : 'HP',
          HomePhone: (_.def.phoneTypeInPos == 'MobilePhone') ? "" : $(`${_.def.wrapper} .field_phone`).value,
          MobilePhone: (_.def.phoneTypeInPos == 'MobilePhone') ? $(`${_.def.wrapper} .field_phone`).value : "",
          WantsBrochure: $(`${_.def.wrapper} #WantsBrochure`).checked,
          HasAcceptedTerms: $(`${_.def.wrapper} #AcceptTnC`).checked,
          YesEmailMarketing: $(`${_.def.wrapper} #WantsInfo`).checked,
          StateRegionCode: (Object.keys(_.def.locList).length > 2) ? $(_.def.wrapper + ' #locList').value.split('|')[0] : '',
          StateRegionName: (Object.keys(_.def.locList).length > 2) ? $(_.def.wrapper + ' #locList').value.split('|')[1] : '',
          Comments: createComments()
        },
        extendedDetail: {
          ProductCode: prod,
          ProgramCode: prog,
          EFComMarketCode: _.def.marketCode,
          BrowseCountryCode: getCookie('efcc'), // Default cookie name
          WantsMoreInfo:  $(`${_.def.wrapper} #WantsInfo`).checked,
          WantsBrochure: $(`${_.def.wrapper} #WantsBrochure`).checked,
          DeviceType: EF.isMobile.any ? 'MobilePhone' : 'Desktop'//, // isMobile
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
          SubLocality: '',
        },
        CampaignData: {
          CampaignName: _.def.campaignName,
          CampaignAllocationPrograms: allocation,
          CampaignAllocationCode: (_.def.campaignAllocationPrograms.toString().indexOf(',') > -1) ? "mixed" : "single",
          CampaignQuestionAnswer: [{
            Question: "",
            Answer: ""
          }]
        }
      };

      if (_.curStep === 2 && typeof closing === "undefined") {
        obj = {
          EFComMarketCode: _.def.marketCode,
          StateRegionCode: (Object.keys(_.def.locList).length > 2) ? $(_.def.wrapper + ' #locList').value.split('|')[0] : '',
          StateRegionName: (Object.keys(_.def.locList).length > 2) ? $(_.def.wrapper + ' #locList').value.split('|')[1] : '',
          AddressLine1: $(_.def.wrapper + ' .field_address').value
        };
      }
      if (typeof closing != "undefined" && closing === true) {
        obj.extendedDetail.isCompleted = true;
      }
      return obj;
    }

    function hideFormLogicRow(tar) {
      if ($(`${_.def.wrapper} .form-${tar}`).querySelector(`#${tar}`).checked) {
        $(`${_.def.wrapper} .form-${tar}`).style.display = 'none';
        if (tar == 'WantsBrochure') {
          _.def.customValidation.address.required = false;
          $(`${_.def.wrapper} .form-step-${_.curStep-1} .form-address-row`).style.display = 'none';
          $(`${_.def.wrapper} .form-step-${_.curStep} .form-address-row`).style.display = 'block';
        }
      }
    }

    function createUrl() {
      let url = (_.def.submitToLive) ? 'https://services.ef.com/secureformsapi/campaign/' : 'https://stg-efcom-lb.eflangtech.com/secureformsapi/campaign/';
      if (window.location.href.indexOf('qa') > -1 || window.location.href.indexOf('sitecore') > -1 || window.location.href.indexOf('localhost') > -1) {
        url = 'https://stg-efcom-lb.eflangtech.com/secureformsapi/';
      } else {
        url = 'https://services.ef.com/secureformsapi/';
      }
      if (_.curStep === 2) {
        url += 'ConfirmAddressCampaign/';
      } else {
        url += 'campaign/';
      }
      url += _.cusId;
      return url;
    }

    if (_.runValidation(_.def.onEachValidationSuccess, _.def.onEachValidationError)) {
      //success
      //https://services.ef.com/secureformsapi/campaign/
      let event;
      ajaxPost(createUrl(), createSubmissionObject(), function() {
        if (_.def.twoStep) {
          $(`${_.def.wrapper} .form-submit`).innerHTML = _.def.placeholders.submit;
          $(`${_.def.wrapper} .form-step-${_.curStep}`).style.display = 'none';
          _.curStep++;
          if (_.curStep === 2) {
            $(`${_.def.wrapper} .form-step-${_.curStep}`).style.display = 'block';
            hideFormLogicRow('WantsBrochure');
            hideFormLogicRow('WantsInfo');
            hideFormLogicRow('AcceptTnC');
            if (window.CustomEvent) {
              event = new CustomEvent('completedStep1', {detail: {wrapper: _.def.wrapper}});
            } else {
              event = document.createEvent('CustomEvent');
              event.initCustomEvent('completedStep1', true, true, {wrapper: _.def.wrapper});
            }
            document.dispatchEvent(event);
          }
          if (_.curStep > 2) {
            let logicQ = document.querySelectorAll(_.def.wrapper+' .form-logic-Q');
            for (let i = 0; i < logicQ.length; i++) {
              logicQ[i].style.display = 'none';
            }
            ajaxPost(createUrl(), createSubmissionObject(true), function() {
              $(_.def.wrapper+' .form-button-row').style.display = 'none';
              _.def.customSubmitSuccess();
              if (window.CustomEvent) {
                event = new CustomEvent('finalThank', {detail: {wrapper: _.def.wrapper}});
              } else {
                event = document.createEvent('CustomEvent');
                event.initCustomEvent('finalThank', true, true, {wrapper: _.def.wrapper});
              }
              document.dispatchEvent(event);
            }, _);
          }
        } else {
          _.def.customSubmitSuccess();
          if (window.CustomEvent) {
            event = new CustomEvent('finalThank', {detail: {wrapper: _.def.wrapper}});
          } else {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent('finalThank', true, true, {wrapper: _.def.wrapper});
          }
          document.dispatchEvent(event);
        }
        removeClass($(_.def.wrapper + ' .form-submit'), 'submitting');
        _.clickedBtn = false;
      }, _);
    } else {
      //error
      _.def.customSubmitError();
      removeClass($(_.def.wrapper + ' .form-submit'), 'submitting');
      _.clickedBtn = false;
    }

  }

};
