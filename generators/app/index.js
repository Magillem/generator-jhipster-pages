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
const BaseGenerator = require('generator-jhipster/generators/generator-base');
const constant = require('./constant');
const prompts = require('./prompts');
const writeFiles = require('./files').writeFiles;

const JhipsterGenerator = generator.extend({});
util.inherits(JhipsterGenerator, BaseGenerator);


module.exports = JhipsterGenerator.extend({
    initializing: {
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
        }
    },

    prompting: {

        askForPageSetConfig: prompts.askForPageSetConfig,
        askForPageConfig: prompts.askForPageConfig
    },

    configuring: {
        writePageSetJson() {
            let toPath = `${constant.MODULES_PAGES_CONFIG_FILE}/${this.pageSet}.json`;
            // store information in a file for further use.
            if (!this.useConfigurationFile && (this.databaseType === 'sql' || this.databaseType === 'cassandra')) {
                this.changelogDate = this.dateFormatForLiquibase();
            }
            this.data = {};
            this.data.pages = this.pages;
            this.data.changelogDate = this.changelogDate;
            this.fs.writeJSON(toPath, this.data, null, 4);
        },

        loadInMemoryData() {

            this.baseName = this.jhipsterAppConfig.baseName;
            this.packageName = this.jhipsterAppConfig.packageName;
            this.applicationType = this.jhipsterAppConfig.applicationType;
            this.packageFolder = this.jhipsterAppConfig.packageFolder;
            this.enableTranslation = this.jhipsterAppConfig.enableTranslation;
            this.authenticationType = this.jhipsterAppConfig.authenticationType;
            this.mainClass = this.getMainClassName();

            if(this.pageType === 'loadFromServer' || this.pageType === 'loadAndSaveToServer' || this.pageType === 'forms' || this.pageType === 'workflow') {
                this.loadFromServer = true;
            }

            if(this.pageType === 'saveToServer' || this.pageType === 'loadAndSaveToServer' || this.pageType === 'forms' || this.pageType === 'workflow') {
                this.saveToServer = true;
            }

            if(this.loadFromServer === true || this.saveToServer === true) {
                this.contactServer = true;
            }

            this.pageSetSpinalCased = _.kebabCase(_.lowerFirst(this.pageSet));
            this.pageSetClass = _.camelCase(this.pageSet);
            this.pageSetAngularClass = this.pageSetClass;
            this.pageSetInstance = _.lowerFirst(this.pageSetClass);
            this.pageSetUrl = this.pageSetSpinalCased;
            this.pageSetApiUrl = this.pageSetSpinalCased;
            this.pageSetRouterState = this.pageSetClass;
            this.pageSetFolder = this.pageSetSpinalCased;
            this.pageSetTranslation = this.pageSetSpinalCased;

            this.pages.forEach((page) => {
                page.pageNameKebabCased = _.kebabCase(_.lowerFirst(page.pageName));
                page.pageNameCamelCased = _.camelCase(page.pageName);
                page.pageUrl = page.pageNameKebabCased;
                page.pageNameTranslationKey = _.lowerFirst(page.pageName);
                page.pageAngularName = page.pageNameCamelCased;
                page.pageRouterState = page.pageNameCamelCased;
                page.pageInstance = _.lowerFirst(page.pageNameCamelCased);
                page.pageClass = _.upperFirst(page.pageNameCamelCased);
                page.pageLoadInstance = page.pageInstance+'LoadVM';
                page.pageLoadClass = page.pageClass+'LoadVM';
                page.pageSaveInstance = page.pageInstance+'SaveVM';
                page.pageSaveClass = page.pageClass+'SaveVM';
                page.loadFromServer = false;
                page.saveToServer = false;
                page.contactServer = false;

                if(page.pageType === 'loadFromServer' || page.pageType === 'loadAndSaveToServer' || page.pageType === 'forms' || page.pageType === 'workflow') {
                    page.loadFromServer = true;
                }

                if(page.pageType === 'saveToServer' || page.pageType === 'loadAndSaveToServer' || page.pageType === 'forms' || page.pageType === 'workflow') {
                    page.saveToServer = true;
                }

                if(page.loadFromServer === true || page.saveToServer === true) {
                    page.contactServer = true;
                }

                if(page.pageName === this.pageName) {
                    this.pageNameKebabCased = page.pageNameKebabCased;
                    this.pageNameCamelCased = page.pageNameCamelCased;
                    this.pageUrl = page.pageUrl;
                    this.pageApiUrl = page.pageNameKebabCased;
                    this.pageNameTranslationKey = page.pageNameTranslationKey;
                    this.pageAngularName = page.pageAngularName;
                    this.pageRouterState = page.pageRouterState;
                    this.pageInstance = page.pageInstance ;
                    this.pageClass = page.pageClass ;
                    this.pageLoadInstance = page.pageLoadInstance ;
                    this.pageLoadClass = page.pageLoadClass ;
                    this.pageSaveInstance = page.pageSaveInstance ;
                    this.pageSaveClass = page.pageSaveClass ;
                }
            });
        }
    },

    writing: writeFiles(),

    install() {
        let logMsg =
            `To install your dependencies manually, run: ${chalk.yellow.bold(`${this.clientPackageManager} install`)}`;

        if (this.clientFramework === 'angular1') {
            logMsg =
                `To install your dependencies manually, run: ${chalk.yellow.bold(`${this.clientPackageManager} install & bower install`)}`;
        }
        const injectDependenciesAndConstants = (err) => {
            if (err) {
                this.warning('Install of dependencies failed!');
                this.log(logMsg);
            } else if (this.clientFramework === 'angular1') {
                //this.spawnCommand('gulp', ['install']);
            }
        };
        const installConfig = {
            bower: this.clientFramework === 'angular1',
            npm: this.clientPackageManager !== 'yarn',
            yarn: this.clientPackageManager === 'yarn',
            callback: injectDependenciesAndConstants
        };
        if (this.options['skip-install']) {
            this.log(logMsg);
        } else {
            //this.installDependencies(installConfig);
        }
    },

    end() {
        this.log('End of pages generator');
    }
});
