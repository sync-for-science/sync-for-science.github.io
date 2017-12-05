
The examples below refer to the following variables:

 * `patientId` indicates the FHIR `id` of the `Patient` in context. For example, `123`.

 * `lastCheck` indiclates a FHIR `instant`, with millisecond-level precision including a timezone. For example, `2016-04-01T02:52:32.000Z`

We'll also refer to two "request times":

 * *first-connection* for broad queries that the app will make once, after first approval, to back-fill historical data
 * *periodic-update* for narrow queries the app will make frequently (e.g. weekly)

(Note: a production-quality app might repeat the "broad" queries on an occasional basis — e.g. yearly  — as a sanity check, and to discovery any data that may have fallen _out_ of the record.)

Want to propose a change?
[edit this page!](https://github.com/sync-for-science/sync-for-science.github.io/edit/master{{page.url}})

## Authorization expectations: SMART on FHIR OAuth2

Sync for Science<sup>TM</sup> (like Argonaut) uses the OAuth2-based [SMART on FHIR authorization specification](http://docs.smarthealthit.org/authorization). But we don't need all the moving parts. In particular, in Sync for Science we can get away with a minimum of:

1. "**confidential clients**", meaning that apps get assigned a `client_id` and `client_secret` to authenticate to EHRs.The general SMART and Argonaut specs also require support for "public clients", but it's not strictly a requirement in S4S.

2.  "**standalone launch**" flow, meaning that the patient (research participant) can begin by interacting with the PMI app, and from there, can launch into an "connect to my EHR" workflow. The general SMART and Argonaut specs also require support for the "EHR launch flow" (where apps launch from an EHR or portal), but it's not strictly a requirement in S4S.

3.  **`patient/*.read launch/patient offline_access`** scopes, meaning that when the app launches, it will ask the EHR for permission to read all data available to the patient, and it will ask to learn the FHIR id of the patient whose records are shared.


We also **do not require support for Single Sign-on via OpenID Connect** in S4S (though again, it's part of SMART and Argonaut, and we encourage implementers to support it).


