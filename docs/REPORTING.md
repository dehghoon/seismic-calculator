# Reporting Architecture

## Access model

Core engineering calculations, checks, warnings, limitations, applicability information, and report preview data are available without a report subscription.

Formal PDF generation and download are premium operations. The server must verify approved LinkoTech authentication and an active report entitlement before producing an official PDF. Client-side hiding is not authorization.

## Preview endpoint

`POST /api/v1/reports/preview`

The request uses the same calculation contract as `POST /api/v1/calculations`. The API invokes the validated Agent #2 engine, preserves its engineering output unchanged, and adds the report presentation contract required by Report Specification v3.0.

The preview payload includes:

- report metadata;
- calculation mode and edition selectors;
- common inputs;
- edition-scoped inputs;
- edition-scoped results;
- optional dual comparison;
- checks and warnings;
- formula trace;
- code references;
- validation metadata;
- display rules;
- presentation elements;
- required report section order;
- report-contract completeness metadata;
- the professional-review disclaimer.

## Official PDF endpoint

`POST /api/v1/reports/pdf`

The endpoint currently fails closed with `REPORT_ENTITLEMENT_NOT_CONFIGURED`. This is intentional. No approved LinkoTech authentication and report-entitlement provider configuration has been supplied to this repository.

Do not replace this behavior with client-side access checks or a mock production entitlement.

## NBCC 2020 release boundary

NBCC 2020 remains blocked from company-approved production engineering release until the approved 2020 hazard source/location benchmark and unresolved engineering hold points are closed. Report preview and future PDF output must preserve that limitation prominently.

## Traceability

Report presentation must preserve the chain:

`Source -> Edition -> Calculation Step -> Formula ID -> Code Reference -> Output -> Validation Test -> Report Section`

The application layer may format or organize these records but must not change their engineering meaning.
