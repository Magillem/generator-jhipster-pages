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
<%_ } _%>

/**
 * View Model Class to Save page <%= pageName %>.
 */

public class <%= pageSaveClass %>{

<%_ for (idx in fields) {
    if (typeof fields[idx].javadoc !== 'undefined') { _%>
<%- formatAsFieldJavadoc(fields[idx].javadoc) %>
<%_ }
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
    if (fieldValidate === true && fieldValidateRules.indexOf('required') !== -1) {
    required = true;
    } _%>
<%- include ../../../common/field_validators -%>
<%_ } _%>
<%_ if (typeof fields[idx].javadoc != 'undefined') { _%>
@ApiModelProperty(value = "<%- formatAsApiDescription(fields[idx].javadoc) %>"<% if (required) { %>, required = true<% } %>)
<%_ } _%>
<%_ if (fieldTypeBlobContent !== 'text') { _%>
private <%= fieldType %> <%= fieldName %>;
<%_ } else { _%>
private String <%= fieldName %>;
<%_ }
}_%>
}
