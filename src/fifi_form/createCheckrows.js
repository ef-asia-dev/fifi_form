fifi_form.prototype.createCheckrows = function() {
  var _ = this;
  let appendHTML;

  function addressShowHide(val, first) {
    first = (typeof first === "undefined") ? false : true;
    val = (typeof val === "object") ? val.target.checked : val;
    let addRows = $(_.def.wrapper).querySelectorAll('.form-address-row');
    if (val === true) {
      if (_.def.addressTBC.required === true) {
        for (let k = 0; k < addRows.length; k++) {
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

    if (i == "DataCollection") {
      let stment = document.createElement('div');
      stment.className = "data-collection-statement";
      let stmentText = "<h4>개인정보 수집 및 이용에 대한 안내</h4>\
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

      $(_.def.wrapper+` form .form-${i}`).appendChild(stment);
      $(_.def.wrapper + (' form .form-' + i) + ' .data-collection-statement').innerHTML = stmentText;
    }

    let lbl = document.createElement('label');
    lbl.setAttribute('for', i);
    let lblSpan = document.createElement('span');
    lblSpan.className = "label-subtext";
    lbl.appendChild(chkbox);
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
