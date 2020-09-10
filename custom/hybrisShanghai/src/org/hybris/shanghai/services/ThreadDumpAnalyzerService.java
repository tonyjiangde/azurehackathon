/**
 *
 */
package org.hybris.shanghai.services;

import org.hybris.shanghai.utils.threaddumpanalyzer.ParsedDumpFile;
import org.hybris.shanghai.utils.threaddumpanalyzer.TDA.ThreadDumpSourceType;


/**
 * @author i314119
 *
 */
public interface ThreadDumpAnalyzerService
{
	//public ParsedThreads importFile(final String filePath, final ThreadDumpSourceType srcType);

	//public ArrayList<DeadLock> detectDeadLock();
	public ParsedDumpFile parseFile(final String filePath, final ThreadDumpSourceType srcType);
}
