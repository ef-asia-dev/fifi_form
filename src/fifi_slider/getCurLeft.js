fifi_slider.prototype.getCurLeft = function() {
	let _ = this;
	_.curLeft = parseInt(_.sliderInner.style.left.split('px')[0]);
}