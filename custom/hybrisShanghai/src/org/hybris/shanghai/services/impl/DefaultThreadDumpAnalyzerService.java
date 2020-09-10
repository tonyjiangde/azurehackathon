/**
 *
 */
package org.hybris.shanghai.services.impl;

import org.hybris.shanghai.services.ThreadDumpAnalyzerService;
import org.hybris.shanghai.utils.threaddumpanalyzer.ParsedDumpFile;
import org.hybris.shanghai.utils.threaddumpanalyzer.TDA;
import org.hybris.shanghai.utils.threaddumpanalyzer.TDA.ThreadDumpSourceType;


/**
 * @author i314119
 *
 */
public class DefaultThreadDumpAnalyzerService implements ThreadDumpAnalyzerService
{



	/*
	 * (non-Javadoc)
	 *
	 * @see org.hybris.shanghai.services.ThreadDumpAnalyzerService#parseFile(java.lang.String,
	 * org.hybris.shanghai.utils.threaddumpanalyzer.TDA.ThreadDumpSourceType)
	 */
	@Override
	public ParsedDumpFile parseFile(final String filePath, final ThreadDumpSourceType srcType)
	{
		final TDA tda = new TDA();
		final ParsedDumpFile pdf = new ParsedDumpFile();
		pdf.setParsedThreads(tda.importFile(filePath, srcType));
		pdf.setDeadlocks(tda.detectDeadLock());
		return pdf;
	}

}
