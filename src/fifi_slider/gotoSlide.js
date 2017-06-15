fifi_slider.prototype.gotoSlide = function() {
	let _ = this;

	_.sliderInner.style.transition = 'left ' + _.def.transition.speed/1000 + 's ' + _.def.transition.easing;
	_.sliderInner.style.left = -_.curSlide*_.slideW + 'px';
	addClass(_.def.target, 'isAnimating');
	setTimeout(function() {
		_.sliderInner.style.transition = '';
		removeClass(_.def.target, 'isAnimating');
	}, _.def.transition.speed);
	_.setDot();
	if (_.def.autoHeight) {
  		_.def.target.style.height = _.allSlides[_.curSlide].offsetHeight + "px";
  	}
	_.def.afterChangeSlide(_);
}