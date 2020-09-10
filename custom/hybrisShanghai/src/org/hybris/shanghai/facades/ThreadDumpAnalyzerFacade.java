/**
 *
 */
package org.hybris.shanghai.facades;

import org.hybris.shanghai.utils.threaddumpanalyzer.TDA.ThreadDumpSourceType;
import org.hybris.shanghai.utils.threaddumpanalyzer.ThreadDumpAnalyzerData;


/**
 * @author i314119
 *
 */
public interface ThreadDumpAnalyzerFacade
{
	public ThreadDumpAnalyzerData analyzeThreadDumpFile(final String filePath, final ThreadDumpSourceType srcType);
}
