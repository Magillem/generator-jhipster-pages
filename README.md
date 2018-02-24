# generator-jhipster-pages
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> JHipster module, create pages : client only (static), or client and server side. Load data from server, Save data to server, form, table...

# Introduction

This is a [JHipster](http://jhipster.github.io/) module, that is meant to be used in a JHipster application.

# Prerequisites

As this is a [JHipster](http://jhipster.github.io/) module, we expect you have JHipster and its related tools already installed:

- [Installing JHipster](https://jhipster.github.io/installation.html)

# Compatibility

Before 2.0.2 (included) it's angular 4.
After 2.0.4 (included) it's angular 5.
I haven't tested with micro service or any not-sql based project (cassandra, mongodb, elasticsearch, ...).

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

Launch generator and it will ask for everything it needs

```bash
yo jhipster-pages
```

if you want to regenerate some existing pages you can do it by page set with the following command line :

```bash
yo jhipster-pages regenerate
```


## Core Concepts

Each page belongs to a page set. A page set is defined by a name.
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
   
## I have generated, so what's next

you generate page but you see empty page and you have errors in ts. For some page type it's normal.
The goal of this module, is just to save time by generating "plumbing" files.

### Example 
If you choose "Load and Save data to server" :
 - It create empty java web service and visual object.
 - You can see a new entry in your navbar wich target an empty html page. 
 - You have js/ts controller is there but don't call the js/ts service to load or save data.
 - It's now you turn to code...


## Road Map

Here is the list of types to do

- reactjs client side


# License

Apache License v2.0 © [Guillaume DUFOUR]()


[npm-image]: https://img.shields.io/npm/v/generator-jhipster-pages.svg
[npm-url]: https://npmjs.org/package/generator-jhipster-pages
[travis-image]: https://travis-ci.org/Magillem/generator-jhipster-pages.svg?branch=master
[travis-url]: https://travis-ci.org/Magillem/generator-jhipster-pages
[daviddm-image]: https://david-dm.org/Magillem/generator-jhipster-pages.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/Magillem/generator-jhipster-pages
