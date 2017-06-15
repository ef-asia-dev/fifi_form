fifi_form.prototype.appendAdditionalQ = function(appendHTML, curStep) {
  var _ = this;
  if (_.def.twoStep === false) {
    curStep = 1;
  }
  if (_.def.additionalQuestions.length > 0) {
    for (var g = 0; g < _.def.additionalQuestions.length; g++) {
      if ((_.def.twoStep === true && curStep === _.def.additionalQuestions[g]['step']) ||
          _.def.twoStep === false) {
        appendHTML += '<div class="form-row add-Question';
        if (curStep == 1 && _.def.additionalQuestions[g]['required'] == true) {
          appendHTML += ' add-Q-required';
        }
        if (_.def.additionalQuestions[g]['isMC'] == false &&
        _.def.additionalQuestions[g]['radio_or_dropdown'] == 'dropdown') {
          appendHTML += ' add-Q-select';
        }
        if (_.def.additionalQuestions[g]['isQQ']) {
          appendHTML += ' is-qualifying';
        }
        appendHTML += '">';
        appendHTML += `<div class="label">${_.def.additionalQuestions[g]['question']}</div>`;
        if (_.def.additionalQuestions[g]['isMC'] == false &&
        _.def.additionalQuestions[g]['radio_or_dropdown'] == 'dropdown') {
          appendHTML += `<select id="aq-${g}">`;
        }
        if (_.def.additionalQuestions[g]['isMC'] == true ||
        _.def.additionalQuestions[g]['isMC'] == false &&
        _.def.additionalQuestions[g]['radio_or_dropdown'] == 'radio') {
          for (var p = 0; p < _.def.additionalQuestions[g]['answers'].length; p++) {
            let fldN = `aq-${g}_`+_.def.additionalQuestions[g]['answers'][p].replace(' ', '');
            appendHTML += `<div class="form-subrow">`;
            var isRadio = ( _.def.additionalQuestions[g]['isMC'] == false) ? 'radio' : 'checkbox';
            appendHTML += `<input type="${isRadio}" name="aq-${g}" id="${fldN}" value="${_.def.additionalQuestions[g]['answers'][p]}"/>`;
            appendHTML += `<label for="${fldN}">`;
            appendHTML += `<span class="label-subtext">${_.def.additionalQuestions[g]['answers'][p]}</span>`;
            appendHTML += '</label></div>';
          }
        } else {
          for (var p in _.def.additionalQuestions[g]['answers']) {
            appendHTML += `<option value="${_.def.additionalQuestions[g]['answers'][p]}">${p}</option>`;
          }
        }
        if (_.def.additionalQuestions[g]['isMC'] == false &&
        _.def.additionalQuestions[g]['radio_or_dropdown'] == 'dropdown') {
          appendHTML += '</select>';
        }
        if (_.def.additionalQuestions[g]['isMC'] == false &&
        _.def.additionalQuestions[g]['radio_or_dropdown'] == 'input') {
          appendHTML += '<input type="text"/>';
        }
        if (_.def.additionalQuestions[g]['isMC'] == false &&
        _.def.additionalQuestions[g]['radio_or_dropdown'] == 'textarea') {
          appendHTML += '<textarea rows="3" ></textarea>';
        }
        appendHTML += '</div>';
      }
    }
  }
  return appendHTML;
};
