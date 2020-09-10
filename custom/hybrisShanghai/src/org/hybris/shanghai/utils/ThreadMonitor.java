/**
 *
 */
package org.hybris.shanghai.utils;

/**
 * @author i314119
 *
 */
import java.io.IOException;
import java.lang.management.LockInfo;
import java.lang.management.ManagementFactory;
import java.lang.management.MonitorInfo;
import java.lang.management.RuntimeMXBean;
import java.lang.management.ThreadInfo;
import java.lang.management.ThreadMXBean;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Properties;



public class ThreadMonitor
{
	private final ThreadMXBean tmbean;
	private final RuntimeMXBean runbean;
	private static String INDENT = "\t";
	private final String findDeadlocksMethodName = "findDeadlockedThreads";
	private final boolean canDumpLocks = true;


	private static final SimpleDateFormat defaultFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

	/**
	 * Constructs a ThreadMonitor object to get thread information in the local JVM.
	 */
	public ThreadMonitor()
	{
		this.tmbean = ManagementFactory.getThreadMXBean();
		this.runbean = ManagementFactory.getRuntimeMXBean();
	}

	/**
	 * Prints the thread dump information to System.out.
	 *
	 * @return the thread dump information.
	 */
	public String threadDump()
	{
		if (canDumpLocks)
		{
			if (tmbean.isObjectMonitorUsageSupported() && tmbean.isSynchronizerUsageSupported())
			{
				return dumpThreadInfoWithLocks();
			}
		}
		return dumpThreadInfo();
	}

	private String dumpThreadInfo()
	{
		final String date = createDateFormat().format(new Date(System.currentTimeMillis()));
		final StringBuilder threadDump = new StringBuilder(date + "\n");
		final Properties prop = new Properties();
		prop.putAll(runbean.getSystemProperties());
		threadDump.append("Full thread dump " + prop.getProperty("java.vm.name") + " (" + prop.getProperty("java.vm.version") + " "
				+ prop.getProperty("java.vm.info") + "):\n");
		final long[] tids = tmbean.getAllThreadIds();
		final ThreadInfo[] tinfos = tmbean.getThreadInfo(tids, Integer.MAX_VALUE);
		for (final ThreadInfo ti : tinfos)
		{
			threadDump.append("\n" + printThreadInfo(ti));
		}
		if (findDeadlock() != null)
		{
			threadDump.append(findDeadlock());
		}
		return threadDump.toString();
	}

	/**
	 *
	 */
	private SimpleDateFormat createDateFormat()
	{
		return defaultFormat;
	}

	/**
	 * Prints the thread dump information with locks info to System.out.
	 *
	 * @return the thread dump information with locks info.
	 * @throws IOException
	 */
	private String dumpThreadInfoWithLocks()
	{
		final String date = createDateFormat().format(new Date(System.currentTimeMillis()));
		final StringBuilder threadDump = new StringBuilder("\n" + date + "\n\n");
		final Properties prop = new Properties();
		prop.putAll(runbean.getSystemProperties());
		threadDump.append("Full thread dump " + prop.getProperty("java.vm.name") + " (" + prop.getProperty("java.vm.version") + " "
				+ prop.getProperty("java.vm.info") + "):\n");
		final ThreadInfo[] tinfos = tmbean.dumpAllThreads(true, true);
		for (final ThreadInfo ti : tinfos)
		{
			threadDump.append("\n" + printThreadInfo(ti));
			final LockInfo[] syncs = ti.getLockedSynchronizers();
			threadDump.append(printLockInfo(syncs));
		}
		if (findDeadlock() != null)
		{
			threadDump.append(findDeadlock());
		}
		return threadDump.toString();

	}


	private String printThreadInfo(final ThreadInfo ti)
	{
		// print stack trace with locks
		final StackTraceElement[] stacktrace = ti.getStackTrace();
		final MonitorInfo[] monitors = ti.getLockedMonitors();
		final currentThreadInfo result = new currentThreadInfo(ti);
		final StringBuilder threadOutput = new StringBuilder(result.getThreadName());
		threadOutput.append(result.getThreadStateDesc());

		//Stats!
		threadOutput.append(result.getThreadStats());

		for (int i = 0; i < stacktrace.length; i++)
		{
			final StackTraceElement ste = stacktrace[i];
			if (i == 0)
			{
				threadOutput.append("\n java.lang.Thread.State: " + result.getThreadState());
				threadOutput.append("\n" + INDENT + "at " + ste.toString());
				if (ste.toString().contains("java.lang.Object.wait(Native Method)") && result.getLockName() != null)
				{
					threadOutput.append("\n" + INDENT + "- waiting on " + result.getLockName());
				}
				if (ste.toString().contains("sun.misc.Unsafe.park(Native Method)") && result.getLockName() != null)
				{
					threadOutput.append("\n" + INDENT + "- parking to wait for " + result.getLockName());
				}
				if (result.getThreadStateDesc().contains("BLOCKED") && result.getLockName() != null)
				{
					threadOutput.append("\n" + INDENT + "- waiting to lock " + result.getLockName());
				}
			}
			else
			{
				threadOutput.append("\n" + INDENT + "at " + ste.toString());
			}
			for (final MonitorInfo mi : monitors)
			{
				if (mi.getLockedStackDepth() == i)
				{
					threadOutput.append("\n" + INDENT + " - locked " + mi);
				}
			}
		}
		threadOutput.append("\n");
		return threadOutput.toString();
	}

	private String printLockInfo(final LockInfo[] locks)
	{
		final StringBuilder lockOutput = new StringBuilder(INDENT + "Locked synchronizers: count = " + locks.length + "\n");
		for (final LockInfo li : locks)
		{
			lockOutput.append(INDENT + " - " + li + "\n");
		}
		//lockOutput.append("\n");
		return lockOutput.toString();
	}

	/**
	 * Checks if any threads are deadlocked. If any, print the thread dump information.
	 */
	public String findDeadlock()
	{
		final StringBuilder deadlock = new StringBuilder();
		long[] tids;
		if (findDeadlocksMethodName.equals("findDeadlockedThreads") && tmbean.isSynchronizerUsageSupported())
		{
			tids = tmbean.findDeadlockedThreads();
			if (tids == null)
			{
				return null;
			}
			deadlock.append("Deadlock found :-");
			final ThreadInfo[] infos = tmbean.getThreadInfo(tids, true, true);
			for (final ThreadInfo ti : infos)
			{
				deadlock.append(printThreadInfo(ti));
				deadlock.append(ti.getLockedSynchronizers());
				deadlock.append("\n");
			}
			return deadlock.toString();
		}
		else
		{
			tids = tmbean.findMonitorDeadlockedThreads();
			if (tids == null)
			{
				return null;
			}
			final ThreadInfo[] infos = tmbean.getThreadInfo(tids, Integer.MAX_VALUE);
			for (final ThreadInfo ti : infos)
			{
				// print thread information
				deadlock.append(printThreadInfo(ti));
			}
			return deadlock.toString();
		}
	}


	//
	//CTL Class added to create TDA compatible thread dump
	//
	final class currentThreadInfo
	{
		private final ThreadInfo ti;
		private final String INDENT = "\t";

		public currentThreadInfo(final ThreadInfo ti)
		{
			this.ti = ti;

		}

		public String getLockName()
		{
			if (ti.getLockName() != null)
			{
				return ti.getLockName();
			}
			else
			{
				return null;
			}
		}

		public String getThreadState()
		{
			return ti.getThreadState().toString();
		}

		public String getThreadStateDesc()
		{
			final StackTraceElement[] stacktrace = ti.getStackTrace();
			final StringBuilder threadStateDesc = new StringBuilder();
			if (stacktrace.length > 0)
			{
				final StackTraceElement topOfStack = stacktrace[0];
				if (topOfStack.toString().contains("java.lang.Object.wait(Native Method)"))
				{
					//threadStateDesc = new StringBuilder("in Object.wait()");
					threadStateDesc.append("in Object.wait()");
				}
				else
				{
					threadStateDesc.append(ti.getThreadState().toString());
				}
			}
			if (ti.isSuspended())
			{
				threadStateDesc.append(" (suspended)");
			}
			if (ti.isInNative())
			{
				threadStateDesc.append(" (JNI Native Code)");
			}
			if (ti.getLockOwnerName() != null)
			{
				threadStateDesc.append(INDENT + " owned by " + ti.getLockOwnerName() + " Id=" + ti.getLockOwnerId());
			}
			return threadStateDesc.toString();
		}

		public String getThreadName()
		{
			//String INDENT = "\t";
			final String tidHex = Integer.toHexString((int) ti.getThreadId());
			final StringBuilder sb = new StringBuilder(
					"\"" + ti.getThreadName() + "\"" + " prio=5 tid=0x" + ti.getThreadId() + " nid=0x" + tidHex + " ");
			return sb.toString();
		}

		public String getThreadStats()
		{
			final StringBuilder sb = new StringBuilder(" - stats:");
			if (tmbean.isThreadCpuTimeSupported())
			{
				final long cpu = (tmbean.getThreadCpuTime(ti.getThreadId()) / 1000000L);
				sb.append(" cpu=" + cpu);
			}
			sb.append(" blk=" + ti.getBlockedTime() + " wait=" + ti.getWaitedTime());
			return sb.toString();
		}
	}
}
