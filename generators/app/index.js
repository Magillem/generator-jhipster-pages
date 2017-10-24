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
const util = require('util');
const chalk = require('chalk');
const generator = require('yeoman-generator');
const packagejs = require('../../package.json');
const semver = require('semver');
const _ = require('lodash');
const pluralize = require('pluralize');
const BaseGenerator = require('generator-jhipster/generators/generator-base');
const constant = require('./constant');
const prompts = require('./prompts');
const writeFiles = require('./files').writeFiles;

const JhipsterGenerator = generator.extend({});
util.inherits(JhipsterGenerator, BaseGenerator);


module.exports = JhipsterGenerator.extend({
    initializing: {
        init(args) {
            this.regenerate = false;
            if (args === 'regenerate') {
                this.regenerate = true;
            }
        },
        readConfig() {
            this.jhipsterAppConfig = this.getJhipsterAppConfig();
            if (!this.jhipsterAppConfig) {
                this.error('Can\'t read .yo-rc.json');
            }
        },
        displayLogo() {
            // it's here to show that you can use functions from generator-jhipster
            // this function is in: generator-jhipster/generators/generator-base.js
            this.printJHipsterLogo();

            // Have Yeoman greet the user.
            this.log(`\nWelcome to the ${chalk.bold.yellow('JHipster pages')} generator! ${chalk.yellow(`v${packagejs.version}\n`)}`);
        },
        checkJhipster() {
            const jhipsterVersion = this.jhipsterAppConfig.jhipsterVersion;
            const minimumJhipsterVersion = packagejs.dependencies['generator-jhipster'];
            if (!semver.satisfies(jhipsterVersion, minimumJhipsterVersion)) {
                this.warning(`\nYour generated project used an old JHipster version (${jhipsterVersion})... you need at least (${minimumJhipsterVersion})\n`);
            }
        },
        setupconsts() {
            this.fields = [];
            this.fieldNamesUnderscored = [];
        }
    },

    prompting: {
        askForPageSetConfig: prompts.askForPageSetConfig,
        askForPageConfig: prompts.askForPageConfig,
        askForFormConfig: prompts.askForFormConfig,
        askForTableConfig: prompts.askForTableConfig,
        askForWorkflowConfig: prompts.askForWorkflowConfig
    },

    configuring: {
        writePageSetJson() {
            if (!this.regenerate) {
                const toPath = `${constant.MODULES_PAGES_CONFIG_FILE}/${this.pageSet}.json`;
                // store information in a file for further use.
                if (!this.useConfigurationFile && (this.databaseType === 'sql' || this.databaseType === 'cassandra')) {
                    this.changelogDate = this.dateFormatForLiquibase();
                }
                this.data = {};
                this.data.pages = this.pages;
                this.currentPage = { pageName: this.pageName, pageType: this.pageType };
                if (this.pageGlyphIcon || this.pageGlyphIcon === 'false') {
                    this.currentPage.pageGlyphIcon = this.pageGlyphIcon;
                }
                if (this.fields) {
                    this.currentPage.fields = this.fields;
                }
                if (this.pagination) {
                    this.currentPage.pagination = this.pagination;
                }
                this.pages.push(this.currentPage);
                this.data.pageSetGlyphIcon = this.pageSetGlyphIcon;
                this.data.changelogDate = this.changelogDate;
                this.fs.writeJSON(toPath, this.data, null, 4);
            }
        },
        loadConfig() {
            this.baseName = this.jhipsterAppConfig.baseName;
            this.packageName = this.jhipsterAppConfig.packageName;
            this.applicationType = this.jhipsterAppConfig.applicationType;
            this.packageFolder = this.jhipsterAppConfig.packageFolder;
            this.enableTranslation = this.jhipsterAppConfig.enableTranslation;
            this.authenticationType = this.jhipsterAppConfig.authenticationType;
            this.languages = this.jhipsterAppConfig.languages;
            this.mainClass = this.getMainClassName();

            // read config from .yo-rc.json
            this.clientFramework = this.jhipsterAppConfig.clientFramework;
            this.clientPackageManager = this.jhipsterAppConfig.clientPackageManager;
            this.buildTool = this.jhipsterAppConfig.buildTool;

            // use function in generator-base.js from generator-jhipster
            this.angularAppName = this.getAngularAppName();
        },
        loadPageSetInMemory() {
            this.pageSetSpinalCased = _.kebabCase(_.lowerFirst(this.pageSet));
            this.pageSetClass = _.upperFirst(_.camelCase(this.pageSet));
            this.pageSetAngularClass = this.pageSetClass;
            this.pageSetInstance = _.lowerFirst(this.pageSetClass);
            this.pageSetUrl = this.pageSetSpinalCased;
            this.pageSetApiUrl = this.pageSetSpinalCased;
            this.pageSetRouterState = _.lowerFirst(this.pageSetClass);
            this.pageSetTranslationKey = this.pageSetRouterState;
            this.pageSetFolder = this.pageSetSpinalCased;
            this.pageSetTranslation = this.pageSetSpinalCased;

            this.getOneFromServer = false;
            this.getAllFromServer = false;
            this.postOneToServer = false;
            this.contactServer = false;

            this.pages.forEach((page) => {
                page.pageNameKebabCased = _.kebabCase(_.lowerFirst(page.pageName));
                page.pageNameCamelCased = _.camelCase(page.pageName);
                page.pageUrl = page.pageNameKebabCased;
                page.pageAngularName = page.pageNameCamelCased;
                page.pageRouterState = _.lowerFirst(page.pageNameCamelCased);
                page.pageNameTranslationKey = page.pageRouterState;
                page.pageSetAndNameTranslationKey = `${this.pageSetTranslationKey}-${page.pageNameTranslationKey}`;
                page.pageInstance = _.lowerFirst(page.pageNameCamelCased);
                page.pageInstancePlural = pluralize(page.pageInstance);
                page.pageClass = _.upperFirst(page.pageNameCamelCased);
                page.pageClassPlural = pluralize(page.pageClass);
                page.pageApiUrl = page.pageNameKebabCased;
                page.pageLoadInstance = `${page.pageInstance}LoadVM`;
                page.pageLoadClass = `${page.pageClass}LoadVM`;
                page.pageSaveInstance = `${page.pageInstance}SaveVM`;
                page.pageSaveClass = `${page.pageClass}SaveVM`;
                page.getOneFromServer = false;
                page.getAllFromServer = false;
                page.postOneToServer = false;
                page.contactServer = false;

                if (page.pageType === 'getOneFromServer' || page.pageType === 'loadAndSaveToServer' || page.pageType === 'workflow') {
                    page.getOneFromServer = true;
                    this.getOneFromServer = true;
                }

                if (page.pageType === 'postOneToServer' || page.pageType === 'loadAndSaveToServer' || page.pageType === 'form' || page.pageType === 'workflow') {
                    page.postOneToServer = true;
                    this.postOneToServer = true;
                }

                if (page.pageType === 'table') {
                    page.getAllFromServer = true;
                    this.getAllFromServer = true;
                }

                if (page.getOneFromServer === true || page.postOneToServer === true || page.getAllFromServer === true) {
                    page.contactServer = true;
                    this.contactServer = true;
                }
            });
        }
    },

    writing: writeFiles(),

    install: {
        gulpInject() {
            if (this.clientFramework === 'angular1') {
                this.injectJsFilesToIndex();
            } else {
                this.rebuildClient();
            }
        }
    },
    
    end() {
        this.log('End of pages generator');
    }
});
