<%#
 Copyright 2013-2017 the original author or authors from the JHipster project.

 This file is part of the JHipster project, see https://jhipster.github.io/
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
<% if (authenticationType === 'uaa') { %>
    import <%=packageName%>.config.SecurityBeanOverrideConfiguration;
<% } %>
import <%=packageName%>.<%= mainClass %>;
import <%=packageName%>.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the <%= pageSetClass %>Resource REST controller.
 *
 * @see <%= pageSetClass %>Resource
 */
@RunWith(SpringRunner.class)
<%_ if (authenticationType === 'uaa' && applicationType !== 'uaa') { _%>
@SpringBootTest(classes = {<%= mainClass %>.class, SecurityBeanOverrideConfiguration.class})
<%_ } else { _%>
@SpringBootTest(classes = <%= mainClass %>.class)
<%_ } _%>
public class <%= pageSetClass %>ResourceIntTest {
<%_
    let oldSource = '';
    try {
        oldSource = this.fs.readFileSync(this.SERVER_TEST_SRC_DIR + packageFolder + '/web/rest/' + pageSetClass + 'ResourceIntTest.java', 'utf8');
    } catch (e) {}
_%>

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc rest<%= pageSetClass %>MockMvc;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final <%= pageSetClass %>Resource <%= pageSetInstance %>Resource = new <%= pageSetClass %>Resource();
        this.rest<%= pageSetClass %>MockMvc = MockMvcBuilders.standaloneSetup(<%= pageSetInstance %>Resource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setMessageConverters(jacksonMessageConverter).build();
    }


<%_ for (idx in pages){
    const page=pages[idx];_%>

<%_ if(page.saveToServer){_%>

    @Test
    public void post<%=page.pageClass%>()throws Exception{
    //TODO
    }

<%_}
    if(page.loadFromServer){_%>

    @Test
    public void get<%=page.pageClass%>()throws Exception{
    //TODO
    }
<%_}
}_%>
}
