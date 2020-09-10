/**
 *
 */
package org.hybris.shanghai.utils.threaddumpanalyzer;










import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;

import org.apache.log4j.Logger;


/**
 * @author i314119
 *
 */
public class TDA
{
	private ParsedThreads pt = null;
	private static final Logger LOG = Logger.getLogger(TDA.class.getName());

	public TDA()
	{

	}

	public static enum ThreadDumpSourceType
	{
		HAC(new HACThreadDumpParserImpl()), JSTACK(new JstackThreadDumpParserImpl());

		private final ThreadDumpParser parser;

		private ThreadDumpSourceType(final ThreadDumpParser parser)
		{
			this.parser = parser;
		}

		public ThreadDumpParser getParser()
		{
			return this.parser;
		}
	}

	public ParsedThreads importFile(final String filePath, final ThreadDumpSourceType srcType)
	{
		try
		{
			final ThreadDumpParser tdp = srcType.getParser();
			tdp.init();
			pt = tdp.parseFile(filePath);
			return pt;

		}
		catch (final Exception e)
		{
			LOG.error(e.getMessage());
			e.printStackTrace();
			return null;
		}
	}

	private LinkedList<DeadLockTreeNode> deadLockinPathToRoot(final DeadLockTreeNode node)
	{
		final LinkedList<DeadLockTreeNode> path = new LinkedList<DeadLockTreeNode>();
		final HashSet<Thread> threadpool = new HashSet<Thread>();
		DeadLockTreeNode current = node;
		path.add(current);
		threadpool.add(current.getThread());
		boolean deadlockinpathtoroot = false;
		while (current.getParent() != null)
		{
			current = current.getParent();
			path.add(current);

			if (path.getFirst().getThread().equals(current.getThread()))
			{
				deadlockinpathtoroot = true;
				break;
			}
			else
			{
				threadpool.add(current.getThread());
			}
			/*
			 * if (threadpool.contains(current.getThread())) { System.out.println("deadLockinPathToRoot:" +
			 * "close circut is found" + current.getThread().getName()); deadlockinpathtoroot = true; } else {
			 * threadpool.add(current.getThread()); }
			 */
		}
		if (deadlockinpathtoroot)
		{
			return path;
		}
		else
		{
			return null;
		}
	}

	private DeadLock convertToDeadLock(final LinkedList<DeadLockTreeNode> ll)
	{
		final DeadLock result = new DeadLock();
		final ArrayList<String> lockchain = new ArrayList<String>();
		final ArrayList<Thread> threadchain = new ArrayList<Thread>();
		while (ll.size() > 0)
		{
			final DeadLockTreeNode dtn = ll.pop();
			threadchain.add(dtn.getThread());
			if (dtn.getParent() != null)
			{
				lockchain.add(dtn.getParentlock());

			}

		}
		result.setLockchain(lockchain);
		result.setThreadchain(threadchain);
		if (result.isValid())
		{
			return result;
		}
		return null;
	}

	private HashSet<DeadLock> findDeadLock(final Thread thread, final HashSet<Thread> blockedThreads)
	{
		if (!(thread.getWaitingForLocks().size() > 0) || thread.getState() != Thread.STATE_BLOCKED)
		{
			return null;
		}
		else
		{
			final HashSet<DeadLock> deadlocklist = new HashSet<DeadLock>();
			final HashSet<DeadLockTreeNode> visited = new HashSet<DeadLockTreeNode>();
			final LinkedList<DeadLockTreeNode> ll = new LinkedList<DeadLockTreeNode>();
			final DeadLockTreeNode root = this.getDeadLockTreeNode(thread);
			ll.add(root);
			DeadLockTreeNode current;
			while (!ll.isEmpty())
			{
				current = ll.pop();
				if (visited.contains(current))
				{
					continue;
				}
				else
				{
					visited.add(current);
				}
				final LinkedList<DeadLockTreeNode> deadLockinpath = this.deadLockinPathToRoot(current);
				if (deadLockinpath != null)
				{
					final DeadLock dl = this.convertToDeadLock(deadLockinpath);
					if (dl != null)
					{
						deadlocklist.add(dl);
					}

				}
				else
				{
					//add child nodes dynamically
					for (final String waitingforLock : current.getThread().getWaitingForLocks().keySet())
					{
						for (final Thread t : blockedThreads)
						{
							if (t != current.getThread())
							{
								if (t.getHoldingLocks().containsKey(waitingforLock))
								{
									final DeadLockTreeNode child = this.getDeadLockTreeNode(t);
									current.getChildren().put(waitingforLock, child);
									child.setParent(current);
									child.setParentlock(waitingforLock);
									ll.push(child);
								}
							}
						}
					}

				}
				//				if (visited.contains(current))
				//				{
				//					System.out.println("found deadlock");
				//				}
				//				else
				//				{
				//					visited.add(current);
				//				}


			}


			return deadlocklist;
		}


	}

	/*
	 * private DeadLock findDeadLock(final String firstlock, final Thread thread, final HashSet<Thread> blockedThreads){
	 * if(!thread.getWaitingForLocks().containsKey(firstlock)){ return null; }else{ DeadLock potentialDeadLock = new
	 * DeadLock(); final ArrayList<String> lockchain = new ArrayList<>(); final ArrayList<Thread> threadchain = new
	 * ArrayList<Thread>(); lockchain.add(firstlock); threadchain.add(thread); String currentkey = firstlock; Thread
	 * currentthread = thread; final boolean stop = false; while(!stop){ for(Thread t:blockedThreads){ if(t!=thread){
	 * if(t.getHoldingLocks().containsKey(currentkey)){ threadchain.add(t);
	 *
	 * } } }
	 *
	 * } }
	 *
	 *
	 * return null; }
	 *
	 * private boolean findTheChain(String currentlock,final Thread currentThread, final HashSet<Thread> blockedThreads,
	 * ArrayList<String> lockchain,ArrayList<Thread> threadchain){ if(!threadchain.contains(currentThread)){
	 * lockchain.add(currentlock); threadchain.add(currentThread); for(Thread thread:blockedThreads){
	 * if(thread!=currentThread){
	 *
	 * } } }else{ return true; } return false; }
	 */
	private DeadLockTreeNode getDeadLockTreeNode(final Thread thread)
	{
		final DeadLockTreeNode dltn = new DeadLockTreeNode();
		final ArrayList<String> waittolock = new ArrayList<String>();
		final ArrayList<String> locked = new ArrayList<String>();
		final HashMap<String, DeadLockTreeNode> children = new HashMap<String, DeadLockTreeNode>();
		for (final String lock : thread.getHoldingLocks().keySet())
		{
			locked.add(lock);
		}
		for (final String lock : thread.getWaitingForLocks().keySet())
		{
			waittolock.add(lock);
		}
		dltn.setWaittolock(waittolock);
		dltn.setLocked(locked);
		dltn.setThread(thread);
		dltn.setChildren(children);
		dltn.setParent(null);
		dltn.setParentlock(null);
		return dltn;
	}

	private ArrayList<DeadLockTreeNode> buidDeadLockTreeSpace(final HashSet<Thread> blockedThreads)
	{
		final ArrayList<DeadLockTreeNode> dltnlist = new ArrayList<DeadLockTreeNode>();
		for (final Thread thread : blockedThreads)
		{
			final DeadLockTreeNode dltn = new DeadLockTreeNode();
			final ArrayList<String> waittolock = new ArrayList<String>();
			final ArrayList<String> locked = new ArrayList<String>();
			for (final String lock : thread.getHoldingLocks().keySet())
			{
				locked.add(lock);
			}
			for (final String lock : thread.getWaitingForLocks().keySet())
			{
				waittolock.add(lock);
			}
			dltn.setWaittolock(waittolock);
			dltn.setLocked(locked);
			dltn.setThread(thread);
			dltnlist.add(dltn);
		}
		return dltnlist;
	}

	private HashMap<String, DeadLockTreeNode> buidDeadLockTreeSpace2(final HashSet<Thread> blockedThreads)
	{
		final HashMap<String, DeadLockTreeNode> dltnmap = new HashMap<String, DeadLockTreeNode>();
		for (final Thread thread : blockedThreads)
		{
			final DeadLockTreeNode dltn = new DeadLockTreeNode();
			final ArrayList<String> waittolock = new ArrayList<String>();
			final ArrayList<String> locked = new ArrayList<String>();
			for (final String lock : thread.getHoldingLocks().keySet())
			{
				locked.add(lock);
			}
			for (final String lock : thread.getWaitingForLocks().keySet())
			{
				waittolock.add(lock);
			}
			dltn.setWaittolock(waittolock);
			dltn.setLocked(locked);
			dltn.setThread(thread);
			dltnmap.put(thread.getTid(), dltn);
		}
		return dltnmap;
	}

	public ArrayList<DeadLock> detectDeadLock()
	{
		if (this.pt == null)
		{
			return null;

		}
		else if (this.pt.getThreadsWFMonitors().size() == 0)
		{
			return null;
		}
		else if (this.pt.getForDeadlockDetection() == null || this.pt.getForDeadlockDetection().isEmpty())
		{
			return null;
		}
		else if (this.pt.getThreads() == null || this.pt.getThreads().isEmpty())
		{
			return null;
		}
		else
		{
			final ArrayList<DeadLock> result = new ArrayList<DeadLock>();
			boolean found = false;
			for (final Thread thread : this.pt.getThreadsWFMonitors())
			{
				//System.out.println(thread.getName() + "====" + thread.getStateString());
				final HashSet<DeadLock> al = this.findDeadLock(thread, this.pt.getThreadsWFMonitors());
				if (al != null)
				{
					for (final DeadLock dl : al)
					{
						found = false;
						for (final DeadLock dl2 : result)
						{
							if (dl.equals(dl2))
							{
								found = true;
							}
						}
						if (!found)
						{

							result.add(dl);
						}

					}
				}

			}

			/*
			 * for (final String lock : this.pt.getForDeadlockDetection().keySet()) { if
			 * (this.pt.getForDeadlockDetection().get(lock) != null &&
			 * this.pt.getForDeadlockDetection().get(lock).get(0).size() != 0 &&
			 * this.pt.getForDeadlockDetection().get(lock).get(1).size() != 0) { for (final Thread thread :
			 * this.pt.getForDeadlockDetection().get(lock).get(0)) { for (final String lock2 :
			 * thread.getHoldingLocks().keySet()) { for (final Thread thread2 :
			 * this.pt.getForDeadlockDetection().get(lock).get(1)) { if (thread2.getWaitingForLocks().containsKey(lock2)) {
			 *
			 * String key = ""; if (lock.hashCode() < lock2.hashCode()) { key = lock.concat(lock2); } else { key =
			 * lock2.concat(lock); } if (thread.getName().hashCode() < thread2.getName().hashCode()) { key =
			 * key.concat(thread.getName()).concat(thread2.getName()); } else { key =
			 * key.concat(thread2.getName()).concat(thread.getName()); } if (!result.containsKey(key)) { final DeadLock dl
			 * = new DeadLock(); dl.setLockone(lock); dl.setLocktwo(lock2); dl.setOne(thread); dl.setTwo(thread2);
			 *
			 * if (dl.isValid()) { //System.out.println("it is valid:"
			 * +dl.getLockone()+"|"+dl.getLocktwo()+"|"+dl.getOne().getName()+"|"+dl.getTwo().getName()); result.put(key,
			 * dl); } else { //System.out.println("it is not valid:"
			 * +dl.getLockone()+"|"+dl.getLocktwo()+"|"+dl.getOne().getName()+"|"+dl.getTwo().getName()); } } } } } } } }
			 */
			return result;
		}


	}
}
