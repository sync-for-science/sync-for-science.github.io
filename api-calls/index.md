---
layout: page
---

# S4S FHIR API Calls

In the list of API calls below, you'll see each data type annotated with its [MU Common Clinical Data Set labels](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf) (#1-21). Note that we're currently not covering elements #16 (care team members), #18 (unique device identifiers), #19 (assessment and plan of treatment), #20 (goals) — which we believe is a reasonable scope limitation for the S4S pilots.

The [Argonaut Project](http://argonautwiki.hl7.org/index.php?title=Main_Page) will help define these elements in more depth, and we'll build on that effort when additional implementation guidance is available.

The examples below refer to the following variables:

 * `patientId` indicates the FHIR `id` of the `Patient` in context. For example, `123`.

 * `lastCheck` indiclates a FHIR `instant`, with millisecond-level precision including a timezone. For example, `2016-04-01T02:52:32.000Z`

We'll also refer to two "request times":

 * *first-connection* for broad queries that the app will make once, after first approval, to back-fill historical data
 * *periodic-update* for narrow queries the app will make frequently (e.g. weekly)

(Note: a production-quality app might repeat the "broad" queries on an occasional basis — e.g. yearly  — as a sanity check, and to discovery any data that may have fallen _out_ of the record.)

Want to propose a change?
[edit this page!](https://github.com/sync-for-science/sync-for-science.github.io/edit/master/api-calls/index.md)

## Authorization expectations

Sync for Science (like Argonaut) uses the OAuth2-based [SMART on FHIR authorization specification](http://docs.smarthealthit.org/authorization). But we don't need all the moving parts. In particular, in Sync for Science we can get away with a minimum of:

1. "**confidential clients**", meaning that apps get assigned a `client_id` and `client_secret` to authenticate to EHRs.The general SMART and Argonaut specs also require support for "public clients", but it's not strictly a requirement in S4S.

2.  "**standalone launch**" flow, meaning that the patient (research participant) can begin by interacting with the PMI app, and from there, can launch into an "connect to my EHR" workflow. The general SMART and Argonaut specs also require support for the "EHR launch flow" (where apps launch from an EHR or portal), but it's not strictly a requirement in S4S.

3.  **`patient/*.read launch/patient offline_access`** scopes, meaning that when the app launches, it will ask the EHR for permission to read all data available to the patient, and it will ask to learn the FHIR id of the patient whose records are shared.


We also **do not require support for Single Sign-on via OpenID Connect** in S4S (though again, it's part of SMART and Argonaut, and we encourage implementers to support it).

## Server metadata

Return a FHIR conformance statement with [SMART extensions for OAuth](http://docs.smarthealthit.org/authorization/conformance-statement/)

    GET /metadata

## Patient demographics ([MU CCDS #1-6](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))
Includes: name, birth sex, birthdate, race, ethnicty, preferred language

| Details             | URL                                                 |
|---------------------|-----------------------------------------------------|
| Argonaut Guide      | <http://argonautwiki.hl7.org/index.php?title=Patient> |
| FHIR DSTU2 Resource | <http://hl7.org/fhir/patient.html#resource>                    |

##### On *first-connection*, *periodic-update*.
    GET /Patient/{% raw %}{{patientId}}{% endraw %}

###### Request

```HTTP
GET /api/open-fhir/Patient/smart-1288992 HTTP/1.1
Host: portal.demo.syncfor.science
Accept: application/json+fhir
```

###### Response

```JSON
```

## Smoking status ([MU CCDS #7](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))

| Details             | URL                                                 |
|---------------------|-----------------------------------------------------|
| Argonaut Guide      | <http://argonautwiki.hl7.org/index.php?title=Smoking_Status> |
| FHIR DSTU2 Resource | <http://hl7.org/fhir/observation.html#resource>                    |

##### On *first-connection*
    GET /Observation?category=social-history&patient={% raw %}{{patientId}}{% endraw %}

###### Request

```HTTP
GET /api/open-fhir/Observation?category=social-history&patient=smart-1288992 HTTP/1.1
Host: portal.demo.syncfor.science
Accept: application/json+fhir
```

###### Response

```JSON
```

##### On *periodic-update*
    GET /Observation?category=social-history&patient={% raw %}{{patientId}}{% endraw %}&_lastUpdated=gt{% raw %}{{lastCheck}}{% endraw %}

###### Request

```HTTP
GET /api/open-fhir/Observation?category=social-history&patient=smart-1288992&_lastUpdated=gt2016-04-16 HTTP/1.1
Host: portal.demo.syncfor.science
Accept: application/json+fhir
```

###### Response

```JSON
```

## Problems ([MU CCDS #8, #21](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))

| Details             | URL                                                 |
|---------------------|-----------------------------------------------------|
| Argonaut Guide      | <http://argonautwiki.hl7.org/index.php?title=Problems_and_Health_Concerns> |
| FHIR DSTU2 Resource | <http://hl7.org/fhir/condition.html#resource>                    |


##### On *first-connection*
    GET /Condition?patient={% raw %}{{patientId}}{% endraw %}

###### Request

```HTTP
GET /api/open-fhir/Condition?patient=smart-1288992 HTTP/1.1
Host: portal.demo.syncfor.science
Accept: application/json+fhir
```

###### Response

```JSON
```

##### On *periodic-update*
    GET /Condition?patient={% raw %}{{patientId}}{% endraw %}&_lastUpdated=gt{% raw %}{{lastCheck}}{% endraw %}

###### Request

```HTTP
GET /api/open-fhir/Condition?patient=smart-1288992&_lastUpdated=gt2016-04-17T04:00:00 HTTP/1.1
Host: portal.demo.syncfor.science
Accept: application/json+fhir
```

###### Response

```JSON
```


## Medications and allergies ([MU CCDS #9-10](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))

| Details             | URL                                                 |
|---------------------|-----------------------------------------------------|
| Argonaut Guide      | <http://argonautwiki.hl7.org/index.php?title=Medications> <http://argonautwiki.hl7.org/index.php?title=Allergies> |
| FHIR DSTU2 Resource | <http://hl7.org/fhir/medicationstatement.html#resource> <http://hl7.org/fhir/medicationorder.html#resource> <http://hl7.org/fhir/medicationdispense.html#resource> <http://hl7.org/fhir/medicationadministration.html#resource>    <http://hl7.org/fhir/allergyintolerance.html#resource>                    |


##### On *first-connection*
    GET /MedicationOrder?patient={% raw %}{{patientId}}{% endraw %}

###### Request

```HTTP
GET /api/open-fhir/MedicationOrder?patient=smart-1288992&_count=1 HTTP/1.1
Host: portal.demo.syncfor.science
Accept: application/json+fhir
```

###### Response

```JSON
```

    GET /MedicationStatement?patient={% raw %}{{patientId}}{% endraw %}

###### Request

```HTTP
GET /api/open-fhir/MedicationStatement?patient=smart-1288992&_count=1 HTTP/1.1
Host: portal.demo.syncfor.science
Accept: application/json+fhir
```

###### Response

```JSON
```

    GET /MedicationDispense?patient={% raw %}{{patientId}}{% endraw %}

###### Request

```HTTP
GET /api/open-fhir/MedicationDispense?patient=smart-1288992&_count=1 HTTP/1.1
Host: portal.demo.syncfor.science
Accept: application/json+fhir
```

###### Response

```JSON
```

    GET /MedicationAdministration?patient={% raw %}{{patientId}}{% endraw %}

###### Request

```HTTP
GET /api/open-fhir/MedicationAdministration?patient=smart-1288992&_count=1 HTTP/1.1
Host: portal.demo.syncfor.science
Accept: application/json+fhir
```

###### Response

```JSON
```

    GET /AllergyIntolerance?patient={% raw %}{{patientId}}{% endraw %}

###### Request

```HTTP
GET /api/open-fhir/AllergyIntolerance?patient=smart-1288992&_count=1 HTTP/1.1
Host: portal.demo.syncfor.science
Accept: application/json+fhir
```

###### Response

```JSON
```

##### On *periodic-update*
    GET /MedicationOrder?patient={% raw %}{{patientId}}{% endraw %}&_lastUpdated=gt{% raw %}{{lastCheck}}{% endraw %}
    GET /MedicationStatement?patient={% raw %}{{patientId}}{% endraw %}&_lastUpdated=gt{% raw %}{{lastCheck}}{% endraw %}
    GET /MedicationDispense?patient={% raw %}{{patientId}}{% endraw %}&_lastUpdated=gt{% raw %}{{lastCheck}}{% endraw %}
    GET /MedicationAdministration?patient={% raw %}{{patientId}}{% endraw %}&_lastUpdated=gt{% raw %}{{lastCheck}}{% endraw %}
    GET /AllergyIntolerance?patient={% raw %}{{patientId}}{% endraw %}&_lastUpdated=gt{% raw %}{{lastCheck}}{% endraw %}}


## Lab results ([MU CCDS #11? and #12](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))


| Details             | URL                                                 |
|---------------------|-----------------------------------------------------|
| Argonaut Guide      | <http://argonautwiki.hl7.org/index.php?title=Laboratory_Results> |
| FHIR DSTU2 Resource | <https://hl7.org/fhir/observation.html#resource>                   |

##### On *first-connection*
    GET /Observation?category=laboratory?patient={% raw %}{{patientId}}{% endraw %}

###### Request

```HTTP
GET /api/open-fhir/Observation?category=laboratory&patient=smart-1288992&_count=5 HTTP/1.1
Host: portal.demo.syncfor.science
Accept: application/json+fhir
```

###### Response

```JSON
```

##### On *periodic-update*
    GET /Observation?category=laboratory?patient={% raw %}{{patientId}}{% endraw %}&_lastUpdated=gt{% raw %}{{lastCheck}}{% endraw %}

## Vital signs ([MU CCDS #13](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))


| Details             | URL                                                 |
|---------------------|-----------------------------------------------------|
| Argonaut Guide      | <http://argonautwiki.hl7.org/index.php?title=Vital_Signs> |
| FHIR DSTU2 Resource | <https://hl7.org/fhir/observation.html#resource>                   |


##### On *first-connection*
    GET /Observation?category=vital-signs?patient={% raw %}{{patientId}}{% endraw %}

###### Request

```HTTP
GET /api/open-fhir/Observation?category=vital-signs&patient=smart-1288992&_count=5 HTTP/1.1
Host: portal.demo.syncfor.science
Accept: application/json+fhir
```

###### Response

```JSON
```

##### On *periodic-update*
    GET /Observation?category=vital-signs?patient={% raw %}{{patientId}}{% endraw %}&_lastUpdated=gt{% raw %}{{lastCheck}}{% endraw %}

## Procedures ([MU CCDS #15](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))

| Details             | URL                                                 |
|---------------------|-----------------------------------------------------|
| Argonaut Guide      | <http://argonautwiki.hl7.org/index.php?title=Procedures> |
| FHIR DSTU2 Resource | <https://hl7.org/fhir/procedure.html#resource>                   |


##### On *first-connection*
    GET /Procedure?patient={% raw %}{{patientId}}{% endraw %}

###### Request

```HTTP
GET /api/open-fhir/Procedure?patient=smart-1288992 HTTP/1.1
Host: portal.demo.syncfor.science
Accept: application/json+fhir
```

###### Response

```JSON
```

##### On *periodic-update*
    GET /Procedure?patient={% raw %}{{patientId}}{% endraw %}&_lastUpdated=gt{% raw %}{{lastCheck}}{% endraw %}}

## Immunizations ([MU CCDS #17](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))

| Details             | URL                                                 |
|---------------------|-----------------------------------------------------|
| Argonaut Guide      | <http://argonautwiki.hl7.org/index.php?title=Immunizations> |
| FHIR DSTU2 Resource | <https://hl7.org/fhir/immunization.html#resource>                   |

##### On *first-connection*
    GET /Immunization?patient={% raw %}{{patientId}}{% endraw %}

###### Request

```HTTP
GET /api/open-fhir/Immunization?patient=smart-1288992 HTTP/1.1
Host: portal.demo.syncfor.science
Accept: application/json+fhir
```

###### Response

```JSON
```

##### On *periodic-update*
    GET /Immunization?patient={% raw %}{{patientId}}{% endraw %}&_lastUpdated=gt{% raw %}{{lastCheck}}{% endraw %}

## Patient documents

That is: whatever is available for portal download — not a CCDS requirement


| Details             | URL                                                 |
|---------------------|-----------------------------------------------------|
| Argonaut Guide      | <http://argonautwiki.hl7.org/index.php?title=Argonaut_Document_Access> |
| FHIR DSTU2 Resource | <https://hl7.org/fhir/documentreference.html#resource>                   |


##### On *first-connection*
    GET /DocumentReference?patient={% raw %}{{patientId}}{% endraw %}

###### Request

```HTTP
GET /api/open-fhir/DocumentReference?patient=smart-1288992 HTTP/1.1
Host: portal.demo.syncfor.science
Accept: application/json+fhir
```

###### Response

```JSON
```

##### On *periodic-update*
    GET /DocumentReference?patient={% raw %}{{patientId}}{% endraw %}&_lastUpdated=gt{% raw %}{{lastCheck}}{% endraw %}
