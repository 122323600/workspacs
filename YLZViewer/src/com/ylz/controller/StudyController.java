package com.ylz.controller;

import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ylz.common.dto.Image;
import com.ylz.common.dto.Serie;
import com.ylz.common.dto.Study;
import com.ylz.common.mapper.ImageMapper;
import com.ylz.common.mapper.SerieMapper;
import com.ylz.common.mapper.StudyMapper;
import com.ylz.dicom.dto.DicomImage;
import com.ylz.dicom.service.DicomService;
import com.ylz.util.ConfigUtil;

@Controller("studyController")
@RequestMapping("/study")
public class StudyController {

	@Autowired
	@Qualifier("studyMapper")
	private StudyMapper studyMapper;
	
	@Autowired
	private SerieMapper serieMapper;
	
	@Autowired
	private ImageMapper imageMapper;
	
	
	@RequestMapping("/getJpeg")
	@ResponseBody
	public void getJpeg(@ModelAttribute DicomImage image, HttpServletRequest req, HttpServletResponse res){
		String filePath =System.getProperty("YLZViewer.root")+"dicom/dll/WADO.dll";
		DicomService.INSTANCE.initDll(filePath);
		DicomService.INSTANCE.getJpeg(image, req, res);
	}
	
	@RequestMapping("/getData")
	@ResponseBody
	public void getData(HttpServletRequest req, HttpServletResponse res){
		String filePath =System.getProperty("YLZViewer.root")+"dicom/dll/WADO.dll";
		DicomService.INSTANCE.initDll(filePath);
		Date stime=new Date();
		DicomService.INSTANCE.getData4String(req, res);
		Date etime=new Date();
		System.out.println("读取图像用时："+(etime.getTime()-stime.getTime()));
	}
	
	@RequestMapping(value="/getStudy")
	@ResponseBody
	public Study getStudy(HttpServletRequest request,String imagePath){
		Study study=new Study();
		//imagePath = "\\Refer\\20170316\\2017022114464144890\\2017031619535223610\\EMR";
		if(StringUtils.isNotBlank(imagePath)){
			List<Serie> series=new ArrayList<Serie>();
			String filePath = ConfigUtil.getValue("ImageLib")+imagePath;
			File file = new File(filePath);
			File[] files = file.listFiles();
			for(File f: files){
				List<Image> images = new ArrayList<Image>();
				Image image = new Image();
				image.setFilePath(f.getAbsolutePath());
				image.setFileName(f.getName());
				images.add(image);
				Serie serie = new Serie();
				serie.setImages(images); 
				serie.setSeriesNumber("1");
				short st = 1;
				serie.setImageCount(st);
				series.add(serie);
			}
			String storePath = imagePath;
			study.setStorePath(storePath);
			study.setLocalPath(ConfigUtil.getValue("ImageLib"));
			study.setSeries(series);
			study.setSeriesCount(files.length);
		}
		return study;
	}
	
	@RequestMapping("/getInfo")
	@ResponseBody
	public Object getInfo(HttpServletRequest req, HttpServletResponse res){
		String filePath =System.getProperty("YLZViewer.root")+"dicom/dll/WADO.dll";
		DicomService.INSTANCE.initDll(filePath);
		return DicomService.INSTANCE.getInfo(req, res);
	}
}