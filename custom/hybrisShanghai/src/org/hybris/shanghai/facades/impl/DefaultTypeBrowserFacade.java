/**
 *
 */
package org.hybris.shanghai.facades.impl;

import de.hybris.platform.core.model.ItemModel;
import de.hybris.platform.core.model.c2l.LanguageModel;
import de.hybris.platform.core.model.type.AttributeDescriptorModel;
import de.hybris.platform.core.model.type.ComposedTypeModel;
import de.hybris.platform.core.model.type.MapTypeModel;
import de.hybris.platform.core.model.type.TypeModel;
import de.hybris.platform.servicelayer.model.ModelService;
import de.hybris.platform.servicelayer.type.TypeService;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hybris.shanghai.data.AttributeTypeData;
import org.hybris.shanghai.data.AttributesData;
import org.hybris.shanghai.data.LanguageData;
import org.hybris.shanghai.data.MapTypeData;
import org.hybris.shanghai.data.TypeData;
import org.hybris.shanghai.facades.TypeBrowserFacade;
import org.hybris.shanghai.services.TypesBrowserService;
import org.springframework.beans.factory.annotation.Required;

import com.fasterxml.jackson.databind.ObjectMapper;


/**
 * @author I314119
 *
 */
public class DefaultTypeBrowserFacade implements TypeBrowserFacade
{
	private TypesBrowserService typesBrowserService;
	private TypeService typeService;
	private ModelService modelService;

	@Required
	public void setTypesBrowserService(final TypesBrowserService typesBrowserService)
	{
		this.typesBrowserService = typesBrowserService;
	}

	@Required
	public void setTypeService(final TypeService typeService)
	{
		this.typeService = typeService;
	}

	@Required
	public void setModelService(final ModelService modelService)
	{
		this.modelService = modelService;
	}

	/*
	 * (non-Javadoc)
	 *
	 * @see org.hybirs.shanghai.utils.facades.TypesFacade#getTypes()
	 */
	@Override
	public List<TypeData> getTypes()
	{
		final List<ComposedTypeModel> types = typesBrowserService.getComposedTypes();
		final List<TypeData> typesFacadeData = new ArrayList<TypeData>();
		for (final ComposedTypeModel ctm : types)
		{
			final TypeData td = new TypeData();
			td.setPk(ctm.getPk().getLongValueAsString());
			td.setCode(ctm.getCode());
			final ComposedTypeModel st = ctm.getSuperType();
			if (st != null)
			{
				td.setCodeofsupertype(ctm.getSuperType().getCode());
			}
			else
			{
				td.setCodeofsupertype("null");
			}
			td.setTextensionname(ctm.getExtensionName());
			typesFacadeData.add(td);
		}
		return typesFacadeData;
	}

	/*
	 * (non-Javadoc)
	 *
	 * @see org.hybirs.shanghai.utils.facades.TypesFacade#getAttributes(java.lang.String)
	 */
	@Override
	public List<AttributesData> getAttributes(final String pk)
	{
		final List<AttributeDescriptorModel> attributes = typesBrowserService.getAttributesofType(pk);
		final List<AttributesData> facadeData = new ArrayList<AttributesData>();
		for (final AttributeDescriptorModel adm : attributes)
		{
			final AttributesData ad = new AttributesData();
			ad.setAttributepk(adm.getPk().getLongValueAsString());
			ad.setDatabaseColumn(adm.getDatabaseColumn());
			ad.setQualifier(adm.getQualifier());

			ad.setType(adm.getItemtype());
			/*
			 * final ItemModel st = adm.getOwner(); if (st != null) { //ad.setOwner(st.getPk().getLongValueAsString());
			 * ad.setType(s);
			 *
			 * } else { //ad.setOwner("null"); }
			 */
			ad.setAextensionname(adm.getExtensionName());
			facadeData.add(ad);
		}
		return facadeData;
	}

	private boolean isGetter(final Method method)
	{
		if (!method.getName().startsWith("get"))
		{
			return false;
		}
		if (method.getParameterTypes().length != 0)
		{
			return false;
		}
		if (void.class.equals(method.getReturnType()))
		{
			return false;
		}
		return true;
	}

	/*
	 * (non-Javadoc)
	 *
	 * @see org.hybirs.shanghai.utils.facades.TypesFacade#getItemsByCode(java.lang.String)
	 */
	@Override
	public String getItemsByCode(final String code, final int mode)
	{
		final List<Object> items = typesBrowserService.getItemsByCode(code, mode);
		try
		{

			final ObjectMapper mapper = new ObjectMapper();
			final List<Map<String, String>> out = new ArrayList<Map<String, String>>();
			//final String classname = code + "Model";
			//final Class modelClass = Class.forName(code + "Model");
			//System.out.println(items.size());


			/*
			 * final List<ClassLoader> classLoadersList = new LinkedList<ClassLoader>();
			 * classLoadersList.add(ClasspathHelper.contextClassLoader());
			 * classLoadersList.add(ClasspathHelper.staticClassLoader());
			 *
			 * final Reflections reflections = new Reflections(new ConfigurationBuilder() .setScanners(new
			 * SubTypesScanner(false), new ResourcesScanner())
			 * .setUrls(ClasspathHelper.forClassLoader(classLoadersList.toArray(new ClassLoader[0]))) .filterInputsBy(new
			 * FilterBuilder().include(FilterBuilder.prefix("de.hybris"))));
			 */
			//final Reflections reflections = new
			//Reflections();

			/*
			 * final Set<Class<? extends Object>> allClasses = reflections.getSubTypesOf(Object.class); final Map<String,
			 * Class<?>> classBySimpleName = new HashMap<>(); for (final Class<?> c : allClasses) {
			 *
			 * //if (c.getSimpleName().contains("Item")) { System.out.println(c.getSimpleName() + "!!!!!"); }
			 *
			 * classBySimpleName.put(c.getSimpleName(), c); } //classBySimpleName.put(ItemModel.class.getSimpleName(),
			 * ItemModel.class); final Class modelClass = classBySimpleName.get(classname);
			 */

			for (final Object im : items)
			{
				final Map<String, String> data = new HashMap<String, String>();
				/*
				 * if (im != null) {
				 *
				 *
				 * final Object o = modelClass.cast(im); final Method[] methods = modelClass.getMethods();
				 *
				 * for (final Method method : methods) { if (isGetter(method)) { //System.out.println("getter: " +
				 * method.invoke(o)); final Object o2 = method.invoke(o); if (o2 == null) {
				 * data.put(method.getName().substring(3), "null"); } else { data.put(method.getName().substring(3),
				 * method.invoke(im).toString()); } } } }
				 */
				final ItemModel itemmodel = (ItemModel) im;
				data.put("PK", itemmodel.getPk().getLongValueAsString());
				data.put("Type", itemmodel.getItemtype());

				data.put("Model Class", im.getClass().getName());
				//System.out.println(im.getClass().getName());
				//method.invoke(o); } }

				//final Method[] methods = im.getClass().getMethods();

				/*
				 * for (final Method method : methods) { if (isGetter(method)) { //System.out.println(method.getName());
				 * //System.out.println(method.getName() + " : " + method.invoke(im)); final Object o2 = method.invoke(im);
				 * if (o2 == null) { data.put(method.getName().substring(3), "null"); } else {
				 * data.put(method.getName().substring(3), method.invoke(im).toString()); }
				 *
				 *
				 * } }
				 */
				out.add(data);
				//final Method method = im.getClass().getMethod("getCapacity");
				//System.out.println(method.getName() + ":" + method.invoke(im));

			}
			final String json = mapper.writeValueAsString(out);
			//System.out.println(json);
			return json;
		}
		catch (final Exception e)
		{
			// YTODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}


	}

	/*
	 * (non-Javadoc)
	 *
	 * @see org.hybirs.shanghai.utils.facades.TypesFacade#getItemDetails(java.lang.String, java.lang.String)
	 */
	@Override
	public String getItemDetails(final String type, final String pkstring)
	{

		try
		{
			final List<Object> items = typesBrowserService.getItemDetails(type, pkstring);
			final ObjectMapper mapper = new ObjectMapper();
			//final List<Map<String, String>> out = new ArrayList<Map<String, String>>();
			final Map<String, String> data = new HashMap<String, String>();
			for (final Object im : items)
			{

				/*
				 * final ComposedTypeModel ctm = typeService.getComposedTypeForClass(im.getClass()); final
				 * Set<AttributeDescriptorModel> adm = typeService.getAttributeDescriptorsForType(ctm); for (final
				 * AttributeDescriptorModel a : adm) {
				 *
				 * if (a.getReadable().booleanValue()) { System.out.println(a.getReadable().booleanValue() + "===");
				 * System.out.println(a.getQualifier() + "===" + modelService.getAttributeValue(im, a.getQualifier())); } }
				 */
				final Method[] methods = im.getClass().getMethods();
				for (final Method method : methods)
				{

					if (isGetter(method))
					{
						//final Map<String, String> data = new HashMap<String, String>();
						try
						{
							final Object o = method.invoke(im);
							if (o == null)
							{
								data.put(method.getName().substring(3), "null");
							}
							else
							{
								data.put(method.getName().substring(3), o.toString());
							}
						}
						catch (final Exception e)
						{
							data.put(method.getName().substring(3), e.getMessage());
						}
						//out.add(data);
					}

				}
			}

			final String json = mapper.writeValueAsString(data);
			//System.out.println(json);
			return json;
		}
		catch (final Exception e1)
		{
			// YTODO Auto-generated catch block
			e1.printStackTrace();
			return "{\"Error\":\"" + e1.getMessage() + "\"}";
		}

		/*
		 * final StringBuffer sb = new StringBuffer();
		 * sb.append("<table cellpadding=\"10\" style=\"border: 1px solid blue; border-collapse:collapse;\">"); if
		 * (items.size() > 0) { final StringBuffer th = new StringBuffer(); final StringBuffer td = new StringBuffer();
		 * th.append("<tr style=\"border: 1px solid blue; border-collapse:collapse;\">");
		 * td.append("<tr style=\"border: 1px solid blue; border-collapse:collapse;\">"); for (final Object im : items) {
		 * final Method[] methods = im.getClass().getMethods(); for (final Method method : methods) { if
		 * (isGetter(method)) { th.append("<th style=\"border: 1px solid blue; border-collapse:collapse;\">" +
		 * method.getName().substring(3) + "</th>"); try { final Object o = method.invoke(im); if (o == null) {
		 * td.append("<td style=\"border: 1px solid blue; border-collapse:collapse;\">null</td>"); } else {
		 * td.append("<td style=\"border: 1px solid blue; border-collapse:collapse;\">" + o.toString() + "</td>"); } }
		 * catch (final Exception e) { td.append("<td style=\"border: 1px solid blue; border-collapse:collapse;\">" +
		 * e.getMessage() + "</td>"); }
		 *
		 * } } } th.append("</tr>"); td.append("</tr>"); sb.append(th); sb.append(td); } else {
		 * sb.append("<td style=\"border: 1px solid blue; border-collapse:collapse;\">No details found</td>"); }
		 *
		 * sb.append("</table>"); return sb.toString();
		 */
		//return null;
		/*
		 * try { final String json = mapper.writeValueAsString(data); //System.out.println(json); return json; } catch
		 * (final Exception e) { e.printStackTrace(); return null; }
		 */

	}

	/*
	 * (non-Javadoc)
	 *
	 * @see org.hybirs.shanghai.utils.facades.TypesFacade#getItemsByCodeWithPaging(java.lang.String, int, int, int)
	 */
	@Override
	public String getItemsByCodeWithPaging(final String code, final int mode, final int start, final int range, final String sort,
			final String dir, final String query)
	{

		try
		{
			final List<Object> items = typesBrowserService.getItemsByCodeWithPaging(code, mode, start, range, sort, dir, query);
			if (items.size() > 1)
			{
				final ObjectMapper mapper = new ObjectMapper();
				final Map<String, Object> result = new HashMap<String, Object>();
				final Integer i = (Integer) items.get(items.size() - 1);
				items.remove(items.size() - 1);

				final List<Map<String, String>> out = new ArrayList<Map<String, String>>();
				for (final Object im : items)
				{
					final Map<String, String> data = new HashMap<String, String>();
					final ItemModel itemmodel = (ItemModel) im;
					data.put("PK", itemmodel.getPk().getLongValueAsString());
					data.put("Itemtype", itemmodel.getItemtype());
					data.put("Model Class", im.getClass().getName());
					out.add(data);

				}
				result.put("totalCount", i);
				result.put("items", out);
				final String json = mapper.writeValueAsString(result);
				return json;
			}
			else
			{
				return "{}";
			}

		}
		catch (final Exception e)
		{
			e.printStackTrace();
			return "{\"items\":[{\"PK\":\"\",\"Itemtype\":\"" + e.getMessage() + "\",\"Model Class\":\"" + e.getMessage()
					+ "\"}],\"totalCount\":1}";
		}
	}

	/*
	 * (non-Javadoc)
	 *
	 * @see org.hybris.shanghai.facades.TypeBrowserFacade#getTypes(java.lang.String)
	 */
	@Override
	public List<TypeData> getTypes(final String like)
	{
		final List<ComposedTypeModel> types = typesBrowserService.getComposedTypes(like);
		final List<TypeData> typesFacadeData = new ArrayList<TypeData>();
		for (final ComposedTypeModel ctm : types)
		{
			final TypeData td = new TypeData();
			td.setPk(ctm.getPk().getLongValueAsString());
			td.setCode(ctm.getCode());
			final ComposedTypeModel st = ctm.getSuperType();
			if (st != null)
			{
				td.setCodeofsupertype(ctm.getSuperType().getCode());
			}
			else
			{
				td.setCodeofsupertype("null");
			}
			td.setTextensionname(ctm.getExtensionName());
			typesFacadeData.add(td);
		}
		return typesFacadeData;
	}

	/*
	 * (non-Javadoc)
	 *
	 * @see org.hybris.shanghai.facades.TypeBrowserFacade#getAttributes(java.lang.String, java.lang.String)
	 */
	@Override
	public List<AttributesData> getAttributes(final String pk, final String like)
	{
		final List<AttributeDescriptorModel> attributes = typesBrowserService.getAttributesofType(pk, like);
		final List<AttributesData> facadeData = new ArrayList<AttributesData>();
		for (final AttributeDescriptorModel adm : attributes)
		{
			final AttributesData ad = new AttributesData();
			ad.setAttributepk(adm.getPk().getLongValueAsString());
			ad.setDatabaseColumn(adm.getDatabaseColumn());
			ad.setQualifier(adm.getQualifier());
			ad.setType(adm.getItemtype());
			/*
			 * final ItemModel st = adm.getOwner(); if (st != null) { //ad.setOwner(st.getPk().getLongValueAsString());
			 * ad.setType(s);
			 *
			 * } else { //ad.setOwner("null"); }
			 */
			ad.setAextensionname(adm.getExtensionName());
			facadeData.add(ad);
		}
		return facadeData;
	}

	/*
	 * (non-Javadoc)
	 *
	 * @see org.hybris.shanghai.facades.TypeBrowserFacade#getAttributeType(java.lang.String, java.lang.String)
	 */
	@Override
	public AttributeTypeData getAttributeType(final String typepk, final String attributequalifier)
	{
		final String[] fourTypes =
		{ "AtomicType", "CollectionType", "ComposedType", "MapType" };
		final ArrayList<String> ft = new ArrayList<String>(Arrays.asList(fourTypes));
		final TypeModel attributeType = typesBrowserService.getAttributeTypeName(typepk, attributequalifier);
		System.out.println(attributeType.getPk() + "!!" + attributeType.getCode() + "!!" + attributeType.getItemtype());
		TypeModel temptype = attributeType;
		while (!ft.contains(temptype.getItemtype()))
		{
			temptype = typesBrowserService.getAttributeItemType(temptype.getItemtype());
			System.out.println(temptype.getPk() + "!!" + temptype.getCode() + "!!" + temptype.getItemtype());
		}

		final AttributeTypeData facadeData = new AttributeTypeData();
		facadeData.setPk(attributeType.getPk().getLongValueAsString());
		facadeData.setName(attributeType.getCode());
		facadeData.setItemtype(temptype.getItemtype());

		return facadeData;
	}

	/*
	 * (non-Javadoc)
	 *
	 * @see org.hybris.shanghai.facades.TypeBrowserFacade#getCollectionElementType(java.lang.String)
	 */
	@Override
	public AttributesData getCollectionElementType(final String pk)
	{
		final TypeModel elementtype = typesBrowserService.getCollectionElementType(pk);
		final AttributesData facadeData = new AttributesData();
		//facadeData.setPk(elementtype.getPk().getLongValueAsString());
		//facadeData.setName(elementtype.getCode());
		//facadeData.setItemtype(elementtype.getItemtype());
		facadeData.setQualifier(elementtype.getCode());
		facadeData.setAttributepk(elementtype.getPk().getLongValueAsString());
		facadeData.setType(elementtype.getItemtype());
		return facadeData;
	}

	/*
	 * (non-Javadoc)
	 *
	 * @see org.hybris.shanghai.facades.TypeBrowserFacade#getLanguages()
	 */
	@Override
	public List<LanguageData> getLanguages()
	{
		final List<LanguageModel> l = typesBrowserService.getLanguages();
		final List<LanguageData> facadeData = new ArrayList<LanguageData>();
		for (final LanguageModel lm : l)
		{
			final LanguageData ld = new LanguageData();
			ld.setIsocode(lm.getIsocode());
			facadeData.add(ld);
		}
		return facadeData;
	}

	/*
	 * (non-Javadoc)
	 *
	 * @see org.hybris.shanghai.facades.TypeBrowserFacade#getMapTypes()
	 */
	@Override
	public List<MapTypeData> getMapTypes()
	{
		final List<Object> items = typesBrowserService.getItemsByCode("MapType", 1);
		final List<MapTypeData> facadeData = new ArrayList<MapTypeData>();
		for (final Object im : items)
		{
			final MapTypeData mtd = new MapTypeData();
			final MapTypeModel maptypemodel = (MapTypeModel) im;
			mtd.setPk(maptypemodel.getPk().getLongValueAsString());
			mtd.setCode(maptypemodel.getCode());
			mtd.setArgumentType(maptypemodel.getArgumentType().getCode());
			mtd.setReturntype(maptypemodel.getReturntype().getCode());
			facadeData.add(mtd);
		}
		//select {pk},{code},{argumentType},{returntype} from {MapType}
		return facadeData;
	}

	/*
	 * (non-Javadoc)
	 *
	 * @see org.hybris.shanghai.facades.TypeBrowserFacade#httpget(java.lang.String)
	 */
	@Override
	public String httpget(final String url)
	{
		return typesBrowserService.httpget(url);
	}

	/*
	 * (non-Javadoc)
	 *
	 * @see org.hybris.shanghai.facades.TypeBrowserFacade#isAttributeLocalized(java.lang.String, java.lang.String)
	 */
	@Override
	public boolean isAttributeLocalized(final String typepk, final String attributequalifier)
	{
		// YTODO Auto-generated method stub
		final AttributeDescriptorModel am = typesBrowserService.getAttributeDescriptorModel(typepk, attributequalifier);
		//System.out.println(am.getName() + "!!!!" + am.getLocalized());
		return am.getLocalized().booleanValue();
	}


}
