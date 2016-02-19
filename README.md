# barista-core
For those gettings started with barista, see BaristaLabs/barista-cli

*This is a continuation of the patterns defined in the (closed-source) Barista implementation built on .NET and SharePoint technologies.*

Barista aims to allow end-users to execute scripts in a sandbox while exposing business-level functionality that does not have access to system-level resources.

By exposing this functionality to CMS and other controlled environments (SharePoint, etc) this allows end-users to develop business functionality that would previously require customizations to the CMS software (E.g. Farm-Level Deployments). In tightly-governed environments, customizations to the software are expensive in terms of approval process, time to develop, and the potential of breaking changes when the CMS software is updated.

Barista scripts can be deployed and managed similarly to content within a CMS and allows for a layer of abstraction between the scripts and the platform.

---

Previously, the .NET implementation of Barista used a JavaScript engine developed in .Net which JIT compiled JS to IL using Jurassic. While JS/ECMAScript has moved forward, Jurassic has not. Other libraries exist for .NET which allow scripts to execute in a similar fashion (JINT/JavaScript.Net/NiL.JS...) however each suffers in its own way, either in performance, lack of full compatability and so forth. While contributions back to Jurassic, or a completely custom JS engine can be developed, the LOE to do so is extremely high. With Node/V8, there exists a platform that is actively being developed incorporating the latest standards and focusing on performance.

The challenge here is that Node takes a nice, sandboxed JavaScript environment in V8 (and now Chakra) and rips it wide open -- giving scripts the ability to access system resources (FS, processes, etc). The node implementation of Barista closes this sandbox back up to Barista scripts and exposes only functionality that manipulates resources in (end) user-land.

Some goals:
* Barista executes each script in a seperate node process for isolation.
* Scripts are time and memory limited so they do not run indefinately or use up system resources.
* Barista module system (similar nee identical to NPM) that allows modules to be installed and extend an otherwise basic level of functionality.
* Available modules (either custom or built-in) do not perform system level actions.
* Modules are available that perform actions familar to .NET developers and the .NET Implementation of Barista (EPPlus, SharePoint...)
* Modules even though installed, must be whitelisted on a case-by-case basis.

Future Goals:
* Allow for remote sandbox processes to allow Barista to run in a clustered approach.
* Multi-tenancy to allow Barista to run as a PaaS on AWS/Azure.
