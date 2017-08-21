Documentation of Fifi_Form.js

Basic Initialization:
var form_render = new fifi_form();

With Config:
This customized config would be merged with the defaults in the plugin.


*validation config - can override
first name, last name: exist
full name: exist
birthdate check non-existent date
email regex @ .com
phone check all digits
