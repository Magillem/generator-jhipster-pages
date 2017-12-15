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
                    newPageSet: 'ThePageSet',
                    pageSetGlyphIcon: 'ok',
                    pageType: 'form',
                    pageName: 'TheForm',
                    pageGlyphIcon: 'euro',
                    fieldAdd: false
                })
                .on('end', done);
        });

        it('generate form files', () => {
            assert.file([
                '.jhipster/pages/thePageSet.json',
                'src/main/java/com/mycompany/myapp/web/rest/vm/TheFormSaveVM.java',
                'src/main/webapp/app/pages/page-sets.state.js',
                'src/main/webapp/app/pages/the-page-set/thePageSet.state.js',
                'src/main/webapp/app/pages/the-page-set/theForm.controller.js',
                'src/main/webapp/app/pages/the-page-set/theForm.html',
                'src/main/webapp/app/pages/the-page-set/theForm.service.js',
                'src/test/javascript/spec/app/pages/the-page-set/theForm.controller.spec.js',
                'src/main/webapp/i18n/en/thePageSet.json'
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
                    newPageSet: 'ThePageSet',
                    pageSetGlyphIcon: 'ok',
                    pageType: 'form',
                    pageName: 'TheForm',
                    pageGlyphIcon: 'euro',
                    fieldAdd: false
                })
                .on('end', done);
        });

        it('generate form files', () => {
            assert.file([
                '.jhipster/pages/thePageSet.json',
                'src/main/java/com/mycompany/myapp/web/rest/vm/TheFormSaveVM.java',
                'src/main/webapp/app/pages/page-sets.module.ts',
                'src/main/webapp/app/pages/the-page-set/thePageSet.module.ts',
                'src/main/webapp/app/pages/the-page-set/thePageSet.route.ts',
                'src/main/webapp/app/pages/the-page-set/index.ts',
                'src/main/webapp/app/pages/the-page-set/theForm.component.ts',
                'src/main/webapp/app/pages/the-page-set/theForm.component.html',
                'src/main/webapp/app/pages/the-page-set/theForm.service.ts',
                'src/main/webapp/app/pages/the-page-set/theForm.model.ts',
                'src/test/javascript/spec/app/pages/the-page-set/theForm.component.spec.ts',
                'src/main/webapp/i18n/en/thePageSet.json'
            ]);
            assert.fileContent('src/main/webapp/app/pages/page-sets.module.ts', /import { SampleMysqlThePageSetModule } from '.\/the-page-set\/thePageSet.module';/);
        });
    });
});
