# barista-core

*This is a continuation of the patterns defined in the (closed-source) Barista implementation built on .NET and SharePoint technologies.*

Barista aims to allow end-users to execute scripts in a sandbox while exposing business-level functionality that does not have access to system-level resources.

By exposing this functionality to CMS environments (SharePoint, etc) this allows end-users to develop business functionality that would previously require modifications to the CMS software (E.g. Farm-Level Deployments)


Previously, the .Net implementation of Barista used a JavaScript engine developed in .Net which JIT compiled JS to IL using Jurassic. While JS/ECMAScript has moved forward, Jurassic has not. Other libraries exist for .NET which allow scripts to execute in a similar fashion (JINT/JavaScript.Net/NiL.JS...) however each suffers in its own way, either in performance, lack of full compatability and so forth. With Node/V8, there exists a platform that is actively being developed incorporating the latest standards and focusing on performance.

The challenge here is that node takes a nice, sandboxed JavaScript environment in V8 (and now Chakra) and rips it wide open -- giving scripts the ability to access system resources (FS, processes, etc). The node implementation of Barista closes this sandbox back up to barista scripts and exposes only functionality that manipulates resources in (end) user-land.
