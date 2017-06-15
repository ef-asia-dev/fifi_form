fifi_slider.prototype.updateSliderDimension = function() {
	let _ = this;

	_.slideW = parseInt(_.def.target.querySelectorAll('.slide')[0].offsetWidth);
	_.sliderInner.style.left = -_.slideW*_.curSlide + "px";

	if (_.def.autoHeight) {
  		_.def.target.style.height = _.allSlides[_.curSlide].offsetHeight + "px";
  	} else {
  		for (let i = 0; i < _.totalSlides+2; i++) {
	  		if (_.allSlides[i].offsetHeight > _.def.target.offsetHeight) {
				_.def.target.style.height = _.allSlides[i].offsetHeight + "px";
	  		}
	  	}
  	}
  	_.def.afterChangeSlide(_);
}