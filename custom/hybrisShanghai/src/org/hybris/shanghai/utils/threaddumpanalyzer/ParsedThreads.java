/**
 *
 */
package org.hybris.shanghai.utils.threaddumpanalyzer;

/**
 * @author i314119
 *
 */
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;


public class ParsedThreads
{
	private String timeStamp;
	private List<Thread> threads;
	private HashSet<Thread> threadsWFMonitors;
	private HashSet<Thread> threadsSOMonitors;
	private HashSet<Thread> threadsLockingMonitors;
	private HashMap<String, String> allmonitors;
	private HashMap<String, ArrayList<HashSet<Thread>>> allmonitorsState;
	private String logfile;

	/**
	 * @return the timeStamp
	 */
	public String getTimeStamp()
	{
		return timeStamp;
	}

	/**
	 * @param timeStamp
	 *           the timeStamp to set
	 */
	public void setTimeStamp(final String timeStamp)
	{
		this.timeStamp = timeStamp;
	}

	/**
	 * @return the threads
	 */
	public List<Thread> getThreads()
	{
		return threads;
	}

	/**
	 * @param threads
	 *           the threads to set
	 */
	public void setThreads(final List<Thread> threads)
	{
		this.threads = threads;
	}

	/**
	 * @return the threadsWFMonitors
	 */
	public HashSet<Thread> getThreadsWFMonitors()
	{
		return threadsWFMonitors;
	}

	/**
	 * @param threadsWFMonitors
	 *           the threadsWFMonitors to set
	 */
	public void setThreadsWFMonitors(final HashSet<Thread> threadsWFMonitors)
	{
		this.threadsWFMonitors = threadsWFMonitors;
	}

	/**
	 * @return the threadsSOMonitors
	 */
	public HashSet<Thread> getThreadsSOMonitors()
	{
		return threadsSOMonitors;
	}

	/**
	 * @param threadsSOMonitors
	 *           the threadsSOMonitors to set
	 */
	public void setThreadsSOMonitors(final HashSet<Thread> threadsSOMonitors)
	{
		this.threadsSOMonitors = threadsSOMonitors;
	}

	/**
	 * @return the threadsLockingMonitors
	 */
	public HashSet<Thread> getThreadsLockingMonitors()
	{
		return threadsLockingMonitors;
	}

	/**
	 * @param threadsLockingMonitors
	 *           the threadsLockingMonitors to set
	 */
	public void setThreadsLockingMonitors(final HashSet<Thread> threadsLockingMonitors)
	{
		this.threadsLockingMonitors = threadsLockingMonitors;
	}

	/**
	 * @return the monitorsWithoutLThreads
	 */
	public List<String> getMonitorsWithoutLThreads()
	{
		final ArrayList<String> result = new ArrayList<String>();
		for (final String lock : allmonitorsState.keySet())
		{
			if (allmonitorsState.get(lock).get(2).size() == 0)
			{
				result.add(lock);
			}
		}
		return result;
	}

	public List<String> getMonitorsLocked()
	{
		final ArrayList<String> result = new ArrayList<String>();
		for (final String lock : allmonitorsState.keySet())
		{
			if (allmonitorsState.get(lock).get(2).size() > 0)
			{
				result.add(lock);
			}
		}
		return result;
	}

	public HashMap<String, String> getAllmonitors()
	{
		return allmonitors;
	}

	public void setAllmonitors(final HashMap<String, String> allmonitors)
	{
		this.allmonitors = allmonitors;
	}

	public HashMap<String, ArrayList<HashSet<Thread>>> getForDeadlockDetection()
	{
		return allmonitorsState;
	}

	public void setForDeadlockDetection(final HashMap<String, ArrayList<HashSet<Thread>>> forDeadlockDetection)
	{
		allmonitorsState = forDeadlockDetection;
	}

	/**
	 * @return the logfile
	 */
	public String getLogfile()
	{
		return logfile;
	}

	/**
	 * @param logfile
	 *           the logfile to set
	 */
	public void setLogfile(final String logfile)
	{
		this.logfile = logfile;
	}

}
