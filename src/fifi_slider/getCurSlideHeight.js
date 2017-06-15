fifi_slider.prototype.getCurSlideHeight = function(idx) {
	if (_.def.autoHeight) {
  		_.def.target.style.height = _.allSlides[idx].offsetHeight + "px";
  	}
}