/**
 *
 */
package org.hybris.shanghai.fileupload;

/**
* @author i314119
*
*/
import org.springframework.web.multipart.MultipartFile;


public class LogfileUpload
{
	private MultipartFile file;

	public MultipartFile getFile()
	{
		return file;
	}

	public void setFile(final MultipartFile file)
	{
		this.file = file;
	}
}