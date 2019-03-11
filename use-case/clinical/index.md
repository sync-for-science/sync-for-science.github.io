---
layout: page
---

# Clinical Data

The API calls below show how to use S4S for sharing Clinical Data. You'll see each data type annotated with its [MU Common Clinical Data Set labels](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf) (#1-21). Note that we're currently not covering elements #16 (care team members), #18 (unique device identifiers), #19 (assessment and plan of treatment), #20 (goals) — which we believe is a reasonable scope limitation for the S4S pilots.

The APIs are designed for compatibility with the [Argonaut Project Data Query Implementation Guide](http://www.fhir.org/guides/argonaut/r2/), based on SMART on FHIR.

{% include security.md %}
{% include metadata.md %}

## Patient demographics ([MU CCDS #1-6](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))
Includes: name, birth sex, birthdate, race, ethnicty, preferred language

| Details             | URL                                                 |
|---------------------|-----------------------------------------------------|
| Argonaut Guide      | <http://argonautwiki.hl7.org/index.php?title=Patient> |
| FHIR DSTU2 Resource | <http://hl7.org/fhir/DSTU2/patient.html#resource>                    |

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
| FHIR DSTU2 Resource | <http://hl7.org/fhir/DSTU2/observation.html#resource>                    |

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
| FHIR DSTU2 Resource | <http://hl7.org/fhir/DSTU2/condition.html#resource>                    |


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
| FHIR DSTU2 Resource | <http://hl7.org/fhir/DSTU2/medicationstatement.html#resource> <http://hl7.org/fhir/DSTU2/medicationorder.html#resource> <http://hl7.org/fhir/DSTU2/medicationdispense.html#resource> <http://hl7.org/fhir/DSTU2/medicationadministration.html#resource>    <http://hl7.org/fhir/DSTU2/allergyintolerance.html#resource>                    |


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
| FHIR DSTU2 Resource | <https://hl7.org/fhir/DSTU2/observation.html#resource>                   |

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
| FHIR DSTU2 Resource | <https://hl7.org/fhir/DSTU2/observation.html#resource>                   |


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
| FHIR DSTU2 Resource | <https://hl7.org/fhir/DSTU2/procedure.html#resource>                   |


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
| FHIR DSTU2 Resource | <https://hl7.org/fhir/DSTU2/immunization.html#resource>                   |

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
| FHIR DSTU2 Resource | <https://hl7.org/fhir/DSTU2/documentreference.html#resource>                   |


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
