---
permalink: /reference/naming
order: 05
---

# Naming

A summary of Stimulus naming conventions:

| Component              | Convention      | Rationale                                                                                                     |
|------------------------|-----------------|---------------------------------------------------------------------------------------------------------------|
| Controller filenames   | `snake_case.js` | Rails works that way                                                                                          |
| Identifiers            | `kebab-case`    | Sometimes used as part of HTML attribute names; analogous to CSS classes, which are conventionally kebab-case |
| Action names           | `camelCase`     | Map directly to JavaScript controller methods                                                                 |
| Target names           | `camelCase`     | Map directly to JavaScript controller properties                                                              |
| Data attributes (JS)   | `camelCase`     | Thin wrapper around the [HTMLElement.dataSet API][dataset-api]                                                |
| Data attributes (HTML) | `kebab-case`    | Thin wrapper around the [HTMLElement.dataSet API][dataset-api]                                                |

[dataset-api]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
