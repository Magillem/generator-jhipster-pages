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
package <%=packageName%>.web.rest;

import com.codahale.metrics.annotation.Timed;
import <%=packageName%>.web.rest.util.HeaderUtil;
<%_ for (idx in pages) {
    const page = pages[idx];_%>
<%_ if (page.saveToServer) { _%>
import <%=packageName%>.web.rest.vm.<%=page.pageSaveClass%>;
<%_ }
    if (page.loadFromServer) { _%>
import <%=packageName%>.web.rest.vm.<%=page.pageLoadClass%>;
<%_ }} _%>
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing <%= pageSetClass %>.
 */
@RestController
@RequestMapping("/api/<%= pageSetApiUrl %>")
public class <%= pageSetClass %>Resource {

    private final Logger log = LoggerFactory.getLogger(<%= pageSetClass %>Resource.class);

<%_ for (idx in pages) {
    const page = pages[idx];_%>
<%_ if (page.saveToServer) { _%>
    /**
     * POST  /<%= page.pageApiUrl %> : Save <%= page.pageName %>.
     *
     * @param <%= page.pageSaveInstance %> the <%= page.pageName %> to save
     * @return the ResponseEntity with status 201 (Created) and with body the new <%= page.pageSaveClass %>, or with status 400 (Bad Request) if the <%= page.pageName %> has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/<%= page.pageApiUrl %>")
    @Timed
    public ResponseEntity post<%= page.pageClass %>(@RequestBody <%= page.pageSaveClass %> <%= page.pageSaveInstance %>) throws URISyntaxException {
        log.debug("REST request to save <%= page.pageSaveClass %> : {}", <%= page.pageSaveInstance %>);
        //TODO please code the save of page data.
        return ResponseEntity.ok().build();
    }
<%_ }
    if (page.loadFromServer) { _%>
    /**
     * GET  /<%= page.pageApiUrl %> : get <%= page.pageName %>.
     *
     * @return the ResponseEntity with status 200 (OK) and with body the <%= page.pageLoadInstance %>, or with status 404 (Not Found)
     */
    @GetMapping("/<%= page.pageApiUrl %>")
    @Timed
    public ResponseEntity<<%= page.pageLoadClass %>> get<%= page.pageClass %>() {
        log.debug("REST request to get <%= page.pageLoadClass %>");
        <%= page.pageLoadClass %> <%= page.pageLoadInstance %> = null;
        //TODO please code the load referential data or any utils data to load the page.
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(<%= page.pageLoadInstance %>));
    }

<%_ }
} _%>

}
