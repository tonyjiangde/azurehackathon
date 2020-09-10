/**
 *
 */
package org.hybris.shanghai.web.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

import org.apache.commons.lang.StringUtils;
import org.hybris.shanghai.d3TreeNode;
import org.hybris.shanghai.data.AttributeTypeData;
import org.hybris.shanghai.data.AttributesData;
import org.hybris.shanghai.data.LanguageData;
import org.hybris.shanghai.data.MapTypeData;
import org.hybris.shanghai.data.TypeData;
import org.hybris.shanghai.facades.TypeBrowserFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;


/**
 * @author I314119
 *
 */
@Controller
public class TypebrowserController
{
	private TypeBrowserFacade typeBrowserFacade;



	@RequestMapping(value = "/typebrowser.do")
	public String showTypes()
	{
		return "typebrowser";
	}

	@RequestMapping(value = "/showtypes.do")
	public void showTypesAJAX(@RequestParam(value = "search", defaultValue = StringUtils.EMPTY)
	final String like, final PrintWriter pw)
	{
		final List<TypeData> type = typeBrowserFacade.getTypes(like);
		final ObjectMapper mapper = new ObjectMapper();
		try
		{
			final String json = mapper.writeValueAsString(type);
			pw.write(json);
			pw.flush();
			pw.close();
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
	}

	private d3TreeNode findSuperTypeNode(final d3TreeNode root, final TypeData td)
	{
		if (root.getName().equals(td.getCodeofsupertype()))
		{
			return root;
		}
		else
		{
			for (final d3TreeNode tn : root.getChildren())
			{
				return findSuperTypeNode(tn, td);
			}
			return null;
		}


	}



	@RequestMapping(value = "/showtypestree.do")
	public void showTypesTreeAJAX(final PrintWriter pw)
	{
		final List<TypeData> type = typeBrowserFacade.getTypes();

		final ObjectMapper mapper = new ObjectMapper();

		try
		{
			final Queue<d3TreeNode> q = new LinkedList<d3TreeNode>();
			final d3TreeNode root = new d3TreeNode("Item");
			q.add(root);
			while (q.size() > 0)
			{
				final d3TreeNode current = q.poll();
				final Iterator<TypeData> it = type.iterator();
				while (it.hasNext())
				{
					final TypeData td = it.next();
					if (td.getCodeofsupertype().equals(current.getName()))
					{
						final d3TreeNode tn = new d3TreeNode(td.getCode());
						current.addChild(tn);
						q.add(tn);
					}
				}
				current.sortChildren();
				//q.remove(root);
				//System.out.println(q.size() + "!!!!!!");
			}

			final String json = mapper.writeValueAsString(root);
			pw.write(json);
			pw.flush();
			pw.close();
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
	}

	@RequestMapping(value = "/showlanguages.do")
	public void showLanguagesAJAX(final PrintWriter pw)
	{
		final List<LanguageData> language = typeBrowserFacade.getLanguages();

		final ObjectMapper mapper = new ObjectMapper();

		try
		{
			final String json = mapper.writeValueAsString(language);
			pw.write(json);
			pw.flush();
			pw.close();
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
	}

	@RequestMapping(value = "/showatrributes.do", params =
	{ "typepk" })
	public void showAttributesAJAX(@RequestParam(value = "typepk")
	final String pk, final PrintWriter pw) throws UnsupportedEncodingException
	{
		final String npk = URLDecoder.decode(pk, "UTF-8");
		final List<AttributesData> attributes = typeBrowserFacade.getAttributes(npk);
		final ObjectMapper mapper = new ObjectMapper();
		try
		{
			final String json = mapper.writeValueAsString(attributes);
			pw.write(json);
			pw.flush();
			pw.close();
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
	}

	@RequestMapping(value = "/getAtrributeType.do", params =
	{ "typepk", "qualifier" })
	public void getAttributeTypeAJAX(@RequestParam(value = "typepk")
	final String pk, @RequestParam(value = "qualifier")
	final String qualifier, final PrintWriter pw) throws UnsupportedEncodingException
	{
		final String npk = URLDecoder.decode(pk, "UTF-8");
		final String nqualifier = URLDecoder.decode(qualifier, "UTF-8");
		final AttributeTypeData attributetype = typeBrowserFacade.getAttributeType(npk, nqualifier);
		//final AttributeTypeData attributeitemtype = typeBrowserFacade.getAttributeItemType(npk, nqualifier);
		final ObjectMapper mapper = new ObjectMapper();
		try
		{
			final String json = mapper.writeValueAsString(attributetype);
			pw.write(json);
			pw.flush();
			pw.close();
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
	}

	@RequestMapping(value = "/isAttributeLocalized.do", params =
	{ "typepk", "qualifier" })
	public void isAttributeLocalizedAJAX(@RequestParam(value = "typepk")
	final String pk, @RequestParam(value = "qualifier")
	final String qualifier, final PrintWriter pw) throws UnsupportedEncodingException
	{
		final String npk = URLDecoder.decode(pk, "UTF-8");
		final String nqualifier = URLDecoder.decode(qualifier, "UTF-8");
		final Boolean localized = new Boolean(typeBrowserFacade.isAttributeLocalized(npk, nqualifier));
		//final AttributeTypeData attributeitemtype = typeBrowserFacade.getAttributeItemType(npk, nqualifier);
		final ObjectMapper mapper = new ObjectMapper();
		try
		{
			final String json = mapper.writeValueAsString(localized);
			pw.write(json);
			pw.flush();
			pw.close();
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
	}

	@RequestMapping(value = "searchatrributes/{pk}", method = RequestMethod.GET)
	public void searchAttributesAJAX(@PathVariable
	final String pk, @RequestParam(value = "search", defaultValue = StringUtils.EMPTY)
	final String search, final PrintWriter pw) throws UnsupportedEncodingException
	{
		final String npk = URLDecoder.decode(pk, "UTF-8");
		final List<AttributesData> attributes = typeBrowserFacade.getAttributes(npk, search);

		/*
		 * final ArrayList<ImpexAttributeData> impexattributes = new ArrayList<ImpexAttributeData>();
		 *
		 * for (final AttributesData ad : attributes) { final ImpexAttributeData id = new ImpexAttributeData();
		 * id.setName(ad.getQualifier()); id.setAttributetype(ad.getType()); id.setAttributepk(ad.getAttributepk());
		 * impexattributes.add(id); }
		 */

		final ObjectMapper mapper = new ObjectMapper();
		try
		{
			final String json = mapper.writeValueAsString(attributes);

			pw.write(json);
			pw.flush();
			pw.close();
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
	}

	@RequestMapping(value = "/showitems.do", params =
	{ "code", "mode" })
	public void showItemsAJAX(@RequestParam(value = "code")
	final String code, @RequestParam(value = "mode")
	final int mode, final PrintWriter pw) throws UnsupportedEncodingException
	{
		final String ncode = URLDecoder.decode(code, "UTF-8");
		final String items = typeBrowserFacade.getItemsByCode(ncode, mode);
		try
		{
			pw.write(items);
			pw.flush();
			pw.close();
		}

		catch (final Exception e)
		{
			// YTODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@RequestMapping(value = "/showmaptypes.do")
	public void showMaptypesAJAX(final PrintWriter pw) throws UnsupportedEncodingException
	{

		try
		{
			final List<MapTypeData> mtd = typeBrowserFacade.getMapTypes();
			final ObjectMapper mapper = new ObjectMapper();
			final String json = mapper.writeValueAsString(mtd);

			pw.write(json);
			pw.flush();
			pw.close();
		}

		catch (final Exception e)
		{
			// YTODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@RequestMapping(value = "/showitemsp.do", params =
	{ "code", "mode", "start", "limit" })
	public void showItemsWithPagingAJAX(@RequestParam(value = "code")
	final String code, @RequestParam(value = "mode")
	final int mode, @RequestParam(value = "start")
	final int start, @RequestParam(value = "limit")
	final int range, @RequestParam(value = "sort", defaultValue = StringUtils.EMPTY)
	final String sort, @RequestParam(value = "dir", defaultValue = StringUtils.EMPTY)
	final String dir, @RequestParam(value = "query", defaultValue = StringUtils.EMPTY)
	final String query, final PrintWriter pw) throws UnsupportedEncodingException
	{
		final String ncode = URLDecoder.decode(code, "UTF-8");
		final String items = typeBrowserFacade.getItemsByCodeWithPaging(ncode, mode, start, range, sort, dir, query);
		try
		{

			pw.write(items);
			pw.flush();
			pw.close();
		}

		catch (final Exception e)
		{
			// YTODO Auto-generated catch block
			e.printStackTrace();

		}
	}

	@RequestMapping(value = "/showitemdetail.do", params =
	{ "type", "pk" })
	public void showItemDetailAJAX(@RequestParam(value = "type")
	final String type, @RequestParam(value = "pk")
	final String pk, final PrintWriter pw) throws UnsupportedEncodingException
	{
		final String ntype = URLDecoder.decode(type, "UTF-8");
		final String npk = URLDecoder.decode(pk, "UTF-8");
		final String items = typeBrowserFacade.getItemDetails(ntype, npk);
		try
		{
			pw.write(items);
			pw.flush();
			pw.close();
		}

		catch (final Exception e)
		{
			// YTODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@RequestMapping(value = "/showcollectionelementtype.do", params =
	{ "pk" })
	public void showCollectionElementTypeAJAX(@RequestParam(value = "pk")
	final String pk, final PrintWriter pw) throws UnsupportedEncodingException
	{
		final String npk = URLDecoder.decode(pk, "UTF-8");
		final AttributesData atd = typeBrowserFacade.getCollectionElementType(npk);
		final ObjectMapper mapper = new ObjectMapper();
		try
		{
			final String json = mapper.writeValueAsString(atd);

			pw.write(json);
			pw.flush();
			pw.close();
		}

		catch (final Exception e)
		{
			// YTODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@RequestMapping(value = "/httpg.do", params =
	{ "url" })
	public void httpget(@RequestParam(value = "url")
	final String url, final PrintWriter pw) throws UnsupportedEncodingException
	{
		final String u = URLDecoder.decode(url, "UTF-8");
		System.out.println(u);
		try
		{
			final String json = typeBrowserFacade.httpget(u);

			pw.write(json);
			pw.flush();
			pw.close();
		}

		catch (final Exception e)
		{
			// YTODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@Autowired
	public void setFacade(final TypeBrowserFacade facade)
	{
		this.typeBrowserFacade = facade;
	}


}
