/**
 *
 */
package org.hybris.shanghai.utils.threaddumpanalyzer;

import java.util.ArrayList;


/**
 * @author i314119
 *
 */
public class DeadLock
{

	private ArrayList<String> lockchain;
	private ArrayList<Thread> threadchain;


	public boolean equals(final DeadLock arg0)
	{
		final ArrayList<Thread> tmp = new ArrayList<Thread>();
		tmp.addAll(arg0.getThreadchain());
		if (threadchain.size() != tmp.size())
		{
			return false;
		}
		else if (threadchain.size() < 2)
		{
			return false;

		}
		else
		{
			boolean found = false;
			for (int i = 0; i < threadchain.size(); i++)
			{

				found = false;
				final Thread thread = threadchain.get(i);
				for (int j = 0; j < tmp.size(); j++)
				{
					if (tmp.get(j).equals(thread))
					{
						found = true;
						break;
					}
				}
				if (!found)
				{
					return false;
				}
			}

			for (int i = 0; i < tmp.size(); i++)
			{

				found = false;
				final Thread thread = tmp.get(i);
				for (int j = 0; j < threadchain.size(); j++)
				{
					if (threadchain.get(j).equals(thread))
					{
						found = true;
						break;
					}
				}
				if (!found)
				{
					return false;
				}
			}

		}
		/*
		 * else if (threadchain.size() == 3) { boolean found = false; for (int i = 1; i < threadchain.size(); i++) {
		 *
		 * found = false; final Thread thread = threadchain.get(i); System.out.println("checking:!!!" + thread.getName());
		 * for (int j = 0; j < tmp.size(); j++) { System.out.println( "comparing:!!!" + thread.getName() + "|" +
		 * tmp.get(j).getName() + "|" + (tmp.get(j).equals(thread))); if (tmp.get(j).equals(thread)) { tmp.remove(j);
		 * found = true; break; } } if (!found) { return false; } } } else { boolean found = false;
		 *
		 * for (int i = 0; i < threadchain.size(); i++) {
		 *
		 * found = false; final Thread thread = threadchain.get(i); System.out.println("checking:!!!" + thread.getName());
		 * for (int j = 0; j < tmp.size(); j++) { System.out.println( "comparing:!!!" + thread.getName() + "|" +
		 * tmp.get(j).getName() + "|" + (tmp.get(j).equals(thread))); if (tmp.get(j).equals(thread)) { tmp.remove(j);
		 * found = true; break; } } if (!found) { return false; } } }
		 */


		return true;
	}

	public boolean isValid()
	{
		for (int i = (threadchain.size() - 1); i >= 0; i--)
		{
			if (threadchain.get(i).getState() != Thread.STATE_BLOCKED)
			{
				return false;
			}
			if (i != 0)
			{
				final String lock = lockchain.get(i - 1);
				if (!threadchain.get(i).getWaitingForLocks().containsKey(lock))
				{
					return false;
				}
				else if (!threadchain.get(i - 1).getHoldingLocks().containsKey(lock))
				{
					return false;
				}
			}
			else
			{
				/*
				 * final String lock = lockchain.get(i); if (!threadchain.get(i).getWaitingForLocks().containsKey(lock)) {
				 * return false; } else { boolean loop = false; for (int j = 0; j < threadchain.size() - 1; j++) { if
				 * (threadchain.get(i).getHoldingLocks().containsKey(lock)) { loop = true; } } return !loop; }
				 */
				boolean loop = false;
				for (int j = 1; j < threadchain.size(); j++)
				{
					if (threadchain.get(i).equals(threadchain.get(j)))
					{
						loop = true;
					}
				}
				return loop;
			}

		}
		return true;
	}

	/**
	 * @return the lockchain
	 */
	public ArrayList<String> getLockchain()
	{
		return lockchain;
	}

	/**
	 * @param lockchain
	 *           the lockchain to set
	 */
	public void setLockchain(final ArrayList<String> lockchain)
	{
		this.lockchain = lockchain;
	}

	/**
	 * @return the threadchain
	 */
	public ArrayList<Thread> getThreadchain()
	{
		return threadchain;
	}

	/**
	 * @param threadchain
	 *           the threadchain to set
	 */
	public void setThreadchain(final ArrayList<Thread> threadchain)
	{
		this.threadchain = threadchain;
	}

}

