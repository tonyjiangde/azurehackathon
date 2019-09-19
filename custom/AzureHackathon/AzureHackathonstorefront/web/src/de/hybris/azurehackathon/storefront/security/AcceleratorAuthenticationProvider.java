/*
 * [y] hybris Platform
 *
 * Copyright (c) 2018 SAP SE or an SAP affiliate company.  All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */
package de.hybris.azurehackathon.storefront.security;

import de.hybris.azurehackathon.core.util.AzureFaceAPIClient;
import de.hybris.azurehackathon.core.util.DetectResult;
import de.hybris.azurehackathon.core.util.IdentifyResult;
import de.hybris.azurehackathon.core.util.SpeakerVerificationRestClient;
import de.hybris.azurehackathon.core.util.contract.verification.Result;
import de.hybris.azurehackathon.core.util.contract.verification.Verification;
import de.hybris.platform.acceleratorstorefrontcommons.security.AbstractAcceleratorAuthenticationProvider;
import de.hybris.platform.core.Constants;
import de.hybris.platform.core.Registry;
import de.hybris.platform.core.model.user.UserModel;
import de.hybris.platform.jalo.JaloConnection;
import de.hybris.platform.jalo.JaloSession;
import de.hybris.platform.jalo.user.User;
import de.hybris.platform.jalo.user.UserManager;
import de.hybris.platform.servicelayer.config.ConfigurationService;
import de.hybris.platform.servicelayer.exceptions.UnknownIdentifierException;
import de.hybris.platform.servicelayer.model.ModelService;
import de.hybris.platform.servicelayer.user.UserService;
import de.hybris.platform.spring.security.CoreUserDetails;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.Base64;
import java.util.Collections;
import java.util.UUID;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;


/**
 * Derived authentication provider supporting additional authentication checks. See
 * {@link de.hybris.platform.spring.security.RejectUserPreAuthenticationChecks}.
 *
 * <ul>
 * <li>prevent login without password for users created via CSCockpit</li>
 * <li>prevent login as user in group admingroup</li>
 * </ul>
 *
 * any login as admin disables SearchRestrictions and therefore no page can be viewed correctly
 */
public class AcceleratorAuthenticationProvider extends AbstractAcceleratorAuthenticationProvider
{


	private static final String ROLE_ADMIN_GROUP = "ROLE_" + Constants.USER.ADMIN_USERGROUP.toUpperCase();

	private GrantedAuthority adminAuthority = new SimpleGrantedAuthority(ROLE_ADMIN_GROUP);

	private UserService userService;
	private ModelService modelService;
	private ConfigurationService configurationService;

	/**
	 * @return the configurationService
	 */

	public ConfigurationService getConfigurationService()
	{
		return configurationService;
	}

	/**
	 * @param configurationService
	 *           the configurationService to set
	 */
	@Required
	public void setConfigurationService(final ConfigurationService configurationService)
	{
		this.configurationService = configurationService;
	}

	/**
	 * @return the modelService
	 */
	@Override
	public ModelService getModelService()
	{
		return modelService;
	}

	/**
	 * @param modelService
	 *           the modelService to set
	 */
	@Override
	@Required
	public void setModelService(final ModelService modelService)
	{
		this.modelService = modelService;
	}

	/**
	 * @return the userService
	 */
	@Override
	public UserService getUserService()
	{
		return userService;
	}

	/**
	 * @param userService
	 *           the userService to set
	 */
	@Override
	@Required
	public void setUserService(final UserService userService)
	{
		this.userService = userService;
	}

	/**
	 * @see de.hybris.platform.acceleratorstorefrontcommons.security.AbstractAcceleratorAuthenticationProvider#additionalAuthenticationChecks(org.springframework.security.core.userdetails.UserDetails,
	 *      org.springframework.security.authentication.AbstractAuthenticationToken)
	 */
	@Override
	protected void additionalAuthenticationChecks(final UserDetails details, final AbstractAuthenticationToken authentication)
			throws AuthenticationException
	{
		super.additionalAuthenticationChecks(details, authentication);

		// Check if the user is in role admingroup
		if (getAdminAuthority() != null && details.getAuthorities().contains(getAdminAuthority()))
		{
			throw new LockedException("Login attempt as " + Constants.USER.ADMIN_USERGROUP + " is rejected");
		}
	}


	@Override
	public Authentication authenticate(final Authentication authentication) throws AuthenticationException
	{

		if ((authentication.getCredentials() instanceof String)
				&& ((String) authentication.getCredentials()).startsWith("data:audio"))
		{
			final String username = (authentication.getPrincipal() == null) ? "NONE_PROVIDED" : authentication.getName();
			UserModel userModel = null;

			// throw BadCredentialsException if user does not exist
			try
			{
				userModel = getUserService().getUserForUID(StringUtils.lowerCase(username));
				if (org.springframework.util.StringUtils.isEmpty(userModel.getVrprofileid()))
				{
					throw new BadCredentialsException("There is no profile created for this customer!");
				}
			}
			catch (final UnknownIdentifierException e)
			{

				throw new BadCredentialsException(messages.getMessage(CORE_AUTHENTICATION_PROVIDER_BAD_CREDENTIALS, BAD_CREDENTIALS),
						e);
			}

			// throw BadCredentialsException if the user does not belong to customer user group
			if (!getUserService().isMemberOfGroup(userModel, getUserService().getUserGroupForUID(Constants.USER.CUSTOMER_USERGROUP)))
			{
				throw new BadCredentialsException(messages.getMessage(CORE_AUTHENTICATION_PROVIDER_BAD_CREDENTIALS, BAD_CREDENTIALS));
			}
			//======
			if (Registry.hasCurrentTenant() && JaloConnection.getInstance().isSystemInitialized())
			{


				UserDetails userDetails = null;

				try
				{
					userDetails = retrieveUser(username);
				}
				catch (final UsernameNotFoundException notFound)
				{
					throw new BadCredentialsException(
							messages.getMessage("CoreAuthenticationProvider.badCredentials", "Bad credentials"), notFound);
				}

				//getPreAuthenticationChecks().check(userDetails);

				final User user = UserManager.getInstance().getUserByLogin(userDetails.getUsername());
				// FORM based check
				final Object credential = authentication.getCredentials();

				if (credential instanceof String)
				{
					final String endpoint = configurationService.getConfiguration()
							.getString("azurehackthon2019.speakerrecognition.endpoint");
					final String key = configurationService.getConfiguration().getString("azurehackthon2019.speakerrecognition.key");
					final SpeakerVerificationRestClient sv = new SpeakerVerificationRestClient(endpoint, key);
					final byte[] decodedByte = Base64.getDecoder().decode(((String) credential).split(",")[1]);
					final InputStream stream = new ByteArrayInputStream(decodedByte);
					try
					{
						final Verification vf = sv.verify(stream, UUID.fromString(userModel.getVrprofileid()));
						System.out.println(vf.result);
						if (vf.result.equals(Result.ACCEPT))
						{
							additionalAuthenticationChecks(userDetails, (AbstractAuthenticationToken) authentication);
							// finally, set user in session
							JaloSession.getCurrentSession().setUser(user);
							return createSuccessAuthentication(authentication, userDetails);
						}
						else
						{
							throw new BadCredentialsException(
									messages.getMessage("CoreAuthenticationProvider.badCredentials", "Bad credentials"));
						}

					}
					catch (final Exception e)
					{
						e.printStackTrace();
						throw new BadCredentialsException(e.getMessage());
					}


				}

				else
				{
					throw new BadCredentialsException(
							messages.getMessage("CoreAuthenticationProvider.badCredentials", "Bad credentials"));
				}


			}
			else
			{
				return createSuccessAuthentication(//
						authentication, //
						new CoreUserDetails("systemNotInitialized", "systemNotInitialized", true, false, true, true,
								Collections.EMPTY_LIST, null));
			}

		}
		else if ((authentication.getCredentials() instanceof String)
				&& ((String) authentication.getCredentials()).startsWith("data:image"))
		{
			final String username = (authentication.getPrincipal() == null) ? "NONE_PROVIDED" : authentication.getName();
			UserModel userModel = null;

			// throw BadCredentialsException if user does not exist
			try
			{
				userModel = getUserService().getUserForUID(StringUtils.lowerCase(username));
				if (org.springframework.util.StringUtils.isEmpty(userModel.getFrpersonid()))
				{
					throw new BadCredentialsException("There is no profile created for this customer!");
				}
			}
			catch (final UnknownIdentifierException e)
			{

				throw new BadCredentialsException(messages.getMessage(CORE_AUTHENTICATION_PROVIDER_BAD_CREDENTIALS, BAD_CREDENTIALS),
						e);
			}
			// throw BadCredentialsException if the user does not belong to customer user group
			if (!getUserService().isMemberOfGroup(userModel, getUserService().getUserGroupForUID(Constants.USER.CUSTOMER_USERGROUP)))
			{
				throw new BadCredentialsException(messages.getMessage(CORE_AUTHENTICATION_PROVIDER_BAD_CREDENTIALS, BAD_CREDENTIALS));
			}
			//======
			if (Registry.hasCurrentTenant() && JaloConnection.getInstance().isSystemInitialized())
			{


				UserDetails userDetails = null;

				try
				{
					userDetails = retrieveUser(username);
				}
				catch (final UsernameNotFoundException notFound)
				{
					throw new BadCredentialsException(
							messages.getMessage("CoreAuthenticationProvider.badCredentials", "Bad credentials"), notFound);
				}

				//getPreAuthenticationChecks().check(userDetails);

				final User user = UserManager.getInstance().getUserByLogin(userDetails.getUsername());
				// FORM based check
				final Object credential = authentication.getCredentials();

				if (credential instanceof String)
				{
					final AzureFaceAPIClient client = new AzureFaceAPIClient(
							configurationService.getConfiguration().getString("azurehackthon2019.facerecognition.key"),
							configurationService.getConfiguration().getString("azurehackthon2019.facerecognition.endpoint"));
					final byte[] decodedByte = Base64.getDecoder().decode(((String) credential).split(",")[1]);
					DetectResult[] d;
					try
					{
						d = client.detect(decodedByte, userModel.getUid());
						if (d != null && d.length > 0 && d[0] != null
								&& !org.springframework.util.StringUtils.isEmpty(d[0].getFaceId()))
						{
							System.out.println(d[0].getFaceId());
							final IdentifyResult[] result = client.identify(d[0].getFaceId());
							if (result != null && result.length == 1 && result[0].getCandidates() != null
									&& result[0].getCandidates().length == 1
									&& result[0].getCandidates()[0].getPersonId().equals(userModel.getFrpersonid()))
							{
								System.out.println("Face identified with id:" + result[0].getCandidates()[0].getPersonId()
										+ " with confidence: " + result[0].getCandidates()[0].getConfidence());
								additionalAuthenticationChecks(userDetails, (AbstractAuthenticationToken) authentication);
								// finally, set user in session
								JaloSession.getCurrentSession().setUser(user);
								return createSuccessAuthentication(authentication, userDetails);
							}
							else
							{
								throw new BadCredentialsException(
										messages.getMessage("CoreAuthenticationProvider.badCredentials", "Bad credentials"));
							}
						}
						else
						{
							throw new BadCredentialsException("No faces detected!");
						}
					}
					catch (final Exception e)
					{
						// XXX Auto-generated catch block
						e.printStackTrace();
						throw new BadCredentialsException(
								messages.getMessage("CoreAuthenticationProvider.badCredentials", "Bad credentials"));
					}




				}

				else
				{
					throw new BadCredentialsException(
							messages.getMessage("CoreAuthenticationProvider.badCredentials", "Bad credentials"));
				}


			}
			else
			{
				return createSuccessAuthentication(//
						authentication, //
						new CoreUserDetails("systemNotInitialized", "systemNotInitialized", true, false, true, true,
								Collections.EMPTY_LIST, null));
			}


		}
		else
		{
			return super.authenticate(authentication);
		}

	}

	public void setAdminGroup(final String adminGroup)
	{
		if (StringUtils.isBlank(adminGroup))
		{
			adminAuthority = null;
		}
		else
		{
			adminAuthority = new SimpleGrantedAuthority(adminGroup);
		}
	}

	protected GrantedAuthority getAdminAuthority()
	{
		return adminAuthority;
	}
}
