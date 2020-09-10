/**
 *
 */
package org.hybris.shanghai.utils;

import java.util.List;


/**
 * @author i314119
 *
 */
public class AnalyzerResult
{
	private boolean success;
	private String filename;
	private long totaltime;
	private long totalqeries;
	private List<AnalyzerResultLine> analyzerresultlines;

	public boolean isSuccess()
	{
		return success;
	}

	public void setSuccess(final boolean success)
	{
		this.success = success;
	}

	public long getTotaltime()
	{
		return totaltime;
	}

	public void setTotaltime(final long totaltime)
	{
		this.totaltime = totaltime;
	}

	public long getTotalqeries()
	{
		return totalqeries;
	}

	public void setTotalqeries(final long totalqeries)
	{
		this.totalqeries = totalqeries;
	}

	public List<AnalyzerResultLine> getAnalyzerresultlines()
	{
		return analyzerresultlines;
	}

	public void setAnalyzerresultlines(final List<AnalyzerResultLine> analyzerresultlines)
	{
		this.analyzerresultlines = analyzerresultlines;
	}

	public String getFilename()
	{
		return filename;
	}

	public void setFilename(final String filename)
	{
		this.filename = filename;
	}




}
