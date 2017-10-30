<%#
 Copyright 2013-2017 the original author or authors from the JHipster project.

    This file is part of the JHipster project, see http://www.jhipster.tech/
    for more information.

        Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
limitations under the License.
-%>
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { <%= angularXAppName %>SharedModule } from '../../shared';
import {
<%_ for (idx in pages) {
    const page = pages[idx];_%>
    <%= page.pageAngularName %>Service,
    <%= page.pageAngularName %>Component,
<%_ if (page.pagination === 'pagination' || page.pagination === 'pager') { _%>
<%= page.pageAngularName %>ResolvePagingParams
<%_ }
} _%>
    <%= pageSetAngularClass %>Route,
} from './';

const PAGE_SET_STATES = [
    ...<%= pageSetAngularClass %>Route,
];

@NgModule({
    imports: [
        <%= angularXAppName %>SharedModule,
        RouterModule.forRoot(PAGE_SET_STATES, { useHash: true })
    ],
    declarations: [
<%_ for (idx in pages) {
const page = pages[idx];_%>
    <%= page.pageAngularName %>Component,
<%_ } _%>
],
    entryComponents: [
<%_ for (idx in pages) {
const page = pages[idx];_%>
    <%= page.pageAngularName %>Component,
<%_ } _%>
],
    providers: [
<%_ for (idx in pages) {
const page = pages[idx];_%>
    <%= page.pageAngularName %>Service,
    <%_ if (page.pagination === 'pagination' || page.pagination === 'pager') { _%>
<%= page.pageAngularName %>ResolvePagingParams,
<%_ }} _%>
],
schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

<%_ for (idx in pages) {
const page = pages[idx];_%>
export class <%= angularXAppName %><%= page.pageSetAngularClass %>Module {}
<%_ } _%>
