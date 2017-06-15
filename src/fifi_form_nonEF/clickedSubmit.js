fifi_form.prototype.clickedSubmit = function() {
  var _ = this;

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
  function createSubmissionObject() {
    return {
      customer: {
          FirstName: $(`${_.def.wrapper} .field_first_name`).value,
          LastName: $(`${_.def.wrapper} .field_last_name`).value,
          Email: $(`${_.def.wrapper} .field_email`).value,
          Address: $(`${_.def.wrapper} .field_address`).value,
          DateOfBirth: $(`${_.def.wrapper} .field_birthdate`).value,
          City: "",
          PhoneRadio: (_.def.phoneTypeInPos == 'MobilePhone') ? 'MP' : 'HP',
          HomePhone: (_.def.phoneTypeInPos == 'MobilePhone') ? "" : $(`${_.def.wrapper} .field_phone`).value,
          MobilePhone: (_.def.phoneTypeInPos == 'MobilePhone') ? $(`${_.def.wrapper} .field_phone`).value : "",
          WantsBrochure: $(`${_.def.wrapper} #WantsBrochure`).checked,
          HasAcceptedTerms: $(`${_.def.wrapper} #AcceptTnC`).checked,
          YesEmailMarketing: $(`${_.def.wrapper} #WantsInfo`).checked,
          StateRegionCode: (Object.keys(_.def.locList).length > 2) ? $('#locList').value.split('|')[0] : '',
          StateRegionName: (Object.keys(_.def.locList).length > 2) ? $('#locList').value.split('|')[1] : '',
          Comments: createComments()
      },
      extendedDetail: {
        WantsMoreInfo:  $(`${_.def.wrapper} #WantsInfo`).checked,
        WantsBrochure: $(`${_.def.wrapper} #WantsBrochure`).checked,
      }
    };
  }

  function hideFormLogicRow(tar) {
    if ($(`${_.def.wrapper} .form-${tar}`).querySelector(`#${tar}`).checked) {
      $(`${_.def.wrapper} .form-${tar}`).style.display = 'none';
      if (tar == 'WantsBrochure') {
        _.def.customValidation.address.required = false;
        $(`${_.def.wrapper} .form-step-${_.curStep} .form-address-row`).style.display = 'none';
      }
    }
  }

  if (_.runValidation(_.def.onEachValidationSuccess, _.def.onEachValidationError)) {
    //success
    let url = _.def.submissionEndPoint;
    ajaxPost(url, createSubmissionObject(), function() {
      if (_.def.twoStep) {
        $(`${_.def.wrapper} .form-submit`).innerHTML = _.def.placeholders.submit;
        $(`${_.def.wrapper} .form-step-${_.curStep}`).style.display = 'none';
        _.curStep++;
        if (_.curStep === 2) {
          $(`${_.def.wrapper} .form-step-${_.curStep}`).style.display = 'block';
          hideFormLogicRow('WantsBrochure');
          hideFormLogicRow('WantsInfo');
          hideFormLogicRow('AcceptTnC');
        }
        if (_.curStep > 2) {
          let logicQ = document.querySelectorAll('.form-logic-Q');
          for (let i = 0; i < logicQ.length; i++) {
            logicQ[i].style.display = 'none';
          }
          $('.form-button-row').style.display = 'none';
        }
      }
      _.def.customSubmitSuccess();
    }, _);
  } else {
    //error
    _.def.customSubmitError();
  }
};
