---
layout: page
---

# FHIR API Calls


The examples below will make use of the following variables:

 * `{{patientId}}` indicates the FHIR `id` of the `Patient` in context. For example, `123`.

 * `{{lastCheck}}` indiclates a FHIR `instant`, with millisecond-level precision including a timezone. For example, `2016-04-01T02:52:32.000Z`

We'll also refer to two "request times": *first-connection* for broad queries that the app will make once, after first approval, to back-fill historical data, and *regular-update* for narrow queries the app wil make frequently (e.g. weekly). (Note that a production-quality app might repeat the broad-queries on an infrequent basis (e.g. yearly) as a sanity check, and to discovery any data that may have fallen out of the record.)

In the list below, you'll also see each data type annotated with its [MU Common Clinical Data Set labels](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf) (1-21). Note that we're currently not covering elements 16, 18, 19, 20, 21 -- which we believe is totally reasonable scope for this pilot effort. [Argonaut](http://argonautwiki.hl7.org/index.php?title=Main_Page) will help define these in more depth, and we'll build on that effort when ready.

Want to propose a change?
[edit this page!](https://github.com/sync-for-science/sync-for-science.github.io/edit/master/api-calls/index.md)

## API calls S4S app will make:


#### Patient demographics ([MU CCDS 1-6](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))
Includes: name, birth sex, birthdate, race, ethnicty, preferred language

##### On *first-connection*, *regular-update*.
    GET /Patient/{{patientId}}
    
    
#### Smoking stauts ([MU CCDS 7](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))
##### On *first-connection*
    GET /Observation?category=social-history&patient={{patientId}}

##### On *regular-update*
    GET /Observation?category=social-history&patient={{patientId}&_lastUpdated=gt{{lastCheck}}}


#### Problems ([MU CCDS 8](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))
##### On *first-connection*
    GET /Condition?patient={{patientId}}

##### On *regular-update*
    GET /Condition?patient={{patientId}}&_lastUpdated=gt{{lastCheck}}


#### Medications and allergies([MU CCDS 9-10](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))

##### On *first-connection*
    GET /MedicationOrder?patient={{patientId}}
    GET /MedicationStatement?patient={{patientId}}
    GET /MedicationDispense?patient={{patientId}}
    GET /MedicationAdministration?patient={{patientId}}
    GET /AllergyIntolerance?patient={{patientId}}

##### On *regular-update*
    GET /MedicationOrder?patient={{patientId}}&_lastUpdated=gt{{lastCheck}}
    GET /MedicationStatement?patient={{patientId}}&_lastUpdated=gt{{lastCheck}}
    GET /MedicationDispense?patient={{patientId}}&_lastUpdated=gt{{lastCheck}}
    GET /MedicationAdministration?patient={{patientId}}&_lastUpdated=gt{{lastCheck}}
    GET /AllergyIntolerance?patient={{patientId}&_lastUpdated=gt{{lastCheck}}}


#### Lab results ([MU CCDS 11? and 12](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))
##### On *first-connection*
    GET /Observation?category=laboratory?patient={{patientId}}

##### On *regular-update*
    GET /Observation?category=laboratory?patient={{patientId}}&_lastUpdated=gt{{lastCheck}}
    
#### Vital signs ([MU CCDS 13](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))
##### On *first-connection*
    GET /Observation?category=vital-signs?patient={{patientId}}

##### On *regular-update*
    GET /Observation?category=vital-signs?patient={{patientId}}&_lastUpdated=gt{{lastCheck}}



#### Procedures ([MU CCDS 15](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))
##### On *first-connection*
    GET /Procedure?patient={{patientId}}

##### On *regular-update*
    GET /Procedure?patient={{patientId}&_lastUpdated=gt{{lastCheck}}}

#### Immunizations ([MU CCDS 17](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))
##### On *first-connection*
    GET /Immunization?patient={{patientId}}

##### On *regular-update*
    GET /Immunization?patient={{patientId}}&_lastUpdated=gt{{lastCheck}}

#### Patient documents (whatever is available for portal download)
##### On *first-connection*
    GET /DocumentReference?patient={{patientId}}

##### On *regular-update*
    GET /DocumentReference?patient={{patientId}}&_lastUpdated=gt{{lastCheck}}



