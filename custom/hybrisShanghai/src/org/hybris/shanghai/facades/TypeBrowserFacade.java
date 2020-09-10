/**
 *
 */
package org.hybris.shanghai.facades;

import java.util.List;

import org.hybris.shanghai.data.AttributeTypeData;
import org.hybris.shanghai.data.AttributesData;
import org.hybris.shanghai.data.LanguageData;
import org.hybris.shanghai.data.MapTypeData;
import org.hybris.shanghai.data.TypeData;



/**
 * @author I314119
 *
 */
public interface TypeBrowserFacade
{
	/**
	 * Call method of getComposedTypes() from TypesBrowserService
	 *
	 * Return a list of type models that are currently persisted. If none are found an empty list is returned.
	 *
	 * @return all composed types of the system
	 */
	List<TypeData> getTypes();

	List<TypeData> getTypes(String like);

	AttributeTypeData getAttributeType(String typepk, String attributequalifier);


	boolean isAttributeLocalized(String typepk, String attributequalifier);

	//AttributeTypeData getAttributeItemType(String typepk, String attributequalifier);

	/**
	 * Call method of getAttributesofType() from TypesBrowserService
	 *
	 * Return a list of attribute descriptors that are currently persisted for the given type. If none are found an empty
	 * list is returned.
	 *
	 * @param pk
	 *           the pk string of the type
	 * @return all attribute descriptors of the given type
	 */
	List<AttributesData> getAttributes(String pk);

	List<AttributesData> getAttributes(String pk, String like);

	AttributesData getCollectionElementType(final String pk);

	/**
	 * Call method of getItemsByCode() from TypesBrowserService
	 *
	 * Return a list of items persisted of the given type. If none is found, an empty list will be returned.
	 *
	 * @param code
	 *           the type name
	 * @param mode
	 *           searches only the specified type and omits all subtypes by setting mode to 0 and search that type and
	 *           any subtypes by setting mode to 1
	 *
	 * @deprecated paging is required for better performance,so it is replaced by
	 *             {@link #getItemsByCodeWithPaging(String, int, int, int, String, String, String)}
	 * @return All items of the given type.
	 */
	@Deprecated
	String getItemsByCode(String code, int mode);


	List<MapTypeData> getMapTypes();

	/**
	 * Call method of getItemsByCodeWithPaging() from TypesBrowserService
	 *
	 * Return a list of items persisted of the given type. If none is found, an empty list will be returned. Paging is
	 * enabled
	 *
	 * @param code
	 *           the type name
	 * @param mode
	 *           searches only the specified type and omits all subtypes by setting mode to 0 and search that type and
	 *           any subtypes by setting mode to 1
	 * @param start
	 *           the search begins at the specified start index
	 * @param range
	 *           the search returns all items within the specified range
	 * @Param sort the name of a property need to be sorted
	 * @param dir
	 *           the direction of a sort i.e. DESC, ASC
	 * @param query
	 *           for searching items that certain properties of the item containing the given query string
	 *
	 * @return All items of the given type.
	 */
	String getItemsByCodeWithPaging(final String code, final int mode, final int start, final int range, final String sort,
			final String dir, final String query);

	/**
	 * Call method of getItemDetails() from TypesBrowserService
	 *
	 * Return a model object with given type and pk
	 *
	 * @param type
	 *           the type name
	 * @param pkstring
	 *           the pk of an item
	 * @return An item model of the given type and pk.
	 */
	String getItemDetails(String type, String pkstring);

	List<LanguageData> getLanguages();

	String httpget(String url);
}
