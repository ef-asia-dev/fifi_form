fifi_form.prototype.appendForm = function() {
  var _ = this;
  var appendHTML = '<form>';

  if (_.def.twoStep == true) {
    appendHTML += '<div class="form-step-1">';
  }

  for (var k in _.fields) {
    let extraClass = '';
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
      appendHTML += `<div class="form-row${extraClass}">`;
    }
    if (k === 'first_name' || k === 'last_name') {
      appendHTML += '<div class="name-row">';
    }
    if (typeof _.def.autocomplete.autolist[k] === "undefined") {
      _.def.autocomplete.autolist[k] = {};
      _.def.autocomplete.autolist[k].name = _.def.placeholders[k];
      _.def.autocomplete.autolist[k].auto = _.def.placeholders[k];
    }
    appendHTML += `<div class="label">${_.def.placeholders[k]}</div>`;
    appendHTML += `<input class="field_${k}" name="${_.def.autocomplete.autolist[k].name}" autocomplete="${_.def.autocomplete.autolist[k].auto}" type="${_.fields[k]}"`;
    if (_.def.showPlaceholder == true) {
      appendHTML += `placeholder="${_.def.placeholders[k]}"`;
    }
    appendHTML += ' />'
               + '</div>';
    if (k === 'last_name' ) {
      appendHTML += '</div>';
    }
  }

  let hideLoc = (Object.keys(_.def.locList).length > 2) ? '' : ' form-hidden';
  appendHTML += `<div class="form-row${hideLoc}">`;
  appendHTML += `<div class="label">${_.def.placeholders['loc']}</div>`;
  appendHTML += '<select id="locList">';
  for (var l in _.def.locList) {
    appendHTML += `<option value="${_.def.locList[l]}">${l}</option>`;
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

  $(_.def.wrapper).innerHTML = appendHTML;

  if (_.def.twoStep && _.def.addressTBC.required == true) {
    let add_field = $('.form-address-row').cloneNode(true);
    $(`${_.def.wrapper} .form-step-2`).appendChild(add_field);
  }

  _.createCheckrows();
  _.createSubmitButton();

};
