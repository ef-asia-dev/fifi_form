fifi_slider.prototype.buildDots = function() {
	let _ = this;

	for (let i = 0; i < _.totalSlides; i++) {
		let dot = document.createElement('li');
		dot.setAttribute('data-slide', i+1);		
		_.def.dotsWrapper.appendChild(dot);
	}

	_.def.dotsWrapper.addEventListener('click', function(e) {
		if (e.target && e.target.nodeName == "LI") {
			_.curSlide = e.target.getAttribute('data-slide');
			_.gotoSlide();
		}
	},false);
}