# azurehackathon
Azure Hackathon 2019 Shanghai

[Azire cognitive services documentations](https://azure.microsoft.com/en-us/services/cognitive-services/)

**Environment Setup:**

Extentions are built on 1811.9

1. Use installer b2c_acc by running : *./install.sh -r b2c_acc*
2. Generate accelerator module by using the yacceleratorstorefront:  *ant modulegen -Dinput.module=accelerator -Dinput.name=AzureHackathon -Dinput.package=de.hybris.azurehackathon -Dinput.template=develop*
3. reinstall all ootb addons on the created storefront: *ant reinstall_addons -Dtarget.storefront=AzureHackathonstorefront*
4. rebuild the sysem: *ant clean all*
5. Initializ the system: *ant initialize*


**Integrate Azure Speech Recognition:**

1. go to [Azure Speech Recognition](https://azure.microsoft.com/en-us/services/cognitive-services/speaker-recognition/) to activate the azure service for your account and get the Endpoint and key.
2. Since we extends the OOTB SearchBoxComponent for additional speach recognition of search functionality on the storefront, we added following lines in the AzureHackathoncore-items.xml allowing for set apikey as well as region where your service located in the cms component:

        <itemtype code="AzureHackthonSearchBoxComponent" extends="SearchBoxComponent"
        autocreate="true" generate="true"
        jaloclass="de.hybris.azurehackathon.core.jalo.AzureHackthonSearchBoxComponent">
        <description>Represents the search box component using Azure Voice Recognition.</description>
        <attributes>
        <attribute qualifier="apikey" type="java.lang.String">
        <description>API_Key for consuming the Azure Service</description>
        <modifiers/>
        <persistence type="property"/>
        </attribute>
        <attribute qualifier="region" type="java.lang.String">
        <description>region of the Azure Service</description>
        <modifiers/>
        <persistence type="property"/>
        </attribute>
        </attributes>
        </itemtype>

3. The frontend code is implemented in *AzureHackathon/AzureHackathonstorefront/web/webroot/WEB-INF/views/responsive/cms/azurehackthonsearchboxcomponent.jsp* for new button and logic for calling the Speech Recognition service.
4. Create a AzureHackthonSearchBoxComponent in backoffice or via impex like:

        insert_update AzureHackthonSearchBoxComponent;&Item;apikey;catalogVersion(catalog(id),version)[unique=true,allownull=true];creationtime[forceWrite=true,dateformat=dd.MM.yyyy hh:mm:ss];displayProductImages[allownull=true];displayProducts[allownull=true];displaySuggestions[allownull=true];maxProducts[allownull=true];maxSuggestions[allownull=true];minCharactersBeforeRequest[allownull=true];modifiedtime[dateformat=dd.MM.yyyy hh:mm:ss];name;onlyOneRestrictionMustApply[allownull=true];owner(&Item)[forceWrite=true];region;uid[unique=true,allownull=true];visible[allownull=true];waitTimeBeforeRequest[allownull=true]
        ;Item1;xxxxxxxxxxxxx;electronicsContentCatalog:Online;05.09.2019 02:37:51;false;true;true;4;6;3;05.09.2019 03:46:23;Azurehackathon Search Box;false;;westus;AzureHackathonSearchBox;true;500

5. Go to the smartedit and replace the ootb SearchBoxComponent on the SearchBoxSlot  of homepage of electronics content catalog:online with the AzureHackthonSearchBoxComponent or via Impex:

        insert_update ElementsForSlot;&Item;creationtime[forceWrite=true,dateformat=dd.MM.yyyy hh:mm:ss];language(isocode)[unique=true];modifiedtime[dateformat=dd.MM.yyyy hh:mm:ss];owner(&Item)[forceWrite=true];qualifier;reverseSequenceNumber;sequenceNumber;source(catalogVersion(catalog(id),version),uid)[unique=true,allownull=true];target(catalogVersion(catalog(id),version),uid)[unique=true,allownull=true]
        ;Item589;05.09.2019 02:37:51;;05.09.2019 02:37:51;;ElementsForSlot;765,461,655;0;electronicsContentCatalog:Online:SearchBoxSlot;electronicsContentCatalog:Online:AzureHackathonSearchBox

6. To make reference to the required js lib on pages, add file at: AzureHackathon/AzureHackathonstorefront/web/webroot/_ui/responsive/common/js/microsoft.cognitiveservices.speech.sdk.bundle.js and add following line at AzureHackathon/AzureHackathonstorefront/web/webroot/WEB-INF/tags/responsive/template/javaScript.tag

        <script src="${commonResourcePathHtml}/js/microsoft.cognitiveservices.speech.sdk.bundle.js"></script>

7. Then you should see the Azure Speech Recognition integration on the storefront.



**Integrate Azure QnA Maker:**

1. go to [Azure QnA Maker](https://azure.microsoft.com/en-us/services/cognitive-services/qna-maker/) to ceate a QnA service and get the Service Endpoint and  EndpointKey.
2. Since we are going to also use speech recognition for QnA, we added following lines in the AzureHackathoncore-items.xml allowing for set apikey, region of speech recognition as well as endpoint, endpointkey of QnA maker where your service located in the cms component:

        <itemtype code="AzureHackthonFAQBotComponent" autocreate="true"
        generate="true" extends="SimpleCMSComponent"
        jaloclass="de.hybris.platform.acceleratorcms.jalo.components.AzureHackthonFAQBotComponent">
        <description>Represents the AzureHackthonFAQBotComponent component.</description>
        <attributes>
        <attribute qualifier="endpointKey" type="java.lang.String">
        <persistence type="property" />
        <modifiers/>
        <description>endpointKey for calling Azure FAQ Service</description>
        </attribute>
        <attribute qualifier="endpoint" type="java.lang.String">
        <persistence type="property" />
        <modifiers/>
        <description>Service Endpoint</description>
        </attribute>
        <attribute qualifier="apikey" type="java.lang.String">
        <description>API_Key for consuming the Azure Service</description>
        <modifiers/>
        <persistence type="property"/>
        </attribute>
        <attribute qualifier="region" type="java.lang.String">
        <description>region of the Azure Service</description>
        <modifiers/>
        <persistence type="property"/>
        </attribute>                
        </attributes>
        </itemtype>

3. The frontend code is implemented in *AzureHackathon/AzureHackathonstorefront/web/webroot/WEB-INF/views/responsive/cms/azurehackthonfaqbotcomponent.jsp* for displaying a chat bot on a page.
4. Create a AzureHackthonFAQBotComponent in backoffice or via impex like:

        insert_update AzureHackthonFAQBotComponent;&Item;apikey;catalogVersion(catalog(id),version)[unique=true,allownull=true];creationtime[forceWrite=true,dateformat=dd.MM.yyyy hh:mm:ss];displayProductImages;endpoint;endpointKey;modifiedtime[dateformat=dd.MM.yyyy hh:mm:ss];name;onlyOneRestrictionMustApply[allownull=true];owner(&Item)[allownull=true,forceWrite=true];region;uid[unique=true,allownull=true];visible[allownull=true]
        ;Item0;xxxxxxxxxxx;electronicsContentCatalog:Online;06.09.2019 05:44:28;false;https://azurehackation.azurewebsites.net/qnamaker/knowledgebases/xxxxxxxx/generateAnswer;xxxxxxxxxxxxxxxxx;07.09.2019 01:43:54;Azurehackthon FAQ Bot;true;;westus;Azurehackthon FAQ Bot;true
        
5. Create a "Azurehackathon FAQ" page in backoffice by using ootb "Content Page 1 Template"or via impex like:

        insert_update ContentPage;&Item;approvalStatus(code,itemtype(code))[allownull=true];catalogVersion(catalog(id),version)[unique=true,allownull=true];copyToCatalogsDisabled[allownull=true];creationtime[forceWrite=true,dateformat=dd.MM.yyyy hh:mm:ss];defaultPage[allownull=true];homepage[allownull=true];label;lockedBy(uid);masterTemplate(catalogVersion(catalog(id),version),uid)[allownull=true];modifiedtime[dateformat=dd.MM.yyyy hh:mm:ss];name;navigationNodeList(catalogVersion(catalog(id),version),uid);onlyOneRestrictionMustApply[allownull=true];originalPage(catalogVersion(catalog(id),version),uid);owner(&Item)[forceWrite=true];pageStatus(code,itemtype(code));previewImage(catalogVersion(catalog(id),version),code);uid[unique=true,allownull=true]
        ;Item186;approved:CmsApprovalStatus;electronicsContentCatalog:Online;false;06.09.2019 03:37:36;false;false;/azurehackahonfaq;;electronicsContentCatalog:Online:ContentPage1Template;06.09.2019 04:11:33;Azurehackathon FAQ Page;;true;;;active:CmsPageStatus;;Azurehackathon FAQ Page

6. Create a ContentSlot in backoffice or via impex like:

        insert_update ContentSlot;&Item;activeFrom[dateformat=dd.MM.yyyy hh:mm:ss];activeUntil[dateformat=dd.MM.yyyy hh:mm:ss];active[allownull=true];catalogVersion(catalog(id),version)[unique=true,allownull=true];creationtime[forceWrite=true,dateformat=dd.MM.yyyy hh:mm:ss];currentPosition;modifiedtime[dateformat=dd.MM.yyyy hh:mm:ss];name;originalSlot(catalogVersion(catalog(id),version),uid);owner(&Item)[allownull=true,forceWrite=true];uid[unique=true,allownull=true]
        ;Item680;;;true;electronicsContentCatalog:Online;06.09.2019 04:23:29;;06.09.2019 05:45:46;Azurehackathon FAQ Content Slot;;;Section2Bslot-AazurehackathonFAQ
        
7. Create a ContentSlotForPage in backoffice to link the created contentslot "Azurehackathon FAQ Content Slot" to position "Section2B" on Page  "Azurehackathon FAQ Page" or via impex.

        insert_update ContentSlotForPage;&Item;catalogVersion(catalog(id),version)[unique=true,allownull=true];contentSlot(catalogVersion(catalog(id),version),uid)[allownull=true];creationtime[forceWrite=true,dateformat=dd.MM.yyyy hh:mm:ss];modifiedtime[dateformat=dd.MM.yyyy hh:mm:ss];owner(&Item)[allownull=true,forceWrite=true];page(catalogVersion(catalog(id),version),uid)[allownull=true];position[allownull=true];uid[unique=true,allownull=true]
        ;Item0;electronicsContentCatalog:Online;electronicsContentCatalog:Online:Section2Bslot-AazurehackathonFAQ;06.09.2019 04:26:08;06.09.2019 04:26:08;;electronicsContentCatalog:Online:Azurehackathon FAQ Page;Section2B;00000334

8. Set the contentslot of AzureHackthonFAQBotComponent to created Section2Bslot-AazurehackathonFAQ, then you should see the Azure QnA maker integration on the storefront by visiting: /azurehackahonfaq

9. To enable a quick navigation to the page. We added a link to the page on shared page header at: AzureHackathon/AzureHackathonstorefront/web/webroot/WEB-INF/tags/responsive/common/header/header.tag

        <li>
        <c:if test="${empty hideHeaderLinks}">
        <ycommerce:testId code="header_faq_link">
        <div class="nav-location hidden-xs">
        <c:url value="/azurehackahonfaq" var="faqUrl"/>
        <a href="${fn:escapeXml(faqUrl)}" class="btn">
        <span class="glyphicon glyphicon-question-sign"></span>
        </a>
        </div>
        </ycommerce:testId>
        </c:if>
        </li>

10. To enable a quick navigation on the navigation bar. We create firstly a CMSLinkComponent in backoffice or via impex:

        insert_update CMSLinkComponent;&Item;catalogVersion(catalog(id),version)[unique=true,allownull=true];category(catalogVersion(catalog(id),version),code);categoryPOS;contentPage(catalogVersion(catalog(id),version),uid);contentPagePOS;creationtime[forceWrite=true,dateformat=dd.MM.yyyy hh:mm:ss];external[allownull=true];modifiedtime[dateformat=dd.MM.yyyy hh:mm:ss];name;onlyOneRestrictionMustApply[allownull=true];owner(&Item)[forceWrite=true];product(catalogVersion(catalog(id),version),code);productPOS;styleAttributes;target(code,itemtype(code))[allownull=true];uid[unique=true,allownull=true];url;visible[allownull=true]
        ;Item552;electronicsContentCatalog:Online;;;;;06.09.2019 03:51:47;false;06.09.2019 04:02:08;CMSLinkComponent;true;;;;;sameWindow:LinkTargets;Azurehackathon FAQ Link;/azurehackahonfaq;true

11. Secondly create a CMSNavigationNode "Azurehackathon FAQ" refering to the created CMSNavigationEntry "AzureCMSNavigationEntry" and having Parent "ElectronicsCategoryNavNode" in backoffice or via impex:

        insert_update CMSNavigationNode;&Item;catalogVersion(catalog(id),version)[unique=true,allownull=true];creationtime[forceWrite=true,dateformat=dd.MM.yyyy hh:mm:ss];modifiedtime[dateformat=dd.MM.yyyy hh:mm:ss];name;owner(&Item)[forceWrite=true];parent(catalogVersion(catalog(id),version),uid);parentPOS;uid[unique=true,allownull=true];visible[allownull=true]
        ;Item124;electronicsContentCatalog:Online;06.09.2019 03:47:43;06.09.2019 04:08:31;CMSNavigationNode;;electronicsContentCatalog:Online:ElectronicsCategoryNavNode;6;AzurehackathonFAQNode;true

12. Thirdly create a CMSNavigationEntry "AzureCMSNavigationEntry" wrapping the CMSLinkComponent and attach to CMSNavigationNode "Azurehackathon FAQ" in backoffice or via impex:

        insert_update CMSNavigationEntry;&Item;catalogVersion(catalog(id),version)[unique=true,allownull=true];creationtime[forceWrite=true,dateformat=dd.MM.yyyy hh:mm:ss];item(&Item)[allownull=true];modifiedtime[dateformat=dd.MM.yyyy hh:mm:ss];name;navigationNode(catalogVersion(catalog(id),version),uid);navigationNodePOS;owner(&Item)[allownull=true,forceWrite=true];uid[unique=true,allownull=true]
        ;Item1063;electronicsContentCatalog:Online;06.09.2019 04:07:12;-pk of the Azurehackathon FAQ Link item -;06.09.2019 04:08:31;AzureCMSNavigationEntry;electronicsContentCatalog:Online:AzurehackathonFAQNode;0;;Azurehackathon Navigation Entry

13. Then you should see navigation items on storefront linking to the FAQ page.



**Integrate Azure Ink Recognizer:**

1. Modified the OOTB: AzureHackathon/AzureHackathonstorefront/web/webroot/WEB-INF/views/responsive/pages/quickOrder/quickOrderPage.jsp to enable Azure Ink Recognizer integration.
2. Access to the service endpoint is added via properties:

        azurehackthon2019.inkrecognizer.key=xxxxxx
        azurehackthon2019.inkrecognizer.url=https://azurehackationinkrecognizer.cognitiveservices.azure.com/inkrecognizer/v1.0-preview/recognize
        
3. Add following lines in the QuickOrderPageController.java allowing for the injection of properties into the jsp page:

        model.addAttribute("inkrecognizerkey", Config.getString("azurehackthon2019.inkrecognizer.key", "xxxxxxxxxxx"));
        model.addAttribute("inkrecognizerurl", Config.getString("azurehackthon2019.inkrecognizer.url", "xxxxxxxxxxx"));


**Integrate Azure Speaker Recognition:**

1. VerificationProfile needs to be created for each customer at Azure Speaker Recognition Service, to minimize the effort of customization, modify AzureHackathon/AzureHackathonstorefront/web/webroot/WEB-INF/views/responsive/pages/account/accountChangePasswordPage.jsp add UI function for sending recorded voice captured in browser for enroll. At least three times enrollment is needed. The wave file will be encoded in BASE64 format and sent to server in a hidden input element of the updata password form. It has to be noted since authentication needs to happened on server side, so all calls to Speaker Verification API must also be implemented on Server side.
            
        <form:hidden path="file" id="myfile" />

2. To allow the data binding, updatePasswordForm.java need to be modified for the hidden voice recording:

        private String file;
        /**
         * @return the file
         */
        public String getFile()
        {
            return file;
        }

        /**
         * @param file
         *           the file to set
         */
        public void setFile(final String file)
        {
            this.file = file;
        }

3.  java client for calling Azure services are placed in de.hybris.azurehackathon.core.util e.g. SpeakerVerificationRestClient
4. Modify the AzureHackathon/AzureHackathonstorefront/web/src/de/hybris/azurehackathon/storefront/controllers/pages/AccountPageController.java, change the updatePassword() method for handling voice enrollment.
5. Once VerificationProfile is created, customer needs to login via voice, change the AzureHackathon/AzureHackathonstorefront/web/webroot/WEB-INF/tags/responsive/user/login.tag to submit voice as password.
6. Since accelorator uses Spring security for use authentiction, to minimize the customization, change the AzureHackathon/AzureHackathonstorefront/web/src/de/hybris/azurehackathon/storefront/security/AcceleratorAuthenticationProvider.java, if the entered password is voice then call Azure api for verification.
7. To correlate the customer with profile id, following attribute is added to user model:
        
        <attribute qualifier="vrprofileid" type="java.lang.String">
            <persistence type="property"/>
            <modifiers read="true" write="true" search="false" optional="true"/>
        </attribute>



**Integrate Azure Face Recognition:**

1. To use face to identify user, we created "customers" user group at azure face service, and for each customer, they can add faces and traing the algoritm . Modify the "PROFILE" page at AzureHackathon/AzureHackathonstorefront/web/webroot/WEB-INF/views/responsive/pages/account/accountProfileEditPage.jsp, Use video to capture three pictures and send to server.
2. API calls are implemented in AzureFaceAPIClient
3. Modify the AzureHackathon/AzureHackathonstorefront/web/src/de/hybris/azurehackathon/storefront/controllers/pages/AccountPageController.java, change the updateProfile() method for adding faces to customer.
4. change the AzureHackathon/AzureHackathonstorefront/web/webroot/WEB-INF/tags/responsive/user/login.tag to add login with images.
5. Since accelorator uses Spring security for use authentiction, to minimize the customization, change the AzureHackathon/AzureHackathonstorefront/web/src/de/hybris/azurehackathon/storefront/security/AcceleratorAuthenticationProvider.java, if the entered password is image then call Azure api for verification.
6. To correlate the customer with person id, following attribute is added to user model:

        <attribute qualifier="frpersonid" type="java.lang.String">
            <persistence type="property"/>
            <modifiers read="true" write="true" search="false" optional="true"/>
        </attribute>
