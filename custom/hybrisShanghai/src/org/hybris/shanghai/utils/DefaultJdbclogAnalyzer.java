/**
 *
 */
package org.hybris.shanghai.utils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import org.apache.commons.math3.stat.descriptive.SummaryStatistics;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;


/**
 * @author i314119
 *
 */
public class DefaultJdbclogAnalyzer implements JdbclogAnalyzer
{
	private final HashMap<Integer, ArrayList<String[]>> statistics;
	private final HashMap<Integer, String> queries;
	private boolean traceenabled;
	private int totaltime;
	private int totalqueries;
	private int count = 0;

	public DefaultJdbclogAnalyzer()
	{
		this.statistics = new HashMap<Integer, ArrayList<String[]>>();
		this.queries = new HashMap<Integer, String>();
		setTraceenabled(false);
		totaltime = 0;
		totalqueries = 0;
	}

	public DefaultJdbclogAnalyzer(final boolean traceenabled)
	{
		this.statistics = new HashMap<Integer, ArrayList<String[]>>();
		this.queries = new HashMap<Integer, String>();
		this.setTraceenabled(traceenabled);
		totaltime = 0;
		totalqueries = 0;
	}

	@Override
	public void reset()
	{
		this.statistics.clear();
		this.queries.clear();
		this.totaltime = 0;
		totalqueries = 0;
	}

	@Override
	public int getTotalTime()
	{
		return this.totaltime;
	}

	@Override
	public int getTotalQueries()
	{
		return this.totalqueries;
	}

	@Override
	public void insertLine(final String line) throws Exception
	{
		count++;
		final String[] temp = line.split("\\|");
		if (temp.length < 6)
		{
			System.out.println(count + "--------" + temp.length + "----------" + line);
			throw new Exception("Format of jdbc log file is not correct!");
		}
		if (temp[4].equals("statement"))
		{
			final String[] data = new String[3];
			data[0] = temp[2];
			//data[1]=temp[3];
			data[1] = temp[3].replace(" ms", "");
			data[2] = temp[6];
			final int key = temp[5].hashCode();
			//System.out.println();
			this.totaltime = this.totaltime + Integer.parseInt(data[1]);
			this.totalqueries++;
			if (!this.queries.containsKey(key))
			{
				final ArrayList<String[]> al = new ArrayList<String[]>();
				al.add(data);
				this.statistics.put(key, al);
				this.queries.put(key, temp[5]);
				//System.out.println(temp[5]);
			}
			else
			{
				this.statistics.get(key).add(data);
			}
			//this.statistics.
		}

	}

	@Override
	public AnalyzerResult finishAnalysis(final int min)
	{
		final AnalyzerResult result = new AnalyzerResult();
		final List<AnalyzerResultLine> al = new ArrayList<AnalyzerResultLine>();
		final Set<Integer> keys = this.statistics.keySet();
		final SummaryStatistics stats = new SummaryStatistics();
		for (final int k : keys)
		{
			stats.clear();
			final String[][] o = this.statistics.get(k).toArray(new String[0][0]);
			for (int i = 0; i < o.length; i++)
			{
				stats.addValue(Double.parseDouble(o[i][1]));

				//System.out.println(o[i][1]);
			}

			final long percenttime = Math.round((stats.getSum() * 100.0) / this.getTotalTime());
			if (percenttime >= min)
			{
				//final long count = stats.getN();
				//final long percentcount = Math.round(((stats.getN() * 100.0) / this.getTotalQueries()));
				//final long totaltime = (long) stats.getSum();
				//final long average = Math.round(stats.getMean());
				//final long standarddeviation = Math.round(stats.getStandardDeviation());
				final AnalyzerResultLine ar = new AnalyzerResultLine();
				ar.setCount(stats.getN());
				ar.setPercentcount(Math.round(((stats.getN() * 100.0) / this.getTotalQueries())));
				ar.setTotaltime((long) stats.getSum());
				ar.setAverage(Math.round(stats.getMean()));
				ar.setStandarddeviation(Math.round(stats.getStandardDeviation()));
				ar.setQuery(this.queries.get(k));
				ar.setPercenttime(percenttime);
				ar.setMax((long) stats.getMax());
				ar.setMin((long) stats.getMin());
				/*
				 * System.out.println("-------------"); System.out.println(count); System.out.println(percentcount);
				 * System.out.println(totaltime); System.out.println(percenttime); System.out.println(average);
				 * System.out.println(standarddeviation); System.out.println(this.queries.get(k));
				 * System.out.println("-------------");
				 */
				al.add(ar);
			}

		}
		result.setTotaltime(this.getTotalTime());
		result.setTotalqeries(this.getTotalQueries());
		Collections.sort(al);
		result.setAnalyzerresultlines(al);
		System.out.println(this.getTotalTime() + "|" + this.getTotalQueries());
		return result;
	}

	@Override
	public AnalyzerResult finishAnalysis(final int min, final double bottom, final int count)
	{
		final AnalyzerResult result = new AnalyzerResult();
		final List<AnalyzerResultLine> al = new ArrayList<AnalyzerResultLine>();
		final Set<Integer> keys = this.statistics.keySet();
		final SummaryStatistics stats = new SummaryStatistics();
		for (final int k : keys)
		{
			stats.clear();
			final String[][] o = this.statistics.get(k).toArray(new String[0][0]);
			final List<ExceptionLine> exceptions = new ArrayList<ExceptionLine>();
			//final String message;
			for (int i = 0; i < o.length; i++)
			{
				final double v = Double.parseDouble(o[i][1]);
				stats.addValue(v);
				if (v >= bottom)
				{
					final ExceptionLine ex = new ExceptionLine();
					ex.setTimestamp(o[i][0]);
					ex.setTime(Long.valueOf(o[i][1]));
					ex.setDetails(o[i][2]);
					//message = o[i][0].concat("|").concat(String.valueOf(v)).concat(" ms");
					exceptions.add(ex);
				}
				//System.out.println(o[i][1]);
			}
			final long percenttime = Math.round((stats.getSum() * 100.0) / this.getTotalTime());
			if (percenttime >= min && stats.getN() >= count)
			{
				//final long count = stats.getN();
				//final long percentcount = Math.round(((stats.getN() * 100.0) / this.getTotalQueries()));
				//final long totaltime = (long) stats.getSum();
				//final long average = Math.round(stats.getMean());
				//final long standarddeviation = Math.round(stats.getStandardDeviation());
				final AnalyzerResultLine ar = new AnalyzerResultLine();
				ar.setCount(stats.getN());
				ar.setPercentcount(Math.round(((stats.getN() * 100.0) / this.getTotalQueries())));
				ar.setTotaltime((long) stats.getSum());
				ar.setAverage(Math.round(stats.getMean()));
				ar.setStandarddeviation(Math.round(stats.getStandardDeviation()));
				ar.setQuery(this.queries.get(k));
				ar.setPercenttime(percenttime);
				ar.setMax((long) stats.getMax());
				ar.setMin((long) stats.getMin());
				final ObjectMapper mapper = new ObjectMapper();
				String json;
				try
				{
					json = mapper.writeValueAsString(exceptions);
					ar.setExceptions(json);
				}
				catch (final JsonGenerationException e)
				{
					// YTODO Auto-generated catch block
					e.printStackTrace();
				}
				catch (final JsonMappingException e)
				{
					// YTODO Auto-generated catch block
					e.printStackTrace();
				}
				catch (final IOException e)
				{
					// YTODO Auto-generated catch block
					e.printStackTrace();
				}

				/*
				 * System.out.println("-------------"); System.out.println(count); System.out.println(percentcount);
				 * System.out.println(totaltime); System.out.println(percenttime); System.out.println(average);
				 * System.out.println(standarddeviation); System.out.println(this.queries.get(k));
				 * System.out.println("-------------");
				 */
				al.add(ar);
			}

		}
		result.setTotaltime(this.getTotalTime());
		result.setTotalqeries(this.getTotalQueries());
		Collections.sort(al);
		result.setAnalyzerresultlines(al);
		//System.out.println(this.getTotalTime() + "|" + this.getTotalQueries());
		return result;
	}

	public boolean isTraceenabled()
	{
		return traceenabled;
	}

	public void setTraceenabled(final boolean traceenabled)
	{
		this.traceenabled = traceenabled;
	}
}
