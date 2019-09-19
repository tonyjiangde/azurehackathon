/**
 *
 */
package de.hybris.azurehackathon.core.util;

/**
 * @author i314119
 *
 */
public class Candidates
{
	private String personId;
	private double confidence;

	/**
	 * @return the personId
	 */
	public String getPersonId()
	{
		return personId;
	}

	/**
	 * @param personId
	 *           the personId to set
	 */
	public void setPersonId(final String personId)
	{
		this.personId = personId;
	}

	/**
	 * @return the confidence
	 */
	public double getConfidence()
	{
		return confidence;
	}

	/**
	 * @param confidence
	 *           the confidence to set
	 */
	public void setConfidence(final double confidence)
	{
		this.confidence = confidence;
	}

}
