package de.hybris.azurehackathon.core.util;

public class PersonResult {
	private String personId;
	private String[] persistedFaceIds;
	/**
	 * @return the personId
	 */
	public String getPersonId() {
		return personId;
	}
	/**
	 * @param personId the personId to set
	 */
	public void setPersonId(String personId) {
		this.personId = personId;
	}
	/**
	 * @return the persistedFaceIds
	 */
	public String[] getPersistedFaceIds() {
		return persistedFaceIds;
	}
	/**
	 * @param persistedFaceIds the persistedFaceIds to set
	 */
	public void setPersistedFaceIds(String[] persistedFaceIds) {
		this.persistedFaceIds = persistedFaceIds;
	}
	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}
	/**
	 * @param name the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}
	/**
	 * @return the userData
	 */
	public String getUserData() {
		return userData;
	}
	/**
	 * @param userData the userData to set
	 */
	public void setUserData(String userData) {
		this.userData = userData;
	}
	private String name;
	private String userData;

}
