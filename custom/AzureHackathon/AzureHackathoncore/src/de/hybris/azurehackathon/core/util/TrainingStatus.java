package de.hybris.azurehackathon.core.util;
import java.util.Date;

public class TrainingStatus {
	private String status;
	private Date createdDateTime;
	private Date lastActionDateTime;
	private String message;
	/**
	 * @return the status
	 */
	public String getStatus() {
		return status;
	}
	/**
	 * @param status the status to set
	 */
	public void setStatus(String status) {
		this.status = status;
	}
	/**
	 * @return the createdDateTime
	 */
	public Date getCreatedDateTime() {
		return createdDateTime;
	}
	/**
	 * @param createdDateTime the createdDateTime to set
	 */
	public void setCreatedDateTime(Date createdDateTime) {
		this.createdDateTime = createdDateTime;
	}
	/**
	 * @return the lastActionDateTime
	 */
	public Date getLastActionDateTime() {
		return lastActionDateTime;
	}
	/**
	 * @param lastActionDateTime the lastActionDateTime to set
	 */
	public void setLastActionDateTime(Date lastActionDateTime) {
		this.lastActionDateTime = lastActionDateTime;
	}
	/**
	 * @return the message
	 */
	public String getMessage() {
		return message;
	}
	/**
	 * @param message the message to set
	 */
	public void setMessage(String message) {
		this.message = message;
	}
}
