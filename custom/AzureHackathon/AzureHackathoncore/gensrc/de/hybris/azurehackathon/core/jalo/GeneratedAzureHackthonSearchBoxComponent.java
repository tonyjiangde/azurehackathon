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
import de.hybris.platform.acceleratorcms.jalo.components.SearchBoxComponent;
import de.hybris.platform.jalo.Item.AttributeMode;
import de.hybris.platform.jalo.SessionContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * Generated class for type {@link de.hybris.azurehackathon.core.jalo.AzureHackthonSearchBoxComponent AzureHackthonSearchBoxComponent}.
 */
@SuppressWarnings({"deprecation","unused","cast","PMD"})
public abstract class GeneratedAzureHackthonSearchBoxComponent extends SearchBoxComponent
{
	/** Qualifier of the <code>AzureHackthonSearchBoxComponent.apikey</code> attribute **/
	public static final String APIKEY = "apikey";
	/** Qualifier of the <code>AzureHackthonSearchBoxComponent.region</code> attribute **/
	public static final String REGION = "region";
	protected static final Map<String, AttributeMode> DEFAULT_INITIAL_ATTRIBUTES;
	static
	{
		final Map<String, AttributeMode> tmp = new HashMap<String, AttributeMode>(SearchBoxComponent.DEFAULT_INITIAL_ATTRIBUTES);
		tmp.put(APIKEY, AttributeMode.INITIAL);
		tmp.put(REGION, AttributeMode.INITIAL);
		DEFAULT_INITIAL_ATTRIBUTES = Collections.unmodifiableMap(tmp);
	}
	@Override
	protected Map<String, AttributeMode> getDefaultAttributeModes()
	{
		return DEFAULT_INITIAL_ATTRIBUTES;
	}
	
	/**
	 * <i>Generated method</i> - Getter of the <code>AzureHackthonSearchBoxComponent.apikey</code> attribute.
	 * @return the apikey - API_Key for consuming the Azure Service
	 */
	public String getApikey(final SessionContext ctx)
	{
		return (String)getProperty( ctx, APIKEY);
	}
	
	/**
	 * <i>Generated method</i> - Getter of the <code>AzureHackthonSearchBoxComponent.apikey</code> attribute.
	 * @return the apikey - API_Key for consuming the Azure Service
	 */
	public String getApikey()
	{
		return getApikey( getSession().getSessionContext() );
	}
	
	/**
	 * <i>Generated method</i> - Setter of the <code>AzureHackthonSearchBoxComponent.apikey</code> attribute. 
	 * @param value the apikey - API_Key for consuming the Azure Service
	 */
	public void setApikey(final SessionContext ctx, final String value)
	{
		setProperty(ctx, APIKEY,value);
	}
	
	/**
	 * <i>Generated method</i> - Setter of the <code>AzureHackthonSearchBoxComponent.apikey</code> attribute. 
	 * @param value the apikey - API_Key for consuming the Azure Service
	 */
	public void setApikey(final String value)
	{
		setApikey( getSession().getSessionContext(), value );
	}
	
	/**
	 * <i>Generated method</i> - Getter of the <code>AzureHackthonSearchBoxComponent.region</code> attribute.
	 * @return the region - region of the Azure Service
	 */
	public String getRegion(final SessionContext ctx)
	{
		return (String)getProperty( ctx, REGION);
	}
	
	/**
	 * <i>Generated method</i> - Getter of the <code>AzureHackthonSearchBoxComponent.region</code> attribute.
	 * @return the region - region of the Azure Service
	 */
	public String getRegion()
	{
		return getRegion( getSession().getSessionContext() );
	}
	
	/**
	 * <i>Generated method</i> - Setter of the <code>AzureHackthonSearchBoxComponent.region</code> attribute. 
	 * @param value the region - region of the Azure Service
	 */
	public void setRegion(final SessionContext ctx, final String value)
	{
		setProperty(ctx, REGION,value);
	}
	
	/**
	 * <i>Generated method</i> - Setter of the <code>AzureHackthonSearchBoxComponent.region</code> attribute. 
	 * @param value the region - region of the Azure Service
	 */
	public void setRegion(final String value)
	{
		setRegion( getSession().getSessionContext(), value );
	}
	
}
