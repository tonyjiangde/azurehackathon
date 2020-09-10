/**
 *
 */
package org.hybris.shanghai.facades.impl;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;

import org.hybris.shanghai.facades.ThreadDumpAnalyzerFacade;
import org.hybris.shanghai.services.ThreadDumpAnalyzerService;
import org.hybris.shanghai.utils.threaddumpanalyzer.DeadLock;
import org.hybris.shanghai.utils.threaddumpanalyzer.ParsedDumpFile;
import org.hybris.shanghai.utils.threaddumpanalyzer.ParsedThreads;
import org.hybris.shanghai.utils.threaddumpanalyzer.TDA.ThreadDumpSourceType;
import org.hybris.shanghai.utils.threaddumpanalyzer.Thread;
import org.hybris.shanghai.utils.threaddumpanalyzer.ThreadData;
import org.hybris.shanghai.utils.threaddumpanalyzer.ThreadDumpAnalyzerData;
import org.springframework.beans.factory.annotation.Required;


/**
 * @author i314119
 *
 */
public class DefaultThreadDumpAnalyzerFacade implements ThreadDumpAnalyzerFacade
{

	private ThreadDumpAnalyzerService threadDumpAnalyzerService;

	/*
	 * (non-Javadoc)
	 *
	 * @see org.hybris.shanghai.facades.ThreadDumpAnalyzerFacade#analyzeThreadDumpFile(java.lang.String,
	 * org.hybris.shanghai.utils.threaddumpanalyzer.TDA.ThreadDumpSourceType)
	 */
	@Override
	public ThreadDumpAnalyzerData analyzeThreadDumpFile(final String filePath, final ThreadDumpSourceType srcType)
	{
		try
		{
			final File file = new File(filePath);
			final String fname = file.getName();
			final BufferedReader in = new BufferedReader(new FileReader(file));
			final StringBuffer sb = new StringBuffer();
			String line;
			while ((line = in.readLine()) != null)
			{
				sb.append(line);
				sb.append("\n");
			}
			in.close();
			final ParsedDumpFile pdf = threadDumpAnalyzerService.parseFile(filePath, srcType);
			final ParsedThreads pt = pdf.getParsedThreads();
			final ThreadDumpAnalyzerData tdad = new ThreadDumpAnalyzerData();
			final HashMap<Long, ThreadData> threaddatas = new HashMap<Long, ThreadData>();
			//System.out.println(pt.getThreads().size() + "!!!!");
			for (final Thread thread : pt.getThreads())
			{
				final ThreadData td = new ThreadData();
				td.setName(thread.getName());
				td.setPrio(Long.valueOf(thread.getPrio()));
				final Long tid = Long.parseLong(thread.getTid().substring(2), 16);
				td.setTid(tid);
				td.setNid(Long.parseLong(thread.getNid().substring(2), 16));
				td.setState(thread.getStateString());
				td.setDetails(thread.getDetails());
				threaddatas.put(tid, td);
			}
			tdad.setLogfile(sb.toString());
			final ArrayList<Long> twfm = new ArrayList<Long>();
			for (final Thread thread : pt.getThreadsWFMonitors())
			{
				twfm.add(Long.parseLong(thread.getTid().substring(2), 16));
			}

			final ArrayList<Long> tsom = new ArrayList<Long>();
			for (final Thread thread : pt.getThreadsSOMonitors())
			{
				tsom.add(Long.parseLong(thread.getTid().substring(2), 16));
			}

			final ArrayList<Long> tlm = new ArrayList<Long>();
			for (final Thread thread : pt.getThreadsLockingMonitors())
			{
				tlm.add(Long.parseLong(thread.getTid().substring(2), 16));
			}
			tdad.setTimestamp(pt.getTimeStamp());
			tdad.setThreaddatas(threaddatas);
			tdad.setTwfm(twfm);
			tdad.setTsom(tsom);
			tdad.setTlm(tlm);
			tdad.setSuccess(true);
			tdad.setFilename(fname);
			tdad.setThreadsize(pt.getThreads().size());
			tdad.setTwfmsize(twfm.size());
			tdad.setTsomsize(tsom.size());
			tdad.setTlmsize(tlm.size());
			tdad.setMonitors(pt.getAllmonitors().size());
			tdad.setMhlt(pt.getMonitorsLocked().size());
			tdad.setMwlt(pt.getMonitorsWithoutLThreads().size());

			/*
			 * final HashMap<S, String> am = new HashMap<Long, String>(); for (final String key :
			 * pt.getAllmonitors().keySet()) { am.put(Long.parseLong(key.substring(2), 16), pt.getAllmonitors().get(key));
			 * }
			 */
			tdad.setAllmonitors(pt.getAllmonitors());


			//tdad.setAllmonitorsState(pt.getForDeadlockDetection());
			final HashMap<String, ArrayList<HashSet<Long>>> allmonitorsState = new HashMap<String, ArrayList<HashSet<Long>>>();
			for (final String monitor : pt.getForDeadlockDetection().keySet())
			{
				final ArrayList<HashSet<Long>> states = new ArrayList<HashSet<Long>>();

				for (int i = 0; i < pt.getForDeadlockDetection().get(monitor).size(); i++)
				{
					final HashSet<Long> hs = new HashSet<Long>();
					for (final Thread thread : pt.getForDeadlockDetection().get(monitor).get(i))
					{
						hs.add(Long.parseLong(thread.getTid().substring(2), 16));
					}
					states.add(i, hs);
				}
				allmonitorsState.put(monitor, states);
			}
			tdad.setAllmonitorsState(allmonitorsState);
			tdad.setMonitorsLocked(pt.getMonitorsLocked());
			final ArrayList<DeadLock> dll = pdf.getDeadlocks();
			final ArrayList<ArrayList<Long>> deadlocklistdata = new ArrayList<ArrayList<Long>>();
			if (dll != null)
			{
				for (final DeadLock dl : dll)
				{

					final ArrayList<Long> deadlockdata = new ArrayList<Long>();
					for (final Thread thread : dl.getThreadchain())
					{
						if (!deadlockdata.contains(Long.parseLong(thread.getTid().substring(2), 16)))
						{
							deadlockdata.add(Long.parseLong(thread.getTid().substring(2), 16));
						}
					}
					deadlocklistdata.add(deadlockdata);
				}
			}
			tdad.setDeadlocklist(deadlocklistdata);
			return tdad;
		}
		catch (final Exception e)
		{
			e.printStackTrace();
			return null;
		}

	}

	/**
	 * @return the threadDumpAnalyzerService
	 */
	public ThreadDumpAnalyzerService getThreadDumpAnalyzerService()
	{
		return threadDumpAnalyzerService;
	}

	/**
	 * @param threadDumpAnalyzerService
	 *           the threadDumpAnalyzerService to set
	 */
	@Required
	public void setThreadDumpAnalyzerService(final ThreadDumpAnalyzerService threadDumpAnalyzerService)
	{
		this.threadDumpAnalyzerService = threadDumpAnalyzerService;
	}

}
