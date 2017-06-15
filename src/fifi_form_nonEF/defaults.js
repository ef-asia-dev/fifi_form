function $(elem) {
  return document.querySelector(elem);
};
function hasClass(el, className) {
  return el.classList ? el.classList.contains(className) : new RegExp(`(^| )${className}( |$)`, 'gi').test(el.className);
};
function addClass(el, className) {
  if (el.classList) {
    el.classList.add(className);
  } else {
    el.className += ` ${className}`;
  }
};
function removeClass(el, className) {
  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp(`(^|\\b)${className.split(' ').join('|')}(\\b|$)`, 'gi'), ' ');
  }
};
function getCookie(key) {
  const result = new RegExp(`(?:^|; )${encodeURIComponent(key)}=([^;]*)`).exec(document.cookie);
  return result ? (result[1]) : null;
}; // readCookie
function ajaxPost(link, data, onSuccess, _) {
  var request = new XMLHttpRequest();
  request.open('POST', link, true);
  request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  request.send(JSON.stringify(data));
  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
      console.log(request.responseText);
      let data = JSON.parse(request.responseText);
      _.cusId = data.FormId;
      onSuccess();
    }
  }
};
function $extendObj(_def, addons) {
  if (typeof addons !== "undefined") {
    for (var prop in _def) {
      if (addons[prop] != undefined) {
        _def[prop] = addons[prop];
      }
    }
  }
};

fifi_form = function(settings) {
  var _ = this;
  function ajaxGet(link) {
    var request = new XMLHttpRequest();
    request.open('GET', link, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var data = JSON.parse(request.responseText);
      } else {
        // We reached our target server, but it returned an error

      }
    };
    request.onerror = function() {
      // There was a connection error of some sort
    };
    request.send();
  };

  _.def = {
    formRendered: false,
    wrapper: '.form-wrapper',
    submissionEndPoint: '/endpoint',
    twoStep: true,
    addressTBC: {
      required: true
    },
    formLogic: {
      WantsBrochure: {
        prechecked: true,
        showOnForm: true,
        labelText: 'I want to order a free brochure.'
      },
      WantsInfo: {
        prechecked: true,
        showOnForm: true,
        labelText: 'I want to receive more information.'
      },
      AcceptTnC: {
        prechecked: true,
        showOnForm: true,
        labelText: 'I accept the <a href="javascript: void(0);" target="_blank">Terms and Conditions</a>.'
      }
    },
    additionalQuestions: [{
      step: 2,
      isMC: true, // **** make dropdown
      radio_or_dropdown: false, // if isMC is true, this is ignored
      required: true,
      question: 'How did you hear about EF?',
      answers: [
        'from Facebook',
        'from Friends',
        'from Google'
      ]
    }, {
      step: 2,
      isMC: false,
      radio_or_dropdown: 'radio',
      required: false,
      question: 'How long do you want to travel?',
      answers: [
        '2 weeks',
        '4 weeks',
        '3 months'
      ]
    }, {
      step: 2,
      isMC: false,
      radio_or_dropdown: 'dropdown',
      required: true,
      question: 'How long do you want to travel?',
      answers: { // text: value
        'Please choose': '',
        '2 weeks': '2w',
        '4 weeks': '4w',
        '3 months': '3m'
      }
    }, {
      step: 1,
      isMC: true,
      radio_or_dropdown: false,
      required: true,
      question: 'Which animals do you like?',
      answers: [
        'Cats',
        'Dogs',
        'Dolphins',
        'Pigs',
        'Ducks',
        'Elephants',
        'Giraffe'
      ]
    }],
    askFullName: false,
    showPlaceholder: false,
    placeholders: {
      first_name: 'First Name',
      last_name: 'Last Name',
      full_name: 'Full Name',
      birthdate: 'Birth Date',
      email: 'Email',
      phone: 'Mobile Phone',
      loc: 'City',
      address: 'Address',
      next: 'Next',
      submit: 'Submit'
    },
    autocomplete: {
      use: true,
      autolist: {
        first_name: {
          name: 'fname',
          auto: 'given-name'
        },
        last_name: {
          name: 'lname',
          auto: 'family-name'
        },
        full_name: {
          name: 'fname',
          auto: 'name'
        },
        email: {
          name: 'email',
          auto: 'email'
        },
        phone: {
          name: 'phone',
          auto: 'tel'
        },
        address: {
          name: 'address',
          auto: 'street-address'
        }
      }
    },
    locList: { // text: value
      'Choose': '',
      '北京': '11|北京',
      '重庆': '50|重庆'
    },
    customSubmitSuccess: function() {
      document.querySelector('body').style.background = 'white';
    },
    customSubmitError: function() {
      document.querySelector('body').style.background = '#ffddee';
    },
    onEachValidationSuccess: function() {
      //document.querySelector('body').style.background = 'red';
    },
    onEachValidationError: function() {
      //document.querySelector('body').style.background = 'red';
    },
    customValidation: {
      first_name: {
        min: 1,
        max: 50,
        required: true,
        regex: /^[^0-9]+$/
      },
      last_name: {
        min: 1,
        max: 50,
        required: true,
        regex: /^[^0-9]+$/
      },
      full_name: {
        min: 1,
        max: 50,
        required: true,
        regex: /^[^0-9]+$/
      },
      birthdate: {
        min: '1911-01-01',
        max: '2011-12-31',
        required: true,
        regex: /^[\d\s\+\-]{4}-[\d\s\+\-]{2}-[\d\s\+\-]{2}$/
      },
      email: {
        min: 1,
        max: 50,
        required: true,
        regex: /^[\w+.-]+@([\w+.-]+\.)+[A-Za-z]{2,6}$/
      },
      phone: {
        min: 5,
        max: 20,
        required: true,
        regex: /^[\d\s\+\-]{5,20}$/
      },
      address: {
        min: 1,
        max: 200,
        required: true,
        regex: /./
      }
    }
  };

  $extendObj(_.def, settings);

  _.fields = {};

  if (_.def.askFullName) {
    _.fields['full_name'] = 'text';
  }
  _.fields['first_name'] = 'text';
  _.fields['last_name'] = 'text';
  _.fields['birthdate'] = 'date';
  _.fields['email'] = 'email';
  _.fields['phone'] = 'tel';
  _.fields['address'] = 'text';

  _.invalidNum = 0;

  _.curStep = 1;
  _.cusId = '';

  _.init();
};
