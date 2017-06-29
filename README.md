# vue-component-cli (clone from [vue-cli](https://github.com/vuejs/vue-cli/))

> Simple CLI for scaffolding Vue.js component

## Installation

```bash
$ npm install -g vue-component-cli
```

## Usage

```bashh
$ vue-c init <template-name> <project-name>
```

Example:

```bash
$ vue-c init vue-componnet-dev-template my-project
```

## Official Template

The only template: [vue-component-template](https://github.com/savoygu/vue-component-template)

## Custom Templates

```bash
$ vue-c init username/repo my-project
```

refer: [download-git-repo](https://github.com/flipxfx/download-git-repo)

## Local Templates

```
$ vue-c init ~/fs/path/to-custom-template my-project
```

## 参考文档


Node.js cli:
https://github.com/tj/commander.js

Termail string styling:
https://github.com/chalk/chalk

Github api:
https://developer.github.com/v3/repos/#get (获取指定用户的指定仓库)

Interactive cli:
https://github.com/SBoudrias/Inquirer.js (常用的交互式命令行用户界面的集合)
