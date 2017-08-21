## Getting Started with Gulp
First install gulp globally
```
> npm install --global gulp-cli
```

Then locally
```
> npm install gulp --save-dev
```

Then install all the necessary dependencies
```
> npm install
```

Start the development server (changes will now update live in browser)
```
> gulp
```

## Documentation of the Form
Render a customized lead form at the client-side.

- Supports IE9+.
- Not dependent on jQuery.
- **Vanilla Javascipt.**

### 1. Include this form_master.js in the .html
```
<script src="http://www.efcampaigns.com/blackops/js/form_master.js"></script>
```
### 2. Include form.css
### 3. Initialize with or without customized configuration.

Basic Initialization:
```
var form = new fifi_form();
```

With Config:
This customized config would be merged with the defaults in the plugin.
```
var form_config = {
  twoStep: false,
  placeholders: {
    first_name: '名字',
    last_name: 'Last Name',
    full_name: 'Full Name',
    birthdate: 'Birth Date',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    loc: 'City',
    next: 'Suivant',
    submit: 'Submit'
  },
  locList: { // text: value
    'Choose': '',
    '香港': '香港'
  }
};
var x = new fifi_form(form_config);
```
### Full Config:
```
var form_config = {
  submitToLive: false,
  formRendered: false,
  wrapper: '.form-wrapper',
  formType: 'CAMP',
  marketCode: 'hk',
  campaignName: 'Form Testing Campaign',
  campaignAllocationPrograms: ['LT', 'ILC', 'ILS'],
  phoneTypeInPos: 'MobilePhone', // or HomePhone
  twoStep: true,
  addressTBC: {
    required: false
  },
  formLogic: {
    WantsBrochure: {
      prechecked: true,
      showOnForm: false,
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
    answers: ['from Facebook', 'from Friends', 'from Google']
  }, {
    step: 2,
    isMC: false,
    radio_or_dropdown: 'radio',
    required: false,
    question: 'How long do you want to travel?',
    answers: ['2 weeks', '4 weeks', '3 months']
  }, {
    step: 2,
    isMC: false,
    radio_or_dropdown: 'dropdown',
    required: true,
    isQQ: true,
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
    answers: ['Cats', 'Dogs', 'Dolphins', 'Pigs', 'Ducks', 'Elephants', 'Giraffe']
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
  customSubmitSuccess: function customSubmitSuccess() {},
  customSubmitError: function customSubmitError() {},
  onEachValidationSuccess: function onEachValidationSuccess() {
    //document.querySelector('body').style.background = 'red';
  },
  onEachValidationError: function onEachValidationError() {
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
      default: '',
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
```
