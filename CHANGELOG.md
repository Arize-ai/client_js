# @arizeai/ax-client

## [1.18.0](https://github.com/Arize-ai/arize/compare/arize-js-sdk/v1.17.0...arize-js-sdk/v1.18.0) (2026-06-08)


### 🎁 New Features

* **experiments:** support for appending experiment runs ([#72134](https://github.com/Arize-ai/arize/issues/72134)) ([f761a25](https://github.com/Arize-ai/arize/commit/f761a259acb04dd40ea489f1e8e1f09143d01ecb))


### ❔ Miscellaneous Chores

* promote evaluators, role-bindings (CRUD), spans list, and users to BETA ([#73280](https://github.com/Arize-ai/arize/issues/73280)) ([ad1ee37](https://github.com/Arize-ai/arize/commit/ad1ee374872dd0d9afdbcccec1b74275b26d3a7c))

## [1.17.0](https://github.com/Arize-ai/arize/compare/arize-js-sdk/v1.16.0...arize-js-sdk/v1.17.0) (2026-06-02)


### 🎁 New Features

* **prompts:** add get version support ([#73169](https://github.com/Arize-ai/arize/issues/73169)) ([ab4ad3a](https://github.com/Arize-ai/arize/commit/ab4ad3a4b18e0890e0135b15f4c4e89be4899046))


### 🐛 Bug Fixes

* set default pagination limit to 50 for all list operations ([#73195](https://github.com/Arize-ai/arize/issues/73195)) ([ac402f3](https://github.com/Arize-ai/arize/commit/ac402f37a099a09f0eee65952418509c89113ea2))


### 💫 Code Refactoring

* **prompts:** rename `prompts.get_label` to `prompts.get_version_by_label` ([#73168](https://github.com/Arize-ai/arize/issues/73168)) ([67094cb](https://github.com/Arize-ai/arize/commit/67094cb3b4bc8e632b30982b37e1c6fb3cb44429))
* **spans:** `spans.annotate_spans` to `spans.annotate` ([#73168](https://github.com/Arize-ai/arize/issues/73168)) ([67094cb](https://github.com/Arize-ai/arize/commit/67094cb3b4bc8e632b30982b37e1c6fb3cb44429))

## [1.16.0](https://github.com/Arize-ai/arize/compare/arize-js-sdk/v1.15.0...arize-js-sdk/v1.16.0) (2026-05-30)


### 🎁 New Features

* **projects:** support for project updates ([#72940](https://github.com/Arize-ai/arize/issues/72940)) ([92b70e6](https://github.com/Arize-ai/arize/commit/92b70e6073dab69679786adaf656c6c8e6d7fecb))


### ❔ Miscellaneous Chores

* promote annotation-queues, organizations, prompts, roles, spaces to BETA ([#72421](https://github.com/Arize-ai/arize/issues/72421)) ([745ee18](https://github.com/Arize-ai/arize/commit/745ee18a34b1b89f1b3a80d96a196c53ea838682))

## [1.15.0](https://github.com/Arize-ai/arize/compare/arize-js-sdk/v1.14.0...arize-js-sdk/v1.15.0) (2026-05-27)


### 🎁 New Features

* **datasets:** add updateDataset function ([#72037](https://github.com/Arize-ai/arize/issues/72037)) ([25623b4](https://github.com/Arize-ai/arize/commit/25623b4ef59383c1cc68b24cd083ae6427f89945))


### 🐛 Bug Fixes

* raise AmbiguousNameError when multiple spaces share a name ([#72449](https://github.com/Arize-ai/arize/issues/72449)) ([6e71959](https://github.com/Arize-ai/arize/commit/6e71959db6b952aad77648532921355c028cfb98))
* **rest-api:** use base64 Relay global IDs in OpenAPI spec examples ([#71993](https://github.com/Arize-ai/arize/issues/71993)) ([5903e5b](https://github.com/Arize-ai/arize/commit/5903e5b6bea4b149906f1fc45eb7aa8993eac2c9)), closes [#71246](https://github.com/Arize-ai/arize/issues/71246)

## [1.14.0](https://github.com/Arize-ai/arize/compare/arize-js-sdk/v1.13.0...arize-js-sdk/v1.14.0) (2026-05-14)

### 🎁 New Features

- add structured annotations to dataset examples and experiment runs responses ([#69284](https://github.com/Arize-ai/arize/issues/69284)) ([c32872e](https://github.com/Arize-ai/arize/commit/c32872e8dbcf482300e417fd2f110153c6244349))
- **datasets & experiments:** align dataset/experiment annotate endpoints to 202 empty body ([#70693](https://github.com/Arize-ai/arize/issues/70693)) ([7caad8e](https://github.com/Arize-ai/arize/commit/7caad8eba4dcf36f5c021ffd5f436cd13a9b4399))
- **spans:** add annotateSpans() for batch span annotation ([#71631](https://github.com/Arize-ai/arize/issues/71631)) ([7fff72c](https://github.com/Arize-ai/arize/commit/7fff72ca59750bb3cb7bcaa2f6001ac04538b3e6))
- Add users support ([#70278](https://github.com/Arize-ai/arize/issues/70278)) ([e94bccf](https://github.com/Arize-ai/arize/commit/e94bccf59686a3f8fc89bd449fb73049b6b6e903))

## [1.13.0](https://github.com/Arize-ai/arize/compare/arize-js-sdk/v1.12.0...arize-js-sdk/v1.13.0) (2026-05-11)

### 🎁 New Features

- **api-keys:** extend GET /v2/api-keys with space_id and user_id filters ([#70697](https://github.com/Arize-ai/arize/issues/70697)) ([06dfc73](https://github.com/Arize-ai/arize/commit/06dfc73f9f3d7eb08c9d3c9435ff17d3462fa5e3))
- add run_experiment task type ([#70545](https://github.com/Arize-ai/arize/issues/70545)) ([2ed75b9](https://github.com/Arize-ai/arize/commit/2ed75b998fb90298575329f4a63c95435a9a74b2))

## [1.12.0](https://github.com/Arize-ai/arize/compare/arize-js-sdk/v1.11.0...arize-js-sdk/v1.12.0) (2026-05-08)

### 🎁 New Features

- add SDK source identification via span attributes ([#70404](https://github.com/Arize-ai/arize/issues/70404)) ([b8ccabb](https://github.com/Arize-ai/arize/commit/b8ccabbcb3cb042d696b6009e170a74e3ad28a8d))

### 🐛 Bug Fixes

- **annotation-queues:** Update how "unset" behaviour works for annotation queues. ([#69699](https://github.com/Arize-ai/arize/issues/69699)) ([5c82539](https://github.com/Arize-ai/arize/commit/5c82539815c7f727fc6ee8b82a752fd2931ea5b9))

## [1.11.0](https://github.com/Arize-ai/arize/compare/arize-js-sdk/v1.10.1...arize-js-sdk/v1.11.0) (2026-05-01)

### 🎁 New Features

- extend evaluators API for code evaluator configs ([#69121](https://github.com/Arize-ai/arize/issues/69121)) ([1d136e4](https://github.com/Arize-ai/arize/commit/1d136e4d7eb009212dfb872d67725266d12d6c66))

## [1.10.1](https://github.com/Arize-ai/arize/compare/arize-js-sdk/v1.10.0...arize-js-sdk/v1.10.1) (2026-04-29)

### 🐛 Bug Fixes

- **experiments:** make ExperimentRun.output nullable, surface error field ([#67390](https://github.com/Arize-ai/arize/issues/67390)) ([#69695](https://github.com/Arize-ai/arize/issues/69695)) ([26ab10b](https://github.com/Arize-ai/arize/commit/26ab10b7bdfb57f2c18697675587e462ccbddfe6))

## [1.10.0](https://github.com/Arize-ai/arize/compare/arize-js-sdk/v1.9.0...arize-js-sdk/v1.10.0) (2026-04-26)

#### 🎁 New Features

- **annotations:** add annotateDatasetExamples and annotateExperimentRuns ([#69279](https://github.com/Arize-ai/arize/issues/69279)) ([a0594b5](https://github.com/Arize-ai/arize/commit/a0594b5e737abe75551cccae109d34eb5ef2c0a0))
- **organizations:** add deleteOrganization to ax-client ([#69534](https://github.com/Arize-ai/arize/issues/69534)) ([ce5204d](https://github.com/Arize-ai/arize/commit/ce5204d0fa49256130ee886af51f0fbd05d8e0b2))
- **prompts:** API audit improvements ([#68525](https://github.com/Arize-ai/arize/issues/68525)) ([4583acc](https://github.com/Arize-ai/arize/commit/4583acc426e4e5d2491dc97117e13cb4d0050b36))
- **tasks:** add updateTask and deleteTask to JS/TS SDK ([#69116](https://github.com/Arize-ai/arize/issues/69116)) ([ff72ced](https://github.com/Arize-ai/arize/commit/ff72ced9d0b70d85bae5727fd00bb22d30df1caa))

### 🐛 Bug Fixes

- **rest_api:** proper schema for provider params ([#67787](https://github.com/Arize-ai/arize/issues/67787)) ([63108e4](https://github.com/Arize-ai/arize/commit/63108e4413681cfb702e51f2f6cdf65c52dbaa99))

## [1.9.0](https://github.com/Arize-ai/arize/compare/arize-js-sdk/v1.8.0...arize-js-sdk/v1.9.0) (2026-04-22)

### 🎁 New Features

- add DatasetWithExampleIds response for dataset examples endpoints ([#68638](https://github.com/Arize-ai/arize/issues/68638)) ([8fb25bc](https://github.com/Arize-ai/arize/commit/8fb25bc1d72453f3fa2b804c528d9a1b02500862))
- update enum for optimization direction to include none ([#67047](https://github.com/Arize-ai/arize/issues/67047)) ([b948295](https://github.com/Arize-ai/arize/commit/b948295822a80a6c28a8fa2afa3a60e0176111b1))

## [1.8.0](https://github.com/Arize-ai/arize/compare/arize-js-sdk/v1.7.0...arize-js-sdk/v1.8.0) (2026-04-17)

### 🎁 New Features

- **organizations:** add organizations module with list/get/create/update support ([#68644](https://github.com/Arize-ai/arize/issues/68644)) ([cdc825d](https://github.com/Arize-ai/arize/commit/cdc825d8675cbb36761e76e70d6995bc2883618f)), closes [#59168](https://github.com/Arize-ai/arize/issues/59168)

## [1.7.0](https://github.com/Arize-ai/arize/compare/arize-js-sdk/v1.6.0...arize-js-sdk/v1.7.0) (2026-04-15)

### 🎁 New Features

- add restrictResource, unrestrictResource, and role binding operations ([#67234](https://github.com/Arize-ai/arize/issues/67234)) ([16c97c8](https://github.com/Arize-ai/arize/commit/16c97c868d49de5549a41d07521479cb25a752dc))
- **spaces:** add delete space support ([#68714](https://github.com/Arize-ai/arize/issues/68714)) ([9f09df0](https://github.com/Arize-ai/arize/commit/9f09df05753178b93acf91eedc065223733a2cb7))

### 📚 Documentation

- add js docs to client type ([#68151](https://github.com/Arize-ai/arize/issues/68151)) ([859baac](https://github.com/Arize-ai/arize/commit/859baac6b2a4e336c4444ffac29ff2e896d7c06e))
- add js docs to utils ([#68147](https://github.com/Arize-ai/arize/issues/68147)) ([e18bd33](https://github.com/Arize-ai/arize/commit/e18bd33af512ed1d9068fdd449ed77fb522fbe95))

## [1.6.0](https://github.com/Arize-ai/arize/compare/arize-js-sdk/v1.5.0...arize-js-sdk/v1.6.0) (2026-04-03)

### 🎁 New Features

- Add annotation queue module to TS SDK ([#66428](https://github.com/Arize-ai/arize/issues/66428)) ([c5a48f5](https://github.com/Arize-ai/arize/commit/c5a48f5ba6c72dbac3ad231739117f5de636f4e2))

## [1.5.0](https://github.com/Arize-ai/arize/compare/arize-js-sdk/v1.4.1...arize-js-sdk/v1.5.0) (2026-03-30)

### 🎁 New Features

- add name-or-ID resolution across JS SDK (mirrors Python SDK) ([#66418](https://github.com/Arize-ai/arize/issues/66418)) ([d3c55bc](https://github.com/Arize-ai/arize/commit/d3c55bce943ff7e6f4fe1d094690a4ed93514fd8))
- implement list spans ([#63735](https://github.com/Arize-ai/arize/issues/63735)) ([9510ea3](https://github.com/Arize-ai/arize/commit/9510ea3b381910468dcad028887ec6bdc6b1cf52))
- implement roles CRUD API ([#66241](https://github.com/Arize-ai/arize/issues/66241)) ([92d1cb1](https://github.com/Arize-ai/arize/commit/92d1cb145bd3460a7f94a84825a30c3197a1331a)), closes [#66233](https://github.com/Arize-ai/arize/issues/66233)
- add tasks and task-runs module to ax-client ([#65671](https://github.com/Arize-ai/arize/issues/65671)) ([de9545b](https://github.com/Arize-ai/arize/commit/de9545b57713805632db7458828768d9c330b911))

### 🐛 Bug Fixes

- address dependabot and code scanning security alerts ([#66426](https://github.com/Arize-ai/arize/issues/66426)) ([5eae40a](https://github.com/Arize-ai/arize/commit/5eae40ab235c50e4135ed7fefc6bec25d1a7724b))

### ❔ Miscellaneous Chores

- Add upgrade suggestion to SDK pre-release warnings ([#66879](https://github.com/Arize-ai/arize/issues/66879)) ([8c47f31](https://github.com/Arize-ai/arize/commit/8c47f31f1cac29121da13c9a9161a8493af4070d))

## [1.4.1](https://github.com/Arize-ai/arize/compare/arize-js-sdk/v1.4.0...arize-js-sdk/v1.4.1) (2026-03-21)

### 💫 Code Refactoring

- **api-keys:** centralize ApiKeyStatus schema and update references ([#66333](https://github.com/Arize-ai/arize/issues/66333)) ([e32438d](https://github.com/Arize-ai/arize/commit/e32438d56098a25bd925c17ee262e0895e9f5ab6))

## [1.4.0](https://github.com/Arize-ai/arize/compare/arize-js-sdk/v1.3.1...arize-js-sdk/v1.4.0) (2026-03-19)

### 🎁 New Features

- Implement evaluators API ([#65527](https://github.com/Arize-ai/arize/issues/65527)) ([bc137f6](https://github.com/Arize-ai/arize/commit/bc137f67bbcb3ab7aceebfb54f19b6d1a0686eaf)), closes [#59177](https://github.com/Arize-ai/arize/issues/59177)

## [1.3.1](https://github.com/Arize-ai/arize/compare/arize-js-sdk/v1.3.0...arize-js-sdk/v1.3.1) (2026-03-18)

### 📚 Documentation

- improve formatting of client configuration priority description ([#65909](https://github.com/Arize-ai/arize/issues/65909)) ([fe4aa7c](https://github.com/Arize-ai/arize/commit/fe4aa7c36b647e010d7707a72af21f5134cd37dd))

## [1.3.0](https://github.com/Arize-ai/arize/compare/arize-js-sdk/v1.2.0...arize-js-sdk/v1.3.0) (2026-03-17)

### 🎁 New Features

- **ai-integrations:** Add ai-integrations support to ax-client ([#65049](https://github.com/Arize-ai/arize/issues/65049)) ([148ea5c](https://github.com/Arize-ai/arize/commit/148ea5ce76795deec3e2faaf2f830cce0dd78f88)), closes [#59159](https://github.com/Arize-ai/arize/issues/59159)
- **api-keys:** API Keys Create/List/Delete ([#64924](https://github.com/Arize-ai/arize/issues/64924)) ([961b0dc](https://github.com/Arize-ai/arize/commit/961b0dce7d7750d39c4d74d3cf940c5c9cde0785))
- **prompts:** add prompts support to JS ax-client ([#65175](https://github.com/Arize-ai/arize/issues/65175)) ([466a4f3](https://github.com/Arize-ai/arize/commit/466a4f3ed69d8cc4270efe5d85c1d4b424626386))

### 🐛 Bug Fixes

- **sdk:** Exit early on authentication errors ([#65266](https://github.com/Arize-ai/arize/issues/65266)) ([55e4dee](https://github.com/Arize-ai/arize/commit/55e4dee7a7c8b15d75be6a72c091f062dd2811ab))
- Fix for ai-integrations and prompts in JS SDK ([#65798](https://github.com/Arize-ai/arize/issues/65798)) ([f95c790](https://github.com/Arize-ai/arize/commit/f95c7909ca600a9bc9dc3d0440b7bb9515fdcabf))
- **api-keys:** rename regenerate endpoint to refresh ([#65562](https://github.com/Arize-ai/arize/issues/65562)) ([36df84f](https://github.com/Arize-ai/arize/commit/36df84ff50fc77d121173cb449b49344e9b9dded))

## [1.2.0](https://github.com/Arize-ai/arize/compare/arize-js-sdk/v1.1.0...arize-js-sdk/v1.2.0) (2026-02-20)

### 🎁 New Features

- Add camel cased exampleId for experiment runs ([#63550](https://github.com/Arize-ai/arize/issues/63550)) ([0ab4686](https://github.com/Arize-ai/arize/commit/0ab468637b048ba5be658a399f512484db988b17))

## [1.1.0](https://github.com/Arize-ai/arize/compare/arize-js-sdk/v1.0.4...arize-js-sdk/v1.1.0) (2026-02-20)

### 🎁 New Features

- **ts-client:** Annotation configs ([#63326](https://github.com/Arize-ai/arize/issues/63326)) ([8b45238](https://github.com/Arize-ai/arize/commit/8b452381527c488341a333283275cb85f665cfea))

## [1.0.4](https://github.com/Arize-ai/arize/compare/arize-js-sdk/v1.0.3...arize-js-sdk/v1.0.4) (2026-02-10)

### 📚 Documentation

- remove trailing ellipsis in installation command example ([#62588](https://github.com/Arize-ai/arize/issues/62588)) ([0f63026](https://github.com/Arize-ai/arize/commit/0f63026bdf701ef84133da87d2671ad96361a1b2))

## [1.0.3](https://github.com/Arize-ai/arize/compare/arize-js-sdk/v1.0.2...arize-js-sdk/v1.0.3) (2026-02-06)

### 📚 Documentation

- refine dataset creation instructions ([#62350](https://github.com/Arize-ai/arize/issues/62350)) ([9961152](https://github.com/Arize-ai/arize/commit/9961152b32c87e6d4f1f3007529ec3eb67ba8c8e))

## [1.0.2](https://github.com/Arize-ai/arize/compare/arize-js-sdk/v1.0.1...arize-js-sdk/v1.0.2) (2026-02-06)

### 📚 Documentation

- enhance developer experience emphasis in client description ([#62344](https://github.com/Arize-ai/arize/issues/62344)) ([0c14def](https://github.com/Arize-ai/arize/commit/0c14defdfc473f53562c79a7c2077801e1fbf646))

## [1.0.1](https://github.com/Arize-ai/arize/compare/arize-js-sdk/v1.0.0...arize-js-sdk/v1.0.1) (2026-02-06)

### 📚 Documentation

- Add doc change ([#62325](https://github.com/Arize-ai/arize/issues/62325)) ([17792c2](https://github.com/Arize-ai/arize/commit/17792c2c876607764580a98996dcab791378af45))

## 1.0.0 (2026-02-06)

### ⚠️ BREAKING CHANGES

- Initial release! ([#57744](https://github.com/Arize-ai/arize/issues/57744)) ([a0d8810](https://github.com/Arize-ai/arize/commit/a0d8810549b94c326dcd4b18b228ee7a69295a1c))
