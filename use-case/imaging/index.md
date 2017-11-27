---
layout: page
---

# Imaging Data


The API calls below show how to use S4S for sharing Imaging Data. The Imaging Data Use Case is aligned with FHIR STU3.


{% include security.md %}


### Note on `503` response status and `Retry-After` hints

The Imaging Data use case is designed to be compatible with existing DICOM-based infrastructure, so that support can readily be built as a layer on top of widely supported PACS operatiosn like DICOM's C-MOVE and C-FIND. Since these DICOM operations can take several minutes to complete, the S4S client should be prepared to receive a `503` HTTP response code with a `Retry-After` header indicating how many seconds to wait before re-trying a request. For example, the following response means "try agian after 5 minutes (300 seconds)":

```
HTTP/1.1 503 Service Unavailable
Retry-AFter: 300
```

{% include metadata.md %}

## ImagingStudy
Includes: a list of imaging studies available for a patient. (TODO: include details from RSNA FHIR Broker.)

##### On *first-connection*
    GET /ImagingStudy?patient={% raw %}{{patientId}}{% endraw %}

###### Request

```HTTP
GET /api/open-fhir/ImagingStudy?patient=smart-1288992 HTTP/1.1
Host: portal.demo.syncfor.science
Accept: application/json+fhir
```

###### Response

```JSON
```

##### On *periodic-update*
    GET /ImagingStudy?patient={% raw %}{{patientId}}{% endraw %}&_lastUpdated=gt{% raw %}{{lastCheck}}{% endraw %}

###### Request

```HTTP
GET /api/open-fhir/ImagingStudy?patient=smart-1288992&_lastUpdated=gt2016-04-16 HTTP/1.1
Host: portal.demo.syncfor.science
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
Host: portal.demo.syncfor.science
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
Host: portal.demo.syncfor.science
Accept: application/json+fhir
```

###### Response

```JSON
```

Each `ImagingStudy` in the response bundle will include an `ImagingStudy.uid` value and an `ImagingStudy.endpoint` reference. These values can be used to retrieve full DICOM data for the study as follows:

1. The endpoint reference resolves to an Endpoint resource whose Endpoint.url represents a DICOM WADO service. For the example below, assume this URL was `https://imaging-server/Patient/smart-1288992/$wado-rs`.

2. The uid value provides a DICOM study unique id. For the example below, assume this uid was `urn:oid:2.16.124.113543.6003.1154777499.30246.19789.3503430045`.

3. These vales can be used to formulate a request for DICOM data as follows:

```
GET https://imaging-server/Patient/smart-1288992/$wado-rs/studies/2.16.124.113543.6003.1154777499.30246.19789.3503430045
Accept: multipart/related; type=application/dicom
```
