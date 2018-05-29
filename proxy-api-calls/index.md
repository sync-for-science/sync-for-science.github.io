---
layout: page
---

# SMART Example Server

The [SMART Example server](https://portal.demo.syncfor.science/) is an implementation
of the S4S [auth-proxy](https://github.com/sync-for-science/auth-proxy). This serves
as an example of a provider's 'Patient Portal'. This server is for *testing* only. It
does not contain real patient data and you should never use it with real patient data.
It is also ephemeral; we reset its state frequently as we redeploy our reference
architecture, so you should not rely on it persisting client data.

## Open FHIR Access

If you want to explore FHIR without worrying about authentication you can use the /api/open-fhir/ endpoint of the SMART Server. Alternatively
you can register a client and create a patient token using the steps below.

## Creating a Client

In order to create a client for interacting with the SMART EHR System, use the following endpoint.

###### Request URL

```
https://portal.demo.syncfor.science/oauth/register
```

###### Required request parameters
```
{
 "client_id": Supply an identifier (can have characters/numbers),
 "client_secret": Supply a secret (can have characters/numbers),
 "client_name": Supply a client name (can have characters/numbers),
 "redirect_uris": URL that your client application uses on verification of authorization,
 "scopes": Requesting SMART scopes
}
```

###### Request Example

```
curl --request POST -H "Accept: application/json" \
    -d "client_id=TEST12345&client_secret=TESTSECRET123&client_name=TESTCLIENT&redirect_uris=https://tests.demo.syncfor.science/authorized/&scopes=launch/patient patient/*.read offline_access" \
    https://portal.demo.syncfor.science/oauth/register
```

###### Response

```JSON
{
  "client_id": "TEST12345",
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

If you want your application to mimic having an access token for a specific
user you can use the SMART servers administrative API to do so. Generating this
token should only be considered a method for testing and debugging purposes. You
will not find unauthenticated endpoints in real world servers that allow you
to create these access or refresh tokens.

###### Request URL

```
https://portal.demo.syncfor.science/oauth/debug/token
```

###### Request JSON parameters example
```
{
 "client_id": Client ID Created above,
 "expires": 360,
 "scopes": "patient/*.read launch/patient offline_access",
 "user": "daniel-adams",
 "patient_id": "smart-1288992"
}
```

###### Request Example

```
curl -H "Content-Type: application/json" \
	 --request POST \
	 --data '{"client_id": "TEST12345", "expires":360, "scopes": "patient/*.read launch/patient offline_access", "user": "daniel-adams", "patient_id": "smart-1288992"}' \
	 https://portal.demo.syncfor.science/oauth/debug/token
```

###### Response

```JSON
{
  "access_token": "832d4d32-9db1-45c2-83fb-8854a6307645",
  "refresh_token": "4e7286ab-1069-4102-ad69-eafa35daa3f3"
}
```

## Token introspection

If you want to retrieve information about a token you have, you get call the /oauth/debug/introspect endpoint.

###### Requesting Token URL
```
https://portal.demo.syncfor.science/oauth/debug/introspect?access_token={% raw %}{{access_token}}{% endraw %}
```

###### Request Example

```
curl https://portal.demo.syncfor.science/oauth/debug/introspect?access_token=832d4d32-9db1-45c2-83fb-8854a6307645
```

###### Response

```JSON
{
  "access_token": "832d4d32-9db1-45c2-83fb-8854a6307645",
  "approval_expires": "Thu, 01 Jan 1970 00:06:00 GMT",
  "expires": "Tue, 29 May 2018 18:31:40 GMT",
  "refresh_token": "4e7286ab-1069-4102-ad69-eafa35daa3f3",
  "scopes": [
    "patient/*.read",
    "launch/patient",
    "offline_access"
  ],
  "security_labels": [],
  "token_type": "Bearer"
}
```
