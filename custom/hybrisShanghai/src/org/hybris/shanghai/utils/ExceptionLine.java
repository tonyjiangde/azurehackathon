/**
 *
 */
package org.hybris.shanghai.utils;

/**
 * @author i314119
 *
 */
public class ExceptionLine
{
	private String timestamp;
	private long time;
	private String details;

	/**
	 * @return the timestamp
	 */
	public String getTimestamp()
	{
		return timestamp;
	}

	/**
	 * @param timestamp
	 *           the timestamp to set
	 */
	public void setTimestamp(final String timestamp)
	{
		this.timestamp = timestamp;
	}

	/**
	 * @return the time
	 */
	public long getTime()
	{
		return time;
	}

	/**
	 * @param time
	 *           the time to set
	 */
	public void setTime(final long time)
	{
		this.time = time;
	}

	/**
	 * @return the details
	 */
	public String getDetails()
	{
		return details;
	}

	/**
	 * @param details
	 *           the details to set
	 */
	public void setDetails(final String details)
	{
		this.details = details;
	}

}
