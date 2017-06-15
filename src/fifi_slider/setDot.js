fifi_slider.prototype.setDot = function() {
	let _ = this;
	let tardot = _.curSlide-1;

	for (let j = 0; j < _.totalSlides; j++) {
		removeClass(_.def.dotsWrapper.querySelectorAll('li')[j], 'active');
	}

	if (_.curSlide - 1 < 0) {
		tardot =  _.totalSlides-1;
	} else if (_.curSlide - 1 > _.totalSlides-1) {
		tardot = 0;
	}
	addClass(_.def.dotsWrapper.querySelectorAll('li')[tardot], 'active');
}