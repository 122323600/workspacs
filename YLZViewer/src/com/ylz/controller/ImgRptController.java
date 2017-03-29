package com.ylz.controller;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sun.jna.Library;
import com.sun.jna.Native;
import com.sun.jna.PointerType;
import com.sun.jna.ptr.LongByReference;
import com.sun.jna.ptr.PointerByReference;
import com.ylz.common.dto.ExamItem;
import com.ylz.common.dto.ExamOrgan;
import com.ylz.common.dto.ExamStudy;
import com.ylz.common.dto.PageExamStudy;
import com.ylz.common.dto.PageImage;
import com.ylz.common.dto.PageImageInfo;
import com.ylz.common.dto.PageRpt;
import com.ylz.common.dto.StudyImage;
import com.ylz.common.dto.Studys;
import com.ylz.common.service.ExamImageService;
import com.ylz.common.service.QueryService;
import com.ylz.dicom.dto.DicomImage;
import com.ylz.dicom.service.DicomService;
import com.ylz.util.ConfigUtil;
import com.ylz.util.SysUtils;

@Controller("imgRptController")
@RequestMapping("/imgRpt")
public class ImgRptController {
	
	@Autowired
	private QueryService queryService;
	
	@Autowired
	private ExamImageService examImageService;
	
	@RequestMapping("/getImageList")
	@ResponseBody
	public List<StudyImage> getImageList(@ModelAttribute Studys study, HttpServletRequest request ){
		List<StudyImage> l = new ArrayList<StudyImage>();
		if(study!=null){
			if(StringUtils.isNotBlank(study.getStudyNo())){
				if(StringUtils.isNotBlank(study.getStudySeries())){
					String[] ser=study.getStudySeries().trim().split(",");
					List<String> liser=new ArrayList<String>();
					for(String s:ser){
						liser.add(s);
					}
					study.setStudySeriesUid(liser);
				}
				if(ConfigUtil.getPrivateImage()==false){//不打开私有图像
					study.setCommonImage(true);
				}
				l = queryService.findImageList(study);
				if(l!=null && l.size()>0){
					String localPath;
					if(StringUtils.isBlank(l.get(0).getLocalPath())){
						localPath = ConfigUtil.getValue("ImageLib");
					}else{
						localPath = l.get(0).getLocalPath();
					}
					
					for(int i=0; i<l.size(); i++){
						l.get(i).setFilePath(localPath+File.separatorChar+l.get(i).getStorePath()+File.separatorChar+l.get(i).getFileName());
					}
				}
			}
		}
		return l;
	}
	
	public interface ReadJpgLibrary extends Library {
		ReadJpgLibrary INSTANCE = (ReadJpgLibrary) Native.loadLibrary(
				System.getProperty("clinical.root")+"dll/WADO.dll", 
				ReadJpgLibrary.class);
		int CreateImage(String filePath, String param, PointerType buf, PointerType size);
		int GetImageParam(String filePath, PointerType buf, PointerType size);
		int GetPixelData(String filePath, PointerType buf, PointerType size);
		void FreeBuf(PointerType buf);
	}
	
	@RequestMapping("/getImage1")
	public void getImage(@ModelAttribute PageImage pageImage, HttpServletRequest req, HttpServletResponse res){
		res.setContentType("image/jpeg");
		try {
			if(pageImage==null) return;
			
			StringBuffer param = new StringBuffer("");
			if(StringUtils.trimToNull(pageImage.getRegion())!=null){
				param.append("region="+pageImage.getRegion()+"/");
			}
			if(StringUtils.trimToNull(pageImage.getColumns())!=null){
				param.append("columns="+pageImage.getColumns()+"/");
			}
			if(StringUtils.trimToNull(pageImage.getRows())!=null){
				param.append("rows="+pageImage.getRows()+"/");
			}
			if(StringUtils.trimToNull(pageImage.getAnnotation())!=null){
				param.append("annotation="+pageImage.getAnnotation()+"/");
			}
			if(StringUtils.trimToNull(pageImage.getImageQuality())!=null){
				param.append("imageQuality="+pageImage.getImageQuality()+"/");
			}
			if(StringUtils.trimToNull(pageImage.getWindowCenter())!=null){
				param.append("windowCenter="+pageImage.getWindowCenter()+"/");
			}
			if(StringUtils.trimToNull(pageImage.getWindowWidth())!=null){
				param.append("windowWidth="+pageImage.getWindowWidth()+"/");
			}
			synchronized(this){
				OutputStream out = null;
				LongByReference longPoint = null;
				PointerByReference buf = null;
				byte[] images = null;
				try{
					out = res.getOutputStream();
					longPoint = new LongByReference(0);
					buf = new PointerByReference();
					int retCode = ReadJpgLibrary.INSTANCE.CreateImage(pageImage.getFilePath(), param.toString(), buf, longPoint);
					if(retCode==1){
						images = new byte[(int)longPoint.getValue()];
						long size = longPoint.getValue();
						for(long i=0; i<size; i++){
							images[(int)i] = buf.getValue().getByte(i);
						}
						out.write(images);
						out.flush();
					}
				} catch (Exception e){
					e.printStackTrace();
				} finally {
					if(out!=null){
						out.close();
					}
					images = null;
					longPoint = null;
					buf = null;
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	@RequestMapping("/getReport")
	public void getReport(@ModelAttribute PageRpt rpt, HttpServletRequest req, HttpServletResponse res){
		if(rpt==null) return;
		
		PageRpt retRpt = queryService.findReport(rpt);
		if(retRpt!=null){
			String patternName = "";
			if(StringUtils.trimToNull(retRpt.getExamClass())!=null){
				patternName = retRpt.getExamClass() + ".htm";
			}
			String filePath = System.getProperty("clinical.root") + "/ReportPattern/" + patternName;
			File file = new File(filePath);
			if(!file.exists()){
				filePath = System.getProperty("clinical.root") + "/ReportPattern/default.htm";
				file = new File(filePath);
			}
			try {
				StringBuffer sb = new StringBuffer();
				BufferedReader br = new BufferedReader(new FileReader(file));
				String str = "";
				while((str=br.readLine())!=null){
					sb.append(str+"\n");
				}
				br.close();
				
				String examOrgans = "";
				ExamOrgan organ = new ExamOrgan();
				organ.setExamNo(rpt.getExamNo());
				List<ExamOrgan> organList = queryService.findExamOrgansByExamNo(organ);
				if(organList!=null && organList.size()>0){
					for(int i=0; i<organList.size(); i++){
						ExamOrgan tempOrgan = organList.get(i);
						if(i==organList.size()-1){
							examOrgans = examOrgans + tempOrgan.getOrganName();
						} else {
							examOrgans = examOrgans + tempOrgan.getOrganName() + ",";
						}
					}
				}
				retRpt.setExamOrgans(examOrgans);
				
				String examItems = "";
				ExamItem item = new ExamItem();
				item.setExamNo(rpt.getExamNo());
				List<ExamItem> itemList = queryService.findExamItemsByExamNo(item);
				if(itemList!=null && itemList.size()>0){
					for(int i=0; i<itemList.size(); i++){
						ExamItem tempItem = itemList.get(i);
						if(i==itemList.size()-1){
							examItems = examItems + tempItem.getItemName();
						} else {
							examItems = examItems + tempItem.getItemName() + ",";
						}
					}
				}
				retRpt.setExamItems(examItems);
				
				String html = sb.toString();
				html = html.replaceAll("#AffirmReporter", SysUtils.checkEmpty(retRpt.getAffirmReporter()));
				html = html.replaceAll("#HostipalName", SysUtils.checkEmpty(retRpt.getHospitalName()));
				html = html.replaceAll("#ExamSubClass", SysUtils.checkEmpty(retRpt.getExamOrgans()));
				html = html.replaceAll("#OutPatientNo", SysUtils.checkEmpty(retRpt.getOutpatientNo()));
				html = html.replaceAll("#PriReporter", SysUtils.checkEmpty(retRpt.getReporter()));
				html = html.replaceAll("#InPatientNo", SysUtils.checkEmpty(retRpt.getInpatientNo()));
				html = html.replaceAll("#Description", SysUtils.checkEmpty(retRpt.getDescription()));
				html = html.replaceAll("#ReportDate", SysUtils.checkEmpty(retRpt.getReportDate()));
				html = html.replaceAll("#PatLocalID", SysUtils.checkEmpty(retRpt.getPatLocalId()));
				html = html.replaceAll("#Impression", SysUtils.checkEmpty(retRpt.getImpression()));
				html = html.replaceAll("#examClass", SysUtils.checkEmpty(retRpt.getExamClass()));
				html = html.replaceAll("#ExamItem", SysUtils.checkEmpty(retRpt.getExamItems()));
				html = html.replaceAll("#ExamDate", SysUtils.checkEmpty(retRpt.getExamDate()));
				html = html.replaceAll("#ReqDept", SysUtils.checkEmpty(retRpt.getReqDept()));
				html = html.replaceAll("#SickID", SysUtils.checkEmpty(retRpt.getSickId()));
				html = html.replaceAll("#BedNo", SysUtils.checkEmpty(retRpt.getBedNo()));
				html = html.replaceAll("#Name", SysUtils.checkEmpty(retRpt.getName()));
				html = html.replaceAll("#Sex", SysUtils.checkEmpty(retRpt.getSex()));
				html = html.replaceAll("#Age", SysUtils.checkEmpty(retRpt.getAge()));
				
				OutputStream out = res.getOutputStream();
				PrintWriter pw = new PrintWriter(new BufferedWriter(new OutputStreamWriter(out)));
				pw.println(html);
				pw.flush();
				pw.close();
				out.close();
				
			} catch (Exception e) {
				e.printStackTrace();
				return;
			}
			
		}
	}
	
	@RequestMapping("/getImageValues")
	@ResponseBody
	public List<PageImage> getImageValues(@ModelAttribute PageImage image){
		List<PageImage> list = new ArrayList<PageImage>();
		if(StringUtils.trimToNull(image.getModality())!=null){
			list = ConfigUtil.getWL(image.getModality());
		}
		return list;
	}
	
	@RequestMapping("/getImageInfo")
	@ResponseBody
	public PageImageInfo getImageInfo(@ModelAttribute PageImageInfo image, HttpServletRequest request){
		PageImageInfo ret = new PageImageInfo();
		
		if(StringUtils.trimToNull(image.getStudyNo())!=null){			
			if(StringUtils.isNotBlank(image.getStudySeries())){
				PageImageInfo imageInfo = queryService.findImageInfo(image);
				if(imageInfo!=null){
					String path =  request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+request.getContextPath();
					String url = path + "/html/report.htm?exam_no=" + imageInfo.getExamNo();
					imageInfo.setReportUrl(url);
					//2014 12-24 ：添加configValue参数，根据config.xml配置项计算得出
					imageInfo.setConfigValue(ConfigUtil.getConfigValue());						
					
					//是否制定序列
					Map<String,Object> m=new HashMap<String,Object>();
					String[] ser=image.getStudySeries().split(",");
					List<String> liser=new ArrayList<String>();
					for(String s:ser){
						liser.add(s);
					}
					m.put("studyNo", image.getStudyNo());
					m.put("series", liser);
					List<String> li=queryService.getStudyImageName(m);
					imageInfo.setSeriesFileName(li);
					
					ret = imageInfo;
					ret.setSuccess(true);
				}
				else{
					ret.setSuccess(false);
					ret.setErrMsg("获取影像服务信息出错!");
				}
				
			}else{
				PageImageInfo imageInfo = queryService.findImageInfo(image);
				if(imageInfo!=null){
				//http://192.168.24.79:9000/areashare/imgRpt/getReport?reportNo=1&examNo=0000022303
					String path =  request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+request.getContextPath();
					String url = path + "/html/report.htm?exam_no=" + imageInfo.getExamNo();
					imageInfo.setReportUrl(url);
					//2014 12-24 ：添加configValue参数，根据config.xml配置项计算得出
					imageInfo.setConfigValue(ConfigUtil.getConfigValue());						
					
					if(ConfigUtil.getPrivateImage()==false){
						imageInfo.setPrivateImageCount(examImageService.getPrivateImageCount(imageInfo.getStudyNo()));
						if(imageInfo.getPrivateImageCount()>0){
							List<String> li=examImageService.getUnPrivateImages(imageInfo.getStudyNo());
							imageInfo.setImageCount(String.valueOf(li.size()));
							imageInfo.setSeriesFileName(li);
							imageInfo.setHiddenPrivateImage(true);
						}
					}
					ret = imageInfo;
					ret.setSuccess(true);
				}
				else{
					ret.setSuccess(false);
					ret.setErrMsg("获取影像服务信息出错!");
				}
			}
		}
		
		return ret;
	}
	
	@RequestMapping("/getExamStudy")
	@ResponseBody
	public Map<String,Object> getExamStudy(@ModelAttribute PageExamStudy exam, HttpServletRequest request){
		Map<String,Object> m=new HashMap<String,Object>();
		if(StringUtils.trimToNull(exam.getExamNo())==null){
			String examNo="";
			if(StringUtils.trimToNull(exam.getApplyNo())!=null){
				PageExamStudy study = queryService.findExamStudyByApplyNo(exam);
				if(study!=null){
					examNo=study.getExamNo();
				}
			}else if(StringUtils.trimToNull(exam.getOrderNo())!=null){
				    examNo=queryService.findExamNoByOrderNo(exam.getOrderNo());
			}
			if(StringUtils.trimToNull(examNo)!=null){
				ExamStudy es=new ExamStudy();
				es.setExamNo(examNo);
				List<ExamStudy> list= examImageService.findExamStudys(es);
				if(list==null || list.size()<1){
					m.put("success", false);
					m.put("errMsg", "没有对应检查图像!");
				}else{
					m.put("success", true);
					m.put("data", list);
				}
				
			}else{
				m.put("success", false);
				m.put("errMsg", "查询检查号exam_no不存在!");
			}
		}else{
			ExamStudy es=new ExamStudy();
			es.setExamNo(exam.getExamNo());
			List<ExamStudy> list= examImageService.findExamStudys(es);
			if(list==null || list.size()<1){
				m.put("success", false);
				m.put("errMsg", "没有对应检查图像!");
			}else{
				m.put("success", true);
				m.put("data", list);
			}
		}
		return m;
	}
	
	@RequestMapping("/getDicomImage")
	@ResponseBody
	public void getData(HttpServletRequest req, HttpServletResponse res){
		String filePath =System.getProperty("clinical.root")+"/dicom/dll/WADO.dll";
		DicomService.INSTANCE.initDll(filePath);
		DicomService.INSTANCE.getData(req, res);
	}
	
	@RequestMapping("/getImage")
	@ResponseBody
	public void getJpeg(@ModelAttribute DicomImage image, HttpServletRequest req, HttpServletResponse res){
		String filePath =System.getProperty("clinical.root")+"/dicom/dll/WADO.dll";
		DicomService.INSTANCE.initDll(filePath);
		DicomService.INSTANCE.getJpeg(image, req, res);
	}
	
	@RequestMapping(value="/getStudys")
	@ResponseBody
	public List<Studys> getReport(@RequestParam("examNo") String examNo,Model model){
		List<Studys> studys=new ArrayList<Studys>();
		
		if(StringUtils.isNotBlank(examNo)) {
			studys=examImageService.findStudysByExamNo(examNo);
		}
		return studys;
	}
}
