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
<%_
const i18nToLoad = [pageSetInstance];
for (const idx in fields) {
    if (fields[idx].fieldIsEnum === true) {
        i18nToLoad.push(fields[idx].enumInstance);
    }
}
_%>
<%_
let hasDate = false;
if (fieldsContainInstant || fieldsContainZonedDateTime || fieldsContainLocalDate) {
    hasDate = true;
}
_%>
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

<%_ for (idx in pages) {
    const page = pages[idx];_%>
import { <%= page.pageAngularName %>Component } from './<%= page.pageAngularName %>.component';
<%_ } _%>

<%_ for (idx in pages) {
    const page = pages[idx];
    _%>

    <%_
    if (page.pagination === 'pagination' || page.pagination === 'pager') {
        _%>
        @Injectable()
    export class
        <%= page.pageAngularName %>ResolvePagingParams implements Resolve <any> {

            constructor(private paginationUtil: JhiPaginationUtil) {
            }

            resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
                const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
                const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
                return {
                    page: this.paginationUtil.parsePage(page),
                    predicate: this.paginationUtil.parsePredicate(sort),
                    ascending: this.paginationUtil.parseAscending(sort)
                };
            }
        }

        <% _
    }
} _%>


export const <%= pageSetAngularClass %>Route: Routes = [
<%_ for (idx in pages) {
const page = pages[idx];
_%>
    {
        path: '<%= page.pageUrl %>',
        component: <%= page.pageAngularName %>Component,
    <%_ if (page.pagination === 'pagination' || page.pagination === 'pager'){ _%>
resolve: {
    'pagingParams': <%= page.pageAngularName %>ResolvePagingParams
},
    <%_ } _%>
data: {
    authorities: ['ROLE_USER'],
        pageTitle: <% if (enableTranslation){ %>'<%= angularAppName %>.<%= page.pageSetAndNameTranslationKey %>.home.title'<% }else{ %>'<%= page.pageClassPlural %>'<% } %>
},
canActivate: [UserRouteAccessService]
},
<%_ } _%>
];
