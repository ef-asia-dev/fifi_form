fifi_slider.prototype.initArrows = function() {
	let _ = this;

	if (_.def.arrowLeft != '') {
		_.def.arrowLeft.addEventListener('click', function() {
			if (! hasClass(_.def.target, 'isAnimating')) {				
				if (_.curSlide == 1) {
					_.curSlide = _.totalSlides+1;
					_.sliderInner.style.left = -_.curSlide*_.slideW + 'px';
				}
				_.curSlide--;
				setTimeout(function() {
					_.gotoSlide();
				}, 20);
			}
		}, false);
	}

	if (_.def.arrowRight != '') {
		_.def.arrowRight.addEventListener('click', function() {
			if (! hasClass(_.def.target, 'isAnimating')) {	
				if (_.curSlide == _.totalSlides) {
					_.curSlide = 0;
					_.sliderInner.style.left = -_.curSlide*_.slideW + 'px';
				}
				_.curSlide++;
				setTimeout(function() {
					_.gotoSlide();
				}, 20);
			}
		}, false);
	}
}