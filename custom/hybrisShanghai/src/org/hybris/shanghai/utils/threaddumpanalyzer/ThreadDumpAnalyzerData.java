/**
 *
 */
package org.hybris.shanghai.utils.threaddumpanalyzer;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;


/**
 * @author i314119
 *
 */
public class ThreadDumpAnalyzerData
{
	private boolean success;
	private HashMap<Long, ThreadData> threaddatas;
	private List<Long> twfm;
	private List<Long> tsom;
	private List<Long> tlm;
	private String filename;
	private String logfile;
	private String timestamp;
	private int threadsize;
	private int twfmsize;
	private int tsomsize;
	private int tlmsize;
	private int monitors;
	private int mwlt;
	private int mhlt;
	private HashMap<String, ArrayList<HashSet<Long>>> allmonitorsState;
	private List<String> MonitorsLocked;
	private HashMap<String, String> allmonitors;
	private ArrayList<ArrayList<Long>> deadlocklist;

	/**
	 * @return the threaddatas
	 */
	public HashMap<Long, ThreadData> getThreaddatas()
	{
		return threaddatas;
	}

	/**
	 * @param threaddatas
	 *           the threaddatas to set
	 */
	public void setThreaddatas(final HashMap<Long, ThreadData> threaddatas)
	{
		this.threaddatas = threaddatas;
	}

	/**
	 * @return the twfm
	 */
	public List<Long> getTwfm()
	{
		return twfm;
	}

	/**
	 * @param twfm
	 *           the twfm to set
	 */
	public void setTwfm(final List<Long> twfm)
	{
		this.twfm = twfm;
	}

	/**
	 * @return the tsom
	 */
	public List<Long> getTsom()
	{
		return tsom;
	}

	/**
	 * @param tsom
	 *           the tsom to set
	 */
	public void setTsom(final List<Long> tsom)
	{
		this.tsom = tsom;
	}

	/**
	 * @return the tlm
	 */
	public List<Long> getTlm()
	{
		return tlm;
	}

	/**
	 * @param tlm
	 *           the tlm to set
	 */
	public void setTlm(final List<Long> tlm)
	{
		this.tlm = tlm;
	}

	public boolean isSuccess()
	{
		return success;
	}

	public void setSuccess(final boolean success)
	{
		this.success = success;
	}

	public String getFilename()
	{
		return filename;
	}

	public void setFilename(final String filename)
	{
		this.filename = filename;
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
	 * @return the threadsize
	 */
	public int getThreadsize()
	{
		return threadsize;
	}

	/**
	 * @param threadsize
	 *           the threadsize to set
	 */
	public void setThreadsize(final int threadsize)
	{
		this.threadsize = threadsize;
	}

	/**
	 * @return the twfmsize
	 */
	public int getTwfmsize()
	{
		return twfmsize;
	}

	/**
	 * @param twfmsize
	 *           the twfmsize to set
	 */
	public void setTwfmsize(final int twfmsize)
	{
		this.twfmsize = twfmsize;
	}

	/**
	 * @return the tsomsize
	 */
	public int getTsomsize()
	{
		return tsomsize;
	}

	/**
	 * @param tsomsize
	 *           the tsomsize to set
	 */
	public void setTsomsize(final int tsomsize)
	{
		this.tsomsize = tsomsize;
	}

	/**
	 * @return the tlmsize
	 */
	public int getTlmsize()
	{
		return tlmsize;
	}

	/**
	 * @param tlmsize
	 *           the tlmsize to set
	 */
	public void setTlmsize(final int tlmsize)
	{
		this.tlmsize = tlmsize;
	}

	/**
	 * @return the monitors
	 */
	public int getMonitors()
	{
		return monitors;
	}

	/**
	 * @param monitors
	 *           the monitors to set
	 */
	public void setMonitors(final int monitors)
	{
		this.monitors = monitors;
	}

	/**
	 * @return the mwlt
	 */
	public int getMwlt()
	{
		return mwlt;
	}

	/**
	 * @param mwlt
	 *           the mwlt to set
	 */
	public void setMwlt(final int mwlt)
	{
		this.mwlt = mwlt;
	}

	/**
	 * @return the mhlt
	 */
	public int getMhlt()
	{
		return mhlt;
	}

	/**
	 * @param mhlt
	 *           the mhlt to set
	 */
	public void setMhlt(final int mhlt)
	{
		this.mhlt = mhlt;
	}

	/**
	 * @return the allmonitorsState
	 */
	public HashMap<String, ArrayList<HashSet<Long>>> getAllmonitorsState()
	{
		return allmonitorsState;
	}

	/**
	 * @param allmonitorsState
	 *           the allmonitorsState to set
	 */
	public void setAllmonitorsState(final HashMap<String, ArrayList<HashSet<Long>>> allmonitorsState)
	{
		this.allmonitorsState = allmonitorsState;
	}

	/**
	 * @return the monitorsLocked
	 */
	public List<String> getMonitorsLocked()
	{
		return MonitorsLocked;
	}

	/**
	 * @param monitorsLocked
	 *           the monitorsLocked to set
	 */
	public void setMonitorsLocked(final List<String> monitorsLocked)
	{
		MonitorsLocked = monitorsLocked;
	}

	/**
	 * @return the allmonitors
	 */
	public HashMap<String, String> getAllmonitors()
	{
		return allmonitors;
	}

	/**
	 * @param allmonitors
	 *           the allmonitors to set
	 */
	public void setAllmonitors(final HashMap<String, String> allmonitors)
	{
		this.allmonitors = allmonitors;
	}

	/**
	 * @return the deadlocklist
	 */
	public ArrayList<ArrayList<Long>> getDeadlocklist()
	{
		return deadlocklist;
	}

	/**
	 * @param deadlocklist
	 *           the deadlocklist to set
	 */
	public void setDeadlocklist(final ArrayList<ArrayList<Long>> deadlocklist)
	{
		this.deadlocklist = deadlocklist;
	}


}
