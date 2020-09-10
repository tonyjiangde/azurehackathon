/**
 *
 */
package org.hybris.shanghai.web.controller;

//import de.hybris.platform.hac.facade.impl.ThreadMonitor;
import de.hybris.platform.servicelayer.config.ConfigurationService;
import de.hybris.tools.system.tgw.TGW;
import de.hybris.tools.system.tgw.TGW.Report;
import de.hybris.tools.system.tgw.ThreadDumpSourceType;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.Properties;
import java.util.concurrent.ExecutionException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import org.hybris.shanghai.facades.ThreadDumpAnalyzerFacade;
import org.hybris.shanghai.fileupload.LogFileValidator;
import org.hybris.shanghai.fileupload.LogfileUpload;
import org.hybris.shanghai.utils.AnalyzerResult;
import org.hybris.shanghai.utils.JdbclogAnalyzer;
import org.hybris.shanghai.utils.ThreadMonitor;
import org.hybris.shanghai.utils.threaddumpanalyzer.TDA;
import org.hybris.shanghai.utils.threaddumpanalyzer.ThreadDumpAnalyzerData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.ObjectMapper;

import httl.Engine;
import httl.Template;


/**
 * @author i314119
 *
 */
@Controller
//@RequestMapping("/upload.do")
public class FileUploadController
{


	//private ThreadDumpCollector dumpCollector = null;

	public FileUploadController()
	{
		//this.dumpCollector = new ThreadDumpCollector();
	}

	@Autowired
	LogFileValidator validator;

	@Autowired
	private ThreadDumpAnalyzerFacade threadDumpAnalyzerFacade;

	@Autowired
	JdbclogAnalyzer jdbclogAnalyzer;

	@Autowired
	private ConfigurationService configurationService;

	@InitBinder
	private void initBinder(final WebDataBinder binder)
	{
		binder.setValidator(validator);
	}

	@RequestMapping(value = "/upload", method = RequestMethod.GET)
	public @ResponseBody String provideUploadInfo()
	{
		return "You can upload a file by posting to this same URL.";
	}


	@RequestMapping(value = "/uploadthreaddump/{type}", method = RequestMethod.POST)
	public @ResponseBody String handleThreadDumpFileUpload(@PathVariable
	final String type, final Model model, @Validated
	final LogfileUpload file, final BindingResult result)
	{
		try
		{
			String savedDirectory = ".." + File.separator + ".." + File.separator + ".." + File.separator + ".." + File.separator;
			String fname = file.getFile().getOriginalFilename();
			String name = savedDirectory + fname;
			File f = new File(name);
			final byte[] bytes = file.getFile().getBytes();
			final BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(f));
			stream.write(bytes);
			stream.close();
			final String[] ex = fname.split("\\.");
			final ArrayList<String> files = new ArrayList<String>();
			String foldername = "";
			if (ex.length > 1 && ex[ex.length - 1].toLowerCase().equals("zip"))
			{
				foldername = java.util.UUID.randomUUID().toString();
				final ZipFile zipFile = new ZipFile(f);
				final Enumeration emu = zipFile.entries();
				savedDirectory = savedDirectory + foldername + File.separator;
				while (emu.hasMoreElements())
				{

					final ZipEntry entry = (ZipEntry) emu.nextElement();
					if (entry.isDirectory())
					{
						//new File(savedDirectory + entry.getName()).mkdirs();
						continue;
					}
					else if (entry.getName().startsWith(".") || entry.getName().startsWith("__MACOSX"))
					{
						continue;
					}
					final BufferedInputStream bis = new BufferedInputStream(zipFile.getInputStream(entry));
					fname = entry.getName();
					f = new File(savedDirectory + entry.getName());
					name = f.getAbsolutePath();
					files.add(name);
					final File parent = f.getParentFile();
					if (parent != null && (!parent.exists()))
					{
						parent.mkdirs();
					}
					final FileOutputStream fos = new FileOutputStream(f, false);
					final BufferedOutputStream bos = new BufferedOutputStream(fos, 2048);

					int count;
					final byte data[] = new byte[2048];
					while ((count = bis.read(data, 0, 2048)) != -1)
					{
						bos.write(data, 0, count);
					}
					bos.flush();
					bos.close();
					bis.close();
				}
				zipFile.close();
			}
			else
			{
				files.add(f.getAbsolutePath());
			}
			final ArrayList<ThreadDumpAnalyzerData> results = new ArrayList<ThreadDumpAnalyzerData>();
			for (final String filepath : files)
			{
				TDA.ThreadDumpSourceType tdst = TDA.ThreadDumpSourceType.HAC;
				if (type.toLowerCase().equals("hac"))
				{
					tdst = TDA.ThreadDumpSourceType.HAC;
				}
				else if (type.toLowerCase().equals("jstack"))
				{
					tdst = TDA.ThreadDumpSourceType.JSTACK;
				}
				final ThreadDumpAnalyzerData tdad = threadDumpAnalyzerFacade.analyzeThreadDumpFile(filepath, tdst);
				if (tdad != null)
				{
					results.add(tdad);
				}
			}
			//name = f.getAbsolutePath();


			//		try
			//		{
			//			final byte[] bytes = file.getFile().getBytes();
			//			final BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(f));
			//			stream.write(bytes);
			//			stream.close();
			//			final String[] ex = fname.split("\\.");
			//			//System.out.println(ex.length + "!" + ex[ex.length - 1].toLowerCase());
			//			if (ex.length > 1 && ex[ex.length - 1].toLowerCase().equals("zip"))
			//			{
			//				final ZipFile zipFile = new ZipFile(f);
			//				final Enumeration emu = zipFile.entries();
			//
			//				while (emu.hasMoreElements())
			//				{
			//					final ZipEntry entry = (ZipEntry) emu.nextElement();
			//					if (entry.isDirectory())
			//					{
			//						new File(savedDirectory + entry.getName()).mkdirs();
			//						continue;
			//					}
			//					final BufferedInputStream bis = new BufferedInputStream(zipFile.getInputStream(entry));
			//					fname = entry.getName();
			//					f = new File(savedDirectory + entry.getName());
			//					name = f.getAbsolutePath();
			//					final File parent = f.getParentFile();
			//					if (parent != null && (!parent.exists()))
			//					{
			//						parent.mkdirs();
			//					}
			//					final FileOutputStream fos = new FileOutputStream(f, false);
			//					final BufferedOutputStream bos = new BufferedOutputStream(fos, 2048);
			//
			//					int count;
			//					final byte data[] = new byte[2048];
			//					while ((count = bis.read(data, 0, 2048)) != -1)
			//					{
			//						bos.write(data, 0, count);
			//					}
			//					bos.flush();
			//					bos.close();
			//					bis.close();
			//				}
			//				zipFile.close();
			//			}
			//			final BufferedReader in = new BufferedReader(new FileReader(name));
			//			final StringBuffer sb = new StringBuffer();
			//			String line;
			//			while ((line = in.readLine()) != null)
			//			{
			//				sb.append(line);
			//				sb.append("\n");
			//			}
			//			in.close();
			//			final TDA tda = new TDA();
			//			final ParsedThreads pt = tda.importFile(name, TDA.ThreadDumpSourceType.HAC);
			//			final ThreadDumpAnalyzerData tdad = new ThreadDumpAnalyzerData();
			//			final HashMap<Long, ThreadData> threaddatas = new HashMap<Long, ThreadData>();
			//			//System.out.println(pt.getThreads().size() + "!!!!");
			//			for (final Thread thread : pt.getThreads())
			//			{
			//				final ThreadData td = new ThreadData();
			//				td.setName(thread.getName());
			//				td.setPrio(Long.valueOf(thread.getPrio()));
			//				final Long tid = Long.parseLong(thread.getTid().substring(2), 16);
			//				td.setTid(tid);
			//				td.setNid(Long.parseLong(thread.getNid().substring(2), 16));
			//				td.setState(thread.getStateString());
			//				td.setDetails(thread.getDetails());
			//				threaddatas.put(tid, td);
			//			}
			//			tdad.setLogfile(sb.toString());
			//			final ArrayList<Long> twfm = new ArrayList<Long>();
			//			for (final Thread thread : pt.getThreadsWFMonitors())
			//			{
			//				twfm.add(Long.parseLong(thread.getTid().substring(2), 16));
			//			}
			//
			//			final ArrayList<Long> tsom = new ArrayList<Long>();
			//			for (final Thread thread : pt.getThreadsSOMonitors())
			//			{
			//				tsom.add(Long.parseLong(thread.getTid().substring(2), 16));
			//			}
			//
			//			final ArrayList<Long> tlm = new ArrayList<Long>();
			//			for (final Thread thread : pt.getThreadsLockingMonitors())
			//			{
			//				tlm.add(Long.parseLong(thread.getTid().substring(2), 16));
			//			}
			//
			//			tdad.setTimestamp(pt.getTimeStamp());
			//			tdad.setThreaddatas(threaddatas);
			//			tdad.setTwfm(twfm);
			//			tdad.setTsom(tsom);
			//			tdad.setTlm(tlm);
			//			tdad.setSuccess(true);
			//			tdad.setFilename(fname);
			//			tdad.setThreadsize(pt.getThreads().size());
			//			tdad.setTwfmsize(twfm.size());
			//			tdad.setTsomsize(tsom.size());
			//			tdad.setTlmsize(tlm.size());
			//			tdad.setMonitors(pt.getAllmonitors().size());
			//			tdad.setMhlt(pt.getMonitorsLocked().size());
			//			tdad.setMwlt(pt.getMonitorsWithoutLThreads().size());
			//
			//			/*
			//			 * final HashMap<S, String> am = new HashMap<Long, String>(); for (final String key :
			//			 * pt.getAllmonitors().keySet()) { am.put(Long.parseLong(key.substring(2), 16), pt.getAllmonitors().get(key));
			//			 * }
			//			 */
			//			tdad.setAllmonitors(pt.getAllmonitors());
			//
			//
			//			//tdad.setAllmonitorsState(pt.getForDeadlockDetection());
			//			final HashMap<String, ArrayList<HashSet<Long>>> allmonitorsState = new HashMap<String, ArrayList<HashSet<Long>>>();
			//			for (final String monitor : pt.getForDeadlockDetection().keySet())
			//			{
			//				final ArrayList<HashSet<Long>> states = new ArrayList<HashSet<Long>>();
			//
			//				for (int i = 0; i < pt.getForDeadlockDetection().get(monitor).size(); i++)
			//				{
			//					final HashSet<Long> hs = new HashSet<Long>();
			//					for (final Thread thread : pt.getForDeadlockDetection().get(monitor).get(i))
			//					{
			//						hs.add(Long.parseLong(thread.getTid().substring(2), 16));
			//					}
			//					states.add(i, hs);
			//				}
			//				allmonitorsState.put(monitor, states);
			//			}
			//			tdad.setAllmonitorsState(allmonitorsState);
			//			tdad.setMonitorsLocked(pt.getMonitorsLocked());
			//			final ArrayList<DeadLock> dll = tda.detectDeadLock();
			//			final ArrayList<ArrayList<Long>> deadlocklistdata = new ArrayList<ArrayList<Long>>();
			//			if (dll != null)
			//			{
			//				for (final DeadLock dl : dll)
			//				{
			//					final ArrayList<Long> deadlockdata = new ArrayList<Long>();
			//					for (final Thread thread : dl.getThreadchain())
			//					{
			//						deadlockdata.add(Long.parseLong(thread.getTid().substring(2), 16));
			//					}
			//					deadlocklistdata.add(deadlockdata);
			//				}
			//			}
			//			tdad.setDeadlocklist(deadlocklistdata);
			final ObjectMapper mapper = new ObjectMapper();
			final String json = mapper.writeValueAsString(results);
			return "{success:true, tda:" + json + ",folder:'" + foldername + "'}";

		}
		catch (final Exception e)
		{
			e.printStackTrace();
			return "{success:false,message:'You failed to upload " + file.getFile().getName() + " => " + e.getMessage() + "'}";
		}


	}

	@RequestMapping(value = "/gethacthreaddump", method = RequestMethod.GET)
	public @ResponseBody String gethacthreaddump()
	{
		try
		{
			final String savedDirectory = ".." + File.separator + ".." + File.separator + ".." + File.separator + ".."
					+ File.separator;
			final String fname = "hac.txt";
			String name = savedDirectory.concat(fname);
			final File f = new File(name);
			final ThreadMonitor tm = new ThreadMonitor();
			final String x = tm.threadDump();
			final byte[] bytes = x.getBytes();
			final BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(f));
			stream.write(bytes);
			stream.close();
			name = f.getAbsolutePath();
			final TDA.ThreadDumpSourceType tdst = TDA.ThreadDumpSourceType.HAC;
			final ThreadDumpAnalyzerData tdad = threadDumpAnalyzerFacade.analyzeThreadDumpFile(name, tdst);
			final ArrayList<ThreadDumpAnalyzerData> results = new ArrayList<ThreadDumpAnalyzerData>();
			results.add(tdad);
			final ObjectMapper mapper = new ObjectMapper();
			final String json = mapper.writeValueAsString(results);
			return "{success:true, tda:" + json + ",folder:''}";

		}
		catch (final Exception e)
		{
			e.printStackTrace();
			return "{success:false,message:'" + e.getMessage() + "'}";
		}



	}

	/*
	 * @RequestMapping(value = "/test", method = RequestMethod.GET) public @ResponseBody String test() { try { if
	 * (this.dumpCollector == null) { this.dumpCollector = new ThreadDumpCollector(); } if
	 * (!this.dumpCollector.isCollecting()) { final long startTime = System.currentTimeMillis(); long endTime =
	 * startTime; this.dumpCollector.startCollecting(10); while ((endTime - startTime) < 10000) { Thread.sleep(10000);
	 * endTime = System.currentTimeMillis(); }
	 *
	 *
	 *
	 * return dumpCollector.stopCollecting().toString(); } else { return "wait!!"; } } catch (final Exception e) {
	 * e.printStackTrace(); return "{success:false,message:'" + e.getMessage() + "'}"; }
	 *
	 *
	 *
	 * }
	 */

	@RequestMapping(value = "/tdw", params =
	{ "filename", "type", "mode" }, method = RequestMethod.GET)
	public @ResponseBody String tdw(@RequestParam(value = "filename")
	final String filename, @RequestParam(value = "type")
	final String type, @RequestParam(value = "mode")
	final String mode)
	{
		//System.out.println(filename + "!!!" + type + "!!!" + mode);
		final TGW tgw = new TGW();
		final String savedDirectory = ".." + File.separator + ".." + File.separator + ".." + File.separator + ".." + File.separator;
		final String name = savedDirectory.concat(filename);
		try
		{
			ThreadDumpSourceType srcType = ThreadDumpSourceType.JSTACK;
			if (type != null && !type.isEmpty())
			{
				try
				{
					srcType = ThreadDumpSourceType.valueOf(type.toUpperCase());
				}
				catch (final Exception e)
				{
					srcType = ThreadDumpSourceType.HAC;
				}
			}
			tgw.importDirectory(name, srcType);
			final Properties props = new Properties();
			props.load(TGW.class.getResourceAsStream("/de/hybris/tools/system/tgw/httl.properties"));
			final Engine engine = Engine.getEngine(props);
			final Template template = engine.getTemplate("/de/hybris/tools/system/tgw/report_template.html");
			final ByteArrayOutputStream bao = new ByteArrayOutputStream();
			final Report report = tgw.createReport();
			template.render(report, bao);
			bao.flush();
			return bao.toString();
		}
		catch (final IOException e)
		{
			// YTODO Auto-generated catch block
			e.printStackTrace();
			return e.getMessage();
		}
		catch (final ExecutionException e)
		{
			// YTODO Auto-generated catch block
			e.printStackTrace();
			return e.getMessage();
		}
		catch (final InterruptedException e)
		{
			// YTODO Auto-generated catch block
			e.printStackTrace();
			return e.getMessage();
		}
		catch (final Exception e)
		{
			// YTODO Auto-generated catch block
			e.printStackTrace();
			return e.getMessage();
		}

	}

	@RequestMapping(value = "/upload/{min}/{bo}/{co}", method = RequestMethod.POST)
	public @ResponseBody String handleJdbclogFileUpload(@PathVariable
	final int min, @PathVariable
	final double bo, @PathVariable
	final int co, final Model model, @Validated
	final LogfileUpload file, final BindingResult result)
	{
		final String savedDirectory = ".." + File.separator + ".." + File.separator + ".." + File.separator + ".." + File.separator;
		String fname = file.getFile().getOriginalFilename();
		String name = savedDirectory + fname;
		jdbclogAnalyzer.reset();

		File f = new File(name);
		//System.out.println(f.getAbsolutePath() + "!" + fname + "|" + min + "|" + bo);
		name = f.getAbsolutePath();
		try
		{
			final byte[] bytes = file.getFile().getBytes();
			final BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(f));
			stream.write(bytes);
			stream.close();
			final String[] ex = fname.split("\\.");
			//System.out.println(ex.length + "!" + ex[ex.length - 1].toLowerCase());
			if (ex.length > 1 && ex[ex.length - 1].toLowerCase().equals("zip"))
			{
				final ZipFile zipFile = new ZipFile(f);
				final Enumeration emu = zipFile.entries();

				while (emu.hasMoreElements())
				{
					final ZipEntry entry = (ZipEntry) emu.nextElement();
					if (entry.isDirectory())
					{
						new File(savedDirectory + entry.getName()).mkdirs();
						continue;
					}
					else if (entry.getName().startsWith(".") || entry.getName().startsWith("__MACOSX"))
					{
						continue;
					}
					final BufferedInputStream bis = new BufferedInputStream(zipFile.getInputStream(entry));
					fname = entry.getName();
					f = new File(savedDirectory + entry.getName());
					name = f.getAbsolutePath();
					final File parent = f.getParentFile();
					if (parent != null && (!parent.exists()))
					{
						parent.mkdirs();
					}
					final FileOutputStream fos = new FileOutputStream(f, false);
					final BufferedOutputStream bos = new BufferedOutputStream(fos, 2048);

					int count;
					final byte data[] = new byte[2048];
					while ((count = bis.read(data, 0, 2048)) != -1)
					{
						bos.write(data, 0, count);
					}
					bos.flush();
					bos.close();
					bis.close();
				}
				zipFile.close();
			}



			final BufferedReader br = new BufferedReader(new FileReader(f));
			String line;
			final ArrayList<String> lines = new ArrayList<String>();
			while ((line = br.readLine()) != null)
			{
				//System.out.println("!!!!!" + line);
				if (!line.matches("^\\s*[0-9]*[|].*$"))
				{
					//System.out.println("how");
					if (!lines.isEmpty())
					{
						String l = lines.get(lines.size() - 1);
						l = l.concat(line);
						lines.set(lines.size() - 1, l);
						//System.out.println("!!!@!@" + lines.get(lines.size() - 1));
					}
				}
				else
				{
					lines.add(line);
				}
			}
			for (final String l : lines)
			{
				//System.out.println(lines.size() + "----" + l);
				jdbclogAnalyzer.insertLine(l);
			}
			final AnalyzerResult ar = jdbclogAnalyzer.finishAnalysis(min, bo, co);
			ar.setSuccess(true);
			ar.setFilename(fname);
			final ObjectMapper mapper = new ObjectMapper();
			final String json = mapper.writeValueAsString(ar);
			//System.out.println(json);
			br.close();
			return json;

			//"{success:true,result:{count:1,percentcount:2,totaltime:3,percenttime:4,average:5,standarddeviation:6,query:'You successfully uploaded "
			//+ name + "'}}";
		}
		catch (final Exception e)
		{
			e.printStackTrace();
			return "{success:false,message:'You failed to upload " + name + " => " + e.getMessage() + "'}";
		}
	}

}
