fifi_form.prototype.runValidation = function(validCB, invalidCB) {
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
      _.invalidNum++;
    }
    invalidCB();
  };

  function isValidDate(dateVal) {
    let year = parseInt(dateVal.split('-')[0]);
    let month = parseInt(dateVal.split('-')[1]);
    let day = parseInt(dateVal.split('-')[2]);
    if (typeof year !== 'number' || typeof month !== 'number' || typeof day !== 'number' ||
        year < 1900 || year > 2100 || month < 1 || month > 12) { // Check value ranges
      return false;
    } // if
    const isLeap = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
    const maxDayValue = {
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
      12: 31,
    };
    return day >= 1 && day <= maxDayValue[month];
  } // isValidDate

  if (_.def.askFullName) {
    $('.field_first_name').value = 'read last name';
    $('.field_last_name').value = $('.field_full_name').value;
  }

  let exSelector = (_.def.twoStep) ? `.form-step-${_.curStep}` : '';

  let fields = document.querySelectorAll(`${_.def.wrapper} ${exSelector} [class*="field_"]`);
  let requiredAddQ = document.querySelectorAll(`${_.def.wrapper} [class*="add-Q-required"]`);

  for (let k = 0; k < fields.length; k++) {
    let fval = fields[k].value;
    let curField = fields[k].className.split(' ')[0].split('field_')[1];
    let curVali = _.def.customValidation[curField];
    let curMin = curVali.min;
    let curMax = curVali.max;
    let curReq = curVali.required;
    let curRegex = curVali.regex;

    if (curReq === true) {
      if (curRegex.test(fval) === true &&
         (curField == "birthdate" && fval >= curMin || fval.length >= curMin) &&
         (curField == "birthdate" && fval <= curMax || fval.length <= curMax) &&
         (curField == "birthdate" && isValidDate(fval) || true)) {
        onValid($(`.field_${curField}`));
      } else {
        onInvalid($(`.field_${curField}`));
      }
    }
  }

  if (Object.keys(_.def.locList).length > 2) {
    if ($('#locList').value != '') {
      onValid($('#locList'));
    } else {
      onInvalid($('#locList'));
    }
  }

  for (let j = 0; j < requiredAddQ.length; j++) {
    let curQ = requiredAddQ[j];
    let curFulfilled = false;

    for (let k = 1; k < requiredAddQ[j].children.length; k++) {
      if (requiredAddQ[j].querySelectorAll('select').length > 0) {
          if (requiredAddQ[j].querySelector('select').value == '') {
            break;
          } else {
            curFulfilled = true;
            break;
          }
      } else {
        if (requiredAddQ[j].children[k].querySelector('input').checked) {
          curFulfilled = true;
          break;
        }
      }
    }
    if (curFulfilled) {
      onValid(requiredAddQ[j]);
    } else {
      onInvalid(requiredAddQ[j]);
    }
  }

  // form logic
  if (!$('#WantsBrochure').checked && !$('#WantsInfo').checked && !$('#AcceptTnC').checked) {
    onInvalid($('.form-AcceptTnC'));
  }
  if (hasClass($('.form-AcceptTnC'), 'input-invalid') && ($('#WantsBrochure').checked || $('#WantsInfo').checked || $('#AcceptTnC').checked)) {
    onValid($('.form-AcceptTnC'));
  }

  if (_.invalidNum === 0) {
    return true;
  } else {
    return false;
  }

};
