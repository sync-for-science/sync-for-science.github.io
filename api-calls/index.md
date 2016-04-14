---
layout: page
---

# FHIR API Calls

In the list of API calls below, you'll see each data type annotated with its [MU Common Clinical Data Set labels](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf) (1-21). Note that we're currently not covering elements 16 (care team members), 18 (unique device identifiers), 19 (assessment and plan of treatment), 20 (goals), 21 (health concerns) — which we believe is a reasonable scope limitation for the S4S pilots. the [Argonaut Project](http://argonautwiki.hl7.org/index.php?title=Main_Page) will help define these elements in more depth, and we'll build on that effort when additional implementation guidance is available.

The examples below refer to the following variables:

 * `{{patientId}}` indicates the FHIR `id` of the `Patient` in context. For example, `123`.

 * `{{lastCheck}}` indiclates a FHIR `instant`, with millisecond-level precision including a timezone. For example, `2016-04-01T02:52:32.000Z`

We'll also refer to two "request times": *first-connection* for broad queries that the app will make once, after first approval, to back-fill historical data, and *regular-update* for narrow queries the app wil make frequently (e.g. weekly). (Note: a production-quality app might repeat the "broad" queries on a occasional basis (e.g. yearly) as a sanity check, and to discovery any data that may have fallen _out_ of the record.)

Want to propose a change?
[edit this page!](https://github.com/sync-for-science/sync-for-science.github.io/edit/master/api-calls/index.md)

## API calls the S4S app will make

#### Patient demographics ([MU CCDS #1-6](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))
Includes: name, birth sex, birthdate, race, ethnicty, preferred language

##### On *first-connection*, *regular-update*.
    GET /Patient/{{patientId}}
    
    
#### Smoking status ([MU CCDS #7](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))
##### On *first-connection*
    GET /Observation?category=social-history&patient={{patientId}}

##### On *regular-update*
    GET /Observation?category=social-history&patient={{patientId}}&_lastUpdated=gt{{lastCheck}}


#### Problems ([MU CCDS #8](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))
##### On *first-connection*
    GET /Condition?patient={{patientId}}

##### On *regular-update*
    GET /Condition?patient={{patientId}}&_lastUpdated=gt{{lastCheck}}


#### Medications and allergies([MU CCDS #9-10](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))

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
    GET /AllergyIntolerance?patient={{patientId}}&_lastUpdated=gt{{lastCheck}}}


#### Lab results ([MU CCDS #11? and #12](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))
##### On *first-connection*
    GET /Observation?category=laboratory?patient={{patientId}}

##### On *regular-update*
    GET /Observation?category=laboratory?patient={{patientId}}&_lastUpdated=gt{{lastCheck}}
    
#### Vital signs ([MU CCDS #13](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))
##### On *first-connection*
    GET /Observation?category=vital-signs?patient={{patientId}}

##### On *regular-update*
    GET /Observation?category=vital-signs?patient={{patientId}}&_lastUpdated=gt{{lastCheck}}

#### Procedures ([MU CCDS #15](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))
##### On *first-connection*
    GET /Procedure?patient={{patientId}}

##### On *regular-update*
    GET /Procedure?patient={{patientId}}&_lastUpdated=gt{{lastCheck}}}

#### Immunizations ([MU CCDS 17](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))
##### On *first-connection*
    GET /Immunization?patient={{patientId}}

##### On *regular-update*
    GET /Immunization?patient={{patientId}}&_lastUpdated=gt{{lastCheck}}

#### Patient documents (i.e. whatever is available for portal download — not a CCDS requirement)
##### On *first-connection*
    GET /DocumentReference?patient={{patientId}}

##### On *regular-update*
    GET /DocumentReference?patient={{patientId}}&_lastUpdated=gt{{lastCheck}}



