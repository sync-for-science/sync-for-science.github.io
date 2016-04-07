---
layout: page
---

# FHIR API Calls

For the examples below, we'll assume we're working with:

 * access at the single-patient level
 * a patient with `id` = `123`

## Demographics

##### API Call
    GET /Patient/123/

##### Response
FHIR `Patient` resource, with extensions for MU race, ethnicity, ± birth sex.

