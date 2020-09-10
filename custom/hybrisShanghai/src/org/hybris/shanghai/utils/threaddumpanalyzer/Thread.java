/**
 *
 */
package org.hybris.shanghai.utils.threaddumpanalyzer;

/**
 * @author i314119
 *
 */
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;



public class Thread
{
	private String details;
	private String name;
	private String prio;
	private String tid;
	private String nid;
	private String stats_cpu;
	private String stats_blk;
	private String stats_wait;
	private Lockedsynchronizers lockedsynchronizers;
	private HashMap<String, String> waitingForLocks = new HashMap<String, String>();
	private HashMap<String, String> holdingLocks = new HashMap<String, String>();
	private HashMap<String, String> sleepingOnLocks = new HashMap<String, String>();
	private int state;
	private int oldstate = -1;
	private List<String> methods = new ArrayList<String>();
	public static final int STATE_RUNNABLE = 0;
	public static final int STATE_WAITING = 1;
	public static final int STATE_TIMED_WAITING = 2;
	public static final int STATE_BLOCKED = 3;
	public static final int STATE_IOWAIT = 4;
	public static final int STATE_UNKNOWN = 5;

	public Thread()
	{
	}

	public String getName()
	{
		return this.name;
	}

	public void setName(final String name)
	{
		this.name = name;
	}

	public int getState()
	{
		return this.state;
	}

	public void setState(final int state)
	{
		this.state = state;
	}

	public void setState(final String sState)
	{
		this.state = getState(sState);
	}

	public List<String> getMethods()
	{
		return this.methods;
	}

	public void setMethods(final List<String> methods)
	{
		this.methods = methods;
	}

	public static int getState(final String sState)
	{
		if (sState.equals("RUNNABLE"))
		{
			return 0;
		}
		if (sState.equals("WAITING"))
		{
			return 1;
		}
		if (sState.equals("TIMED_WAITING"))
		{
			return 2;
		}
		if (sState.equals("BLOCKED"))
		{
			return 3;
		}
		if (!sState.equals("IOWAIT"))
		{
			return 5;
		}
		return 4;
	}

	public boolean isValid()
	{
		if (this.methods.isEmpty())
		{
			return false;
		}
		return true;
	}

	public void addMethod(final String method)
	{
		this.methods.add(method);
	}

	public String getPrio()
	{
		return prio;
	}

	public void setPrio(final String prio)
	{
		this.prio = prio;
	}

	public String getTid()
	{
		return tid;
	}

	public void setTid(final String tid)
	{
		this.tid = tid;
	}

	public String getNid()
	{
		return nid;
	}

	public void setNid(final String nid)
	{
		this.nid = nid;
	}

	public String getStats_cpu()
	{
		return stats_cpu;
	}

	public void setStats_cpu(final String stats_cpu)
	{
		this.stats_cpu = stats_cpu;
	}

	public String getStats_blk()
	{
		return stats_blk;
	}

	public void setStats_blk(final String stats_blk)
	{
		this.stats_blk = stats_blk;
	}

	public String getStats_wait()
	{
		return stats_wait;
	}

	public void setStats_wait(final String stats_wait)
	{
		this.stats_wait = stats_wait;
	}

	public Lockedsynchronizers getLockedsynchronizers()
	{
		return lockedsynchronizers;
	}

	public void setLockedsynchronizers(final Lockedsynchronizers lockedsynchronizers)
	{
		this.lockedsynchronizers = lockedsynchronizers;
	}



	@Override
	public String toString()
	{
		final ObjectMapper mapper = new ObjectMapper();
		try
		{
			return mapper.writeValueAsString(this);
		}
		catch (final JsonGenerationException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}
		catch (final JsonMappingException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}
		catch (final IOException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}
	}

	public HashMap<String, String> getWaitingForLocks()
	{
		return waitingForLocks;
	}

	public void setWaitingForLocks(final HashMap<String, String> waitingForLocks)
	{
		this.waitingForLocks = waitingForLocks;
	}



	public HashMap<String, String> getHoldingLocks()
	{
		return holdingLocks;
	}

	public void setHoldingLocks(final HashMap<String, String> holdingLocks)
	{
		this.holdingLocks = holdingLocks;
	}

	public String getDetails()
	{
		return details;
	}

	public void setDetails(final String details)
	{
		this.details = details;
	}

	public String getStateString(final int state)
	{
		if (state == 0)
		{
			return "RUNNABLE";
		}
		if (state == 1)
		{
			return "WAITING";
		}
		if (state == 2)
		{
			return "TIMED_WAITING";
		}
		if (state == 3)
		{
			return "BLOCKED";
		}
		if (state == 4)
		{
			return getStateString(this.getOldstate());
		}
		else
		{
			return "UNKNOW";
		}

	}

	public String getStateString()
	{
		return this.getStateString(this.state);
	}

	public int getOldstate()
	{
		return oldstate;
	}

	public void setOldstate(final int oldstate)
	{
		this.oldstate = oldstate;
	}

	/**
	 * @return the sleepingOnLocks
	 */
	public HashMap<String, String> getSleepingOnLocks()
	{
		return sleepingOnLocks;
	}

	/**
	 * @param sleepingOnLocks
	 *           the sleepingOnLocks to set
	 */
	public void setSleepingOnLocks(final HashMap<String, String> sleepingOnLocks)
	{
		this.sleepingOnLocks = sleepingOnLocks;
	}


}