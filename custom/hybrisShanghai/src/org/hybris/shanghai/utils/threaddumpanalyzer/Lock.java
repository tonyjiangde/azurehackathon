/**
 *
 */
package org.hybris.shanghai.utils.threaddumpanalyzer;

import de.hybris.tools.system.tgw.Thread;


/**
 * @author i314119
 *
 */
public class Lock
{
	private String id;
	private String object;
	private Thread thread;

	public String getId()
	{
		return id;
	}

	public void setId(final String id)
	{
		this.id = id;
	}

	public String getObject()
	{
		return object;
	}

	public void setObject(final String object)
	{
		this.object = object;
	}

	public Thread getThread()
	{
		return thread;
	}

	public void setThread(final Thread thread)
	{
		this.thread = thread;
	}

}