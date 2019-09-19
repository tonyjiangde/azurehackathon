/**
 *
 */
package de.hybris.azurehackathon.core.util;

/**
 * @author i314119
 *
 */
public class IdentifyResult
{
	private String faceId;

	/**
	 * @return the faceId
	 */
	public String getFaceId()
	{
		return faceId;
	}

	/**
	 * @param faceId
	 *           the faceId to set
	 */
	public void setFaceId(final String faceId)
	{
		this.faceId = faceId;
	}

	/**
	 * @return the candidates
	 */
	public Candidates[] getCandidates()
	{
		return candidates;
	}

	/**
	 * @param candidates
	 *           the candidates to set
	 */
	public void setCandidates(final Candidates[] candidates)
	{
		this.candidates = candidates;
	}

	private Candidates[] candidates;
}
