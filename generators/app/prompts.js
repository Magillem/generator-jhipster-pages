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
const _ = require('lodash');
const jhiCore = require('jhipster-core');
const constant = require('./constant');

module.exports = {
    askForPageSetConfig,
    askForPageConfig,
    askForFormConfig,
    askForTableConfig,
    askForWorkflowConfig
};

function askForPageSetConfig() {

    const done = this.async();

    let pageSetChoices;

    if(this.regenerate) {
        pageSetChoices = [];
    } else {
        pageSetChoices = [
            {
                value: '_CreateNew_',
                name: 'Create a new page set'
            },
        ];
    }


    const pageSetConfigs = `${constant.MODULES_PAGES_CONFIG_FILE}/*.json`;
    shelljs.ls(pageSetConfigs).forEach((file) => {
        const fileName = file.split('\\').pop().split('/').pop().slice(0, -5);
        pageSetChoices.push({
            value: fileName,
            name: fileName
        });
    });

    const prompts = [
        {
            type: 'list',
            name: 'pageSet',
            message: 'Create page in the following page set:',
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
        },
        {
            when: response => response.pageSet === '_CreateNew_',
            type: 'input',
            name: 'pageSetGlyphIcon',
            message: 'Enter the optional page set icon name in font awesome for angular or glyphicon for angularjs ( (upload for example):',
        }
    ];

    this.prompt(prompts).then((prompt) => {
        this.pageSet = prompt.pageSet;
        this.newPageSet = prompt.newPageSet;
        this.pageSetGlyphIcon = prompt.pageSetGlyphIcon;
        if(typeof this.newPageSet !== "undefined") {
            this.pageSet = this.newPageSet;
            this.pages = [];
            this.changelogDate = this.dateFormatForLiquibase();
        } else {
            let fromPath = `${constant.MODULES_PAGES_CONFIG_FILE}/${this.pageSet}.json`;
            //this.log(fromPath);
            try {
                this.fileData = this.fs.readJSON(fromPath);
            } catch (err) {
                this.debug('Error:', err);
                this.error(chalk.red('\nThe page set configuration file could not be read!\n'));
            }
            //this.log(this.fileData);
            this.fileData = this.fileData || {};
            this.pages = this.fileData.pages || [];
            this.pageSetGlyphIcon = this.fileData.pageSetGlyphIcon;
            this.changelogDate = this.fileData.changelogDate;
        }
        done();
    });
}

function askForPageConfig() {

    const done = this.async();

    const existingPagesChoices = [];
    if(this.regenerate){
        this.pages.forEach((page) => {
            existingPagesChoices.push({
                value: page,
                name: page.pageName
            });
        });
    }

    const prompts = [
        {
            when: !this.regenerate,
            type: 'list',
            name: 'pageType',
            message: 'Which kind of page you want to add?',
            choices: [
                {
                    value: 'clientOnly',
                    name: 'Client Only'
                },
                {
                    value: 'getOneFromServer',
                    name: 'Load data from server'
                },
                {
                    value: 'postOneToServer',
                    name: 'Save data to server'
                },
                {
                    value: 'loadAndSaveToServer',
                    name: 'Load and Save data to server'
                },
                {
                    value: 'form',
                    name: 'Form'
                },
                {
                    value: 'table',
                    name: 'Table'
                },
                {
                    value: 'workflow',
                    name: 'Workflow (beta)'
                },
            ],
            store   : true
        },
        {
            when: !this.regenerate,
            type: 'input',
            name: 'pageName',
            message: 'Enter the page name:',
            validate: (input) => {
                this.pages.forEach((page) => {
                    if(page.pageName === input) {
                        return `${input} already exist in ${this.pageSet}`;
                    }
                });
                return true;
            }
        },
        {
            when: !this.regenerate,
            type: 'input',
            name: 'pageGlyphIcon',
            message: 'Enter the optional page icon name in font awesome for angular or glyphicon for angularjs (cloud-upload-alt for example):',
        },
        {
            when: this.regenerate,
            type: 'checkbox',
            name: 'pagesToRegenerate',
            message: 'Regenerate following pages:',
            choices: existingPagesChoices,
            validate: (input) => {
                if(input.length == 0) {
                    return `please select at least one page to regenerate`;
                }
                return true;
            }
        },
    ];

    this.prompt(prompts).then((prompt) => {
        if(!this.regenerate) {
            this.pageType = prompt.pageType;
            this.pageName = prompt.pageName;
            this.pageGlyphIcon = prompt.pageGlyphIcon;
            this.changelogDate = this.dateFormatForLiquibase();
        } else {
            this.pagesToRegenerate = prompt.pagesToRegenerate;
        }
        done();
    });
}


function askForFormConfig() {

    const done = this.async();
    if (!this.regenerate && (this.pageType === 'form' || this.pageType === 'table' || this.pageType === 'workflow')) {
        askForField.call(this, done);
    } else {
        done();
    }
}


/**
 * ask question for a field creation
 */
function askForField(done) {
    this.log(chalk.green(`\nGenerating field #${this.fields.length + 1}\n`));
    const skipServer = this.skipServer;
    const databaseType = this.databaseType;
    const fieldNamesUnderscored = this.fieldNamesUnderscored;
    const prompts = [
        {
            type: 'confirm',
            name: 'fieldAdd',
            message: 'Do you want to add a field to your current page?',
            default: true
        },
        {
            when: response => response.fieldAdd === true,
            type: 'input',
            name: 'fieldName',
            validate: (input) => {
                if (!(/^([a-zA-Z0-9_]*)$/.test(input))) {
                    return 'Your field name cannot contain special characters';
                } else if (input === '') {
                    return 'Your field name cannot be empty';
                } else if (input.charAt(0) === input.charAt(0).toUpperCase()) {
                    return 'Your field name cannot start with an upper case letter';
                } else if (input === 'id' || fieldNamesUnderscored.indexOf(_.snakeCase(input)) !== -1) {
                    return 'Your field name cannot use an already existing field name';
                } else if (!skipServer && jhiCore.isReservedFieldName(input)) {
                    return 'Your field name cannot contain a Java or Angular reserved keyword';
                }
                return true;
            },
            message: 'What is the name of your field?'
        },
        {
            when: response => response.fieldAdd === true,
            type: 'list',
            name: 'fieldType',
            message: 'What is the type of your field?',
            choices: [
                {
                    value: 'String',
                    name: 'String'
                },
                {
                    value: 'Integer',
                    name: 'Integer'
                },
                {
                    value: 'Long',
                    name: 'Long'
                },
                {
                    value: 'Float',
                    name: 'Float'
                },
                {
                    value: 'Double',
                    name: 'Double'
                },
                {
                    value: 'BigDecimal',
                    name: 'BigDecimal'
                },
                {
                    value: 'LocalDate',
                    name: 'LocalDate'
                },
                {
                    value: 'Instant',
                    name: 'Instant'
                },
                {
                    value: 'ZonedDateTime',
                    name: 'ZonedDateTime'
                },
                {
                    value: 'Boolean',
                    name: 'Boolean'
                },
                {
                    value: 'enum',
                    name: 'Enumeration (Java enum type)'
                }
            ],
            default: 0
        },
        {
            when: (response) => {
                if (response.fieldType === 'enum') {
                    response.fieldIsEnum = true;
                    return true;
                }
                response.fieldIsEnum = false;
                return false;
            },
            type: 'input',
            name: 'fieldType',
            validate: (input) => {
                if (input === '') {
                    return 'Your class name cannot be empty.';
                } else if (jhiCore.isReservedKeyword(input, 'JAVA')) {
                    return 'Your enum name cannot contain a Java reserved keyword';
                }
                if (this.enums.indexOf(input) !== -1) {
                    this.existingEnum = true;
                } else {
                    this.enums.push(input);
                }
                return true;
            },
            message: 'What is the class name of your enumeration?'
        },
        {
            when: response => response.fieldIsEnum,
            type: 'input',
            name: 'fieldValues',
            validate: (input) => {
                if (input === '' && this.existingEnum) {
                    this.existingEnum = false;
                    return true;
                }
                if (input === '') {
                    return 'You must specify values for your enumeration';
                }
                if (!/^[A-Za-z0-9_,\s]*$/.test(input)) {
                    return 'Enum values cannot contain special characters (allowed characters: A-Z, a-z, 0-9 and _)';
                }
                const enums = input.replace(/\s/g, '').split(',');
                if (_.uniq(enums).length !== enums.length) {
                    return `Enum values cannot contain duplicates (typed values: ${input})`;
                }
                for (let i = 0; i < enums.length; i++) {
                    if (/^[0-9].*/.test(enums[i])) {
                        return `Enum value "${enums[i]}" cannot start with a number`;
                    }
                    if (enums[i] === '') {
                        return 'Enum value cannot be empty (did you accidentally type "," twice in a row?)';
                    }
                }

                return true;
            },
            message: (answers) => {
                if (!this.existingEnum) {
                    return 'What are the values of your enumeration (separated by comma)?';
                }
                return 'What are the new values of your enumeration (separated by comma)?\nThe new values will replace the old ones.\nNothing will be done if there are no new values.';
            }
        },
        {
            when: response => response.fieldAdd === true && this.pageType !== 'table',
            type: 'confirm',
            name: 'fieldValidate',
            message: 'Do you want to add validation rules to your field?',
            default: false
        },
        {
            when: response => response.fieldAdd === true &&
                response.fieldValidate === true &&
                (response.fieldType === 'String' ||
                    response.fieldTypeBlobContent === 'text'),
            type: 'checkbox',
            name: 'fieldValidateRules',
            message: 'Which validation rules do you want to add?',
            choices: [
                {
                    name: 'Required',
                    value: 'required'
                },
                {
                    name: 'Minimum length',
                    value: 'minlength'
                },
                {
                    name: 'Maximum length',
                    value: 'maxlength'
                },
                {
                    name: 'Regular expression pattern',
                    value: 'pattern'
                }
            ],
            default: 0
        },
        {
            when: response => response.fieldAdd === true &&
                response.fieldValidate === true &&
                (response.fieldType === 'Integer' ||
                    response.fieldType === 'Long' ||
                    response.fieldType === 'Float' ||
                    response.fieldType === 'Double' ||
                    response.fieldType === 'BigDecimal'),
            type: 'checkbox',
            name: 'fieldValidateRules',
            message: 'Which validation rules do you want to add?',
            choices: [
                {
                    name: 'Required',
                    value: 'required'
                },
                {
                    name: 'Minimum',
                    value: 'min'
                },
                {
                    name: 'Maximum',
                    value: 'max'
                }
            ],
            default: 0
        },
        {
            when: response => response.fieldAdd === true &&
                response.fieldValidate === true &&
                response.fieldType === 'byte[]' &&
                response.fieldTypeBlobContent !== 'text',
            type: 'checkbox',
            name: 'fieldValidateRules',
            message: 'Which validation rules do you want to add?',
            choices: [
                {
                    name: 'Required',
                    value: 'required'
                },
                {
                    name: 'Minimum byte size',
                    value: 'minbytes'
                },
                {
                    name: 'Maximum byte size',
                    value: 'maxbytes'
                }
            ],
            default: 0
        },
        {
            when: response => response.fieldAdd === true &&
                response.fieldValidate === true &&
                (response.fieldType === 'LocalDate' ||
                    response.fieldType === 'Instant' ||
                    response.fieldType === 'ZonedDateTime' ||
                    response.fieldType === 'UUID' ||
                    response.fieldType === 'Boolean' ||
                    response.fieldType === 'ByteBuffer' ||
                    response.fieldIsEnum === true),
            type: 'checkbox',
            name: 'fieldValidateRules',
            message: 'Which validation rules do you want to add?',
            choices: [
                {
                    name: 'Required',
                    value: 'required'
                }
            ],
            default: 0
        },
        {
            when: response => response.fieldAdd === true &&
                response.fieldValidate === true &&
                response.fieldValidateRules.indexOf('minlength') !== -1,
            type: 'input',
            name: 'fieldValidateRulesMinlength',
            validate: input => (this.isNumber(input) ? true : 'Minimum length must be a positive number'),
            message: 'What is the minimum length of your field?',
            default: 0
        },
        {
            when: response => response.fieldAdd === true &&
                response.fieldValidate === true &&
                response.fieldValidateRules.indexOf('maxlength') !== -1,
            type: 'input',
            name: 'fieldValidateRulesMaxlength',
            validate: input => (this.isNumber(input) ? true : 'Maximum length must be a positive number'),
            message: 'What is the maximum length of your field?',
            default: 20
        },
        {
            when: response => response.fieldAdd === true &&
                response.fieldValidate === true &&
                response.fieldValidateRules.indexOf('min') !== -1 &&
                (response.fieldType === 'Integer' ||
                    response.fieldType === 'Long'),
            type: 'input',
            name: 'fieldValidateRulesMin',
            message: 'What is the minimum of your field?',
            validate: input => (this.isSignedNumber(input) ? true : 'Minimum must be a number'),
            default: 0
        },
        {
            when: response => response.fieldAdd === true &&
                response.fieldValidate === true &&
                response.fieldValidateRules.indexOf('max') !== -1 &&
                (response.fieldType === 'Integer' ||
                    response.fieldType === 'Long'),
            type: 'input',
            name: 'fieldValidateRulesMax',
            message: 'What is the maximum of your field?',
            validate: input => (this.isSignedNumber(input) ? true : 'Maximum must be a number'),
            default: 100
        },
        {
            when: response => response.fieldAdd === true &&
                response.fieldValidate === true &&
                response.fieldValidateRules.indexOf('min') !== -1 &&
                (response.fieldType === 'Float' ||
                    response.fieldType === 'Double' ||
                    response.fieldType === 'BigDecimal'),
            type: 'input',
            name: 'fieldValidateRulesMin',
            message: 'What is the minimum of your field?',
            validate: input => (this.isSignedDecimalNumber(input, true) ? true : 'Minimum must be a decimal number'),
            default: 0
        },
        {
            when: response => response.fieldAdd === true &&
                response.fieldValidate === true &&
                response.fieldValidateRules.indexOf('max') !== -1 &&
                (response.fieldType === 'Float' ||
                    response.fieldType === 'Double' ||
                    response.fieldType === 'BigDecimal'),
            type: 'input',
            name: 'fieldValidateRulesMax',
            message: 'What is the maximum of your field?',
            validate: input => (this.isSignedDecimalNumber(input, true) ? true : 'Maximum must be a decimal number'),
            default: 100
        },
        {
            when: response => response.fieldAdd === true &&
                response.fieldValidate === true &&
                response.fieldValidateRules.indexOf('minbytes') !== -1 &&
                response.fieldType === 'byte[]' &&
                response.fieldTypeBlobContent !== 'text',
            type: 'input',
            name: 'fieldValidateRulesMinbytes',
            message: 'What is the minimum byte size of your field?',
            validate: input => (this.isNumber(input) ? true : 'Minimum byte size must be a positive number'),
            default: 0
        },
        {
            when: response => response.fieldAdd === true &&
                response.fieldValidate === true &&
                response.fieldValidateRules.indexOf('maxbytes') !== -1 &&
                response.fieldType === 'byte[]' &&
                response.fieldTypeBlobContent !== 'text',
            type: 'input',
            name: 'fieldValidateRulesMaxbytes',
            message: 'What is the maximum byte size of your field?',
            validate: input => (this.isNumber(input) ? true : 'Maximum byte size must be a positive number'),
            default: 5000000
        },
        {
            when: response => response.fieldAdd === true &&
                response.fieldValidate === true &&
                response.fieldValidateRules.indexOf('pattern') !== -1,
            type: 'input',
            name: 'fieldValidateRulesPattern',
            message: 'What is the regular expression pattern you want to apply on your field?',
            default: '^[a-zA-Z0-9]*$'
        }
    ];
    this.prompt(prompts).then((props) => {
        if (props.fieldAdd) {
            if (props.fieldIsEnum) {
                props.fieldType = _.upperFirst(props.fieldType);
            }

            const field = {
                fieldName: props.fieldName,
                fieldType: props.fieldType,
                fieldTypeBlobContent: props.fieldTypeBlobContent,
                fieldValues: props.fieldValues,
                fieldValidateRules: props.fieldValidateRules,
                fieldValidateRulesMinlength: props.fieldValidateRulesMinlength,
                fieldValidateRulesMaxlength: props.fieldValidateRulesMaxlength,
                fieldValidateRulesPattern: props.fieldValidateRulesPattern,
                fieldValidateRulesMin: props.fieldValidateRulesMin,
                fieldValidateRulesMax: props.fieldValidateRulesMax,
                fieldValidateRulesMinbytes: props.fieldValidateRulesMinbytes,
                fieldValidateRulesMaxbytes: props.fieldValidateRulesMaxbytes
            };

            fieldNamesUnderscored.push(_.snakeCase(props.fieldName));
            this.fields.push(field);
        }
        if (props.fieldAdd) {
            askForField.call(this, done);
        } else {
            done();
        }
    });
}


function askForTableConfig() {

    if(this.regenerate || this.pageType !== 'table')
    {
        return;
    }

    const done = this.async();

    const prompts = [
        {
            type: 'list',
            name: 'pagination',
            message: 'Do you want pagination on your entity?',
            choices: [
                {
                    value: 'no',
                    name: 'No'
                },
                {
                    value: 'pager',
                    name: 'Yes, with a simple pager'
                },
                {
                    value: 'pagination',
                    name: 'Yes, with pagination links'
                },
                {
                    value: 'infinite-scroll',
                    name: 'Yes, with infinite scroll'
                }
            ],
            default: 0
        }
    ];

    this.prompt(prompts).then((prompt) => {
        this.pagination = prompt.pagination;
        done();
    });
}

function askForWorkflowConfig() {
}
