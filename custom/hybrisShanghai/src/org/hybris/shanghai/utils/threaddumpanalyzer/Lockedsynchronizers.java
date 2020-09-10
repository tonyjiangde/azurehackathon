/**
 *
 */
package org.hybris.shanghai.utils.threaddumpanalyzer;

/**
 * @author i314119
 *
 */
import java.util.ArrayList;
import java.util.List;


public class Lockedsynchronizers
{
	private int count;
	private final List<Lock> synchronizers = new ArrayList<Lock>();

	public int getCount()
	{
		return count;
	}

	public void setCount(final int count)
	{
		this.count = count;
	}

	public void addSynchronizers(final Lock str)
	{
		synchronizers.add(str);
	}

	public List<Lock> getSynchronizers()
	{
		return this.synchronizers;
	}

	public void clearSynchronizers()
	{
		this.synchronizers.clear();
	}


}