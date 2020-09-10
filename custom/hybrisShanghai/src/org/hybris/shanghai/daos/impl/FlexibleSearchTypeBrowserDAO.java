/**
 *
 */
package org.hybris.shanghai.daos.impl;

import de.hybris.platform.core.model.c2l.LanguageModel;
import de.hybris.platform.core.model.type.AttributeDescriptorModel;
import de.hybris.platform.core.model.type.CollectionTypeModel;
import de.hybris.platform.core.model.type.ComposedTypeModel;
import de.hybris.platform.core.model.type.TypeModel;
import de.hybris.platform.jalo.JaloSession;
import de.hybris.platform.jalo.user.UserManager;
import de.hybris.platform.servicelayer.search.FlexibleSearchQuery;
import de.hybris.platform.servicelayer.search.FlexibleSearchService;
import de.hybris.platform.servicelayer.search.SearchResult;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.hybris.shanghai.daos.TypeBrowserDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


/**
 * @author I314119
 *
 */
@Component(value = "flexibleSearchTypeBrowserDAO")
public class FlexibleSearchTypeBrowserDAO implements TypeBrowserDAO
{
	/**
	 * We use hybris' FlexibleSearchService for running queries against the database
	 *
	 * @see "https://wiki.hybris.com/display/release5/FlexibleSearch"
	 */
	@Autowired
	private FlexibleSearchService flexibleSearchService;

	/*
	 * (non-Javadoc)
	 *
	 * @see org.hybirs.shanghai.utils.daos.TypesDAO#findStadiums()
	 */
	@Override
	public List<ComposedTypeModel> findComposedTypes()
	{
		JaloSession.getCurrentSession().setUser(UserManager.getInstance().getAdminEmployee());
		final String queryString = "SELECT {pk} FROM {ComposedType}";
		final FlexibleSearchQuery query = new FlexibleSearchQuery(queryString);
		return flexibleSearchService.<ComposedTypeModel> search(query).getResult();
	}

	/*
	 * (non-Javadoc)
	 *
	 * @see org.hybirs.shanghai.utils.daos.TypesDAO#getAttributsByCode(java.lang.String)
	 */
	@Override
	public List<AttributeDescriptorModel> getAttributsByCode(final String typepk)
	{
		JaloSession.getCurrentSession().setUser(UserManager.getInstance().getAdminEmployee());
		final String queryString = "SELECT {pk},{qualifier}, {databaseColumn},{owner} FROM {AttributeDescriptor} WHERE {owner} = '"
				+ typepk + "'";

		final FlexibleSearchQuery query = new FlexibleSearchQuery(queryString);
		return flexibleSearchService.<AttributeDescriptorModel> search(query).getResult();
	}

	@Override
	public List<AttributeDescriptorModel> getAttributsByCode(final String typepk, final String like)
	{
		JaloSession.getCurrentSession().setUser(UserManager.getInstance().getAdminEmployee());
		String queryString = null;
		if (StringUtils.isEmpty(like))
		{
			queryString = "SELECT {pk},{qualifier}, {databaseColumn},{owner} FROM {AttributeDescriptor} WHERE {owner} = '" + typepk
					+ "' ORDER BY {qualifier}";
		}
		else
		{
			queryString = "SELECT {pk},{qualifier}, {databaseColumn},{owner} FROM {AttributeDescriptor} WHERE {owner} = '" + typepk
					+ "' AND  {qualifier} like '%" + like + "%' ORDER BY {qualifier}";
		}
		final FlexibleSearchQuery query = new FlexibleSearchQuery(queryString);
		return flexibleSearchService.<AttributeDescriptorModel> search(query).getResult();
	}

	/*
	 * (non-Javadoc)
	 *
	 * @see org.hybirs.shanghai.utils.daos.TypesDAO#getItemsByCode(java.lang.String)
	 */
	@Override
	public List<Object> getItemsByCode(final String code, final int mode)
	{
		JaloSession.getCurrentSession().setUser(UserManager.getInstance().getAdminEmployee());
		String queryString = null;
		if (mode == 0)
		{
			queryString = "SELECT {pk} FROM {" + code + "!}";
		}
		else if (mode == 1)
		{
			queryString = "SELECT {pk} FROM {" + code + "}";
		}
		System.out.println(queryString);
		final FlexibleSearchQuery query = new FlexibleSearchQuery(queryString);
		final SearchResult<Object> sr = flexibleSearchService.search(query);
		//return flexibleSearchService.<Object>search(query).getResult();
		return sr.getResult();
	}

	/*
	 * (non-Javadoc)
	 *
	 * @see org.hybirs.shanghai.utils.daos.TypesDAO#getItemDetails(java.lang.String, java.lang.String)
	 */
	@Override
	public List<Object> getItemDetails(final String type, final String pkstring) throws Exception
	{
		JaloSession.getCurrentSession().setUser(UserManager.getInstance().getAdminEmployee());
		final String queryString = "SELECT {pk} FROM {" + type + "} WHERE {pk} = '" + pkstring + "'";
		System.out.println(queryString);
		final FlexibleSearchQuery query = new FlexibleSearchQuery(queryString);
		final SearchResult<Object> sr = flexibleSearchService.search(query);
		//return flexibleSearchService.<Object>search(query).getResult();
		return sr.getResult();
	}

	/*
	 * (non-Javadoc)
	 *
	 * @see org.hybirs.shanghai.utils.daos.TypesDAO#getItemsByCodeWithPaging(java.lang.String, int, int, int)
	 */
	@Override
	public List<Object> getItemsByCodeWithPaging(final String code, final int mode, final int start, final int range,
			final String sort, final String dir, final String query) throws Exception
	{
		JaloSession.getCurrentSession().setUser(UserManager.getInstance().getAdminEmployee());
		String queryString = null;
		String newcode = code;
		if (mode == 0)
		{
			newcode = code + "!";
		}
		else if (mode == 1)
		{
			newcode = code;
		}

		if (query != null && !query.isEmpty())
		{
			queryString = "Select {t.pk} from {" + newcode
					+ " AS t LEFT JOIN composedtype AS c ON {t.Itemtype} = {c.pk}} WHERE {c.code} like '%" + query.trim()
					+ "%' OR {t.pk} like '%" + query.trim() + "%'";
		}
		else
		{

			queryString = "SELECT {pk} FROM {" + newcode + "}";
			//queryString = queryString + " WHERE {pk} like '%" + query + "%'";
		}

		/*
		 * if (mode == 0) { queryString = "SELECT {pk} FROM {" + code + "!}"; } else if (mode == 1) { queryString =
		 * "SELECT {pk} FROM {" + code + "}"; queryString = "SELECT {t.pk},{t.itemtype},{c.pk},{c.code} FROM {" + code +
		 * " as t LEFT JOIN composedtype AS c ON {t.Itemtype} = {c.pk}}"; }
		 */



		if (sort != null && dir != null && !sort.isEmpty() && !dir.isEmpty())
		{
			queryString = queryString + " ORDER BY {" + sort + "} " + dir;
		}
		System.out.println(queryString);
		final FlexibleSearchQuery fquery = new FlexibleSearchQuery(queryString);
		fquery.setStart(start);
		fquery.setCount(range);
		fquery.setNeedTotal(true);
		final SearchResult<Object> sr = flexibleSearchService.search(fquery);
		final int total = sr.getTotalCount();
		final List<Object> result = new ArrayList<Object>();
		result.addAll(sr.getResult());
		result.add(Integer.valueOf(total));
		return result;
	}

	/*
	 * (non-Javadoc)
	 *
	 * @see org.hybris.shanghai.daos.TypeBrowserDAO#findComposedTypes(java.lang.String)
	 */
	@Override
	public List<ComposedTypeModel> findComposedTypes(final String like)
	{
		JaloSession.getCurrentSession().setUser(UserManager.getInstance().getAdminEmployee());
		String queryString = null;
		if (StringUtils.isEmpty(like))
		{
			queryString = "SELECT {pk},{code} FROM {ComposedType} ORDER BY {code}";
		}
		else
		{
			queryString = "SELECT {pk} FROM {ComposedType} WHERE {code} like '%" + like + "%' ORDER BY {code}";
		}
		System.out.println(queryString);
		final FlexibleSearchQuery query = new FlexibleSearchQuery(queryString);
		return flexibleSearchService.<ComposedTypeModel> search(query).getResult();
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see org.hybris.shanghai.daos.TypeBrowserDAO#getAttributeType(java.lang.String, java.lang.String)
	 */
	@Override
	public TypeModel getAttributeTypeName(final String typepk, final String attributequalifier)
	{
		JaloSession.getCurrentSession().setUser(UserManager.getInstance().getAdminEmployee());
		assert !StringUtils.isEmpty(typepk);
		assert !StringUtils.isEmpty(attributequalifier);
		//"SELECT {pk},{name},{itemtype} FROM {Type} where {pk} IN (" + "{{"
		final String queryString = "SELECT {pk},{code},{itemtype} FROM {Type} where {pk} IN ( " + "{{" + "SELECT {attributeType}"
				+ "FROM {AttributeDescriptor}" + " WHERE {owner} = '" + typepk + "' and {qualifier}='" + attributequalifier + "'"
				+ "}}" + ")";
		System.out.println(queryString);
		final FlexibleSearchQuery query = new FlexibleSearchQuery(queryString);
		return flexibleSearchService.<TypeModel> searchUnique(query); //.<TypeModel> search(query).g.getResult();
	}

	/*
	 * (non-Javadoc)
	 *
	 * @see org.hybris.shanghai.daos.TypeBrowserDAO#getAttributeItemType(java.lang.String, java.lang.String)
	 */
	@Override
	public TypeModel getAttributeItemType(final String typepk)
	{
		JaloSession.getCurrentSession().setUser(UserManager.getInstance().getAdminEmployee());
		assert !StringUtils.isEmpty(typepk);

		final String queryString = "SELECT {pk},{code},{itemtype} FROM {Type} where {code}='" + typepk + "'";

		System.out.println(queryString);
		final FlexibleSearchQuery query = new FlexibleSearchQuery(queryString);
		return flexibleSearchService.<TypeModel> searchUnique(query); //.<TypeModel> search(query).g.getResult();
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see org.hybris.shanghai.daos.TypeBrowserDAO#getCollectionElementType(java.lang.String)
	 */
	@Override
	public TypeModel getCollectionElementType(final String pk)
	{
		JaloSession.getCurrentSession().setUser(UserManager.getInstance().getAdminEmployee());
		assert !StringUtils.isEmpty(pk);

		final String queryString = "SELECT {pk},{code},{elementType} FROM {collectiontype} WHERE {pk}='" + pk + "'";
		System.out.println(queryString);
		final FlexibleSearchQuery query = new FlexibleSearchQuery(queryString);
		final CollectionTypeModel ctm = flexibleSearchService.<CollectionTypeModel> searchUnique(query);
		System.out.println(ctm.getPk() + "|" + ctm.getCode() + "|" + ctm.getElementType());
		//String et = ctm.getElementType();

		return ctm.getElementType(); //.<TypeModel> search(query).g.getResult();
	}

	/*
	 * (non-Javadoc)
	 *
	 * @see org.hybris.shanghai.daos.TypeBrowserDAO#getLanguages()
	 */
	@Override
	public List<LanguageModel> getLanguages()
	{
		JaloSession.getCurrentSession().setUser(UserManager.getInstance().getAdminEmployee());
		final String queryString = "SELECT {pk},{Isocode} FROM {Language}";
		final FlexibleSearchQuery query = new FlexibleSearchQuery(queryString);
		return flexibleSearchService.<LanguageModel> search(query).getResult();
	}

	/*
	 * (non-Javadoc)
	 *
	 * @see org.hybris.shanghai.daos.TypeBrowserDAO#isAttributeLocalized(java.lang.String, java.lang.String)
	 */
	@Override
	public AttributeDescriptorModel getAttributeDescriptorModel(final String typepk, final String attributequalifier)
	{
		JaloSession.getCurrentSession().setUser(UserManager.getInstance().getAdminEmployee());
		assert !StringUtils.isEmpty(typepk);
		assert !StringUtils.isEmpty(attributequalifier);
		final String queryString = "SELECT {pk}" + "FROM {AttributeDescriptor}" + " WHERE {owner} = '" + typepk
				+ "' and {qualifier}='" + attributequalifier + "'";
		System.out.println(queryString);
		final FlexibleSearchQuery query = new FlexibleSearchQuery(queryString);
		return flexibleSearchService.<AttributeDescriptorModel> searchUnique(query); //.<TypeModel> search(query).g.getResult();
	}

}
