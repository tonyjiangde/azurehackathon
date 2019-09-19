/*
 * ----------------------------------------------------------------
 * --- WARNING: THIS FILE IS GENERATED AND WILL BE OVERWRITTEN! ---
 * --- Generated at Sep 19, 2019 7:41:45 PM                     ---
 * ----------------------------------------------------------------
 *  
 * [y] hybris Platform
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */
package de.hybris.azurehackathon.core.jalo;

import de.hybris.azurehackathon.core.constants.AzureHackathonCoreConstants;
import de.hybris.azurehackathon.core.jalo.ApparelProduct;
import de.hybris.azurehackathon.core.jalo.ApparelSizeVariantProduct;
import de.hybris.azurehackathon.core.jalo.ApparelStyleVariantProduct;
import de.hybris.azurehackathon.core.jalo.AzureHackthonSearchBoxComponent;
import de.hybris.azurehackathon.core.jalo.ElectronicsColorVariantProduct;
import de.hybris.platform.acceleratorcms.jalo.components.AzureHackthonFAQBotComponent;
import de.hybris.platform.jalo.Item;
import de.hybris.platform.jalo.Item.AttributeMode;
import de.hybris.platform.jalo.JaloBusinessException;
import de.hybris.platform.jalo.JaloSystemException;
import de.hybris.platform.jalo.SessionContext;
import de.hybris.platform.jalo.extension.Extension;
import de.hybris.platform.jalo.security.Principal;
import de.hybris.platform.jalo.type.ComposedType;
import de.hybris.platform.jalo.type.JaloGenericCreationException;
import de.hybris.platform.jalo.user.User;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * Generated class for type <code>AzureHackathonCoreManager</code>.
 */
@SuppressWarnings({"deprecation","unused","cast","PMD"})
public abstract class GeneratedAzureHackathonCoreManager extends Extension
{
	protected static final Map<String, Map<String, AttributeMode>> DEFAULT_INITIAL_ATTRIBUTES;
	static
	{
		final Map<String, Map<String, AttributeMode>> ttmp = new HashMap();
		Map<String, AttributeMode> tmp = new HashMap<String, AttributeMode>();
		tmp.put("vrprofileid", AttributeMode.INITIAL);
		tmp.put("frpersonid", AttributeMode.INITIAL);
		ttmp.put("de.hybris.platform.jalo.user.User", Collections.unmodifiableMap(tmp));
		DEFAULT_INITIAL_ATTRIBUTES = ttmp;
	}
	@Override
	public Map<String, AttributeMode> getDefaultAttributeModes(final Class<? extends Item> itemClass)
	{
		Map<String, AttributeMode> ret = new HashMap<>();
		final Map<String, AttributeMode> attr = DEFAULT_INITIAL_ATTRIBUTES.get(itemClass.getName());
		if (attr != null)
		{
			ret.putAll(attr);
		}
		return ret;
	}
	
	public ApparelProduct createApparelProduct(final SessionContext ctx, final Map attributeValues)
	{
		try
		{
			ComposedType type = getTenant().getJaloConnection().getTypeManager().getComposedType( AzureHackathonCoreConstants.TC.APPARELPRODUCT );
			return (ApparelProduct)type.newInstance( ctx, attributeValues );
		}
		catch( JaloGenericCreationException e)
		{
			final Throwable cause = e.getCause();
			throw (cause instanceof RuntimeException ?
			(RuntimeException)cause
			:
			new JaloSystemException( cause, cause.getMessage(), e.getErrorCode() ) );
		}
		catch( JaloBusinessException e )
		{
			throw new JaloSystemException( e ,"error creating ApparelProduct : "+e.getMessage(), 0 );
		}
	}
	
	public ApparelProduct createApparelProduct(final Map attributeValues)
	{
		return createApparelProduct( getSession().getSessionContext(), attributeValues );
	}
	
	public ApparelSizeVariantProduct createApparelSizeVariantProduct(final SessionContext ctx, final Map attributeValues)
	{
		try
		{
			ComposedType type = getTenant().getJaloConnection().getTypeManager().getComposedType( AzureHackathonCoreConstants.TC.APPARELSIZEVARIANTPRODUCT );
			return (ApparelSizeVariantProduct)type.newInstance( ctx, attributeValues );
		}
		catch( JaloGenericCreationException e)
		{
			final Throwable cause = e.getCause();
			throw (cause instanceof RuntimeException ?
			(RuntimeException)cause
			:
			new JaloSystemException( cause, cause.getMessage(), e.getErrorCode() ) );
		}
		catch( JaloBusinessException e )
		{
			throw new JaloSystemException( e ,"error creating ApparelSizeVariantProduct : "+e.getMessage(), 0 );
		}
	}
	
	public ApparelSizeVariantProduct createApparelSizeVariantProduct(final Map attributeValues)
	{
		return createApparelSizeVariantProduct( getSession().getSessionContext(), attributeValues );
	}
	
	public ApparelStyleVariantProduct createApparelStyleVariantProduct(final SessionContext ctx, final Map attributeValues)
	{
		try
		{
			ComposedType type = getTenant().getJaloConnection().getTypeManager().getComposedType( AzureHackathonCoreConstants.TC.APPARELSTYLEVARIANTPRODUCT );
			return (ApparelStyleVariantProduct)type.newInstance( ctx, attributeValues );
		}
		catch( JaloGenericCreationException e)
		{
			final Throwable cause = e.getCause();
			throw (cause instanceof RuntimeException ?
			(RuntimeException)cause
			:
			new JaloSystemException( cause, cause.getMessage(), e.getErrorCode() ) );
		}
		catch( JaloBusinessException e )
		{
			throw new JaloSystemException( e ,"error creating ApparelStyleVariantProduct : "+e.getMessage(), 0 );
		}
	}
	
	public ApparelStyleVariantProduct createApparelStyleVariantProduct(final Map attributeValues)
	{
		return createApparelStyleVariantProduct( getSession().getSessionContext(), attributeValues );
	}
	
	public AzureHackthonFAQBotComponent createAzureHackthonFAQBotComponent(final SessionContext ctx, final Map attributeValues)
	{
		try
		{
			ComposedType type = getTenant().getJaloConnection().getTypeManager().getComposedType( AzureHackathonCoreConstants.TC.AZUREHACKTHONFAQBOTCOMPONENT );
			return (AzureHackthonFAQBotComponent)type.newInstance( ctx, attributeValues );
		}
		catch( JaloGenericCreationException e)
		{
			final Throwable cause = e.getCause();
			throw (cause instanceof RuntimeException ?
			(RuntimeException)cause
			:
			new JaloSystemException( cause, cause.getMessage(), e.getErrorCode() ) );
		}
		catch( JaloBusinessException e )
		{
			throw new JaloSystemException( e ,"error creating AzureHackthonFAQBotComponent : "+e.getMessage(), 0 );
		}
	}
	
	public AzureHackthonFAQBotComponent createAzureHackthonFAQBotComponent(final Map attributeValues)
	{
		return createAzureHackthonFAQBotComponent( getSession().getSessionContext(), attributeValues );
	}
	
	public AzureHackthonSearchBoxComponent createAzureHackthonSearchBoxComponent(final SessionContext ctx, final Map attributeValues)
	{
		try
		{
			ComposedType type = getTenant().getJaloConnection().getTypeManager().getComposedType( AzureHackathonCoreConstants.TC.AZUREHACKTHONSEARCHBOXCOMPONENT );
			return (AzureHackthonSearchBoxComponent)type.newInstance( ctx, attributeValues );
		}
		catch( JaloGenericCreationException e)
		{
			final Throwable cause = e.getCause();
			throw (cause instanceof RuntimeException ?
			(RuntimeException)cause
			:
			new JaloSystemException( cause, cause.getMessage(), e.getErrorCode() ) );
		}
		catch( JaloBusinessException e )
		{
			throw new JaloSystemException( e ,"error creating AzureHackthonSearchBoxComponent : "+e.getMessage(), 0 );
		}
	}
	
	public AzureHackthonSearchBoxComponent createAzureHackthonSearchBoxComponent(final Map attributeValues)
	{
		return createAzureHackthonSearchBoxComponent( getSession().getSessionContext(), attributeValues );
	}
	
	public ElectronicsColorVariantProduct createElectronicsColorVariantProduct(final SessionContext ctx, final Map attributeValues)
	{
		try
		{
			ComposedType type = getTenant().getJaloConnection().getTypeManager().getComposedType( AzureHackathonCoreConstants.TC.ELECTRONICSCOLORVARIANTPRODUCT );
			return (ElectronicsColorVariantProduct)type.newInstance( ctx, attributeValues );
		}
		catch( JaloGenericCreationException e)
		{
			final Throwable cause = e.getCause();
			throw (cause instanceof RuntimeException ?
			(RuntimeException)cause
			:
			new JaloSystemException( cause, cause.getMessage(), e.getErrorCode() ) );
		}
		catch( JaloBusinessException e )
		{
			throw new JaloSystemException( e ,"error creating ElectronicsColorVariantProduct : "+e.getMessage(), 0 );
		}
	}
	
	public ElectronicsColorVariantProduct createElectronicsColorVariantProduct(final Map attributeValues)
	{
		return createElectronicsColorVariantProduct( getSession().getSessionContext(), attributeValues );
	}
	
	/**
	 * <i>Generated method</i> - Getter of the <code>User.frpersonid</code> attribute.
	 * @return the frpersonid
	 */
	public String getFrpersonid(final SessionContext ctx, final User item)
	{
		return (String)item.getProperty( ctx, AzureHackathonCoreConstants.Attributes.User.FRPERSONID);
	}
	
	/**
	 * <i>Generated method</i> - Getter of the <code>User.frpersonid</code> attribute.
	 * @return the frpersonid
	 */
	public String getFrpersonid(final User item)
	{
		return getFrpersonid( getSession().getSessionContext(), item );
	}
	
	/**
	 * <i>Generated method</i> - Setter of the <code>User.frpersonid</code> attribute. 
	 * @param value the frpersonid
	 */
	public void setFrpersonid(final SessionContext ctx, final User item, final String value)
	{
		item.setProperty(ctx, AzureHackathonCoreConstants.Attributes.User.FRPERSONID,value);
	}
	
	/**
	 * <i>Generated method</i> - Setter of the <code>User.frpersonid</code> attribute. 
	 * @param value the frpersonid
	 */
	public void setFrpersonid(final User item, final String value)
	{
		setFrpersonid( getSession().getSessionContext(), item, value );
	}
	
	@Override
	public String getName()
	{
		return AzureHackathonCoreConstants.EXTENSIONNAME;
	}
	
	/**
	 * <i>Generated method</i> - Getter of the <code>User.vrprofileid</code> attribute.
	 * @return the vrprofileid
	 */
	public String getVrprofileid(final SessionContext ctx, final User item)
	{
		return (String)item.getProperty( ctx, AzureHackathonCoreConstants.Attributes.User.VRPROFILEID);
	}
	
	/**
	 * <i>Generated method</i> - Getter of the <code>User.vrprofileid</code> attribute.
	 * @return the vrprofileid
	 */
	public String getVrprofileid(final User item)
	{
		return getVrprofileid( getSession().getSessionContext(), item );
	}
	
	/**
	 * <i>Generated method</i> - Setter of the <code>User.vrprofileid</code> attribute. 
	 * @param value the vrprofileid
	 */
	public void setVrprofileid(final SessionContext ctx, final User item, final String value)
	{
		item.setProperty(ctx, AzureHackathonCoreConstants.Attributes.User.VRPROFILEID,value);
	}
	
	/**
	 * <i>Generated method</i> - Setter of the <code>User.vrprofileid</code> attribute. 
	 * @param value the vrprofileid
	 */
	public void setVrprofileid(final User item, final String value)
	{
		setVrprofileid( getSession().getSessionContext(), item, value );
	}
	
}
