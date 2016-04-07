---
layout: page
---

# FHIR API Calls

For the examples below, we'll assume we're working with:

 * access at the single-patient level
 * a patient with `id` = `123`

Want to propose a change?
[edit this page!](https://github.com/sync-for-science/sync-for-science.github.io/edit/master/api-calls/index.md)

## Demographics

##### API Call

    GET /Patient/123

##### Response
FHIR `Patient` resource, with extensions for MU race, ethnicity, ± birth sex.

## Problems

##### API Call
 
Minimum possible requirements:

    GET /Condition?patient=123

This would mean S4S app does "get all", every time.

Concerns?

 * ± doesn't leverage 2015 certification "date range" requirements
 * - app has to request a lot of data every time
 * + very simple, effectively no optionality.

Going a  bit deeper, we could support 

 * by updated > some time in the past
 * by updated < some time in the past (perhaps)
 * by recorded date (perhaps)

    GET /Condition?patient=123
                   &_lastUpdated=gt2016-01
                   &date-recorded=2016
   

## Medications

## Labs

