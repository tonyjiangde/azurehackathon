/**
 *
 */
package org.hybris.shanghai.utils.threaddumpanalyzer;

/**
 * @author i314119
 *
 */
public interface ThreadDumpParser
{
	public ParsedThreads parseFile(String var1);

	public void init();
}