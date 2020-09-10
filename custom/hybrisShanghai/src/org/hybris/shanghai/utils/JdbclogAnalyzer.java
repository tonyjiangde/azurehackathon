/**
 *
 */
package org.hybris.shanghai.utils;

/**
 * @author i314119
 *
 */
public interface JdbclogAnalyzer
{
	public void reset();

	public int getTotalTime();

	public int getTotalQueries();

	public void insertLine(String line) throws Exception;

	public AnalyzerResult finishAnalysis(int min);

	public AnalyzerResult finishAnalysis(int min, double bottom, int count);

	public boolean isTraceenabled();

	public void setTraceenabled(boolean traceenabled);
}
