/**
 *
 */
package org.hybris.shanghai.utils.threaddumpanalyzer;

/**
 * @author i314119
 *
 */
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;


public class HACThreadDumpParserImpl implements ThreadDumpParser
{
	private HashSet<Thread> threadsWFMonitors;
	private HashSet<Thread> threadsSOMonitors;
	private HashSet<Thread> threadsLockingMonitors;
	private HashMap<String, String> allmonitors;
	private HashMap<String, ArrayList<HashSet<Thread>>> allmonitorsState;
	private String timestamp = null;

	@Override
	public void init()
	{
		if (threadsWFMonitors != null)
		{
			threadsWFMonitors.clear();
		}
		else
		{
			threadsWFMonitors = new HashSet<Thread>();
		}
		if (threadsSOMonitors != null)
		{
			threadsSOMonitors.clear();
		}
		else
		{
			threadsSOMonitors = new HashSet<Thread>();
		}
		if (threadsLockingMonitors != null)
		{
			threadsLockingMonitors.clear();
		}
		else
		{
			threadsLockingMonitors = new HashSet<Thread>();
		}
		if (allmonitors != null)
		{
			allmonitors.clear();
		}
		else
		{
			allmonitors = new HashMap<String, String>();
		}
		if (allmonitorsState != null)
		{
			allmonitorsState.clear();
		}
		else
		{
			allmonitorsState = new HashMap<String, ArrayList<HashSet<Thread>>>();
		}
		timestamp = null;
	}

	@Override
	public ParsedThreads parseFile(final String filePath)
	{
		try
		{
			//final StringBuffer sb = new StringBuffer();
			final BufferedReader in = new BufferedReader(new FileReader(filePath));
			String line;
			while ((line = in.readLine()) != null && !line.contains("Full thread dump"))
			{
				//sb.append(line);
				//sb.append("\n");
				if (timestamp == null && !line.isEmpty())
				{
					timestamp = line.trim();
				}
			}
			//sb.append(line);
			//sb.append("\n");
			final ArrayList<Thread> threads = new ArrayList<Thread>();
			while ((line = in.readLine()) != null)
			{

				if (line.contains("tid="))
				{
					final Thread t = this.yParseThread(in, line);
					if (t == null)
					{
						continue;
					}
					//sb.append(t.getDetails());
					//sb.append("\n");
					if (t.isValid())
					{
						threads.add(t);
					}

				}

			}
			final ParsedThreads pt = new ParsedThreads();
			pt.setThreads(threads);
			pt.setAllmonitors(allmonitors);
			pt.setThreadsLockingMonitors(threadsLockingMonitors);
			pt.setThreadsSOMonitors(threadsSOMonitors);
			pt.setThreadsWFMonitors(threadsWFMonitors);
			pt.setTimeStamp(timestamp);
			pt.setForDeadlockDetection(allmonitorsState);
			//pt.setLogfile(sb.toString());
			in.close();
			return pt;

		}
		catch (final IOException e)
		{
			throw new RuntimeException(e);
		}


	}



	private Thread yParseThread(final BufferedReader in, String str) throws IOException
	{
		final Thread thread = new Thread();
		String[] tokens = str.split("[\"]");
		final String threadName = tokens[1];
		if (threadName == null || threadName.equals(""))
		{
			return null;
		}
		final StringBuffer sb = new StringBuffer();
		sb.append(str);
		thread.setName(threadName);
		tokens = str.split("\\s+");
		String[] tmp, tmp2 = null;
		for (int i = 1; i < tokens.length; i++)
		{
			if (tokens[i].trim().startsWith("prio"))
			{
				tmp = tokens[i].split("=");
				if (tmp.length == 2 && tmp[1] != null && !tmp[1].isEmpty())
				{
					thread.setPrio(tmp[1].trim());
				}
			}
			else if (tokens[i].trim().startsWith("tid"))
			{
				tmp = tokens[i].split("=");
				if (tmp.length == 2 && tmp[1] != null && !tmp[1].isEmpty())
				{
					thread.setTid(tmp[1].trim());
				}
			}
			else if (tokens[i].trim().startsWith("nid"))
			{
				tmp = tokens[i].split("=");
				if (tmp.length == 2 && tmp[1] != null && !tmp[1].isEmpty())
				{
					thread.setNid(tmp[1].trim());
				}
			}
		}
		tokens = str.split("stats:\\s+");
		if (tokens.length == 2)
		{
			tmp = tokens[1].split("\\s+");
			for (int i = 0; i < tmp.length; i++)
			{
				if (tmp[i].trim().startsWith("cpu"))
				{
					tmp2 = tmp[i].split("=");
					if (tmp2.length == 2 && tmp2[1] != null && !tmp2[1].isEmpty())
					{
						thread.setStats_cpu(tmp2[1].trim());
					}
				}
				else if (tmp[i].trim().startsWith("blk"))
				{
					tmp2 = tmp[i].split("=");
					if (tmp2.length == 2 && tmp2[1] != null && !tmp2[1].isEmpty())
					{
						thread.setStats_blk(tmp2[1].trim());
					}
				}
				else if (tmp[i].trim().startsWith("wait"))
				{
					tmp2 = tmp[i].split("=");
					if (tmp2.length == 2 && tmp2[1] != null && !tmp2[1].isEmpty())
					{
						thread.setStats_wait(tmp2[1].trim());
					}
				}
			}
		}
		str = in.readLine();
		if (str == null)
		{
			return thread;
		}
		tokens = str.trim().split("\\s*(:|\\(|\\))\\s*");
		if (tokens.length <= 1)
		{
			return thread;
		}
		sb.append("\n");
		sb.append(str);
		String threadState = tokens[1].trim();
		if (threadState == null || threadState.equals(""))
		{
			return thread;
		}
		try
		{
			threadState = java.lang.Thread.State.valueOf(threadState).toString();
		}
		catch (final Exception e)
		{
			return thread;
		}
		thread.setState(threadState);
		if (thread.getState() == Thread.STATE_BLOCKED)
		{
			this.threadsWFMonitors.add(thread);
		}
		else if (thread.getState() == Thread.STATE_WAITING || thread.getState() == Thread.STATE_TIMED_WAITING)
		{
			this.threadsSOMonitors.add(thread);
		}
		while ((str = in.readLine()) != null && (str.contains("at ") || str.contains("- ")))
		{
			sb.append("\n");
			sb.append(str);
			if (str.contains("at "))
			{
				final String method = str.substring("\tat ".length(), str.length());
				thread.addMethod(method);
			}
			if (str.contains("- ") && str.contains("@"))
			{
				if (str.contains("waiting on") || str.contains("parking to wait"))
				{
					tmp = str.substring(str.indexOf("- ") + 2).split("@");

					if (tmp.length == 2)
					{
						this.threadsSOMonitors.add(thread);
						final String[] tmp3 = tmp[0].split("\\s+");
						allmonitors.put(tmp[1].trim(), tmp3[tmp3.length - 1]);
						if (allmonitorsState.get(tmp[1]) != null)
						{
							allmonitorsState.get(tmp[1]).get(0).add(thread);
						}
						else
						{
							final ArrayList<HashSet<Thread>> al = new ArrayList<HashSet<Thread>>();
							al.add(new HashSet<Thread>());
							al.add(new HashSet<Thread>());
							al.add(new HashSet<Thread>());
							al.get(0).add(thread);
							allmonitorsState.put(tmp[1], al);
						}
						/*
						 * if (str.contains("parking to wait")) { if (ForDeadlockDetection.get(tmp[1]) != null) {
						 * ForDeadlockDetection.get(tmp[1]).get(1).add(thread); } else { final ArrayList<HashSet<Thread>> al =
						 * new ArrayList<HashSet<Thread>>(); al.add(new HashSet<Thread>()); al.add(new HashSet<Thread>());
						 * al.get(1).add(thread); ForDeadlockDetection.put(tmp[1], al); } } else { if
						 * (ForDeadlockDetection.get(tmp[1]) != null) { ForDeadlockDetection.get(tmp[1]).get(2).add(thread); }
						 * else { final ArrayList<HashSet<Thread>> al = new ArrayList<HashSet<Thread>>(); al.add(new
						 * HashSet<Thread>()); al.add(new HashSet<Thread>()); al.add(new HashSet<Thread>());
						 * al.get(2).add(thread); ForDeadlockDetection.put(tmp[1], al); } }
						 */
						//thread.getWaitingForLocks().put(tmp[1], tmp[0]);
						thread.getSleepingOnLocks().put(tmp[1], tmp[0]);
					}
				}
				if (str.contains("locked"))
				{
					tmp = str.substring(str.indexOf("- ") + 2).split("@");

					threadsLockingMonitors.add(thread);
					//System.out.println(tmp[0]+"!!!!"+tmp[1]);
					if (tmp.length == 2)
					{
						final String[] tmp3 = tmp[0].split("\\s+");
						allmonitors.put(tmp[1], tmp3[tmp3.length - 1]);
						if (allmonitorsState.get(tmp[1]) != null)
						{
							allmonitorsState.get(tmp[1]).get(2).add(thread);
						}
						else
						{
							final ArrayList<HashSet<Thread>> al = new ArrayList<HashSet<Thread>>();
							al.add(new HashSet<Thread>());
							al.add(new HashSet<Thread>());
							al.add(new HashSet<Thread>());
							al.get(2).add(thread);
							allmonitorsState.put(tmp[1], al);
						}
						//monitorsLocked.put(tmp[1], thread);
						thread.getHoldingLocks().put(tmp[1], tmp[0]);
					}
				}
				if (str.contains("waiting to lock"))
				{
					tmp = str.substring(str.indexOf("- ") + 2).split("@");
					if (tmp.length == 2)
					{
						final String[] tmp3 = tmp[0].split("\\s+");
						allmonitors.put(tmp[1], tmp3[tmp3.length - 1]);
						if (allmonitorsState.get(tmp[1]) != null)
						{
							allmonitorsState.get(tmp[1]).get(1).add(thread);
						}
						else
						{
							final ArrayList<HashSet<Thread>> al = new ArrayList<HashSet<Thread>>();
							al.add(new HashSet<Thread>());
							al.add(new HashSet<Thread>());
							al.add(new HashSet<Thread>());
							al.get(1).add(thread);
							allmonitorsState.put(tmp[1], al);
						}
						thread.getWaitingForLocks().put(tmp[1], tmp[0]);
					}
				}
			}
		}

		if (str.contains("Locked synchronizers"))
		{
			sb.append("\n");
			sb.append(str);
			tmp = str.split("\\s+=\\s+");
			if (tmp.length == 2)
			{
				final Lockedsynchronizers ls = new Lockedsynchronizers();
				ls.setCount(Integer.valueOf(tmp[1]));
				while ((str = in.readLine()) != null && str.contains("- "))
				{
					tmp = str.substring(str.indexOf("- ") + 2).split("@");
					if (tmp.length == 2)
					{
						final Lock lock = new Lock();
						lock.setId(tmp[1]);
						lock.setObject(tmp[0]);
						ls.addSynchronizers(lock);

					}
				}
				thread.setLockedsynchronizers(ls);

			}
		}
		thread.setDetails(sb.toString());
		return thread;
	}
}