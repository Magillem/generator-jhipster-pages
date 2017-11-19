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
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiAlertService<% if (fieldsContainBlob) { %>, JhiDataUtils<% } %> } from 'ng-jhipster';
<% if (postOneToServer) { %>import { Observable } from 'rxjs/Rx';
<% } %>
import { <%= pageAngularClass %> } from './<%= pageAngularFileName %>.model';
import { <%= pageAngularClass %>Service } from './<%= pageAngularFileName %>.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';

@Component({
    selector: '<%= jhiPrefix %>-<%= pageAngularSelector %>',
    templateUrl: './<%= pageAngularFileName %>.component.html'
})
export class <%= pageAngularClass %>Component implements OnInit, OnDestroy {
<% if (getOneFromServer || postOneToServer) { %>
    <%= pageInstance %>: <%= pageAngularClass %>;
<% } else if (getAllFromServer) { %>
    <%= pageInstancePlural %>: <%= pageAngularClass %>[];
<% } %>
    currentAccount: any;
    eventSubscriber: Subscription;<% if (postOneToServer) { %>
    isSaving: Boolean;<% } %>

    constructor(
        private <%= pageInstance %>Service: <%= pageAngularClass %>Service,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }
<% if (getOneFromServer || getAllFromServer) { %>
    loadAll() {

    }
<% } else if (postOneToServer) { %>
    save() {
        this.isSaving = true;
        this.subscribeToSaveResponse(
            this.<%= pageInstance %>Service.create(this.<%= pageInstance %>));
    }

    private subscribeToSaveResponse(result: Observable<<%= pageAngularClass %>>) {
        result.subscribe((res: <%= pageAngularClass %>) =>
        this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: <%= pageAngularClass %>) {
        this.eventManager.broadcast({ name: '<%= pageInstance %>ListModification', content: 'OK'});
        this.isSaving = false;
    }

    private onSaveError() {
        this.isSaving = false;
    }
<% } %>
    ngOnInit() {
<% if (getOneFromServer || getAllFromServer) { %>
        this.loadAll();<% } %>
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
<% if (getOneFromServer || getAllFromServer) { %>
        this.registerChangeIn<%= pageClassPlural %>();<% } %>
    }

    ngOnDestroy() {
<% if (getOneFromServer || getAllFromServer) { %>
        this.eventManager.destroy(this.eventSubscriber);<% } %>
    }
<%_ if (fieldsContainBlob) { _%>
    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }<%_ } _%>
<%_
    if (getOneFromServer || getAllFromServer) {
        let eventCallBack = 'this.loadAll()';
        if (pagination === 'infinite-scroll') {
            eventCallBack = 'this.reset()';
        } _%>
    registerChangeIn<%= pageClassPlural %>() {
        this.eventSubscriber = this.eventManager.subscribe('<%= pageInstance %>ListModification', (response) => <%= eventCallBack %>);
    }
<% } %>
<%_ if (pagination !== 'no') {
 if (pagination === 'pagination' || pagination === 'pager') { _%>
    private onSuccess(data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
            this.totalItems = headers.get('X-Total-Count');
            this.queryCount = this.totalItems;
            // this.page = pagingParams.page;
        this.<%= pageInstancePlural %> = data;
    }<%_ } else if (pagination === 'infinite-scroll') { _%>
    private onSuccess(data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        for (let i = 0; i < data.length; i++) {
            this.<%= pageInstancePlural %>.push(data[i]);
        }
    }<%_ }} _%>
    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
