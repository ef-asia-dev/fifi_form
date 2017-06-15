fifi_form.prototype.init = function() {
  var _ = this;
  if (_.def.formRendered === false) {
    _.appendForm();
  }
};
