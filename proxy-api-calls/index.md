---
layout: page
---

# SMART Example Server

The [SMART Example server](https://portal.demo.syncfor.science/) is an implementation of the S4S [auth-proxy](https://github.com/sync-for-science/auth-proxy). This serves as an example of a provider's 'Patient Portal'.

## Open FHIR Access

If you want to explore FHIR without worrying about authentication you can use the /api/open-fhir/ endpoint of the SMART Server


## Creating a Client

In order to create a client for interacting with the SMART EHR System, use the following endpoint.

##### Requesting Token format.
    POST /oauth/register
    client_id={client_id}&client_secret={client_secret}&client_name={client_name}&redirect_uris={redirect_uris}&scopes={scopes}

##### Request Post Data Example
```
{
 "client_id": Create an identifier (can have characters/numbers),
 "client_secret": Create a secret (can have characters/numbers),
 "client_name": Create a client name (can have characters/numbers),
 "redirect_uris": URL that your client application uses on verification of authorization,
 "scopes": Requesting SMART scopes
}
```

###### Request

```
POST /oauth/register HTTP/1.1
Host: localhost:9000
Accept: application/json
Data: client_id=TEST1234&client_secret=TESTSECRET123&client_name=TESTCLIENT&redirect_uris=https://tests.demo.syncfor.science/authorized/&scopes=launch/patient patient/*.read offline_access
```

###### Response

```JSON
{
  "client_id": "TEST1234",
  "client_secret": "TESTSECRET123",
  "default_scopes": [
    "launch/patient",
    "patient/*.read",
    "offline_access"
  ],
  "redirect_uris": [
    "https://tests.demo.syncfor.science/authorized/"
  ]
}
```

## Requesting token for a specific user

If you want your application to mimic having an access token for a specific user you can use the SMART servers administrative API to do so.

##### Requesting Token format.
    POST /oauth/debug/token

##### Request JSON Example
```
{
 "client_id": Client ID Created above,
 "expires": 360,
 "scopes": "patient/*.read launch/patient offline_access",
 "user": "daniel-adams",
 "patient_id": "smart-1288992"
}
```

###### Request

```
POST /oauth/debug/token HTTP/1.1
Host: localhost:9000
Accept: application/json
```

###### Response

```JSON
{
  "access_token": "ea8e60e8-f0fe-4ecf-9008-1f9298633157",
  "refresh_token": "f1b2798d-a4d5-4444-896c-ad9470f4beca"
}
```

## Token introspection

If you want to retrieve information about a token you have, you get call the /oauth/debug/introspect endpoint.

##### Requesting Token format.
    GET /oauth/debug/token?access_token={% raw %}{{access_token}}{% endraw %}

###### Request

```
GET /oauth/debug/introspect?access_token=ea8e60e8-f0fe-4ecf-9008-1f9298633157 HTTP/1.1
Host: localhost:9000
Accept: application/json
```

###### Response

```JSON
{
  "access_token": "ea8e60e8-f0fe-4ecf-9008-1f9298633157",
  "approval_expires": "Thu, 01 Jan 1970 00:06:00 GMT",
  "expires": "Mon, 23 Apr 2018 18:44:14 GMT",
  "refresh_token": "449b5eab-07ad-4975-9e78-8e309090907a",
  "scopes": [
    "patient/*.read",
    "launch/patient",
    "offline_access"
  ],
  "security_labels": [],
  "token_type": "Bearer"
}
```
