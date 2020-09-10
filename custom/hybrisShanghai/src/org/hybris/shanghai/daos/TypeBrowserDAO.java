/**
 * Simple interface for retrieving type and item information for the typebrowser
 *
 * @author tao.jiang02@sap.com
 *
 */
package org.hybris.shanghai.daos;

import de.hybris.platform.core.model.c2l.LanguageModel;
import de.hybris.platform.core.model.type.AttributeDescriptorModel;
import de.hybris.platform.core.model.type.ComposedTypeModel;
import de.hybris.platform.core.model.type.TypeModel;

import java.util.List;


public interface TypeBrowserDAO
{
	/**
	 * Return a list of typemodels that are currently persisted. If none are found an empty list is returned.
	 *
	 * @return all composedtypes of the system
	 */
	List<ComposedTypeModel> findComposedTypes();

	List<ComposedTypeModel> findComposedTypes(String like);


	TypeModel getAttributeTypeName(String typepk, String attributequalifier);

	TypeModel getAttributeItemType(String typepk);

	TypeModel getCollectionElementType(String pk);

	List<LanguageModel> getLanguages();

	AttributeDescriptorModel getAttributeDescriptorModel(String typepk, String attributequalifier);

	/**
	 * Return a list of attributes with given type. If none is found, an empty list will be returned. paging is not
	 * enabled.
	 *
	 * @param typepk
	 *           the pk string of the type
	 * @return All attributes of the given type.
	 */
	List<AttributeDescriptorModel> getAttributsByCode(String typepk);

	List<AttributeDescriptorModel> getAttributsByCode(String typepk, String like);

	/**
	 * Return a list of items persisted of the given type. If none is found, an empty list will be returned.
	 *
	 * @param code
	 *           the type name
	 * @param mode
	 *           searches only the specified type and omits all subtypes by setting mode to 0 and search that type and
	 *           any subtypes by setting mode to 1
	 * @deprecated paging is required for better performance,so it is replaced by
	 *             {@link #getItemsByCodeWithPaging(String, int, int, int, String, String, String)}
	 * @return All items of the given type.
	 */
	@Deprecated
	List<Object> getItemsByCode(String code, int mode);

	/**
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
	List<Object> getItemsByCodeWithPaging(String code, int mode, int start, int range, String sort, String dir, String query)
			throws Exception;

	/**
	 * Return a model object with given type and pk
	 *
	 * @param type
	 *           the type name
	 * @param pkstring
	 *           the pk of an item
	 * @return An item model of the given type and pk.
	 */
	List<Object> getItemDetails(String type, String pkstring) throws Exception;

}
