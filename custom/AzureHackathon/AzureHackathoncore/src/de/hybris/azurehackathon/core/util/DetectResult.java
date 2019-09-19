package de.hybris.azurehackathon.core.util;
import java.util.List;

public class DetectResult {
 private String faceId;
 private FaceRectangle faceRectangle;



/**
 * @return the faceRectangle
 */
public FaceRectangle getFaceRectangle() {
	return faceRectangle;
}

/**
 * @param faceRectangle the faceRectangle to set
 */
public void setFaceRectangle(FaceRectangle faceRectangle) {
	this.faceRectangle = faceRectangle;
}

/**
 * @return the faceId
 */
public String getFaceId() {
	return faceId;
}

/**
 * @param faceId the faceId to set
 */
public void setFaceId(String faceId) {
	this.faceId = faceId;
}
 

}
