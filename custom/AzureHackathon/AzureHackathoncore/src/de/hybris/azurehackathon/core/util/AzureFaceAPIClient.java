package de.hybris.azurehackathon.core.util;
/**
 *
 */


import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Date;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.DefaultHttpClient;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;






/**
 * @author i314119
 *
 */
public class AzureFaceAPIClient
{
	private static final String OCP_SUBSCRIPTION_KEY_HEADER = "Ocp-Apim-Subscription-Key";

	private static final String JSON_HEADER_VALUE_ACCEPT = "application/json";

	private static final String JSON_HEADER_ACCEPT = "accept";

	private final String subscriptionKey;

	private final Gson gson;

	private final String endpoint;
	private final HttpClient defaultHttpClient;

	public AzureFaceAPIClient(final String subscriptionKey, final String endpoint)
	{
		this.subscriptionKey = subscriptionKey;
		this.endpoint = endpoint;
		defaultHttpClient = new DefaultHttpClient();
		gson = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:SS.SSS").create();
	}

	public int getStatusCode(final HttpResponse response)
	{
		return response.getStatusLine().getStatusCode();
	}

	public HttpUriRequest createHttpRequest(final String resourceURL, final RequestType requestType)
	{
		HttpUriRequest request;

		switch (requestType)
		{
			case GET:
				request = new HttpGet(resourceURL);
				break;
			case POST:
				request = new HttpPost(resourceURL);
				break;
			case DELETE:
				request = new HttpDelete(resourceURL);
				break;
			case PUT:
				request = new HttpPut(resourceURL);
				break;
			default:
				return null;
		}

		request.addHeader(JSON_HEADER_ACCEPT, JSON_HEADER_VALUE_ACCEPT);
		request.addHeader(OCP_SUBSCRIPTION_KEY_HEADER, subscriptionKey);
		return request;
	}

	public String httpResponseToString(final HttpResponse response) throws IOException
	{
		final InputStream responseStream = response.getEntity().getContent();
		final BufferedReader reader = new BufferedReader(new InputStreamReader(responseStream));
		String str;
		final StringBuilder stringResponse = new StringBuilder();
		while ((str = reader.readLine()) != null)
		{
			stringResponse.append(str);
		}
		return stringResponse.toString();
	}

	public HttpEntity addStreamToEntity(final InputStream someStream, final String fieldName, final String fileName)
			throws IOException
	{
		final ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
		int bytesRead;
		final byte[] bytes = new byte[1024];
		while ((bytesRead = someStream.read(bytes)) > 0)
		{
			byteArrayOutputStream.write(bytes, 0, bytesRead);
		}
		final byte[] data = byteArrayOutputStream.toByteArray();

		final MultipartEntityBuilder builder = MultipartEntityBuilder.create();
		builder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
		builder.setStrictMode();
		builder.addBinaryBody(fieldName, data, ContentType.APPLICATION_OCTET_STREAM, fileName);
		return builder.build();
	}



	public String createPersonGroup(final String personGroupId) throws Exception
	{
		final String requestUrl = endpoint + "/persongroups/" + personGroupId;
		final HttpPut request = (HttpPut) this.createHttpRequest(requestUrl, RequestType.PUT);
		final String JSON_STRING = "{\"name\": \"" + personGroupId
				+ "\",\"userData\": \"persongroup for customers.\",\"recognitionModel\": \"recognition_02\"}";
		final StringEntity requestEntity = new StringEntity(JSON_STRING, ContentType.APPLICATION_JSON);
		/*
		 * final List<NameValuePair> paramsList = new ArrayList<>(); paramsList.add(new BasicNameValuePair("name",
		 * personGroupId)); paramsList.add(new BasicNameValuePair("userData", "persongroup for customers"));
		 * paramsList.add(new BasicNameValuePair("recognitionModel", "recognition_02"));
		 */
		//request.setEntity(new UrlEncodedFormEntity(paramsList));
		request.setEntity(requestEntity);
		final HttpResponse response = defaultHttpClient.execute(request);
		final int statusCode = this.getStatusCode(response);
		final String stringResponse = this.httpResponseToString(response);
		if (statusCode == HttpStatus.SC_OK)
		{
			return "SUCCESS";
		}
		else
		{
			throw new Exception(statusCode + ":" + stringResponse);
		}
	}

	public PersonGroupPersonResult createPersonGroupPerson(final String personGroupId, final String personname) throws Exception
	{
		final String requestUrl = endpoint + "/persongroups/" + personGroupId + "/persons";
		final HttpPost request = (HttpPost) this.createHttpRequest(requestUrl, RequestType.POST);
		final String JSON_STRING = "{\"name\": \"" + personname + "\"}";
		final StringEntity requestEntity = new StringEntity(JSON_STRING, ContentType.APPLICATION_JSON);
		request.setEntity(requestEntity);
		final HttpResponse response = defaultHttpClient.execute(request);
		final int statusCode = this.getStatusCode(response);
		final String stringResponse = this.httpResponseToString(response);
		if (statusCode == HttpStatus.SC_OK)
		{
			return gson.fromJson(stringResponse, PersonGroupPersonResult.class);
		}
		else
		{
			throw new Exception(statusCode + ":" + stringResponse);
		}

	}

	public DetectResult[] detect(final byte[] stream, final String id) throws Exception
	{
		//https://{endpoint}/face/v1.0/detect[?returnFaceId][&returnFaceLandmarks][&returnFaceAttributes][&recognitionModel][&returnRecognitionModel][&detectionModel]
		final String requestUrl = endpoint + "/detect/?recognitionModel=recognition_02&detectionModel=detection_02";
		final HttpPost request = (HttpPost) this.createHttpRequest(requestUrl, RequestType.POST);
		final String fileName = id + "_" + new Date() + ".jpg";
		final ByteArrayEntity reqEntity = new ByteArrayEntity(stream, ContentType.APPLICATION_OCTET_STREAM);
		//final HttpEntity entity = this.addStreamToEntity(stream, "data", fileName);
		//String responseXml = EntityUtils.toString(entity);
		//System.out.print(responseXml);
		request.setEntity(reqEntity);
		request.addHeader("Content-Type", "application/octet-stream");
		final HttpResponse response = defaultHttpClient.execute(request);

		final int statusCode = this.getStatusCode(response);
		final String stringResponse = this.httpResponseToString(response);

		if (statusCode == HttpStatus.SC_OK)
		{
			return gson.fromJson(stringResponse, DetectResult[].class);
		}
		else
		{
			throw new Exception(statusCode + ":" + stringResponse);
		}
	}

	public AddFaceResult addFace(final String personGroupId, final String personId, final byte[] stream) throws Exception
	{
		//https://{endpoint}/face/v1.0/persongroups/{personGroupId}/persons/{personId}/persistedFaces[?userData][&targetFace][&detectionModel]
		final String requestUrl = endpoint + "/persongroups/" + personGroupId + "/persons/" + personId
				+ "/persistedFaces?detectionModel=detection_02";
		final HttpPost request = (HttpPost) this.createHttpRequest(requestUrl, RequestType.POST);
		final String fileName = personId + "_" + new Date() + ".jpg";
		final ByteArrayEntity reqEntity = new ByteArrayEntity(stream, ContentType.APPLICATION_OCTET_STREAM);
		request.setEntity(reqEntity);
		request.addHeader("Content-Type", "application/octet-stream");
		final HttpResponse response = defaultHttpClient.execute(request);

		final int statusCode = this.getStatusCode(response);
		final String stringResponse = this.httpResponseToString(response);

		if (statusCode == HttpStatus.SC_OK)
		{
			return gson.fromJson(stringResponse, AddFaceResult.class);
		}
		else
		{
			throw new Exception(statusCode + ":" + stringResponse);
		}
	}

	public String train(final String personGroupId) throws Exception
	{
		//https://{endpoint}/face/v1.0/persongroups/{personGroupId}/train
		final String requestUrl = endpoint + "/persongroups/" + personGroupId + "/train";
		final HttpPost request = (HttpPost) this.createHttpRequest(requestUrl, RequestType.POST);
		final HttpResponse response = defaultHttpClient.execute(request);
		final String stringResponse = this.httpResponseToString(response);
		final int statusCode = this.getStatusCode(response);
		if (statusCode == HttpStatus.SC_ACCEPTED)
		{
			return "SUCCESS";
		}
		else
		{
			throw new Exception(statusCode + ":" + stringResponse);
		}

	}

	public TrainingStatus getTrainingStatus(final String personGroupId) throws Exception
	{
		//https://{endpoint}/face/v1.0/persongroups/{personGroupId}/training
		final String requestUrl = endpoint + "/persongroups/" + personGroupId + "/training";
		final HttpGet request = (HttpGet) this.createHttpRequest(requestUrl, RequestType.GET);
		final HttpResponse response = defaultHttpClient.execute(request);
		final String stringResponse = this.httpResponseToString(response);
		final int statusCode = this.getStatusCode(response);
		if (statusCode == HttpStatus.SC_OK)
		{
			return gson.fromJson(stringResponse, TrainingStatus.class);
		}
		else
		{
			throw new Exception(statusCode + ":" + stringResponse);
		}

	}


	public IdentifyResult[] identify(final String faceid) throws Exception
	{
		//https://{endpoint}/face/v1.0/identify
		final String requestUrl = endpoint + "/identify";
		final HttpPost request = (HttpPost) this.createHttpRequest(requestUrl, RequestType.POST);
		final String JSON_STRING = "{\"personGroupId\": \"customers\",\"faceIds\": [\"" + faceid
				+ "\"],\"maxNumOfCandidatesReturned\":1,\"confidenceThreshold\": 0.5}";
		System.out.println(JSON_STRING);
		final StringEntity requestEntity = new StringEntity(JSON_STRING, ContentType.APPLICATION_JSON);
		request.setEntity(requestEntity);
		final HttpResponse response = defaultHttpClient.execute(request);
		final String stringResponse = this.httpResponseToString(response);
		final int statusCode = this.getStatusCode(response);
		if (statusCode == HttpStatus.SC_OK)
		{
			return gson.fromJson(stringResponse, IdentifyResult[].class);
		}
		else
		{
			throw new Exception(statusCode + ":" + stringResponse);
		}

	}


}
