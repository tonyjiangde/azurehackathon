/**
 *
 */
package org.hybris.shanghai;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;


/**
 * @author I314119
 *
 */
public class d3TreeNode
{
	private String Name;
	private List<d3TreeNode> children;
	private final Comparator<d3TreeNode> comparator;

	public d3TreeNode(final String name)
	{
		this.Name = name;
		this.children = new ArrayList<d3TreeNode>();
		this.comparator = new Comparator<d3TreeNode>()
		{

			@Override
			public int compare(final d3TreeNode o1, final d3TreeNode o2)
			{
				// YTODO Auto-generated method stub
				return o1.getName().compareTo(o2.getName());
			}

		};
	}

	public void sortChildren()
	{
		Collections.sort(children, comparator);
	}

	/**
	 * @return the name
	 */
	public String getName()
	{
		return Name;
	}

	/**
	 * @param name
	 *           the name to set
	 */
	public void setName(final String name)
	{
		Name = name;
	}

	/**
	 * @return the children
	 */
	public List<d3TreeNode> getChildren()
	{
		return children;
	}

	/**
	 * @param children
	 *           the children to set
	 */
	public void setChildren(final List<d3TreeNode> children)
	{
		this.children = children;
	}

	public void addChild(final d3TreeNode tn)
	{
		this.children.add(tn);
	}

	public void addChildren(final List<d3TreeNode> children)
	{
		this.children.addAll(children);
	}

}
