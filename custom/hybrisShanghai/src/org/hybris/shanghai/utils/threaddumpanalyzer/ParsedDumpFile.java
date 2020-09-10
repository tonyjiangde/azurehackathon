/**
 *
 */
package org.hybris.shanghai.utils.threaddumpanalyzer;

import java.util.ArrayList;


/**
 * @author i314119
 *
 */
public class ParsedDumpFile
{
	private ParsedThreads parsedThreads;
	private ArrayList<DeadLock> deadlocks;

	/**
	 * @return the parsedThreads
	 */
	public ParsedThreads getParsedThreads()
	{
		return parsedThreads;
	}

	/**
	 * @param parsedThreads
	 *           the parsedThreads to set
	 */
	public void setParsedThreads(final ParsedThreads parsedThreads)
	{
		this.parsedThreads = parsedThreads;
	}

	/**
	 * @return the deadlocks
	 */
	public ArrayList<DeadLock> getDeadlocks()
	{
		return deadlocks;
	}

	/**
	 * @param deadlocks
	 *           the deadlocks to set
	 */
	public void setDeadlocks(final ArrayList<DeadLock> deadlocks)
	{
		this.deadlocks = deadlocks;
	}

}
