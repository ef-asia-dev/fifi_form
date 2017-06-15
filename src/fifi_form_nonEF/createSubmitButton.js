fifi_form.prototype.createSubmitButton = function() {
  var _ = this;
  let btn = document.createElement("a");
  let btnText = (_.def.twoStep == true) ? _.def.placeholders.next : _.def.placeholders.submit;
  let btnTextNode = document.createTextNode(btnText);
  btn.setAttribute('class', 'form-submit');
  btn.setAttribute('href', 'javascript:void(0);');
  btn.appendChild(btnTextNode);
  btn.addEventListener('click', _.clickedSubmit.bind(this), false);
  $(_.def.wrapper+' form').innerHTML += '<div class="form-row form-button-row"></div>';
  $(_.def.wrapper+' .form-button-row').appendChild(btn);
};
