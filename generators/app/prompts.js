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
const path = require('path');
const shelljs = require('shelljs');
const BaseGenerator = require('generator-jhipster/generators/generator-base');


const MODULES_PAGES_CONFIG_FILE = `.jhipster/pages`;

module.exports = {
    askForPageConfig
};

function askForPageConfig() {

    const done = this.async();

    const prompts = [
        {
            type: 'list',
            name: 'pageSet',
            message: 'Create page in the following pages set:',
            choices: [
                {
                    value: '_CreateNew_',
                    name: 'Create a new pages set'
                },
            ],
            store   : true
        },
        {
            when: response => response.pageSet === '_CreateNew_',
            type: 'input',
            name: 'newPageSet',
            message: 'Create page set with the following name:',
            validate: (input) => {
                let inputPath = `${MODULES_PAGES_CONFIG_FILE}/${input}`;
                if (shelljs.test('-f', inputPath)) {
                    return `${input} already exist in ${MODULES_PAGES_CONFIG_FILE}`;
                }
                return true;
            }
        },
        {
            type: 'list',
            name: 'pageType',
            message: 'Which king of page you want to add?',
            choices: [
                {
                    value: 'Static',
                    name: 'Static'
                },
                {
                    value: 'Dynamic',
                    name: 'Dynamic'
                },
                {
                    value: 'Forms',
                    name: 'Forms'
                },
                {
                    value: 'Workflow',
                    name: 'Workflow'
                },
            ],
            store   : true
        },
        {
            type: 'input',
            name: 'pageName',
            message: 'Enter the page name:',
        }
    ];

    this.prompt(prompts).then((prompt) => {
        this.pageSet = prompt.pageSet;
        this.newPageSet = prompt.newPageSet;
        this.pageName = prompt.pageName;
        done();
    });
}
