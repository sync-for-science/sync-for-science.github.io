---
layout: page
---

# Financial Data

The API calls below show how to use S4S for sharing Financial Data. The
Financial Data Use Case is aligned with FHIR STU3.

{% include security.md %}
{% include metadata.md %}

## Patient demographics
Includes: name, birth sex, birthdate, race, ethnicty, preferred language

| Details             | URL                                                 |
|---------------------|-----------------------------------------------------|
| FHIR DSTU2 Resource | <http://hl7.org/fhir/STU3/patient.html#resource>                    |

##### On *first-connection*, *periodic-update*.
    GET /Patient/{% raw %}{{patientId}}{% endraw %}

###### Request

```HTTP
GET /api/open-fhir/Patient/smart-1288992 HTTP/1.1
Host: portal-stu3.demo.syncfor.science
Accept: application/json+fhir
```

###### Response

```JSON
```

## Coverage
Includes: details about a patient's insurance coverage (TODO: include details from BB on FHIR profiles)

##### On *first-connection*
    GET /Coverage?beneficiary={% raw %}{{patientId}}{% endraw %}

###### Request

```HTTP
GET /api/open-fhir/Coverage?beneficiary=smart-1288992 HTTP/1.1
Host: portal-stu3.demo.syncfor.science
Accept: application/json+fhir
```

###### Response

```JSON
```

##### On *periodic-update*
    GET /Coverage?beneficiary={% raw %}{{patientId}}{% endraw %}&_lastUpdated=gt{% raw %}{{lastCheck}}{% endraw %}

###### Request

```HTTP
GET /api/open-fhir/Coverage?beneficiary=smart-1288992&_lastUpdated=gt2016-04-16 HTTP/1.1
Host: portal-stu3.demo.syncfor.science
Accept: application/json+fhir
```

###### Response

```JSON
```

## Explanation Of Benefit
Includes: details about benefits that a patient has received through their insurance coverage (TODO: include details from BB on FHIR profiles).

##### On *first-connection*
    GET /ExplanationOfBenefit?patient={% raw %}{{patientId}}{% endraw %}

###### Request

```HTTP
GET /api/open-fhir/ExplanationOfBenefit?patient=smart-1288992 HTTP/1.1
Host: portal-stu3.demo.syncfor.science
Accept: application/json+fhir
```

###### Response

```JSON
```

##### On *periodic-update*
    GET /ExplanationOfBenefit?patient={% raw %}{{patientId}}{% endraw %}&_lastUpdated=gt{% raw %}{{lastCheck}}{% endraw %}

###### Request

```HTTP
GET /api/open-fhir/ExplanationOfBenefit?patient=smart-1288992&_lastUpdated=gt2016-04-16 HTTP/1.1
Host: portal-stu3.demo.syncfor.science
Accept: application/json+fhir
```

###### Response

```JSON
```

