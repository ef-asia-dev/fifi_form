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
      if (cur.querySelectorAll('input[type="checkbox"]').length > 0) {
        // is checkbox row
        cur.querySelector('input[type="checkbox"]').addEventListener('change', checkHandler, false);
      } else {
        // not checkbox row
        if (hasClass(cur, 'add-Question')) {
          if (cur.querySelectorAll('select').length > 0) {
            cur.querySelector('select').addEventListener('change', function(e) {
              inputHandler(e, cur);
            }, false);
          } else {
            if (cur.querySelectorAll('input').length > 0) {
              cur.querySelector('input').addEventListener('change', function(e) {
                inputHandler(e, cur);
              }, false);
            }
          }
        } else {
          cur.addEventListener('change', function(e) {
            inputHandler(e, cur);
          } , false);
        }
      }
      _.invalidNum++;
    }
    invalidCB();
  };

  function inputHandler(e, targ) {
    let curField;
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

  function validate(fval, curField) {
    if (_.def.customValidation[curField]) {
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
          onValid($(`${_.def.wrapper} .field_${curField}`));
        } else {
          onInvalid($(`${_.def.wrapper} .field_${curField}`));
        }
      }
    } else if (curField == "#locList") {
      if (Object.keys(_.def.locList).length > 2) {
        if (fval != '') {
          onValid($(_.def.wrapper+' #locList'));
        } else {
          onInvalid($(_.def.wrapper+' #locList'));
        }
      }
    } else {
      let curFulfilled = false;

      for (let k = 1; k < curField.children.length; k++) {
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
    $(_.def.wrapper+' .field_first_name').value = $(_.def.wrapper+' .field_full_name').value;
    $(_.def.wrapper+' .field_last_name').value = ' ';
  }

  let exSelector = (_.def.twoStep) ? `.form-step-${_.curStep}` : '';

  let fields = $(_.def.wrapper).querySelectorAll(`${exSelector} [class*="field_"]`);
  let requiredAddQ = $(_.def.wrapper).querySelectorAll(`[class*="add-Q-required"]`);

  for (let k = 0; k < fields.length; k++) {
    let curField = fields[k].className.split(' ')[0].split('field_')[1];
    validate(fields[k].value, curField);
  }

  validate($(_.def.wrapper+' #locList').value, "#locList");

  for (let j = 0; j < requiredAddQ.length; j++) {
    validate('', requiredAddQ[j]);
  }

  // form logic
  let formLogicQs = document.querySelectorAll(_.def.wrapper+' .form-logic-Q');
  for (let i = 0; i < formLogicQs.length; i++) {
    if (! hasClass(formLogicQs[i], 'form-WantsInfo')) {
      if (! formLogicQs[i].querySelectorAll('input')[0].checked) {
        onInvalid(formLogicQs[i]);
      } else {
        if (hasClass(formLogicQs[i], 'input-invalid')) {
          onValid(formLogicQs[i]);
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
