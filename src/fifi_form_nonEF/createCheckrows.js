fifi_form.prototype.createCheckrows = function() {
  var _ = this;
  let appendHTML;

  function addressShowHide(val, first) {
    first = (typeof first === "undefined") ? false : true;
    val = (typeof val === "object") ? val.target.checked : val;
    let addRows = $(_.def.wrapper).querySelectorAll('.form-address-row');
    if (val === true) {
      for (let k = 0; k < addRows.length; k++) {
        removeClass(addRows[k], 'form-hidden');
        _.def.customValidation.address.required = true;
      }
    } else {
      for (let k = 0; k < addRows.length; k++) {
        addClass(addRows[k], 'form-hidden');
        _.def.customValidation.address.required = false;
        if (first === false) {
          if (hasClass(addRows[k].children[1], 'input-invalid')) {
            _.invalidNum--;
            removeClass(addRows[k].children[1], 'input-invalid');
          }
        }
      }
    }
  }

  for (var i in _.def.formLogic) {
    appendHTML = `<div class="form-row form-logic-Q form-${i}`;
    if (_.def.formLogic[i].showOnForm === false) {
      appendHTML += ` form-hidden`;
    }
    appendHTML += '"></div>';

    $(_.def.wrapper+' form').innerHTML += appendHTML;

    let chkbox = document.createElement('input');
    chkbox.type = "checkbox";
    chkbox.name = i;
    chkbox.id = i;
    if (_.def.formLogic[i].prechecked === true) {
      chkbox.setAttribute('checked', true);
      addressShowHide(true, true);
    }
    $(_.def.wrapper+` form .form-${i}`).appendChild(chkbox);

    let lbl = document.createElement('label');
    lbl.setAttribute('for', i);
    let lblSpan = document.createElement('span');
    lblSpan.class = "label-subtext";
    lblSpan.innerHTML = _.def.formLogic[i].labelText;
    lbl.appendChild(lblSpan);
    $(_.def.wrapper+` form .form-${i}`).appendChild(lbl);

  }

  document.addEventListener('DOMContentLoaded', function() {
    if (_.def.addressTBC.required) {
      $(`${_.def.wrapper} #WantsBrochure`).onchange = addressShowHide;
    }
  }, false);

};
