blog-notify
===========

Scan for new blog posts to send email campaigns

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/blog-notify.svg)](https://npmjs.org/package/blog-notify)
[![Downloads/week](https://img.shields.io/npm/dw/blog-notify.svg)](https://npmjs.org/package/blog-notify)
[![License](https://img.shields.io/npm/l/blog-notify.svg)](https://github.com/matthewcm/blog-notify/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g blog-notify
$ blog-notify COMMAND
running command...
$ blog-notify (-v|--version|version)
blog-notify/0.0.0 linux-x64 node-v15.8.0
$ blog-notify --help [COMMAND]
USAGE
  $ blog-notify COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`blog-notify campaign [DIRECTORY]`](#blog-notify-hello-file)
* [`blog-notify help [COMMAND]`](#blog-notify-help-command)

## `blog-notify campaign .`

Scans the directory for the latest markdown files, and asks user which markdown file to initiate new email campaign.


```
USAGE
  $ blog-notify campaign [DIRECTORY]

OPTIONS
  -h, --help       show CLI help
  -n               filename of blogpost to campaign 

EXAMPLE
  $ blog-notify campaign .
  
```

_See code: [src/commands/campaign.ts](https://github.com/matthewcm/blog-notify/blob/v0.0.0/src/commands/hello.ts)_

## `blog-notify help [COMMAND]`

display help for blog-notify

```
USAGE
  $ blog-notify help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_
<!-- commandsstop -->
