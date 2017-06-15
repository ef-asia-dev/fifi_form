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

(1) ☑ Brochure ☑ MoreInfo
Poseidon>TBC (Brochure weights stronger then MoreInfo )
(2) ☑ Brochure ☐ MoreInfo
Poseidon>TBC (To be call)
(3) ☐ Brochure ☑ MoreInfo
Poseidon>NTBC (Not to be called)
(4) ☐ Brochure ☐ MoreInfo
NO Poseidon>Campaign DB
(5) ☐ Brochure ☑ MoreInfo(Hidden, default on) ☑ T&C(Force MoreInfo)
Poseidon>NTBC
(6) ☑ Brochure ☑ MoreInfo(Hidden, default on) ☑ T&C(Force MoreInfo)
Poseidon>TBC
(7) ☑ Brochure ☐ MoreInfo ☑ T&C(Force Bro)
Poseidon>TBC
