/**
 * Copyright 2013-2017 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://jhipster.github.io/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const _ = require('lodash');
const randexp = require('randexp');
const chalk = require('chalk');
const fs = require('fs');
const generator = require('yeoman-generator');
const constants = require('generator-jhipster/generators/generator-constants');

/* Constants use throughout */
const INTERPOLATE_REGEX = constants.INTERPOLATE_REGEX;
const CLIENT_TEST_SRC_DIR = constants.CLIENT_TEST_SRC_DIR;
const ANGULAR_DIR = constants.ANGULAR_DIR;
const SERVER_MAIN_SRC_DIR = constants.SERVER_MAIN_SRC_DIR;
const SERVER_MAIN_RES_DIR = constants.SERVER_MAIN_RES_DIR;
const TEST_DIR = constants.TEST_DIR;
const SERVER_TEST_SRC_DIR = constants.SERVER_TEST_SRC_DIR;

const SERVER_TEMPLATES_DIR = 'server';
const CLIENT_NG1_TEMPLATES_DIR = 'client/angularjs';
const CLIENT_NG2_TEMPLATES_DIR = 'client/angular';
const CLIENT_I18N_TEMPLATES_DIR = 'client';

/**
 * The default is to use a file path string. It implies use of the template method.
 * For any other config an object { file:.., method:.., template:.. } can be used
 */
const pageSetServerFiles = {
    server: [
        {
            condition: generator => generator.contactServer === true,
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/web/rest/_PageSetResource.java',
                    renameTo: generator => `${generator.packageFolder}/web/rest/${generator.pageSetClass}Resource.java`
                }
            ]
        }
    ],
    test: [
        {
            path: SERVER_TEST_SRC_DIR,
            condition: generator => generator.contactServer === true,
            templates: [{
                file: 'package/web/rest/_PageSetResourceIntTest.java',
                options: { context: { randexp, _, chalkRed: chalk.red, fs, SERVER_TEST_SRC_DIR } },
                renameTo: generator => `${generator.packageFolder}/web/rest/${generator.pageSetClass}ResourceIntTest.java`
            }]
        },
        {
            condition: generator => generator.gatlingTests && generator.contactServer === true,
            path: TEST_DIR,
            templates: [{
                file: 'gatling/user-files/simulations/_PageSetGatlingTest.scala',
                options: { interpolate: INTERPOLATE_REGEX },
                renameTo: generator => `gatling/user-files/simulations/${generator.pageSetClass}GatlingTest.scala`
            }]
        }
    ]
};


const pageServerFiles = {
    server: [
        {
            condition: generator => generator.loadFromServer === true,
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/web/rest/vm/_PageLoadVM.java',
                    renameTo: generator => `${generator.packageFolder}/web/rest/vm/${generator.pageLoadClass}.java`
                }
            ]
        },
        {
            condition: generator => generator.saveToServer === true,
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/web/rest/vm/_PageSaveVM.java',
                    renameTo: generator => `${generator.packageFolder}/web/rest/vm/${generator.pageSaveClass}.java`
                }
            ]
        }
    ]
};

const pageSetAngularjsFiles = {
    pageSet: [
        {
            path: ANGULAR_DIR,
            templates: [
                {
                    file: 'pages/_page-sets.state.js',
                    renameTo: generator => `pages/page-sets.state.js`
                },
                {
                    file: 'pages/_page-set.state.js',
                    renameTo: generator => `pages/${generator.pageSetFolder}/${generator.pageSetAngularClass}.state.js`
                }
            ]
        }
    ]
};


const pageAngularjsFiles = {
    pageCommon: [
        {
            path: ANGULAR_DIR,
            templates: [
                {
                    file: 'pages/_page.controller.js',
                    renameTo: generator => `pages/${generator.pageSetFolder}/${generator.pageAngularName}.controller.js`
                },
                {
                    file: 'pages/_page.html',
                    method: 'processHtml',
                    template: true,
                    renameTo: generator => `pages/${generator.pageSetFolder}/${generator.pageAngularName}.html`
                }
            ]
        }
    ],
    pageCommonWithService: [
        {
            path: ANGULAR_DIR,
            condition: generator => generator.contactServer === true,
            templates: [
                {
                    file: 'pages/_page.service.js',
                    renameTo: generator => `pages/${generator.pageSetFolder}/${generator.pageAngularName}.service.js`
                }
            ]
        }
    ],

    test: [
        {
            path: CLIENT_TEST_SRC_DIR,
            templates: [{
                file: 'spec/app/pages/_page.controller.spec.js',
                renameTo: generator => `spec/app/pages/${generator.pageSetFolder}/${generator.pageName}.controller.spec.js`
            }]
        },
        {
            condition: generator => generator.protractorTests,
            path: CLIENT_TEST_SRC_DIR,
            templates: [{
                file: 'e2e/pages/_page.js',
                renameTo: generator => `e2e/pages/${generator.pageName}.js`
            }]
        }
    ]
};





const angularFiles = {
    client: [
        {
            path: ANGULAR_DIR,
            templates: [
                {
                    condition: generator => generator.pageType !== 'clientOnly',
                    file: 'pages/_page-set.service.ts',
                    renameTo: generator => `pages/${generator.pageSetFolder}/${generator.pageSet}.service.ts`
                },
                {
                    file: 'pages/_page-set.route.ts',
                    renameTo: generator => `pages/${generator.pageSetFolder}/${generator.pageSet}.route.ts`
                },
                {
                    file: `pages/_page-${generator.pageType}.component.html`,
                    method: 'processHtml',
                    template: true,
                    renameTo: generator => `pages/${generator.pageSetFolder}/${generator.pageName}.component.html`
                },
                {
                    file: 'pages/_index.ts',
                    renameTo: generator => `pages/${generator.pageSetFolder}/index.ts`
                },
                {
                    file: 'pages/_page.module.ts',
                    renameTo: generator => `pages/${generator.pageSetFolder}/${generator.pageName}.module.ts`
                },

                {
                    file: 'pages/_page.model.ts',
                    renameTo: generator => `pages/${generator.pageSetFolder}/${generator.pageName}.model.ts`
                }
            ]
        }
    ],
    test: [
        {
            path: CLIENT_TEST_SRC_DIR,
            templates: [{
                file: `spec/app/pages/_page-${generator.pageType}.component.spec.ts`,
                renameTo: generator => `spec/app/pages/${generator.pageSetFolder}/${generator.pageName}.component.spec.ts`
            }]
        },
        {
            condition: generator => generator.protractorTests,
            path: CLIENT_TEST_SRC_DIR,
            templates: [{
                file: 'e2e/pages/_page.spec.ts',
                renameTo: generator => `e2e/pages/${generator.pageName}.spec.ts`
            }]
        }
    ]
};

module.exports = {
    writeFiles,
    pageSetServerFiles,
    pageServerFiles,
    pageSetAngularjsFiles,
    pageAngularjsFiles,
    angularFiles,
    generateOneOrRegenerate
};

function writeFiles() {
    return {

        writeServerFiles() {
            if (this.skipServer) return;

            // write server side files
            this.writeFilesToDisk(pageSetServerFiles, this, false, SERVER_TEMPLATES_DIR);
            generateOneOrRegenerate.call(this, () => {
                this.writeFilesToDisk(pageServerFiles, this, false, SERVER_TEMPLATES_DIR);
            });
        },

        writeClientFiles() {
            if (this.skipClient) return;
            if (this.clientFramework === 'angular1') {
                // write client side files for angular 1.x
                this.writeFilesToDisk(pageSetAngularjsFiles, this, false, CLIENT_NG1_TEMPLATES_DIR);
                generateOneOrRegenerate.call(this, () => {
                    this.writeFilesToDisk(pageAngularjsFiles, this, false, CLIENT_NG1_TEMPLATES_DIR);
                    this.addElementToMenu(this.pageSetRouterState+'-'+this.pageRouterState, this.pageGlyphIcon, this.enableTranslation, this.clientFramework);
                });
            } else {
                // write client side files for angular 2.x +
                this.writeFilesToDisk(angularFiles, this, false, CLIENT_NG2_TEMPLATES_DIR);
                this.addElementToMenu(this.pageSetRouterState+'-'+this.pageRouterState, this.pageGlyphIcon, this.enableTranslation, this.clientFramework);
            }

            // Copy for each
            if (this.enableTranslation) {
                const languages = this.languages || this.getAllInstalledLanguages();
                languages.forEach((language) => {
                    try {
                        this.template(`${CLIENT_I18N_TEMPLATES_DIR}/i18n/_page_${language}.json`, `${constants.CLIENT_MAIN_SRC_DIR}i18n/${language}/${this.pageSetTranslationKey}.json`);
                        generateOneOrRegenerate.call(this, () => {
                            this.addElementTranslationKey(this.pageSetAndNameTranslationKey, this.pageName, language);
                        });
                    } catch (e) {
                        // An exception is thrown if the folder doesn't exist
                        // do nothing
                    }
                });
            }
        }
    };
}

function generateOneOrRegenerate(action) {
    if(this.regenerate) {
        this.pagesToRegenerate.forEach((page) => {
            this.pageType = page.pageType;
            this.pageName = page.pageName;
            this.pageGlyphIcon = page.pageGlyphIcon;
            loadPageInMemory.call(this);
            action();
        });
    } else {
        loadPageInMemory.call(this);
        action();
    }
}

function loadPageInMemory() {
    this.loadFromServer = false;
    this.saveToServer = false;
    this.contactServer = false;

    if(this.pageType === 'loadFromServer' || this.pageType === 'loadAndSaveToServer' || this.pageType === 'table' || this.pageType === 'workflow') {
        this.loadFromServer = true;
    }

    if(this.pageType === 'saveToServer' || this.pageType === 'loadAndSaveToServer' || this.pageType === 'form' || this.pageType === 'workflow') {
        this.saveToServer = true;
    }

    if(this.loadFromServer === true || this.saveToServer === true) {
        this.contactServer = true;
    }

    this.pages.forEach((page) => {

        if(page.pageName === this.pageName) {
            this.fields = page.fields;
            this.pageNameKebabCased = page.pageNameKebabCased;
            this.pageNameCamelCased = page.pageNameCamelCased;
            this.pageUrl = page.pageUrl;
            this.pageApiUrl = page.pageNameKebabCased;
            this.pageNameTranslationKey = page.pageNameTranslationKey;
            this.pageSetAndNameTranslationKey = page.pageSetAndNameTranslationKey;
            this.pageAngularName = page.pageAngularName;
            this.pageRouterState = page.pageRouterState;
            this.pageInstance = page.pageInstance ;
            this.pageInstancePlural = page.pageInstancePlural ;
            this.pageClass = page.pageClass ;
            this.pageLoadInstance = page.pageLoadInstance ;
            this.pageLoadClass = page.pageLoadClass ;
            this.pageSaveInstance = page.pageSaveInstance ;
            this.pageSaveClass = page.pageSaveClass ;
            this.pagination = page.pagination;
        }
    });

    this.fieldsContainInstant = false;
    this.fieldsContainZonedDateTime = false;
    this.fieldsContainLocalDate = false;
    this.fieldsContainBigDecimal = false;
    this.fieldsContainBlob = false;
    this.fieldsContainImageBlob = false;
    this.validation = false;

    this.fields.forEach((field) => {
        const nonEnumType = _.includes(['String', 'Integer', 'Long', 'Float', 'Double', 'BigDecimal',
            'LocalDate', 'Instant', 'ZonedDateTime', 'Boolean', 'byte[]', 'ByteBuffer'], field.fieldType);
        if (!nonEnumType) {
            field.fieldIsEnum = true;
        } else {
            field.fieldIsEnum = false;
        }

        if (_.isUndefined(field.fieldInJavaBeanMethod)) {
            // Handle the specific case when the second letter is capitalized
            // See http://stackoverflow.com/questions/2948083/naming-convention-for-getters-setters-in-java
            if (field.fieldName.length > 1) {
                const firstLetter = field.fieldName.charAt(0);
                const secondLetter = field.fieldName.charAt(1);
                if (firstLetter === firstLetter.toLowerCase() && secondLetter === secondLetter.toUpperCase()) {
                    field.fieldInJavaBeanMethod = firstLetter.toLowerCase() + field.fieldName.slice(1);
                } else {
                    field.fieldInJavaBeanMethod = _.upperFirst(field.fieldName);
                }
            } else {
                field.fieldInJavaBeanMethod = _.upperFirst(field.fieldName);
            }
        }

        if (_.isUndefined(field.fieldValidateRulesPatternJava)) {
            field.fieldValidateRulesPatternJava = field.fieldValidateRulesPattern ?
                field.fieldValidateRulesPattern.replace(/\\/g, '\\\\').replace(/"/g, '\\"') : field.fieldValidateRulesPattern;
        }

        if (_.isArray(field.fieldValidateRules) && field.fieldValidateRules.length >= 1) {
            field.fieldValidate = true;
        } else {
            field.fieldValidate = false;
        }

        if (field.fieldType === 'ZonedDateTime') {
            this.fieldsContainZonedDateTime = true;
        } else if (field.fieldType === 'Instant') {
            this.fieldsContainInstant = true;
        } else if (field.fieldType === 'LocalDate') {
            this.fieldsContainLocalDate = true;
        } else if (field.fieldType === 'BigDecimal') {
            this.fieldsContainBigDecimal = true;
        } else if (field.fieldType === 'byte[]' || field.fieldType === 'ByteBuffer') {
            this.fieldsContainBlob = true;
            if (field.fieldTypeBlobContent === 'image') {
                this.fieldsContainImageBlob = true;
            }
        }
        if (field.fieldValidate) {
            this.validation = true;
        }
    });
}
