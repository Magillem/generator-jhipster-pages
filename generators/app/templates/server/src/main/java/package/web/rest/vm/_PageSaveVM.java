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
package <%=packageName%>.web.rest.vm;

<%_ if (fieldsContainInstant === true) { _%>
import java.time.Instant;
<%_ } if (fieldsContainLocalDate === true) { _%>
import java.time.LocalDate;
<%_ } if (fieldsContainZonedDateTime === true) { _%>
import java.time.ZonedDateTime;
<%_ } if (validation) { %>
import javax.validation.constraints.*;<% } %>

/**
 * View Model Class to Save page <%= pageName %>.
 */

public class <%= pageSaveClass %>{

<%_ if (pageType === 'form') {
    for (idx in fields) {
        if (typeof fields[idx].javadoc !== 'undefined') { _%>
<%-         formatAsFieldJavadoc(fields[idx].javadoc) %>
<%_     }
        let required = false;
        const fieldValidate = fields[idx].fieldValidate;
        const fieldValidateRules = fields[idx].fieldValidateRules;
        const fieldValidateRulesMaxlength = fields[idx].fieldValidateRulesMaxlength;
        const fieldType = fields[idx].fieldType;
        const fieldTypeBlobContent = fields[idx].fieldTypeBlobContent;
        const fieldName = fields[idx].fieldName;
        const fieldNameUnderscored = fields[idx].fieldNameUnderscored;
        const fieldNameAsDatabaseColumn = fields[idx].fieldNameAsDatabaseColumn;
        if (fieldValidate === true) {
            if (fieldValidateRules.indexOf('required') !== -1) {
                required = true;
            } _%>
<%-     include ../../../common/field_validators -%>
<%_     } _%>
<%_     if (typeof fields[idx].javadoc != 'undefined') { _%>
@ApiModelProperty(value = "<%- formatAsApiDescription(fields[idx].javadoc) %>"<% if (required) { %>, required = true<% } %>)
<%_     } _%>
<%_     if (fieldTypeBlobContent !== 'text') { _%>
    private <%= fieldType %> <%= fieldName %>;
<%_     } else { _%>
    private String <%= fieldName %>;
<%_     }
    }_%>


<%_ for (idx in fields) {
        const fieldType = fields[idx].fieldType;
        const fieldTypeBlobContent = fields[idx].fieldTypeBlobContent;
        const fieldName = fields[idx].fieldName;
        const fieldInJavaBeanMethod = fields[idx].fieldInJavaBeanMethod; _%>

<%_     if (fieldTypeBlobContent !== 'text') { _%>
    public <%= fieldType %> <% if (fieldType.toLowerCase() === 'boolean') { %>is<% } else { %>get<%_ } _%><%= fieldInJavaBeanMethod %>() {
<%_     } else { _%>
    public String get<%= fieldInJavaBeanMethod %>() {
<%_     } _%>
        return <%= fieldName %>;
    }

<%_         if (fieldTypeBlobContent !== 'text') { _%>
    public <%= pageSaveClass %> <%= fieldName %>(<%= fieldType %> <%= fieldName %>) {
<%_         } else { _%>
    public <%= pageSaveClass %> <%= fieldName %>(String <%= fieldName %>) {
<%_         } _%>
        this.<%= fieldName %> = <%= fieldName %>;
        return this;
    }

<%_     if (fieldTypeBlobContent !== 'text') { _%>
    public void set<%= fieldInJavaBeanMethod %>(<%= fieldType %> <%= fieldName %>) {
<%_     } else { _%>
    public void set<%= fieldInJavaBeanMethod %>(String <%= fieldName %>) {
<%_     } _%>
    this.<%= fieldName %> = <%= fieldName %>;
    }
<%_     if ((fieldType === 'byte[]' || fieldType === 'ByteBuffer') && fieldTypeBlobContent !== 'text') { _%>

    public String get<%= fieldInJavaBeanMethod %>ContentType() {
        return <%= fieldName %>ContentType;
    }

    public <%= pageSaveClass %> <%= fieldName %>ContentType(String <%= fieldName %>ContentType) {
        this.<%= fieldName %>ContentType = <%= fieldName %>ContentType;
        return this;
    }

    public void set<%= fieldInJavaBeanMethod %>ContentType(String <%= fieldName %>ContentType) {
        this.<%= fieldName %>ContentType = <%= fieldName %>ContentType;
    }
<%_     } _%>
<%_ } _%>

    @Override
    public String toString() {
        return "<%= pageSaveClass %>{" +
        <% for (idx in fields) {
        const fieldName = fields[idx].fieldName;
        const fieldType = fields[idx].fieldType;
        const fieldNameCapitalized = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) %>
        ", <%= fieldName %>='" + <% if (fieldType.toLowerCase() === 'boolean') { %>is<% } else { %>get<%_ } _%><%= fieldNameCapitalized %>() + "'" +<% } %>
        "}";
    }

<%_ } _%>

// jhipster-needle-page-add-getters-setters - Jhipster will add getters and setters here, do not remove

}
