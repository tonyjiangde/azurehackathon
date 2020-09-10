/**
 *
 */
package org.hybris.shanghai.utils.threaddumpanalyzer;

/**
 * @author i314119
 *
 */
public class ThreadData
{
	private String name;
	private long prio;
	private long tid;
	private long nid;
	private String state;
	private String details;

	/**
	 * @return the name
	 */
	public String getName()
	{
		return name;
	}

	/**
	 * @param name
	 *           the name to set
	 */
	public void setName(final String name)
	{
		this.name = name;
	}

	/**
	 * @return the prio
	 */
	public long getPrio()
	{
		return prio;
	}

	/**
	 * @param prio
	 *           the prio to set
	 */
	public void setPrio(final long prio)
	{
		this.prio = prio;
	}

	/**
	 * @return the tid
	 */
	public long getTid()
	{
		return tid;
	}

	/**
	 * @param tid
	 *           the tid to set
	 */
	public void setTid(final long tid)
	{
		this.tid = tid;
	}

	/**
	 * @return the nid
	 */
	public long getNid()
	{
		return nid;
	}

	/**
	 * @param nid
	 *           the nid to set
	 */
	public void setNid(final long nid)
	{
		this.nid = nid;
	}

	/**
	 * @return the state
	 */
	public String getState()
	{
		return state;
	}

	/**
	 * @param state
	 *           the state to set
	 */
	public void setState(final String state)
	{
		this.state = state;
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
