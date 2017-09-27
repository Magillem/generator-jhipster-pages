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
const serverFiles = {
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
        },
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

const angularjsFiles = {
    pageCommon: [
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
                },
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
    serverFiles,
    angularjsFiles,
    angularFiles
};

function writeFiles() {
    return {

        readConf() {

            // read config from .yo-rc.json
            this.baseName = this.jhipsterAppConfig.baseName;
            this.packageName = this.jhipsterAppConfig.packageName;
            this.packageFolder = this.jhipsterAppConfig.packageFolder;
            this.clientFramework = this.jhipsterAppConfig.clientFramework;
            this.clientPackageManager = this.jhipsterAppConfig.clientPackageManager;
            this.buildTool = this.jhipsterAppConfig.buildTool;

            // use function in generator-base.js from generator-jhipster
            this.angularAppName = this.getAngularAppName();

            // use constants from generator-constants.js
            const javaDir = `${constants.SERVER_MAIN_SRC_DIR + this.packageFolder}/`;
            const resourceDir = constants.SERVER_MAIN_RES_DIR;
            const webappDir = constants.CLIENT_MAIN_SRC_DIR;

            // variable from questions
            //this.message = this.props.pageSet;

            // show all variables
            this.log('\n--- some config read from config ---');
            this.log(`baseName=${this.baseName}`);
            this.log(`packageName=${this.packageName}`);
            this.log(`clientFramework=${this.clientFramework}`);
            this.log(`clientPackageManager=${this.clientPackageManager}`);
            this.log(`buildTool=${this.buildTool}`);

            this.log('\n--- some function ---');
            this.log(`angularAppName=${this.angularAppName}`);

            this.log('\n--- some const ---');
            this.log(`javaDir=${javaDir}`);
            this.log(`resourceDir=${resourceDir}`);
            this.log(`webappDir=${webappDir}`);

            this.log('\n--- variables from questions ---');
            this.log(`\npageSet=${this.pageSet}`);
            this.log(`\nnewPageSet=${this.newPageSet}`);
            this.log(`\npageType=${this.pageType}`);
            this.log(`\npageName=${this.pageName}`);

            this.log('------\n');


        },

        writeServerFiles() {
            if (this.skipServer) return;

            // write server side files
            this.writeFilesToDisk(serverFiles, this, false, SERVER_TEMPLATES_DIR);
        },

        writeClientFiles() {
            if (this.skipClient) return;

            if (this.clientFramework === 'angular1') {
                // write client side files for angular 1.x
                this.writeFilesToDisk(angularjsFiles, this, false, CLIENT_NG1_TEMPLATES_DIR);
            } else {
                // write client side files for angular 2.x +
                this.writeFilesToDisk(angularFiles, this, false, CLIENT_NG2_TEMPLATES_DIR);
            }

            this.addElementToMenu(this.pageSetRouterState+'-'+this.pageRouterState, this.pageGlyphIcon, this.enableTranslation, this.clientFramework);

            // Copy for each
            if (this.enableTranslation) {
                const languages = this.languages || this.getAllInstalledLanguages();
                languages.forEach((language) => {
                    try {
                        this.template(`${CLIENT_I18N_TEMPLATES_DIR}/i18n/_page_${language}.json`, `${constants.CLIENT_MAIN_SRC_DIR}i18n/${language}/${this.pageInstance}.json`);
                        this.addElementTranslationKey(this.pageNameTranslationKey, this.pageName, language);
                    } catch (e) {
                        // An exception is thrown if the folder doesn't exist
                        // do nothing
                    }
                });
            }
        }
    };
}
