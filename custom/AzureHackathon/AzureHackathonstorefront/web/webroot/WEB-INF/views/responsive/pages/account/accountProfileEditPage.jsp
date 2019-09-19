<%@ page trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="template" tagdir="/WEB-INF/tags/responsive/template"%>
<%@ taglib prefix="cms" uri="http://hybris.com/tld/cmstags"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="formElement" tagdir="/WEB-INF/tags/responsive/formElement" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<div class="account-section-header">
    <div class="row">
        <div class="container-lg col-md-6">
            <spring:theme code="text.account.profile.updatePersonalDetails"/>
        </div>
    </div>
</div>
<div class="row">
    <div class="container-lg col-md-6">
        <div class="account-section-content">
            <div class="account-section-form">
                <form:form action="update-profile" method="post" commandName="updateProfileForm" id="myupdateprofileform">

                    <formElement:formSelectBox idKey="profile.title" labelKey="profile.title" path="titleCode" mandatory="true" skipBlank="false" skipBlankMessageKey="form.select.empty" items="${titleData}" selectCSSClass="form-control"/>
                    <formElement:formInputBox idKey="profile.firstName" labelKey="profile.firstName" path="firstName" inputCSS="text" mandatory="true"/>
                    <formElement:formInputBox idKey="profile.lastName" labelKey="profile.lastName" path="lastName" inputCSS="text" mandatory="true"/>
					<form:hidden path="file" id="myimage" />
                    <div class="row">
                        <div class="col-sm-6 col-sm-push-6">
                            <div class="accountActions">
                                <ycommerce:testId code="personalDetails_savePersonalDetails_button">
                                    <button type="submit" class="btn btn-primary btn-block">
                                        <spring:theme code="text.account.profile.saveUpdates" text="Save Updates"/>
                                    </button>
                                </ycommerce:testId>
                            </div>
                        </div>
                        <div class="col-sm-6 col-sm-pull-6">
                            <div class="accountActions">
                                <ycommerce:testId code="personalDetails_cancelPersonalDetails_button">
                                    <button type="button" class="btn btn-default btn-block backToHome">
                                        <spring:theme code="text.account.profile.cancel" text="Cancel"/>
                                    </button>
                                </ycommerce:testId>
                            </div>
                        </div>
                    </div>
                </form:form>
				
                	
            </div>
            	<div class="row">
                        <video id="player" class="btn-block" controls autoplay></video>
                  </div>    
                <div class="row">
                		<button  id="capture" type="button" class="btn btn-default btn-block">
                                        Capture
                          </button>
                  </div>    
			
			<canvas id="canvas1" width=480 height=320></canvas>
			<canvas id="canvas2" width=480 height=320></canvas>
			<canvas id="canvas3" width=480 height=320></canvas>
				<script>
				 const player = document.getElementById('player');
				  const canvas1 = document.getElementById('canvas1');
				  const canvas2 = document.getElementById('canvas2');
				  const canvas3 = document.getElementById('canvas3');
				  const context1 = canvas1.getContext('2d');
				  const context2 = canvas2.getContext('2d');
				  const context3 = canvas3.getContext('2d');
				  const captureButton = document.getElementById('capture');
				
				  const constraints = {
				    video: true,
				  };
				
				  function ff() {
					  canvas1.toBlob(function(blob) {
						  var reader1 = new FileReader();
							reader1.readAsDataURL(blob);
							var base64data1;
							reader1.onloadend = (event) => {
							    // The contents of the BLOB are in reader.result:
							    base64data1 = reader1.result;                
						      	//console.log(base64data);
							    canvas2.toBlob(function(blob) {
								  var reader2 = new FileReader();
									reader2.readAsDataURL(blob);
									var base64data2;
									reader2.onloadend = (event) => {
									    // The contents of the BLOB are in reader.result:
									    base64data2 = reader2.result;                
									    canvas3.toBlob(function(blob) {
											  var reader3 = new FileReader();
												reader3.readAsDataURL(blob);
												var base64data3;
												reader3.onloadend = (event) => {
												    // The contents of the BLOB are in reader.result:
												    base64data3 = reader3.result;                
											      	var hidden_elem = document.getElementById("myimage");
											      	hidden_elem.value = base64data1+"_hackathon_"+base64data2+"_hackathon_"+base64data3;
											      	console.log(hidden_elem.value);
												    document.getElementById("myupdateprofileform").submit();
												}
										  
										      }, 'image/jpeg');
									    
									}
							  
							      }, 'image/jpeg');
								}
					  
					      }, 'image/jpeg');
					}
				  
				  captureButton.addEventListener('click', () => {
				    // Draw the video frame to the canvas.
				    context1.drawImage(player, 0, 0, canvas1.width, canvas1.height);
				    setTimeout("context2.drawImage(player, 0, 0, canvas2.width, canvas2.height)", 1500 );
				    setTimeout("context3.drawImage(player, 0, 0, canvas3.width, canvas3.height)", 3000 );
				    setTimeout(ff, 3500 );
				  });
				
				  // Attach the video stream to the video element and autoplay.
				  navigator.mediaDevices.getUserMedia(constraints)
				    .then((stream) => {
				      player.srcObject = stream;
				    });
				</script>
        </div>
    </div>
</div>
