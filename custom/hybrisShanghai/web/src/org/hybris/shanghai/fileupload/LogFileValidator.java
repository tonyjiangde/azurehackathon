/**
 *
 */
package org.hybris.shanghai.fileupload;

/**
 * @author i314119
 *
 */
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;


public class LogFileValidator implements Validator
{

	/*
	 * (non-Javadoc)
	 * 
	 * @see org.springframework.validation.Validator#supports(java.lang.Class)
	 */
	@Override
	public boolean supports(final Class<?> arg0)
	{
		// YTODO Auto-generated method stub
		return LogfileUpload.class.isAssignableFrom(arg0);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see org.springframework.validation.Validator#validate(java.lang.Object, org.springframework.validation.Errors)
	 */
	@Override
	public void validate(final Object arg0, final Errors arg1)
	{
		// YTODO Auto-generated method stub
		final LogfileUpload file = (LogfileUpload) arg0;
		if (file.getFile().getSize() == 0)
		{
			arg1.reject("file", "Please select a file!");
		}
	}

}


