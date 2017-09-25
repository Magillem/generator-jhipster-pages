# generator-jhipster-pages
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> JHipster module, create pages : client only (static), or client and server side. Load data from server, Save data to server, form, table...

# Introduction

This is a [JHipster](http://jhipster.github.io/) module, that is meant to be used in a JHipster application.

# Prerequisites

As this is a [JHipster](http://jhipster.github.io/) module, we expect you have JHipster and its related tools already installed:

- [Installing JHipster](https://jhipster.github.io/installation.html)

# Installation

## With Yarn

To install this module:

```bash
yarn global add generator-jhipster-pages
```

To update this module:

```bash
yarn global upgrade generator-jhipster-pages
```

## With NPM

To install this module:

```bash
npm install -g generator-jhipster-pages
```

To update this module:

```bash
npm update -g generator-jhipster-pages
```

# Usage

## Launch

```bash
yo jhipster-pages
```

## Core Concepts

each page beyond to a page set. A page set is defined by a name.
A Page have a name, a glyphicon, and a type.
The following types are supported:
- **client only** generate a simple static page :
    - empty html page
    - simple js controller
- **Load data from server** generate
    - empty html page
    - js controller
    - js read service
    - java get web service
- **Save data to server** generate
    - empty html page
    - js controller
    - js write service
    - java post web service
- **Load and Save data to server** generate
   - empty html page
   - js controller
   - js read and write service
   - java get and post web service

## Road Map

Here is the list of types to do
- **Form** generate 
   - form html page
   - js controller
   - js write service
   - java post web service
   - post argument object
- **Table** generate
   - table html page
   - js controller
   - js read service
   - java get web service
   - get returned object
- **Workflow** generate
    - multiple step html pages (form) with link to previous and next steps
    - multiple step js controllers
    - js service with init get and final write method
    - java web service with get and post
    
Stack dev order : AngularJS first (angular 1) and then angular 4


# License

Apache License v2.0 © [Guillaume DUFOUR]()


[npm-image]: https://img.shields.io/npm/v/generator-jhipster-pages.svg
[npm-url]: https://npmjs.org/package/generator-jhipster-pages
[travis-image]: https://travis-ci.org/Dufgui/generator-jhipster-pages.svg?branch=master
[travis-url]: https://travis-ci.org/Dufgui/generator-jhipster-pages
[daviddm-image]: https://david-dm.org/Dufgui/generator-jhipster-pages.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/Dufgui/generator-jhipster-pages
