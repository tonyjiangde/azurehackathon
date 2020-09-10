/**
 *
 */
package org.hybris.shanghai.utils;

/**
 * @author i314119
 *
 */
public class AnalyzerResultLine implements Comparable
{
	private long count;
	private double percentcount;
	private long totaltime;
	private double percenttime;
	private long average;
	private long standarddeviation;
	private String query;
	private long min;
	private long max;
	private String exceptions;

	/**
	 * @return the exceptions
	 */
	public String getExceptions()
	{
		return exceptions;
	}

	/**
	 * @param exceptions
	 *           the exceptions to set
	 */
	public void setExceptions(final String exceptions)
	{
		this.exceptions = exceptions;
	}

	/**
	 * @return the min
	 */
	public long getMin()
	{
		return min;
	}

	/**
	 * @param min
	 *           the min to set
	 */
	public void setMin(final long min)
	{
		this.min = min;
	}

	/**
	 * @return the max
	 */
	public long getMax()
	{
		return max;
	}

	/**
	 * @param max
	 *           the max to set
	 */
	public void setMax(final long max)
	{
		this.max = max;
	}



	public long getCount()
	{
		return count;
	}

	public void setCount(final long count)
	{
		this.count = count;
	}

	public double getPercentcount()
	{
		return percentcount;
	}

	public void setPercentcount(final double percentcount)
	{
		this.percentcount = percentcount;
	}

	public long getTotaltime()
	{
		return totaltime;
	}

	public void setTotaltime(final long totaltime)
	{
		this.totaltime = totaltime;
	}

	public double getPercenttime()
	{
		return percenttime;
	}

	public void setPercenttime(final double percenttime)
	{
		this.percenttime = percenttime;
	}

	public long getAverage()
	{
		return average;
	}

	public void setAverage(final long average)
	{
		this.average = average;
	}

	public long getStandarddeviation()
	{
		return standarddeviation;
	}

	public void setStandarddeviation(final long standarddeviation)
	{
		this.standarddeviation = standarddeviation;
	}

	public String getQuery()
	{
		return query;
	}

	public void setQuery(final String query)
	{
		this.query = query;
	}

	/*
	 * (non-Javadoc)
	 *
	 * @see java.lang.Comparable#compareTo(java.lang.Object)
	 */
	@Override
	public int compareTo(final Object o)
	{
		final AnalyzerResultLine arl = (AnalyzerResultLine) o;

		return this.getPercenttime() > arl.getPercenttime() ? -1 : (this.getPercenttime() == arl.getPercenttime()) ? 0 : 1;
	}

}
