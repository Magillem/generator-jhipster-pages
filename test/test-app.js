/* global describe, beforeEach, it*/

const path = require('path');
const fse = require('fs-extra');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('JHipster generator pages', () => {
    describe('Test with Gradle and Angular1', () => {
        beforeEach((done) => {
            helpers
                .run(path.join(__dirname, '../generators/app'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, '../test/templates/gradle-angular1'), dir);
                })
                .withOptions({
                    testmode: true,
                    'skip-install': true
                })
                .withPrompts({
                    pageSet: '_CreateNew_',
                    newPageSet: 'aPageSet',
                    pageSetGlyphIcon: 'ok',
                    pageType: 'form',
                    pageName: 'aForm',
                    pageGlyphIcon: 'euro',
                    fieldAdd: false
                })
                .on('end', done);
        });

        it('generate form files', () => {
            assert.file([
                '.jhipster/pages/aPageSet.json',
                'src/main/java/com/mycompany/myapp/web/rest/vm/AFormSaveVM.java',
                'src/main/webapp/app/pages/page-sets.state.js',
                'src/main/webapp/app/pages/a-page-set/APageSet.state.js',
                'src/main/webapp/app/pages/a-page-set/aForm.controller.js',
                'src/main/webapp/app/pages/a-page-set/aForm.html',
                'src/main/webapp/app/pages/a-page-set/aForm.service.js',
                'src/test/javascript/spec/app/pages/a-page-set/aForm.controller.spec.js',
                'src/main/webapp/i18n/en/aPageSet.json'
            ]);
        });
    });

    describe('Test with Maven and Angular2', () => {
        beforeEach((done) => {
            helpers
                .run(path.join(__dirname, '../generators/app'))
                .inTmpDir((dir) => {
                    fse.copySync(path.join(__dirname, '../test/templates/maven-angular2'), dir);
                })
                .withOptions({
                    testmode: true,
                    'skip-install': true
                })
                .withPrompts({
                    pageSet: '_CreateNew_',
                    newPageSet: 'aPageSet',
                    pageSetGlyphIcon: 'ok',
                    pageType: 'form',
                    pageName: 'aForm',
                    pageGlyphIcon: 'euro',
                    fieldAdd: false
                })
                .on('end', done);
        });

        it('generate form files', () => {
            assert.file([
                '.jhipster/pages/aPageSet.json',
                'src/main/java/com/mycompany/myapp/web/rest/vm/AFormSaveVM.java',
                'src/main/webapp/app/pages/page-sets.module.ts',
                'src/main/webapp/app/pages/a-page-set/APageSet.module.ts',
                'src/main/webapp/app/pages/a-page-set/APageSet.route.ts',
                'src/main/webapp/app/pages/a-page-set/index.ts',
                'src/main/webapp/app/pages/a-page-set/aForm.component.ts',
                'src/main/webapp/app/pages/a-page-set/aForm.component.html',
                'src/main/webapp/app/pages/a-page-set/aForm.service.ts',
                'src/main/webapp/app/pages/a-page-set/aForm.model.ts',
                'src/test/javascript/spec/app/pages/a-page-set/aForm.component.spec.ts',
                'src/main/webapp/i18n/en/aPageSet.json'
            ]);
        });
    });
});
