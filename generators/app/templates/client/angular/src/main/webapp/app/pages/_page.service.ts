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
    let hasDate = false;
    if (fieldsContainInstant || fieldsContainZonedDateTime || fieldsContainLocalDate) {
        hasDate = true;
    }
_%>
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
<%_ if (!(applicationType === 'gateway' && locals.microserviceName) && authenticationType !== 'uaa') { _%>
import { SERVER_API_URL } from '../../app.constants';
<%_ } _%>
<%_ if (hasDate) { _%>

import { JhiDateUtils } from 'ng-jhipster';
<%_ } _%>

import { <%= pageAngularName %> } from './<%= pageAngularName %>.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class <%= pageAngularName %>Service {

    private resourceUrl = <% if (applicationType === 'gateway' && locals.microserviceName) { %>'/<%= microserviceName.toLowerCase() %>/<% } else if (authenticationType === 'uaa') { %>'<% } else { %>SERVER_API_URL + '<% } %>api/<%= pageApiUrl %>';
    <%_ if(searchEngine === 'elasticsearch') { _%>
    private resourceSearchUrl = <% if (applicationType === 'gateway' && locals.microserviceName) { %>'/<%= microserviceName.toLowerCase() %>/<% } else if (authenticationType === 'uaa') { %>'<% } else { %>SERVER_API_URL + '<% } %>api/_search/<%= pageApiUrl %>';
    <%_ } _%>

    constructor(private http: Http<% if (hasDate) { %>, private dateUtils: JhiDateUtils<% } %>) { }


    <%_ if (postOneToServer) { _%>

        <%_ if (pageAngularName.length <= 30) { _%>

    create(<%= pageInstance %>: <%= pageAngularName %>): Observable<<%= pageAngularName %>> {
        <%_ } else { _%>

    create(<%= pageInstance %>: <%= pageAngularName %>):
        Observable<<%= pageAngularName %>> {
        <%_ } _%>
        const copy = this.convert(<%= pageInstance %>);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

        <%_ if (pageAngularName.length <= 30) { _%>

    update(<%= pageInstance %>: <%= pageAngularName %>): Observable<<%= pageAngularName %>> {
        <%_ } else { _%>

    update(<%= pageInstance %>: <%= pageAngularName %>):
        Observable<<%= pageAngularName %>> {
        <%_ } _%>
        const copy = this.convert(<%= pageInstance %>);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    <%_ } _%>

    <% if (getOneFromServer || getAllFromServer) { %>
    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }
    <%_ } _%>

    <%_ if(searchEngine === 'elasticsearch') { _%>

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options)
            .map((res: any) => this.convertResponse(res));
    }
    <%_ } _%>

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to <%= pageAngularName %>.
     */
    private convertItemFromServer(json: any): <%= pageAngularName %> {
        const entity: <%= pageAngularName %> = Object.assign(new <%= pageAngularName %>(), json);
        <%_ for (idx in fields) { _%>
            <%_ if (fields[idx].fieldType === 'LocalDate') { _%>
        entity.<%=fields[idx].fieldName%> = this.dateUtils
            .convertLocalDateFromServer(json.<%=fields[idx].fieldName%>);
            <%_ } _%>
            <%_ if (['Instant', 'ZonedDateTime'].includes(fields[idx].fieldType)) { _%>
        entity.<%=fields[idx].fieldName%> = this.dateUtils
            .convertDateTimeFromServer(json.<%=fields[idx].fieldName%>);
            <%_ } _%>
        <%_ } _%>
        return entity;
    }

    /**
     * Convert a <%= pageAngularName %> to a JSON which can be sent to the server.
     */
    private convert(<%= pageInstance %>: <%= pageAngularName %>): <%= pageAngularName %> {
        const copy: <%= pageAngularName %> = Object.assign({}, <%= pageInstance %>);
        <%_ for (idx in fields){ if (fields[idx].fieldType === 'LocalDate') { _%>
        copy.<%=fields[idx].fieldName%> = this.dateUtils
            .convertLocalDateToServer(<%= pageInstance %>.<%=fields[idx].fieldName%>);
        <%_ } if (['Instant', 'ZonedDateTime'].includes(fields[idx].fieldType)) { %>
        copy.<%=fields[idx].fieldName%> = this.dateUtils.toDate(<%= pageInstance %>.<%=fields[idx].fieldName%>);
        <%_ } } _%>
        return copy;
    }
}
