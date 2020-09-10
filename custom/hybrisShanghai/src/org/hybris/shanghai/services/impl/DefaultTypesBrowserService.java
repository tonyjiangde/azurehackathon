/**
 *
 */
package org.hybris.shanghai.services.impl;

/**
 * @author I314119
 *
 */
import de.hybris.platform.core.model.c2l.LanguageModel;
import de.hybris.platform.core.model.type.AttributeDescriptorModel;
import de.hybris.platform.core.model.type.ComposedTypeModel;
import de.hybris.platform.core.model.type.TypeModel;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;

import org.hybris.shanghai.daos.TypeBrowserDAO;
import org.hybris.shanghai.services.TypesBrowserService;
import org.springframework.beans.factory.annotation.Required;


/**
 * @author I314119
 *
 */
public class DefaultTypesBrowserService implements TypesBrowserService
{

	private TypeBrowserDAO typeBrowserDAO;

	@Required
	public void setTypeBrowserDAO(final TypeBrowserDAO typeBrowserDAO)
	{
		this.typeBrowserDAO = typeBrowserDAO;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see org.hybirs.shanghai.utils.services.TypeService#getAllTypes()
	 */
	@Override
	public List<ComposedTypeModel> getComposedTypes()
	{
		// YTODO Auto-generated method stub
		return typeBrowserDAO.findComposedTypes();
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see org.hybirs.shanghai.utils.services.TypesService#getAttributesofType(java.lang.String)
	 */
	@Override
	public List<AttributeDescriptorModel> getAttributesofType(final String typepk)
	{
		// YTODO Auto-generated method stub
		return typeBrowserDAO.getAttributsByCode(typepk);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see org.hybirs.shanghai.utils.services.TypesService#getItemsByCode(java.lang.String)
	 */
	@Override
	public List<Object> getItemsByCode(final String code, final int mode)
	{
		// YTODO Auto-generated method stub
		return typeBrowserDAO.getItemsByCode(code, mode);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see org.hybirs.shanghai.utils.services.TypesService#getItemDetails(java.lang.String, java.lang.String)
	 */
	@Override
	public List<Object> getItemDetails(final String type, final String pkstring) throws Exception
	{
		// YTODO Auto-generated method stub
		return typeBrowserDAO.getItemDetails(type, pkstring);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see org.hybirs.shanghai.utils.services.TypesService#getItemsByCodeWithPaging(java.lang.String, int, int, int)
	 */
	@Override
	public List<Object> getItemsByCodeWithPaging(final String code, final int mode, final int start, final int range,
			final String sort, final String dir, final String query) throws Exception
	{
		// YTODO Auto-generated method stub
		return typeBrowserDAO.getItemsByCodeWithPaging(code, mode, start, range, sort, dir, query);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see org.hybris.shanghai.services.TypesBrowserService#getComposedTypes(java.lang.String)
	 */
	@Override
	public List<ComposedTypeModel> getComposedTypes(final String like)
	{
		return typeBrowserDAO.findComposedTypes(like);
	}

	/*
	 * (non-Javadoc)
	 *
	 * @see org.hybris.shanghai.services.TypesBrowserService#getAttributesofType(java.lang.String, java.lang.String)
	 */
	@Override
	public List<AttributeDescriptorModel> getAttributesofType(final String typepk, final String like)
	{
		return typeBrowserDAO.getAttributsByCode(typepk, like);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see org.hybris.shanghai.services.TypesBrowserService#getAttributeType(java.lang.String, java.lang.String)
	 */
	@Override
	public TypeModel getAttributeTypeName(final String typepk, final String attributequalifier)
	{
		return typeBrowserDAO.getAttributeTypeName(typepk, attributequalifier);
	}

	/*
	 * (non-Javadoc)
	 *
	 * @see org.hybris.shanghai.services.TypesBrowserService#getAttributeItemType(java.lang.String, java.lang.String)
	 */
	@Override
	public TypeModel getAttributeItemType(final String typepk)
	{
		return typeBrowserDAO.getAttributeItemType(typepk);
	}

	/*
	 * (non-Javadoc)
	 *
	 * @see org.hybris.shanghai.services.TypesBrowserService#getCollectionElementType(java.lang.String)
	 */
	@Override
	public TypeModel getCollectionElementType(final String pk)
	{
		return typeBrowserDAO.getCollectionElementType(pk);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see org.hybris.shanghai.services.TypesBrowserService#getLanguages()
	 */
	@Override
	public List<LanguageModel> getLanguages()
	{
		return typeBrowserDAO.getLanguages();
	}

	/*
	 * (non-Javadoc)
	 *
	 * @see org.hybris.shanghai.services.TypesBrowserService#httpget(java.lang.String)
	 */
	@Override
	public String httpget(final String urlstring)
	{
		URL url;
		HttpURLConnection conn;
		BufferedReader rd;
		String line;
		String result = "";
		try
		{
			url = new URL(urlstring);
			conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("GET");
			rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
			while ((line = rd.readLine()) != null)
			{
				result += line;
			}
			rd.close();
		}
		catch (final IOException e)
		{
			e.printStackTrace();
		}
		catch (final Exception e)
		{
			e.printStackTrace();
		}
		return result;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see org.hybris.shanghai.services.TypesBrowserService#getAttributeDescriptorModel(java.lang.String,
	 * java.lang.String)
	 */
	@Override
	public AttributeDescriptorModel getAttributeDescriptorModel(final String typepk, final String attributequalifier)
	{
		// YTODO Auto-generated method stub
		return typeBrowserDAO.getAttributeDescriptorModel(typepk, attributequalifier);
	}

}
