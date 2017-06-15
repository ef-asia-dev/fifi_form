fifi_slider.prototype.init = function() {
	let _ = this;

	function on_resize(c,t){onresize=function(){clearTimeout(t);t=setTimeout(c,100)};return c};

	function loadedImg(el) {
	    var loaded = false;
	    function loadHandler() {
	        if (loaded) {
	            return;
	        }
	        loaded = true;
	        _.loadedCnt++;
	        if (_.loadedCnt >= _.totalSlides+2) {
	        	_.updateSliderDimension();
			}	  	
	    }
	    var img = el.querySelector('img');
        if (img) {        
	      img.onload = loadHandler;
	      img.src = img.getAttribute('data-src');
	      img.style.display = 'block';
	      if (img.complete) {
	        loadHandler();
	      }
        } else {
        	_.updateSliderDimension();
        }
	}

	window.addEventListener("resize", on_resize(function() {
		_.updateSliderDimension();
	}), false); 

	// wrap slider-inner
	let nowHTML = _.def.target.innerHTML;
	_.def.target.innerHTML = `<div class="slider-inner">${nowHTML}</div>`;

	_.allSlides;
	_.curSlide = _.def.startSlide;
	_.curLeft = 0;
	_.totalSlides = _.def.target.querySelectorAll('.slide').length;

	_.sliderInner = _.def.target.querySelector('.slider-inner');
	_.loadedCnt = 0;

	// append clones
	for (let i = 0; i < _.totalSlides; i++) {
		let clone;

		if (i === 0) {
			clone = _.def.target.querySelectorAll('.slide')[i].cloneNode(true);
			_.sliderInner.appendChild(clone);
		} else if (i === _.totalSlides - 1) {
			clone = _.def.target.querySelectorAll('.slide')[i].cloneNode(true);
			_.sliderInner.insertBefore(clone, _.sliderInner.firstChild);
		}
	}
	_.curSlide++;
	_.allSlides = _.def.target.querySelectorAll('.slide');

	_.def.target.style.height = "1px";
	_.sliderInner.style.width = (_.totalSlides+2)*100 + "%";
	for (let i = 0; i < _.totalSlides+2; i++) {
		_.allSlides[i].style.width = 100/(_.totalSlides+2) + "%";
		loadedImg(_.allSlides[i]);
	}

	_.buildDots();
	_.setDot();
	_.initArrows();

	function addListenerMulti(el, s, fn) {
	  s.split(' ').forEach(e => el.addEventListener(e, fn, false));
	}
	function removeListenerMulti(el, s, fn) {
	  s.split(' ').forEach(e => el.removeEventListener(e, fn, false));
	}

	if (_.def.swipe) {
		addListenerMulti(_.sliderInner, 'mousedown touchstart', startSwipe);
	}

	_.isAnimating = false;

	function startSwipe(e) {
		let touch = e;
		_.getCurLeft();
		if (!_.isAnimating) {
			if (e.type == 'touchstart') {
				touch = e.targetTouches[0] || e.changedTouches[0];
			}
			_.startX = touch.pageX;
			_.startY = touch.pageY;
			addListenerMulti(_.sliderInner, 'mousemove touchmove', swipeMove);			
			addListenerMulti($('body'), 'mouseup touchend', swipeEnd);			
		}
	}

	function swipeMove(e) {
		let touch = e;
		if (e.type == 'touchmove') {
			touch = e.targetTouches[0] || e.changedTouches[0];
		}
		_.moveX = touch.pageX;
		_.moveY = touch.pageY;

		// for scrolling up and down
		if (Math.abs(_.moveX - _.startX) < 40) return;

		_.isAnimating = true;
		addClass(_.def.target, 'isAnimating');
		e.preventDefault();

		if (_.curLeft + _.moveX - _.startX > 0 && _.curLeft == 0) {
			_.curLeft = -_.totalSlides*_.slideW;
		} else if (_.curLeft + _.moveX - _.startX < -(_.totalSlides+1)*_.slideW) {
			_.curLeft = -_.slideW;
		}
		_.sliderInner.style.left = _.curLeft + _.moveX - _.startX + "px";
	}

	function swipeEnd(e) {
		let touch = e;
		_.getCurLeft();

		if (Math.abs(_.moveX - _.startX) === 0) return;

		_.stayAtCur = (Math.abs(_.moveX - _.startX) < 40 || typeof(_.moveX) === "undefined") ? true : false;
		_.dir = (_.startX < _.moveX) ? 'left' : 'right';


		if (_.stayAtCur) {
		} else {
			(_.dir == 'left') ? _.curSlide-- :  _.curSlide++;
			if (_.curSlide < 0) {
				_.curSlide = _.totalSlides;
			} else if (_.curSlide == _.totalSlides+2) {
				_.curSlide = 1;
			}
		}

		_.gotoSlide();

		delete _.startX;
		delete _.startY;
		delete _.moveX;
		delete _.moveY;

		_.isAnimating = false;
		removeClass(_.def.target, 'isAnimating');
		removeListenerMulti(_.sliderInner, 'mousemove touchmove', swipeMove);			
		removeListenerMulti($('body'), 'mouseup touchend', swipeEnd);
	}
}