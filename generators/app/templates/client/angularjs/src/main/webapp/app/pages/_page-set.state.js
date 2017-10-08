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
(function() {
    'use strict';

    angular
        .module('<%=angularAppName%>')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider<%_ for (idx in pages) {
            const page = pages[idx];_%>
            .state('<%= pageSetRouterState %>-<%= page.pageRouterState %>', {
                parent: 'page-sets',
                url: '/pages/<%= pageSetUrl %>/<%= page.pageUrl %>',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: <% if (enableTranslation){ %>'<%= angularAppName %>.<%= page.pageNameTranslationKey %>.title'<% }else{ %>'<%= page.pageName %>'<% } %>
                },
        views: {
            'content@': {
                templateUrl: 'app/pages/<%= pageSetFolder %>/<%= page.pageName %>.html',
                    controller: '<%= page.pageAngularName %>Controller',
                    controllerAs: 'vm'
            }
        },
        resolve: {
            <%_ if (enableTranslation){ _%>
            translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                $translatePartialLoader.addPart('<%= pageSetTranslationKey %>');
                $translatePartialLoader.addPart('global');
                return $translate.refresh();
            }],
            <%_ } _%>
            <% if (page.getOneFromServer === true) { %>
            entity: ['<%= page.pageAngularName %>', function(<%= pageAngularName %>) {
                return <%= pageAngularName %>.get().$promise;
            }]
            <% } %>
        }
    })
    <%_ } _%>
    ;
    }

})();
