---
layout: page
---

# S4S FHIR API Calls

In the list of API calls below, you'll see each data type annotated with its [MU Common Clinical Data Set labels](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf) (#1-21). Note that we're currently not covering elements #16 (care team members), #18 (unique device identifiers), #19 (assessment and plan of treatment), #20 (goals), #21 (health concerns) — which we believe is a reasonable scope limitation for the S4S pilots.

The [Argonaut Project](http://argonautwiki.hl7.org/index.php?title=Main_Page) will help define these elements in more depth, and we'll build on that effort when additional implementation guidance is available.

The examples below refer to the following variables:

 * `:patientId` indicates the FHIR `id` of the `Patient` in context. For example, `123`.

 * `:lastCheck` indiclates a FHIR `instant`, with millisecond-level precision including a timezone. For example, `2016-04-01T02:52:32.000Z`

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

We also **do not require support for Single Sign-on via OpenID Connect** in S4S (though again, it's part of SMART and Argonaut, and we encourage implementers to support it).

## Server metadata

Return a FHIR conformance statement with [SMART extensions for OAuth](http://docs.smarthealthit.org/authorization/conformance-statement/)

    GET /metadata

## Patient demographics ([MU CCDS #1-6](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))
Includes: name, birth sex, birthdate, race, ethnicty, preferred language

##### On *first-connection*, *periodic-update*.
    GET /Patient/{% raw %}{{patientId}}{% endraw %}

###### Request

```
curl -X GET "https://portal.demo.syncfor.science/api/fhir/Patient/smart-1288992"
```

###### Response

```
{
    "resourceType":"Patient",
    "id":"smart-1288992",
    "meta":{
        "versionId":"1",
        "lastUpdated":"2016-04-17T04:25:53.405+00:00",
        "security":[
            {
                "system":"http://smarthealthit.org/security/users",
                "code":"Patient/smart-1288992"
            },
            {
                "system":"http://smarthealthit.org/security/categories",
                "code":"patient"
            }
        ]
    },
    "text":{
        "status":"generated",
        "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">        <p>Daniel Adams</p>      </div>"
    },
    "identifier":[
        {
            "use":"usual",
            "type":{
                "coding":[
                    {
                        "system":"http://hl7.org/fhir/v2/0203",
                        "code":"MR",
                        "display":"Medical record number"
                    }
                ],
                "text":"Medical record number"
            },
            "system":"http://hospital.smarthealthit.org",
            "value":"1288992"
        }
    ],
    "active":true,
    "name":[
        {
            "use":"official",
            "family":[
                "Adams"
            ],
            "given":[
                "Daniel",
                "X."
            ]
        }
    ],
    "telecom":[
        {
            "system":"email",
            "value":"daniel.adams@example.com"
        }
    ],
    "gender":"male",
    "birthDate":"1925-12-23",
    "address":[
        {
            "use":"home",
            "line":[
                "1 Hill AveApt 14"
            ],
            "city":"Tulsa",
            "state":"OK",
            "postalCode":"74117",
            "country":"USA"
        }
    ]
}
```

## Smoking status ([MU CCDS #7](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))

##### On *first-connection*
    GET /Observation?category=social-history&patient={% raw %}{{patientId}}{% endraw %}

###### Request

```
curl -X GET "https://portal.demo.syncfor.science/api/fhir/Observation?category=social-history&patient=smart-1288992"
```

###### Response

```
{
    "resourceType":"Bundle",
    "id":"fd5c04c4-77f9-4654-94d4-bdacde176d3e",
    "meta":{
        "lastUpdated":"2016-04-21T21:38:23.879+00:00"
    },
    "type":"searchset",
    "total":1,
    "link":[
        {
            "relation":"self",
            "url":"https://portal.demo.syncfor.science/api/fhir/Observation?_security=public%2Cpatient%2Cmedications%2Callergies%2Cimmunizations%2Cproblems%2Cprocedures%2Cvital-signs%2Claboratory%2Csmoking&_security=public%2CPatient%2Fsmart-1288992&category=social-history&patient=smart-1288992"
        }
    ],
    "entry":[
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/Observation/smart-observation-21-smokingstatus",
            "resource":{
                "resourceType":"Observation",
                "id":"smart-observation-21-smokingstatus",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"smoking"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">Tobacco smoking status: Former smoker</div>"
                },
                "status":"final",
                "category":{
                    "coding":[
                        {
                            "system":"http://hl7.org/fhir/observation-category",
                            "code":"social-history",
                            "display":"Social History"
                        }
                    ],
                    "text":"Social History"
                },
                "code":{
                    "coding":[
                        {
                            "system":"http://loinc.org",
                            "code":"72166-2",
                            "display":"Tobacco smoking status"
                        }
                    ],
                    "text":"Tobacco smoking status"
                },
                "subject":{
                    "reference":"Patient/smart-1288992"
                },
                "valueCodeableConcept":{
                    "coding":[
                        {
                            "system":"http://snomed.info/sct",
                            "code":"8517006",
                            "display":"Former smoker"
                        }
                    ],
                    "text":"Former smoker"
                }
            },
            "search":{
                "mode":"match"
            }
        }
    ]
}
```

##### On *periodic-update*
    GET /Observation?category=social-history&patient={% raw %}{{patientId}}{% endraw %}&_lastUpdated=gt{% raw %}{{lastCheck}}{% endraw %}

###### Request

```
curl -X GET "https://portal.demo.syncfor.science/api/fhir/Observation?category=social-history&patient=smart-1288992&_lastUpdated=gt2016-04-16"
```

###### Response

```
{
    "resourceType":"Bundle",
    "id":"b71f61b5-3035-4077-978f-b7a771e6a966",
    "meta":{
        "lastUpdated":"2016-04-21T21:41:03.481+00:00"
    },
    "type":"searchset",
    "total":1,
    "link":[
        {
            "relation":"self",
            "url":"https://portal.demo.syncfor.science/api/fhir/Observation?_security=public%2Cpatient%2Cmedications%2Callergies%2Cimmunizations%2Cproblems%2Cprocedures%2Cvital-signs%2Claboratory%2Csmoking&_security=public%2CPatient%2Fsmart-1288992&category=social-history&patient=smart-1288992&_lastUpdated=%3E2016-04-16"
        }
    ],
    "entry":[
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/Observation/smart-observation-21-smokingstatus",
            "resource":{
                "resourceType":"Observation",
                "id":"smart-observation-21-smokingstatus",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"smoking"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">Tobacco smoking status: Former smoker</div>"
                },
                "status":"final",
                "category":{
                    "coding":[
                        {
                            "system":"http://hl7.org/fhir/observation-category",
                            "code":"social-history",
                            "display":"Social History"
                        }
                    ],
                    "text":"Social History"
                },
                "code":{
                    "coding":[
                        {
                            "system":"http://loinc.org",
                            "code":"72166-2",
                            "display":"Tobacco smoking status"
                        }
                    ],
                    "text":"Tobacco smoking status"
                },
                "subject":{
                    "reference":"Patient/smart-1288992"
                },
                "valueCodeableConcept":{
                    "coding":[
                        {
                            "system":"http://snomed.info/sct",
                            "code":"8517006",
                            "display":"Former smoker"
                        }
                    ],
                    "text":"Former smoker"
                }
            },
            "search":{
                "mode":"match"
            }
        }
    ]
}
```

## Problems ([MU CCDS #8](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))

##### On *first-connection*
    GET /Condition?patient={% raw %}{{patientId}}{% endraw %}

###### Request

```
curl -X GET "https://portal.demo.syncfor.science/api/fhir/Condition?patient=smart-1288992"
```

###### Response

```
{
    "resourceType":"Bundle",
    "id":"ead80391-74c8-4817-9184-f7291077c49d",
    "meta":{
        "lastUpdated":"2016-04-21T21:46:26.271+00:00"
    },
    "type":"searchset",
    "total":10,
    "link":[
        {
            "relation":"self",
            "url":"https://portal.demo.syncfor.science/api/fhir/Condition?_security=public%2Cpatient%2Cmedications%2Callergies%2Cimmunizations%2Cproblems%2Cprocedures%2Cvital-signs%2Claboratory%2Csmoking&_security=public%2CPatient%2Fsmart-1288992&patient=smart-1288992"
        }
    ],
    "entry":[
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/Condition/smart-condition-16",
            "resource":{
                "resourceType":"Condition",
                "id":"smart-condition-16",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"problems"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">Osteoarthritis</div>"
                },
                "patient":{
                    "reference":"Patient/smart-1288992"
                },
                "code":{
                    "coding":[
                        {
                            "system":"http://snomed.info/sct",
                            "code":"396275006",
                            "display":"Osteoarthritis"
                        }
                    ],
                    "text":"Osteoarthritis"
                },
                "clinicalStatus":"confirmed",
                "onsetDateTime":"2007-07-11"
            },
            "search":{
                "mode":"match"
            }
        },
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/Condition/smart-condition-20",
            "resource":{
                "resourceType":"Condition",
                "id":"smart-condition-20",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"problems"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">Disorder of lung</div>"
                },
                "patient":{
                    "reference":"Patient/smart-1288992"
                },
                "code":{
                    "coding":[
                        {
                            "system":"http://snomed.info/sct",
                            "code":"427359005",
                            "display":"Disorder of lung"
                        }
                    ],
                    "text":"Disorder of lung"
                },
                "clinicalStatus":"confirmed",
                "onsetDateTime":"2008-07-10"
            },
            "search":{
                "mode":"match"
            }
        },
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/Condition/smart-condition-17",
            "resource":{
                "resourceType":"Condition",
                "id":"smart-condition-17",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"problems"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">Other persistent mental disorders due to conditions classified elsewhere</div>"
                },
                "patient":{
                    "reference":"Patient/smart-1288992"
                },
                "code":{
                    "coding":[
                        {
                            "system":"http://snomed.info/sct",
                            "code":"52448006",
                            "display":"Other persistent mental disorders due to conditions classified elsewhere"
                        }
                    ],
                    "text":"Other persistent mental disorders due to conditions classified elsewhere"
                },
                "clinicalStatus":"confirmed",
                "onsetDateTime":"2007-09-15"
            },
            "search":{
                "mode":"match"
            }
        },
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/Condition/smart-condition-21",
            "resource":{
                "resourceType":"Condition",
                "id":"smart-condition-21",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"problems"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">Alzheimer's disease</div>"
                },
                "patient":{
                    "reference":"Patient/smart-1288992"
                },
                "code":{
                    "coding":[
                        {
                            "system":"http://snomed.info/sct",
                            "code":"26929004",
                            "display":"Alzheimer's disease"
                        }
                    ],
                    "text":"Alzheimer's disease"
                },
                "clinicalStatus":"confirmed",
                "onsetDateTime":"2008-08-08"
            },
            "search":{
                "mode":"match"
            }
        },
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/Condition/smart-condition-18",
            "resource":{
                "resourceType":"Condition",
                "id":"smart-condition-18",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"problems"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">Vascular dementia, uncomplicated</div>"
                },
                "patient":{
                    "reference":"Patient/smart-1288992"
                },
                "code":{
                    "coding":[
                        {
                            "system":"http://snomed.info/sct",
                            "code":"429998004",
                            "display":"Vascular dementia, uncomplicated"
                        }
                    ],
                    "text":"Vascular dementia, uncomplicated"
                },
                "clinicalStatus":"confirmed",
                "onsetDateTime":"2007-11-17"
            },
            "search":{
                "mode":"match"
            }
        },
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/Condition/smart-condition-14",
            "resource":{
                "resourceType":"Condition",
                "id":"smart-condition-14",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"problems"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">Amnesia</div>"
                },
                "patient":{
                    "reference":"Patient/smart-1288992"
                },
                "code":{
                    "coding":[
                        {
                            "system":"http://snomed.info/sct",
                            "code":"48167000",
                            "display":"Amnesia"
                        }
                    ],
                    "text":"Amnesia"
                },
                "clinicalStatus":"confirmed",
                "onsetDateTime":"2005-05-22"
            },
            "search":{
                "mode":"match"
            }
        },
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/Condition/smart-condition-22",
            "resource":{
                "resourceType":"Condition",
                "id":"smart-condition-22",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"problems"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">Dementia associated with another disease</div>"
                },
                "patient":{
                    "reference":"Patient/smart-1288992"
                },
                "code":{
                    "coding":[
                        {
                            "system":"http://snomed.info/sct",
                            "code":"191519005",
                            "display":"Dementia associated with another disease"
                        }
                    ],
                    "text":"Dementia associated with another disease"
                },
                "clinicalStatus":"confirmed",
                "onsetDateTime":"2008-08-08"
            },
            "search":{
                "mode":"match"
            }
        },
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/Condition/smart-condition-23",
            "resource":{
                "resourceType":"Condition",
                "id":"smart-condition-23",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"problems"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">Needs influenza immunization</div>"
                },
                "patient":{
                    "reference":"Patient/smart-1288992"
                },
                "code":{
                    "coding":[
                        {
                            "system":"http://snomed.info/sct",
                            "code":"185903001",
                            "display":"Needs influenza immunization"
                        }
                    ],
                    "text":"Needs influenza immunization"
                },
                "clinicalStatus":"confirmed",
                "onsetDateTime":"2008-08-08"
            },
            "search":{
                "mode":"match"
            }
        },
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/Condition/smart-condition-19",
            "resource":{
                "resourceType":"Condition",
                "id":"smart-condition-19",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"problems"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">Essential hypertension</div>"
                },
                "patient":{
                    "reference":"Patient/smart-1288992"
                },
                "code":{
                    "coding":[
                        {
                            "system":"http://snomed.info/sct",
                            "code":"38341003",
                            "display":"Essential hypertension"
                        }
                    ],
                    "text":"Essential hypertension"
                },
                "clinicalStatus":"confirmed",
                "onsetDateTime":"2008-04-20"
            },
            "search":{
                "mode":"match"
            }
        },
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/Condition/smart-condition-15",
            "resource":{
                "resourceType":"Condition",
                "id":"smart-condition-15",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"problems"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">Benign essential hypertension</div>"
                },
                "patient":{
                    "reference":"Patient/smart-1288992"
                },
                "code":{
                    "coding":[
                        {
                            "system":"http://snomed.info/sct",
                            "code":"1201005",
                            "display":"Benign essential hypertension"
                        }
                    ],
                    "text":"Benign essential hypertension"
                },
                "clinicalStatus":"confirmed",
                "onsetDateTime":"2007-07-11"
            },
            "search":{
                "mode":"match"
            }
        }
    ]
}
```

##### On *periodic-update*
    GET /Condition?patient={% raw %}{{patientId}}{% endraw %}&_lastUpdated=gt{% raw %}{{lastCheck}}{% endraw %}

###### Request

```
curl -X GET "https://portal.demo.syncfor.science/api/fhir/Condition?patient=smart-1288992&_lastUpdated=gt2016-04-17T04:00:00"
```

###### Response

```
{
    "resourceType":"Bundle",
    "id":"c2e8ebf0-b66c-492c-a5bb-d3154c58619c",
    "meta":{
        "lastUpdated":"2016-04-21T21:50:12.457+00:00"
    },
    "type":"searchset",
    "total":10,
    "link":[
        {
            "relation":"self",
            "url":"https://portal.demo.syncfor.science/api/fhir/Condition?_security=public%2Cpatient%2Cmedications%2Callergies%2Cimmunizations%2Cproblems%2Cprocedures%2Cvital-signs%2Claboratory%2Csmoking&_security=public%2CPatient%2Fsmart-1288992&patient=smart-1288992&_lastUpdated=%3E2016-04-17T04%3A00%3A00"
        }
    ],
    "entry":[
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/Condition/smart-condition-16",
            "resource":{
                "resourceType":"Condition",
                "id":"smart-condition-16",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"problems"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">Osteoarthritis</div>"
                },
                "patient":{
                    "reference":"Patient/smart-1288992"
                },
                "code":{
                    "coding":[
                        {
                            "system":"http://snomed.info/sct",
                            "code":"396275006",
                            "display":"Osteoarthritis"
                        }
                    ],
                    "text":"Osteoarthritis"
                },
                "clinicalStatus":"confirmed",
                "onsetDateTime":"2007-07-11"
            },
            "search":{
                "mode":"match"
            }
        },
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/Condition/smart-condition-20",
            "resource":{
                "resourceType":"Condition",
                "id":"smart-condition-20",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"problems"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">Disorder of lung</div>"
                },
                "patient":{
                    "reference":"Patient/smart-1288992"
                },
                "code":{
                    "coding":[
                        {
                            "system":"http://snomed.info/sct",
                            "code":"427359005",
                            "display":"Disorder of lung"
                        }
                    ],
                    "text":"Disorder of lung"
                },
                "clinicalStatus":"confirmed",
                "onsetDateTime":"2008-07-10"
            },
            "search":{
                "mode":"match"
            }
        },
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/Condition/smart-condition-17",
            "resource":{
                "resourceType":"Condition",
                "id":"smart-condition-17",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"problems"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">Other persistent mental disorders due to conditions classified elsewhere</div>"
                },
                "patient":{
                    "reference":"Patient/smart-1288992"
                },
                "code":{
                    "coding":[
                        {
                            "system":"http://snomed.info/sct",
                            "code":"52448006",
                            "display":"Other persistent mental disorders due to conditions classified elsewhere"
                        }
                    ],
                    "text":"Other persistent mental disorders due to conditions classified elsewhere"
                },
                "clinicalStatus":"confirmed",
                "onsetDateTime":"2007-09-15"
            },
            "search":{
                "mode":"match"
            }
        },
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/Condition/smart-condition-21",
            "resource":{
                "resourceType":"Condition",
                "id":"smart-condition-21",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"problems"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">Alzheimer's disease</div>"
                },
                "patient":{
                    "reference":"Patient/smart-1288992"
                },
                "code":{
                    "coding":[
                        {
                            "system":"http://snomed.info/sct",
                            "code":"26929004",
                            "display":"Alzheimer's disease"
                        }
                    ],
                    "text":"Alzheimer's disease"
                },
                "clinicalStatus":"confirmed",
                "onsetDateTime":"2008-08-08"
            },
            "search":{
                "mode":"match"
            }
        },
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/Condition/smart-condition-14",
            "resource":{
                "resourceType":"Condition",
                "id":"smart-condition-14",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"problems"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">Amnesia</div>"
                },
                "patient":{
                    "reference":"Patient/smart-1288992"
                },
                "code":{
                    "coding":[
                        {
                            "system":"http://snomed.info/sct",
                            "code":"48167000",
                            "display":"Amnesia"
                        }
                    ],
                    "text":"Amnesia"
                },
                "clinicalStatus":"confirmed",
                "onsetDateTime":"2005-05-22"
            },
            "search":{
                "mode":"match"
            }
        },
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/Condition/smart-condition-18",
            "resource":{
                "resourceType":"Condition",
                "id":"smart-condition-18",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"problems"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">Vascular dementia, uncomplicated</div>"
                },
                "patient":{
                    "reference":"Patient/smart-1288992"
                },
                "code":{
                    "coding":[
                        {
                            "system":"http://snomed.info/sct",
                            "code":"429998004",
                            "display":"Vascular dementia, uncomplicated"
                        }
                    ],
                    "text":"Vascular dementia, uncomplicated"
                },
                "clinicalStatus":"confirmed",
                "onsetDateTime":"2007-11-17"
            },
            "search":{
                "mode":"match"
            }
        },
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/Condition/smart-condition-22",
            "resource":{
                "resourceType":"Condition",
                "id":"smart-condition-22",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"problems"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">Dementia associated with another disease</div>"
                },
                "patient":{
                    "reference":"Patient/smart-1288992"
                },
                "code":{
                    "coding":[
                        {
                            "system":"http://snomed.info/sct",
                            "code":"191519005",
                            "display":"Dementia associated with another disease"
                        }
                    ],
                    "text":"Dementia associated with another disease"
                },
                "clinicalStatus":"confirmed",
                "onsetDateTime":"2008-08-08"
            },
            "search":{
                "mode":"match"
            }
        },
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/Condition/smart-condition-15",
            "resource":{
                "resourceType":"Condition",
                "id":"smart-condition-15",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"problems"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">Benign essential hypertension</div>"
                },
                "patient":{
                    "reference":"Patient/smart-1288992"
                },
                "code":{
                    "coding":[
                        {
                            "system":"http://snomed.info/sct",
                            "code":"1201005",
                            "display":"Benign essential hypertension"
                        }
                    ],
                    "text":"Benign essential hypertension"
                },
                "clinicalStatus":"confirmed",
                "onsetDateTime":"2007-07-11"
            },
            "search":{
                "mode":"match"
            }
        },
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/Condition/smart-condition-19",
            "resource":{
                "resourceType":"Condition",
                "id":"smart-condition-19",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"problems"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">Essential hypertension</div>"
                },
                "patient":{
                    "reference":"Patient/smart-1288992"
                },
                "code":{
                    "coding":[
                        {
                            "system":"http://snomed.info/sct",
                            "code":"38341003",
                            "display":"Essential hypertension"
                        }
                    ],
                    "text":"Essential hypertension"
                },
                "clinicalStatus":"confirmed",
                "onsetDateTime":"2008-04-20"
            },
            "search":{
                "mode":"match"
            }
        },
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/Condition/smart-condition-23",
            "resource":{
                "resourceType":"Condition",
                "id":"smart-condition-23",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"problems"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">Needs influenza immunization</div>"
                },
                "patient":{
                    "reference":"Patient/smart-1288992"
                },
                "code":{
                    "coding":[
                        {
                            "system":"http://snomed.info/sct",
                            "code":"185903001",
                            "display":"Needs influenza immunization"
                        }
                    ],
                    "text":"Needs influenza immunization"
                },
                "clinicalStatus":"confirmed",
                "onsetDateTime":"2008-08-08"
            },
            "search":{
                "mode":"match"
            }
        }
    ]
}
```


## Medications and allergies ([MU CCDS #9-10](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))

##### On *first-connection*
    GET /MedicationOrder?patient={% raw %}{{patientId}}{% endraw %}

###### Request

```
curl -X GET "https://portal.demo.syncfor.science/api/fhir/MedicationOrder?patient=smart-1288992&_count=1"
```

###### Response

```
{
    "resourceType":"Bundle",
    "id":"26e6d07e-3e75-46fb-869b-053b4c31a213",
    "meta":{
        "lastUpdated":"2016-04-21T21:53:44.578+00:00"
    },
    "type":"searchset",
    "total":5,
    "link":[
        {
            "relation":"self",
            "url":"https://portal.demo.syncfor.science/api/fhir/MedicationOrder?_security=public%2Cpatient%2Cmedications%2Callergies%2Cimmunizations%2Cproblems%2Cprocedures%2Cvital-signs%2Claboratory%2Csmoking&_security=public%2CPatient%2Fsmart-1288992&patient=smart-1288992"
        },
        {
            "relation":"next",
            "url":"https://portal.demo.syncfor.science/api/fhir?_getpages=cb542178-3500-4e69-8366-9d5d6e6318a8&_getpagesoffset=1&_count=1&_pretty=true&_bundletype=searchset"
        }
    ],
    "entry":[
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/MedicationOrder/smart-medicationorder-140",
            "resource":{
                "resourceType":"MedicationOrder",
                "id":"smart-medicationorder-140",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"medications"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">      Memantine 10 MG Oral Tablet [Namenda] (rxnorm: 404673)    </div>"
                },
                "status":"active",
                "patient":{
                    "reference":"Patient/smart-1288992"
                },
                "medicationCodeableConcept":{
                    "coding":[
                        {
                            "system":"http://www.nlm.nih.gov/research/umls/rxnorm",
                            "code":"404673",
                            "display":"Memantine 10 MG Oral Tablet [Namenda]"
                        }
                    ],
                    "text":"Memantine 10 MG Oral Tablet [Namenda]"
                },
                "dosageInstruction":[
                    {
                        "text":"1 bid",
                        "timing":{
                            "repeat":{
                                "boundsPeriod":{
                                    "start":"2008-08-13"
                                },
                                "frequency":2,
                                "period":1,
                                "periodUnits":"d"
                            }
                        },
                        "doseQuantity":{
                            "value":1,
                            "unit":"{tablet}",
                            "system":"http://unitsofmeasure.org",
                            "code":"{tablet}"
                        }
                    }
                ],
                "dispenseRequest":{
                    "numberOfRepeatsAllowed":1,
                    "quantity":{
                        "value":180,
                        "unit":"{tablet}",
                        "system":"http://unitsofmeasure.org",
                        "code":"{tablet}"
                    },
                    "expectedSupplyDuration":{
                        "value":90,
                        "unit":"days",
                        "system":"http://unitsofmeasure.org",
                        "code":"d"
                    }
                }
            },
            "search":{
                "mode":"match"
            }
        }
    ]
}
```

    GET /MedicationStatement?patient={% raw %}{{patientId}}{% endraw %}

###### Request

```
curl -X GET "https://portal.demo.syncfor.science/api/fhir/MedicationStatement?patient=smart-1288992&_count=1"
```

###### Response

```
```

    GET /MedicationDispense?patient={% raw %}{{patientId}}{% endraw %}

###### Request

```
curl -X GET "https://portal.demo.syncfor.science/api/fhir/MedicationDispense?patient=smart-1288992&_count=1"
```

###### Response

```
{
    "resourceType":"Bundle",
    "id":"faf56424-cdab-4f16-a018-e3eeabcdca5c",
    "meta":{
        "lastUpdated":"2016-04-21T21:57:43.000+00:00"
    },
    "type":"searchset",
    "total":23,
    "link":[
        {
            "relation":"self",
            "url":"https://portal.demo.syncfor.science/api/fhir/MedicationDispense?_security=public%2Cpatient%2Cmedications%2Callergies%2Cimmunizations%2Cproblems%2Cprocedures%2Cvital-signs%2Claboratory%2Csmoking&_security=public%2CPatient%2Fsmart-1288992&patient=smart-1288992"
        },
        {
            "relation":"next",
            "url":"https://portal.demo.syncfor.science/api/fhir?_getpages=19c9da88-940c-41fb-9b62-fcf0a73e2bd7&_getpagesoffset=1&_count=1&_pretty=true&_bundletype=searchset"
        }
    ],
    "entry":[
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/MedicationDispense/smart-medicationdispense-10",
            "resource":{
                "resourceType":"MedicationDispense",
                "id":"smart-medicationdispense-10",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"medications"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">      Dispensed 90 tablets = 90 day supply of Hydrochlorothiazide 50 MG Oral Tablet    </div>"
                },
                "status":"completed",
                "patient":{
                    "reference":"Patient/smart-1288992"
                },
                "authorizingPrescription":[
                    {
                        "reference":"MedicationOrder/smart-medicationorder-142"
                    }
                ],
                "quantity":{
                    "value":90,
                    "unit":"tablets",
                    "system":"http://unitsofmeasure.org",
                    "code":"{tablets}"
                },
                "daysSupply":{
                    "value":90,
                    "unit":"days",
                    "system":"http://unitsofmeasure.org",
                    "code":"d"
                },
                "medicationCodeableConcept":{
                    "coding":[
                        {
                            "system":"http://www.nlm.nih.gov/research/umls/rxnorm",
                            "code":"197770",
                            "display":"Hydrochlorothiazide 50 MG Oral Tablet"
                        }
                    ],
                    "text":"Hydrochlorothiazide 50 MG Oral Tablet"
                },
                "whenHandedOver":"2008-11-09"
            },
            "search":{
                "mode":"match"
            }
        }
    ]
}
```

    GET /MedicationAdministration?patient={% raw %}{{patientId}}{% endraw %}

###### Request

```
curl -X GET "https://portal.demo.syncfor.science/api/fhir/MedicationAdministration?patient=smart-1288992&_count=1"
```

###### Response

```
```

    GET /AllergyIntolerance?patient={% raw %}{{patientId}}{% endraw %}

###### Request

```
curl -X GET "https://portal.demo.syncfor.science/api/fhir/AllergyIntolerance?patient=smart-1288992&_count=1"
```

###### Response

```
{
    "resourceType":"Bundle",
    "id":"11a8111f-ee61-4e4f-ab48-3b1e0bc6a42f",
    "meta":{
        "lastUpdated":"2016-04-21T22:00:05.626+00:00"
    },
    "type":"searchset",
    "total":1,
    "link":[
        {
            "relation":"self",
            "url":"https://portal.demo.syncfor.science/api/fhir/AllergyIntolerance?_security=public%2Cpatient%2Cmedications%2Callergies%2Cimmunizations%2Cproblems%2Cprocedures%2Cvital-signs%2Claboratory%2Csmoking&_security=public%2CPatient%2Fsmart-1288992&patient=smart-1288992"
        }
    ],
    "entry":[
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/AllergyIntolerance/smart-allergyintolerance-28",
            "resource":{
                "resourceType":"AllergyIntolerance",
                "id":"smart-allergyintolerance-28",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"allergy"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">Sensitivity to sulfonamide antibacterial</div>"
                },
                "recordedDate":"2000",
                "patient":{
                    "reference":"Patient/smart-1288992"
                },
                "substance":{
                    "coding":[
                        {
                            "system":"http://rxnav.nlm.nih.gov/REST/Ndfrt",
                            "code":"N0000175503",
                            "display":"sulfonamide antibacterial"
                        }
                    ],
                    "text":"sulfonamide antibacterial"
                },
                "status":"confirmed",
                "criticality":"CRITL",
                "category":"medication",
                "reaction":[
                    {
                        "manifestation":[
                            {
                                "coding":[
                                    {
                                        "system":"http://snomed.info/sct",
                                        "code":"271807003",
                                        "display":"skin rash"
                                    }
                                ],
                                "text":"skin rash"
                            }
                        ],
                        "severity":"mild"
                    }
                ]
            },
            "search":{
                "mode":"match"
            }
        }
    ]
}
```

##### On *periodic-update*
    GET /MedicationOrder?patient={% raw %}{{patientId}}{% endraw %}&_lastUpdated=gt{% raw %}{{lastCheck}}{% endraw %}
    GET /MedicationStatement?patient={% raw %}{{patientId}}{% endraw %}&_lastUpdated=gt{% raw %}{{lastCheck}}{% endraw %}
    GET /MedicationDispense?patient={% raw %}{{patientId}}{% endraw %}&_lastUpdated=gt{% raw %}{{lastCheck}}{% endraw %}
    GET /MedicationAdministration?patient={% raw %}{{patientId}}{% endraw %}&_lastUpdated=gt{% raw %}{{lastCheck}}{% endraw %}
    GET /AllergyIntolerance?patient={% raw %}{{patientId}}{% endraw %}&_lastUpdated=gt{% raw %}{{lastCheck}}{% endraw %}}


## Lab results ([MU CCDS #11? and #12](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))

##### On *first-connection*
    GET /Observation?category=laboratory?patient={% raw %}{{patientId}}{% endraw %}

###### Request

```
curl -X GET "https://portal.demo.syncfor.science/api/fhir/Observation?category=laboratory&patient=smart-1288992&_count=5"
```

###### Response

```
{
    "resourceType":"Bundle",
    "id":"e7328577-ce85-407a-b3c0-67d167bf254c",
    "meta":{
        "lastUpdated":"2016-04-21T22:02:07.590+00:00"
    },
    "type":"searchset",
    "total":46,
    "link":[
        {
            "relation":"self",
            "url":"https://portal.demo.syncfor.science/api/fhir/Observation?_security=public%2Cpatient%2Cmedications%2Callergies%2Cimmunizations%2Cproblems%2Cprocedures%2Cvital-signs%2Claboratory%2Csmoking&_security=public%2CPatient%2Fsmart-1288992&category=laboratory&patient=smart-1288992"
        },
        {
            "relation":"next",
            "url":"https://portal.demo.syncfor.science/api/fhir?_getpages=17d58efe-1fac-40c3-9f9c-6a0790e31835&_getpagesoffset=5&_count=5&_pretty=true&_bundletype=searchset"
        }
    ],
    "entry":[
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/Observation/smart-observation-71-lab",
            "resource":{
                "resourceType":"Observation",
                "id":"smart-observation-71-lab",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"laboratory"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">2008-07-10: HDLc SerPl-mCnc = 59 mg/dL</div>"
                },
                "status":"final",
                "category":{
                    "coding":[
                        {
                            "system":"http://hl7.org/fhir/observation-category",
                            "code":"laboratory",
                            "display":"Laboratory"
                        }
                    ],
                    "text":"Laboratory"
                },
                "code":{
                    "coding":[
                        {
                            "system":"http://loinc.org",
                            "code":"2085-9",
                            "display":"HDLc SerPl-mCnc"
                        }
                    ],
                    "text":"HDLc SerPl-mCnc"
                },
                "subject":{
                    "reference":"Patient/smart-1288992"
                },
                "effectiveDateTime":"2008-07-10",
                "valueQuantity":{
                    "value":59.0,
                    "unit":"mg/dL",
                    "system":"http://unitsofmeasure.org"
                },
                "referenceRange":[
                    {
                        "low":{
                            "value":0.0,
                            "unit":"mg/dL",
                            "system":"http://unitsofmeasure.org",
                            "code":"mg/dL"
                        },
                        "high":{
                            "value":0.0,
                            "unit":"mg/dL",
                            "system":"http://unitsofmeasure.org",
                            "code":"mg/dL"
                        },
                        "meaning":{
                            "coding":[
                                {
                                    "system":"http://hl7.org/fhir/referencerange-meaning",
                                    "code":"normal",
                                    "display":"Normal Range"
                                }
                            ],
                            "text":"Normal Range"
                        }
                    }
                ]
            },
            "search":{
                "mode":"match"
            }
        },
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/Observation/smart-observation-87-lab",
            "resource":{
                "resourceType":"Observation",
                "id":"smart-observation-87-lab",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"laboratory"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">2008-07-10: MCV RBC = 74 fL</div>"
                },
                "status":"final",
                "category":{
                    "coding":[
                        {
                            "system":"http://hl7.org/fhir/observation-category",
                            "code":"laboratory",
                            "display":"Laboratory"
                        }
                    ],
                    "text":"Laboratory"
                },
                "code":{
                    "coding":[
                        {
                            "system":"http://loinc.org",
                            "code":"30428-7",
                            "display":"MCV RBC"
                        }
                    ],
                    "text":"MCV RBC"
                },
                "subject":{
                    "reference":"Patient/smart-1288992"
                },
                "effectiveDateTime":"2008-07-10",
                "valueQuantity":{
                    "value":74.0,
                    "unit":"fL",
                    "system":"http://unitsofmeasure.org"
                },
                "referenceRange":[
                    {
                        "low":{
                            "value":80.0,
                            "unit":"fL",
                            "system":"http://unitsofmeasure.org",
                            "code":"fL"
                        },
                        "high":{
                            "value":94.0,
                            "unit":"fL",
                            "system":"http://unitsofmeasure.org",
                            "code":"fL"
                        },
                        "meaning":{
                            "coding":[
                                {
                                    "system":"http://hl7.org/fhir/referencerange-meaning",
                                    "code":"normal",
                                    "display":"Normal Range"
                                }
                            ],
                            "text":"Normal Range"
                        }
                    }
                ]
            },
            "search":{
                "mode":"match"
            }
        },
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/Observation/smart-observation-103-lab",
            "resource":{
                "resourceType":"Observation",
                "id":"smart-observation-103-lab",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"laboratory"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">2008-07-10: Eosinophil NFr Bld = 1 %</div>"
                },
                "status":"final",
                "category":{
                    "coding":[
                        {
                            "system":"http://hl7.org/fhir/observation-category",
                            "code":"laboratory",
                            "display":"Laboratory"
                        }
                    ],
                    "text":"Laboratory"
                },
                "code":{
                    "coding":[
                        {
                            "system":"http://loinc.org",
                            "code":"26450-7",
                            "display":"Eosinophil NFr Bld"
                        }
                    ],
                    "text":"Eosinophil NFr Bld"
                },
                "subject":{
                    "reference":"Patient/smart-1288992"
                },
                "effectiveDateTime":"2008-07-10",
                "valueQuantity":{
                    "value":1.0,
                    "unit":"%",
                    "system":"http://unitsofmeasure.org"
                },
                "referenceRange":[
                    {
                        "low":{
                            "value":0.0,
                            "unit":"%",
                            "system":"http://unitsofmeasure.org",
                            "code":"%"
                        },
                        "high":{
                            "value":3.0,
                            "unit":"%",
                            "system":"http://unitsofmeasure.org",
                            "code":"%"
                        },
                        "meaning":{
                            "coding":[
                                {
                                    "system":"http://hl7.org/fhir/referencerange-meaning",
                                    "code":"normal",
                                    "display":"Normal Range"
                                }
                            ],
                            "text":"Normal Range"
                        }
                    }
                ]
            },
            "search":{
                "mode":"match"
            }
        },
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/Observation/smart-observation-88-lab",
            "resource":{
                "resourceType":"Observation",
                "id":"smart-observation-88-lab",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"laboratory"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">2008-07-10: MCH RBC Qn Auto = 24.1 pg</div>"
                },
                "status":"final",
                "category":{
                    "coding":[
                        {
                            "system":"http://hl7.org/fhir/observation-category",
                            "code":"laboratory",
                            "display":"Laboratory"
                        }
                    ],
                    "text":"Laboratory"
                },
                "code":{
                    "coding":[
                        {
                            "system":"http://loinc.org",
                            "code":"785-6",
                            "display":"MCH RBC Qn Auto"
                        }
                    ],
                    "text":"MCH RBC Qn Auto"
                },
                "subject":{
                    "reference":"Patient/smart-1288992"
                },
                "effectiveDateTime":"2008-07-10",
                "valueQuantity":{
                    "value":24.1,
                    "unit":"pg",
                    "system":"http://unitsofmeasure.org"
                },
                "referenceRange":[
                    {
                        "low":{
                            "value":26.0,
                            "unit":"pg",
                            "system":"http://unitsofmeasure.org",
                            "code":"pg"
                        },
                        "high":{
                            "value":32.0,
                            "unit":"pg",
                            "system":"http://unitsofmeasure.org",
                            "code":"pg"
                        },
                        "meaning":{
                            "coding":[
                                {
                                    "system":"http://hl7.org/fhir/referencerange-meaning",
                                    "code":"normal",
                                    "display":"Normal Range"
                                }
                            ],
                            "text":"Normal Range"
                        }
                    }
                ]
            },
            "search":{
                "mode":"match"
            }
        },
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/Observation/smart-observation-104-lab",
            "resource":{
                "resourceType":"Observation",
                "id":"smart-observation-104-lab",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"laboratory"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">2008-07-10: Basophils NFr Bld = 1 %</div>"
                },
                "status":"final",
                "category":{
                    "coding":[
                        {
                            "system":"http://hl7.org/fhir/observation-category",
                            "code":"laboratory",
                            "display":"Laboratory"
                        }
                    ],
                    "text":"Laboratory"
                },
                "code":{
                    "coding":[
                        {
                            "system":"http://loinc.org",
                            "code":"30180-4",
                            "display":"Basophils NFr Bld"
                        }
                    ],
                    "text":"Basophils NFr Bld"
                },
                "subject":{
                    "reference":"Patient/smart-1288992"
                },
                "effectiveDateTime":"2008-07-10",
                "valueQuantity":{
                    "value":1.0,
                    "unit":"%",
                    "system":"http://unitsofmeasure.org"
                },
                "referenceRange":[
                    {
                        "low":{
                            "value":0.0,
                            "unit":"%",
                            "system":"http://unitsofmeasure.org",
                            "code":"%"
                        },
                        "high":{
                            "value":2.0,
                            "unit":"%",
                            "system":"http://unitsofmeasure.org",
                            "code":"%"
                        },
                        "meaning":{
                            "coding":[
                                {
                                    "system":"http://hl7.org/fhir/referencerange-meaning",
                                    "code":"normal",
                                    "display":"Normal Range"
                                }
                            ],
                            "text":"Normal Range"
                        }
                    }
                ]
            },
            "search":{
                "mode":"match"
            }
        }
    ]
}
```

##### On *periodic-update*
    GET /Observation?category=laboratory?patient={% raw %}{{patientId}}{% endraw %}&_lastUpdated=gt{% raw %}{{lastCheck}}{% endraw %}

## Vital signs ([MU CCDS #13](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))

##### On *first-connection*
    GET /Observation?category=vital-signs?patient={% raw %}{{patientId}}{% endraw %}

###### Request

```
curl -X GET "https://portal.demo.syncfor.science/api/fhir/Observation?category=vital-signs&patient=smart-1288992&_count=5"
```

###### Response

```
{
    "resourceType":"Bundle",
    "id":"0dc33ee8-4d5a-4fe2-87ff-470b9850fcae",
    "meta":{
        "lastUpdated":"2016-04-21T22:03:16.052+00:00"
    },
    "type":"searchset",
    "total":270,
    "link":[
        {
            "relation":"self",
            "url":"https://portal.demo.syncfor.science/api/fhir/Observation?_security=public%2Cpatient%2Cmedications%2Callergies%2Cimmunizations%2Cproblems%2Cprocedures%2Cvital-signs%2Claboratory%2Csmoking&_security=public%2CPatient%2Fsmart-1288992&category=vital-signs&patient=smart-1288992"
        },
        {
            "relation":"next",
            "url":"https://portal.demo.syncfor.science/api/fhir?_getpages=34cabbf9-439b-4aeb-8cd4-cc7100623124&_getpagesoffset=5&_count=5&_pretty=true&_bundletype=searchset"
        }
    ],
    "entry":[
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/Observation/smart-observation-844-heartrate",
            "resource":{
                "resourceType":"Observation",
                "id":"smart-observation-844-heartrate",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"vital-signs"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">2005-02-25: heart_rate = 66.0 {beats}/min</div>"
                },
                "status":"final",
                "category":{
                    "coding":[
                        {
                            "system":"http://hl7.org/fhir/observation-category",
                            "code":"vital-signs",
                            "display":"Vital Signs"
                        }
                    ],
                    "text":"Vital Signs"
                },
                "code":{
                    "coding":[
                        {
                            "system":"http://loinc.org",
                            "code":"8867-4",
                            "display":"heart_rate"
                        }
                    ],
                    "text":"heart_rate"
                },
                "subject":{
                    "reference":"Patient/smart-1288992"
                },
                "encounter":{
                    "reference":"Encounter/smart-encounter-844"
                },
                "effectiveDateTime":"2005-02-25",
                "valueQuantity":{
                    "value":66.0,
                    "unit":"{beats}/min",
                    "system":"http://unitsofmeasure.org",
                    "code":"{beats}/min"
                }
            },
            "search":{
                "mode":"match"
            }
        },
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/Observation/smart-observation-850-bp",
            "resource":{
                "resourceType":"Observation",
                "id":"smart-observation-850-bp",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"vital-signs"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">2009-04-27: Blood pressure 71/43 mmHg</div>"
                },
                "status":"final",
                "category":{
                    "coding":[
                        {
                            "system":"http://hl7.org/fhir/observation-category",
                            "code":"vital-signs",
                            "display":"Vital Signs"
                        }
                    ],
                    "text":"Vital Signs"
                },
                "code":{
                    "coding":[
                        {
                            "system":"http://loinc.org",
                            "code":"55284-4",
                            "display":"Blood pressure systolic and diastolic"
                        }
                    ],
                    "text":"Blood pressure systolic and diastolic"
                },
                "subject":{
                    "reference":"Patient/smart-1288992"
                },
                "encounter":{
                    "reference":"Encounter/smart-encounter-850"
                },
                "effectiveDateTime":"2009-04-27",
                "component":[
                    {
                        "code":{
                            "coding":[
                                {
                                    "system":"http://loinc.org",
                                    "code":"8480-6",
                                    "display":"Systolic blood pressure"
                                }
                            ],
                            "text":"Systolic blood pressure"
                        },
                        "valueQuantity":{
                            "value":71,
                            "unit":"mmHg",
                            "system":"http://unitsofmeasure.org",
                            "code":"mm[Hg]"
                        }
                    },
                    {
                        "code":{
                            "coding":[
                                {
                                    "system":"http://loinc.org",
                                    "code":"8462-4",
                                    "display":"Diastolic blood pressure"
                                }
                            ],
                            "text":"Diastolic blood pressure"
                        },
                        "valueQuantity":{
                            "value":43,
                            "unit":"mmHg",
                            "system":"http://unitsofmeasure.org",
                            "code":"mm[Hg]"
                        }
                    }
                ]
            },
            "search":{
                "mode":"match"
            }
        },
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/Observation/smart-observation-850-systolic",
            "resource":{
                "resourceType":"Observation",
                "id":"smart-observation-850-systolic",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"vital-signs"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">2009-04-27: Systolic blood pressure = 71 mm[Hg]</div>"
                },
                "status":"final",
                "category":{
                    "coding":[
                        {
                            "system":"http://hl7.org/fhir/observation-category",
                            "code":"vital-signs",
                            "display":"Vital Signs"
                        }
                    ],
                    "text":"Vital Signs"
                },
                "code":{
                    "coding":[
                        {
                            "system":"http://loinc.org",
                            "code":"8480-6",
                            "display":"Systolic blood pressure"
                        }
                    ],
                    "text":"Systolic blood pressure"
                },
                "subject":{
                    "reference":"Patient/smart-1288992"
                },
                "effectiveDateTime":"2009-04-27",
                "valueQuantity":{
                    "value":71.0,
                    "unit":"mm[Hg]",
                    "system":"http://unitsofmeasure.org",
                    "code":"mm[Hg]"
                }
            },
            "search":{
                "mode":"match"
            }
        },
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/Observation/smart-observation-844-respiratoryrate",
            "resource":{
                "resourceType":"Observation",
                "id":"smart-observation-844-respiratoryrate",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"vital-signs"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">2005-02-25: respiratory_rate = 22.0 {breaths}/min</div>"
                },
                "status":"final",
                "category":{
                    "coding":[
                        {
                            "system":"http://hl7.org/fhir/observation-category",
                            "code":"vital-signs",
                            "display":"Vital Signs"
                        }
                    ],
                    "text":"Vital Signs"
                },
                "code":{
                    "coding":[
                        {
                            "system":"http://loinc.org",
                            "code":"9279-1",
                            "display":"respiratory_rate"
                        }
                    ],
                    "text":"respiratory_rate"
                },
                "subject":{
                    "reference":"Patient/smart-1288992"
                },
                "encounter":{
                    "reference":"Encounter/smart-encounter-844"
                },
                "effectiveDateTime":"2005-02-25",
                "valueQuantity":{
                    "value":22.0,
                    "unit":"{breaths}/min",
                    "system":"http://unitsofmeasure.org",
                    "code":"{breaths}/min"
                }
            },
            "search":{
                "mode":"match"
            }
        },
        {
            "fullUrl":"https://portal.demo.syncfor.science/api/fhir/Observation/smart-observation-850-diastolic",
            "resource":{
                "resourceType":"Observation",
                "id":"smart-observation-850-diastolic",
                "meta":{
                    "versionId":"1",
                    "lastUpdated":"2016-04-17T04:25:53.405+00:00",
                    "security":[
                        {
                            "system":"http://smarthealthit.org/security/users",
                            "code":"Patient/smart-1288992"
                        },
                        {
                            "system":"http://smarthealthit.org/security/categories",
                            "code":"vital-signs"
                        }
                    ]
                },
                "text":{
                    "status":"generated",
                    "div":"<div xmlns=\"http://www.w3.org/1999/xhtml\">2009-04-27: Diastolic blood pressure = 43 mm[Hg]</div>"
                },
                "status":"final",
                "category":{
                    "coding":[
                        {
                            "system":"http://hl7.org/fhir/observation-category",
                            "code":"vital-signs",
                            "display":"Vital Signs"
                        }
                    ],
                    "text":"Vital Signs"
                },
                "code":{
                    "coding":[
                        {
                            "system":"http://loinc.org",
                            "code":"8462-4",
                            "display":"Diastolic blood pressure"
                        }
                    ],
                    "text":"Diastolic blood pressure"
                },
                "subject":{
                    "reference":"Patient/smart-1288992"
                },
                "effectiveDateTime":"2009-04-27",
                "valueQuantity":{
                    "value":43.0,
                    "unit":"mm[Hg]",
                    "system":"http://unitsofmeasure.org",
                    "code":"mm[Hg]"
                }
            },
            "search":{
                "mode":"match"
            }
        }
    ]
}
```

##### On *periodic-update*
    GET /Observation?category=vital-signs?patient={% raw %}{{patientId}}{% endraw %}&_lastUpdated=gt{% raw %}{{lastCheck}}{% endraw %}

## Procedures ([MU CCDS #15](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))

##### On *first-connection*
    GET /Procedure?patient={% raw %}{{patientId}}{% endraw %}

###### Request

```
curl -X GET "https://portal.demo.syncfor.science/api/fhir/Procedure?patient=smart-1288992"
```

###### Response

```
```

##### On *periodic-update*
    GET /Procedure?patient={% raw %}{{patientId}}{% endraw %}&_lastUpdated=gt{% raw %}{{lastCheck}}{% endraw %}}

## Immunizations ([MU CCDS #17](https://www.healthit.gov/sites/default/files/2015Ed_CCG_CCDS.pdf))

##### On *first-connection*
    GET /Immunization?patient={% raw %}{{patientId}}{% endraw %}

###### Request

```
curl -X GET "https://portal.demo.syncfor.science/api/fhir/Immunization?patient=smart-1288992"
```

###### Response

```
```

##### On *periodic-update*
    GET /Immunization?patient={% raw %}{{patientId}}{% endraw %}&_lastUpdated=gt{% raw %}{{lastCheck}}{% endraw %}

## Patient documents

That is: whatever is available for portal download — not a CCDS requirement

##### On *first-connection*
    GET /DocumentReference?patient={% raw %}{{patientId}}{% endraw %}

###### Request

```
curl -X GET "https://portal.demo.syncfor.science/api/fhir/DocumentReference?patient=smart-1288992"
```

###### Response

```
```

##### On *periodic-update*
    GET /DocumentReference?patient={% raw %}{{patientId}}{% endraw %}&_lastUpdated=gt{% raw %}{{lastCheck}}{% endraw %}
