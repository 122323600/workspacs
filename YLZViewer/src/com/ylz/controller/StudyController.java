package com.ylz.controller;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
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
import com.ylz.util.JsonUtil;

@Controller("studyController")
@RequestMapping("/study")
public class StudyController {
	private final static String ImageLib = ConfigUtil.getValue("ImageLib");
	
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
	public Study getStudy(HttpServletRequest request,String imagePaths){
		//imagePaths="WyJDb25zdWx0LzIwMTcwNDI3LzIwMTcwMjIxMTQ0NjQxNDQ4OTAvMjAxNzA0MTAxMDQ2NDU0NzU0MC9DVC8yOTgzMjA1MV8yMDE3MDQyNzE0MDcxNzExOTQwIiwiQ29uc3VsdC8yMDE3MDQyNy8yMDE3MDIyMTE0NDY0MTQ0ODkwLzIwMTcwNDEwMTA0NjQ1NDc1NDAvQ1QvMjk4MzIwNjNfMjAxNzA0MjcxNDA3MTcyNzk1MCIsIkNvbnN1bHQvMjAxNzA0MjcvMjAxNzAyMjExNDQ2NDE0NDg5MC8yMDE3MDQxMDEwNDY0NTQ3NTQwL0NULzI5ODMyMDE1XzIwMTcwNDI3MTQwNzE3Njc3OTAiLCJDb25zdWx0LzIwMTcwNDI3LzIwMTcwMjIxMTQ0NjQxNDQ4OTAvMjAxNzA0MTAxMDQ2NDU0NzU0MC9DVC8yOTgzMjAyN18yMDE3MDQyNzE0MDcxNzUxMzIwIiwiQ29uc3VsdC8yMDE3MDQyNy8yMDE3MDIyMTE0NDY0MTQ0ODkwLzIwMTcwNDEwMTA0NjQ1NDc1NDAvQ1QvMjk4MzIwMzlfMjAxNzA0MjcxNDA3MTc2MDU2MCIsIkNvbnN1bHQvMjAxNzA0MjcvMjAxNzAyMjExNDQ2NDE0NDg5MC8yMDE3MDQxMDEwNDY0NTQ3NTQwL0NULzI5ODMyMDc1XzIwMTcwNDI3MTQwNzE3MzY0MjAiXQ\u003d\u003d";
		//imagePaths = "[\"/Refer/20170316/2017022114464144890/2017031619535223610/EMR\"]";
		//imagePaths = "[\"/Refer/20170316/2017022114464144890/2017031619535223610/EMR/0001_000000_20140724_082301_29719_0\"]";
		Study study=new Study();
		if(StringUtils.isNotBlank(imagePaths)){
			try {
				sun.misc.BASE64Decoder decoder = new sun.misc.BASE64Decoder();
				imagePaths = new String(decoder.decodeBuffer(imagePaths),"utf-8");
			}catch (IOException e) {
				e.printStackTrace();
			}
			//json字符串转list
			List<String> list = JsonUtil.json2List(imagePaths, String.class);
			String storePath = "";
			if(list!=null && list.size()>0){
				File fl = new File(ImageLib+list.get(0));
				if(fl.exists()){
					if(fl.isDirectory()){
						storePath = fl.getAbsolutePath();
					}else{
						storePath = fl.getParent();
					}
				}
				List<Serie> series=new ArrayList<Serie>();
				for(String imagePath:list){
					//绝对路径
					String filePath = ImageLib+imagePath;
					File file = new File(filePath);
					//判断文件或文件夹是否存在
					if(file.exists()){
						//判断是否是目录
						if(file.isDirectory()){
							File[] files = file.listFiles();
							//判断目录下文件是否存在
							if(files!=null){
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
							}
						}else{
							//文件形式
							List<Image> images = new ArrayList<Image>();
							Image image = new Image();
							image.setFilePath(file.getAbsolutePath());
							image.setFileName(file.getName());
							images.add(image);
							Serie serie = new Serie();
							serie.setImages(images); 
							serie.setSeriesNumber("1");
							short st = 1;
							serie.setImageCount(st);
							series.add(serie);
						}
					}
				}
				study.setStorePath(storePath.replace(ImageLib, ""));
				study.setLocalPath(ImageLib);
				study.setSeries(series);
				study.setSeriesCount(series.size());
			}
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