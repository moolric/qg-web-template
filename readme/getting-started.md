# Getting started

A Git client is required to edit this template.

## 1. Download

```bash
git clone https://github.com/qld-gov-au/glue-template.git
```

## 2. Setup

**Make sure you have Node version >= 6.0 and NPM >= 3**

Install all the node packages (If behind a corporate web proxy please have a look at this website [How to setup Node.js and Npm behind a corporate web proxy](https://jjasonclark.com/how-to-setup-node-behind-web-proxy))
```bash
npm install
```

## 3. Making changes - Create a branch

**WARNING: Do not work directly in 'working', 'beta', or 'master' branches**

To keep the repository clean, branches must be prefixed into categories with a forwardslash /. Categories come from JIRA and are (note capitalisation): 

- Bugfix: For bugs and errors that will be released on the standard schedule
- Feature: For new features
- Hotfix: For critical bugs and errors which will be merged into the current release
- Enhance: For refactoring, or general improvements to existing features that do not add new features

Add the JIRA job number after the category type, and your initials so we can track who's responsible for each branch. If there is no JIRA task, just add your initials.
Example: Bugfix/QOL-100-NE-Fixing-nav-nesting-issue
It's best to checkout files from working, or beta. *Note: working may not always be stable, in those instances use beta.*

**If you use git command line, use the following commands to create your branch**

```bash
git fetch origin
git checkout working
git checkout -b Bugfix/QOL-100-NE-Fixing-nav-nesting-issue
```

Replace "Bugfix/QOL-100-NE-Fixing-nav-nesting-issue" with your branch.

## 4. Usage

**Compiles and lints the project into the build folder for smoke testing**
```bash
gulp build
```
**Run local server, as well as watch and lint js**
Remember to run 'build' first.
```bash
watch:serve
```
**Compiles the released assets for deployment. Note: This will also automatically run a clean build**
```bash
gulp release
```

### Other commands

**Cleans up your build folder before running build, to keep things tidy**
```bash
gulp build:clean
```
**Command performs build as above then replaces ssi directives with JINJA2**
```bash
gulp build-jinja
```
**Watch and lint js**
```bash
gulp watch
```
**To start a local server**
```bash
gulp serve
```
**To run Unit tests and Linting tests**
```bash
gulp test
```

**To run E2E tests using Browserstack**. 

Please make sure to setup browserstack _config file_ (step 3) and run _gulp serve_ before running browserstack E2E tests
```bash
gulp test:browserstack --browsers _browser names_
```
_browser name_ can be a browser or multiple browsers,
for example chrome or ie,chrome,safari
We can add more browser configurations in conf.js

To view testing reports (coverage, eslint and unit test)
```bash
gulp serve --type=reports-server
```

### 5. Making a commit to git

Allways prefix your commit message with the JIRA task number - if you have a JIRA task.

```bash
git commit -m "QOL-100 - Your commit message"
```

### 6. Browserstack Setup
1.) Create a .env file in the root of your project

2.) Place Browserstack configs in this file =
```bash
BROWSERSTACK_USERNAME = username
BROWSERSTACK_ACCESS_KEY = key
PROXYHOST = proxyhost (leave blank if no proxy)
PROXYPORT = proxyport (leave blank if no proxy)
PROXYPROTOCOL = proxyprotocol (leave blank if no proxy)
```