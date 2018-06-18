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

In order to create a client for interacting with the SMART EHR System, use the following endpoint, which implements the dynamic client registration protocol outlined in [RFC7591](https://tools.ietf.org/html/rfc7591).

###### Request URL

```
https://portal.demo.syncfor.science/oauth/register
```

###### Request Parameters
```
{
 "client_name": Client name (can have characters/numbers) [defaults to generated client ID],
 "redirect_uris": Array of URIs that your client application uses on verification of authorization,
 "scope": Space-separated string of requested SMART scopes
}
```

###### Request Example

```
curl --request POST -H "Content-Type: application/json" \
    -d '{"client_name": "TESTCLIENT", "redirect_uris": ["https://tests.demo.syncfor.science/authorized/"], "scope": "launch/patient patient/*.read offline_access"}' \
    https://portal.demo.syncfor.science/oauth/register
```

###### Response

```JSON
{
  "client_id": "f098c69f-a58b-422c-8211-261f14373c36",
  "client_name": "TESTCLIENT",
  "client_secret": "61977150-6b43-48e4-8143-cda17c045d6b",
  "client_secret_expires_at": 0,
  "redirect_uris": [
    "https://tests.demo.syncfor.science/authorized/"
  ],
  "scope": "launch/patient patient/*.read offline_access"
}
```

## Requesting a Token for a Specific User

If you want your application to mimic having an access token for a specific
user you can use the SMART servers administrative API to do so. Generating this
token should only be considered a method for testing and debugging purposes. You
will not find unauthenticated endpoints in real world servers that allow you
to create these access or refresh tokens.

###### Request URL

```
https://portal.demo.syncfor.science/oauth/debug/token
```

###### Request Parameters
```
{
 "client_id": Client ID returned from registration,
 "access_lifetime": lifetime of the access token in seconds [defaults to 3600 seconds],
 "approval_expires": Unix timestamp at which the access token is to expire [defaults to 7 days after generation],
 "scope": Space-separated string of requested SMART scopes [defaults to client scopes provided during registration],
 "user_name": User to which the tokens will be granted,
 "patient_id": Patient ID for which the tokens will be granted
}
```

###### Request Example

```
curl --request POST -H "Content-Type: application/json" \
	 -d '{"client_id": "f098c69f-a58b-422c-8211-261f14373c36", "access_lifetime": 3600, "approval_expires": 1528376907, "scope": "patient/*.read launch/patient offline_access", "username": "daniel-adams", "patient_id": "smart-1288992"}' \
	 https://portal.demo.syncfor.science/oauth/debug/token
```

###### Response

```JSON
{
  "access_token": "02290da3-9da8-4def-aa6e-c306945bcdf9",
  "refresh_token": "9a71354c-3bad-4585-88ab-2f0c238db6c0"
}
```

## Token Introspection

If you want to retrieve information about an access or refresh token you have, you get call the /oauth/debug/introspect/<token> endpoint.

###### Requesting Token URL
```
https://portal.demo.syncfor.science/oauth/debug/introspect?token={% raw %}{{token}}{% endraw %}
```

###### Request Example

```
curl https://portal.demo.syncfor.science/oauth/debug/introspect?token=02290da3-9da8-4def-aa6e-c306945bcdf9
```

###### Response

```JSON
{
  "access_expires": "Thu, 31 May 2018 22:48:43 GMT",
  "access_token": "02290da3-9da8-4def-aa6e-c306945bcdf9",
  "active": true,
  "approval_expires": "Thu, 07 Jun 2018 13:08:27 GMT",
  "client_id": "f098c69f-a58b-422c-8211-261f14373c36",
  "refresh_token": "9a71354c-3bad-4585-88ab-2f0c238db6c0",
  "scope": "patient/*.read launch/patient offline_access",
  "security_labels": [],
  "token_type": "Bearer",
  "username": "daniel-adams"
}
```
