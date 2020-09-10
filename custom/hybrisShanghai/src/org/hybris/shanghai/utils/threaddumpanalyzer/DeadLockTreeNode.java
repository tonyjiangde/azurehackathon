/**
 *
 */
package org.hybris.shanghai.utils.threaddumpanalyzer;

import java.util.ArrayList;
import java.util.HashMap;


/**
 * @author i314119
 *
 */
public class DeadLockTreeNode
{
	private Thread thread;
	private ArrayList<String> waittolock;
	private ArrayList<String> locked;
	private HashMap<String, DeadLockTreeNode> children;
	private DeadLockTreeNode parent;
	private String parentlock;

	/**
	 * @return the thread
	 */
	public Thread getThread()
	{
		return thread;
	}

	/**
	 * @param thread
	 *           the thread to set
	 */
	public void setThread(final Thread thread)
	{
		this.thread = thread;
	}

	/**
	 * @return the waittolock
	 */
	public ArrayList<String> getWaittolock()
	{
		return waittolock;
	}

	/**
	 * @param waittolock
	 *           the waittolock to set
	 */
	public void setWaittolock(final ArrayList<String> waittolock)
	{
		this.waittolock = waittolock;
	}

	/**
	 * @return the locked
	 */
	public ArrayList<String> getLocked()
	{
		return locked;
	}

	/**
	 * @param locked
	 *           the locked to set
	 */
	public void setLocked(final ArrayList<String> locked)
	{
		this.locked = locked;
	}

	/**
	 * @return the children
	 */
	public HashMap<String, DeadLockTreeNode> getChildren()
	{
		return children;
	}

	/**
	 * @param children
	 *           the children to set
	 */
	public void setChildren(final HashMap<String, DeadLockTreeNode> children)
	{
		this.children = children;
	}

	/**
	 * @return the parent
	 */
	public DeadLockTreeNode getParent()
	{
		return parent;
	}

	/**
	 * @param parent
	 *           the parent to set
	 */
	public void setParent(final DeadLockTreeNode parent)
	{
		this.parent = parent;
	}

	/**
	 * @return the parentlock
	 */
	public String getParentlock()
	{
		return parentlock;
	}

	/**
	 * @param parentlock the parentlock to set
	 */
	public void setParentlock(String parentlock)
	{
		this.parentlock = parentlock;
	}

}
