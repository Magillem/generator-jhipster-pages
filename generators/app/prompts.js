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

const chalk = require('chalk');
const shelljs = require('shelljs');
const constant = require('./constant');

module.exports = {
    askForPageSetConfig,
    askForPageConfig
};

function askForPageSetConfig() {

    const done = this.async();

    const pageSetChoices = [
        {
            value: '_CreateNew_',
            name: 'Create a new pages set'
        },
    ];

    shelljs.ls(`{constant.MODULES_PAGES_CONFIG_FILE}/*.js`).forEach((file) => {
        pageSetChoices.push(file.slice(0, -3));
    });

    const prompts = [
        {
            type: 'list',
            name: 'pageSet',
            message: 'Create page in the following pages set:',
            choices: pageSetChoices,
            store   : true
        },
        {
            when: response => response.pageSet === '_CreateNew_',
            type: 'input',
            name: 'newPageSet',
            message: 'Create page set with the following name:',
            validate: (input) => {
                let inputPath = `${constant.MODULES_PAGES_CONFIG_FILE}/${input}`;
                if (shelljs.test('-f', inputPath)) {
                    return `${input} already exist in ${constant.MODULES_PAGES_CONFIG_FILE}`;
                }
                return true;
            }
        }
    ];

    this.prompt(prompts).then((prompt) => {
        this.pageSet = prompt.pageSet;
        this.newPageSet = prompt.newPageSet;
        if(typeof this.newPageSet !== "undefined") {
            this.pageSet = this.newPageSet;
            this.pages = [];
            this.changelogDate = this.dateFormatForLiquibase();
        } else {
            _loadPageSetJson();
        }
        done();
    });
}


function askForPageConfig() {

    const done = this.async();

    const prompts = [
        {
            type: 'list',
            name: 'pageType',
            message: 'Which king of page you want to add?',
            choices: [
                {
                    value: 'static',
                    name: 'Static'
                },
                {
                    value: 'dynamic',
                    name: 'Dynamic'
                },
                {
                    value: 'forms',
                    name: 'Forms'
                },
                {
                    value: 'workflow',
                    name: 'Workflow'
                },
            ],
            store   : true
        },
        {
            type: 'input',
            name: 'pageName',
            message: 'Enter the page name:',
        },
        {
            type: 'input',
            name: 'pageGlyphIcon',
            message: 'Enter the page glyphicon name (see https://getbootstrap.com/components/):',
        }
    ];

    this.prompt(prompts).then((prompt) => {
        this.pageType = prompt.pageType;
        this.pageName = prompt.pageName;
        this.pageGlyphIcon = prompt.pageGlyphIcon;
        this.pages.push({pageName: this.pageName, pageType: this.pageType, pageGlyphIcon: this.pageGlyphIcon});

        done();
    });
}

function _loadPageSetJson() {
    let fromPath = `${constant.MODULES_PAGES_CONFIG_FILE}/${this.pageSet}`;

    try {
        this.fileData = this.fs.readJSON(fromPath);
    } catch (err) {
        this.debug('Error:', err);
        this.error(chalk.red('\nThe page set configuration file could not be read!\n'));
    }
    this.pages = this.fileData.pages || [];
    this.changelogDate = this.fileData.changelogDate;
}
