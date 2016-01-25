# barista-codepress

Presses the code and returns the result.

Via this module, potentially untrusted scripts are executed in userland.

All modules exposed to the execution environment are proxies to ensure that system state is untouched.

Built-in modules such as 'fs' are not exposed to the execution environment.

---

This module is intended to be run in a child process for isolation purposes.

A parent process interacts with the codepress process and passes commands via ipc via a 'brew' message type

In turn, the codepress process submits state