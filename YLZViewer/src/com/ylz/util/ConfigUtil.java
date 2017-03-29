package com.ylz.util;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.apache.commons.lang.StringUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import com.ylz.common.dto.Checkmark;
import com.ylz.common.dto.DictExamClass;
import com.ylz.common.dto.PageImage;
import com.ylz.common.dto.Watermark;


public class ConfigUtil{
	
	private static Resource resource = new ClassPathResource("/config.xml");
	static Element element = null;
	static{
		loadConfigXml();
	}
	
	private static boolean needlogin=false;
	
	private static String ImageLib = "";
	private static String ImageMode = "";
	private static boolean signImage=false;
	private static boolean feedback=false;
	private static boolean print=false;
	
	private static boolean clinicRead=false;
	private static boolean privateImage=false;
	private static boolean editable=false;
	private static Watermark watermark=null;
	private static Checkmark checkmark=null;
	//后期添加图像配置
	//禁止另存为按钮（默认禁止），当允许时该配置项的值为2
	private static boolean forbidSaveAs=false;
	//复制到剪切板按钮（默认允许），当前值为256
	private static boolean copyToClipboard=true;
	//打开本地图像按钮(默认不允许),当允许时该配置项默认值为16
	private static boolean openLocalImage=false;
	//CtrlMultiMode，默认值为8
	private static boolean ctrlMultiMode=false;
	//本地缓存图像按钮（默认禁止）,当允许时该配置项的默认值为1
	private static boolean reserveImage=false;
	//打开3D开关按钮（默认禁止），当允许时该配置项的值为512
	private static boolean verTD=false;
	//通过检查号、姓名、住院号或门诊号查询无记录时忽略时间:1启用，0禁用
	private static boolean ignoreTime=false;
	//调用SSO.dll开关:1启用，0禁用
	private static boolean SSODll=false;
	public ConfigUtil(){}
	
	public static void loadConfigXml(){
		try {
			DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();   
	        DocumentBuilder db = dbf.newDocumentBuilder();
	        String path = resource.getFile().getAbsolutePath();
	        Document document = db.parse(new File(path));
	        element = document.getDocumentElement();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void autoReload(){
		loadConfigXml();
	}
	
	public static String getImageLib(){
		if(StringUtils.trimToNull(ImageLib)==null){
			NodeList list = element.getElementsByTagName("ImageLib");
			if(list!=null && list.getLength()>0){
				Element node = (Element) list.item(0);
				String value = node.getFirstChild().getNodeValue();
				ImageLib = value;
			}
		}
		return ImageLib;
	}
	
	public static String getImageMode(){
		if(StringUtils.trimToNull(ImageMode)==null){
			NodeList list = element.getElementsByTagName("ImageMode");
			if(list!=null && list.getLength()>0){
				Element node = (Element) list.item(0);
				String value = node.getFirstChild().getNodeValue();
				ImageMode = value;
			}
		}
		return ImageMode;
	}
	
	public static String getValue(String key){
		NodeList list = element.getElementsByTagName(key);
		if(list!=null && list.getLength()>0){
			Element node = (Element) list.item(0);
			String value = node.getFirstChild().getNodeValue();
			return value==null?"":value;
		}
		
		return "";
	}
	
	public static List<PageImage> getWL(String key){
		List<PageImage> list = new ArrayList<PageImage>();
		
		NodeList nodeList = element.getElementsByTagName(key);
		if(nodeList!=null && nodeList.getLength()>0){
			Element temp = (Element) nodeList.item(0);
			NodeList itemList = temp.getElementsByTagName("item");
			if(itemList!=null){
				for(int j=0; j<itemList.getLength(); j++){
					Element childNode = (Element) itemList.item(j);
					if(childNode!=null){
						String value = childNode.getFirstChild().getNodeValue();
						if(StringUtils.trimToNull(value)!=null){
							String[] arr = value.split(",");
							if(arr!=null && arr.length==3){
								PageImage entry = new PageImage();
								//entry.setId(arr[0]);
								entry.setTitle(arr[0]);
								entry.setWindowWidth(arr[1]);
								entry.setWindowCenter(arr[2]);
								
								list.add(entry);
							}
						}
					}
				}
			}
		}
		
		return list;
	}
	
	public static boolean getSignImage(){
		if(signImage==false){
			NodeList list = element.getElementsByTagName("signImage");
			if(list!=null && list.getLength()>0){
				Element node = (Element) list.item(0);
				String value = node.getFirstChild().getNodeValue();
				signImage = ("1".equals(value)?true:false);
			}
		}
		return signImage;
	}
	
	public static boolean getEditable(){
		if(editable==false){
			NodeList list = element.getElementsByTagName("editable");
			if(list!=null && list.getLength()>0){
				Element node = (Element) list.item(0);
				String value = node.getFirstChild().getNodeValue();
				editable = ("1".equals(value)?true:false);
			}
		}
		return editable;
	}
	
	public static boolean getPrint(){
		if(print==false){
			NodeList list = element.getElementsByTagName("print");
			if(list!=null && list.getLength()>0){
				Element node = (Element) list.item(0);
				String value = node.getFirstChild().getNodeValue();
				print = ("1".equals(value)?true:false);
			}
		}
		return print;
	}
	
	public static boolean getFeedback(){
		if(feedback==false){
			NodeList list = element.getElementsByTagName("feedback");
			if(list!=null && list.getLength()>0){
				Element node = (Element) list.item(0);
				String value = node.getFirstChild().getNodeValue();
				feedback = ("1".equals(value)?true:false);
			}
		}
		return feedback;
	}
	
	public static boolean isNeedlogin(){
		if(needlogin==false){
			NodeList list = element.getElementsByTagName("needlogin");
			if(list!=null && list.getLength()>0){
				Element node = (Element) list.item(0);
				String value = node.getFirstChild().getNodeValue();
				needlogin = ("1".equals(value)?true:false);
			}
		}
		return needlogin;
	}
	
	public static boolean getClinicRead(){
		if(clinicRead==false){
			NodeList list = element.getElementsByTagName("clinicRead");
			if(list!=null && list.getLength()>0){
				Element node = (Element) list.item(0);
				String value = node.getFirstChild().getNodeValue();
				clinicRead = ("1".equals(value)?true:false);
			}
		}
		return clinicRead;
	}
	
	public static boolean getPrivateImage(){
		if(privateImage==false){
			NodeList list = element.getElementsByTagName("privateImage");
			if(list!=null && list.getLength()>0){
				Element node = (Element) list.item(0);
				String value = node.getFirstChild().getNodeValue();
				privateImage = ("1".equals(value)?true:false);
			}
		}
		return privateImage;
	}
	
	public static Watermark getWatermark(){
		if(watermark==null){
			watermark=new Watermark();
			NodeList list = element.getElementsByTagName("watermark");
			if(list!=null && list.getLength()>0){
				Element node = (Element) list.item(0);
				watermark.setEnabled("1".equals(node.getAttribute("enabled"))?true:false);
				watermark.setType(node.getAttribute("type"));
				watermark.setTop(Integer.parseInt(node.getAttribute("top")));
				watermark.setLeft(Integer.parseInt(node.getAttribute("left")));
				watermark.setText(node.getFirstChild().getNodeValue());				
			}
		}
		return watermark;
	}
	
	public static Checkmark getCheckmark(){
		if(checkmark==null){
			checkmark=new Checkmark();
			NodeList list = element.getElementsByTagName("checkmark");
			if(list!=null && list.getLength()>0){
				Element node = (Element) list.item(0);
				checkmark.setEnabled("1".equals(node.getAttribute("enabled"))?true:false);
				checkmark.setText(node.getFirstChild().getNodeValue());				
			}
		}
		return checkmark;
	}
	public static int getConfigValue(){
		getConfigFlag();
		int value=0;
		if(forbidSaveAs){
			value+=2;
		}
		if(copyToClipboard){
			value+=256;		
		}
		if(openLocalImage){
			value+=16;
		}
		if(ctrlMultiMode){
			value+=8;
		}
		if(reserveImage){
			value+=1;
		}
		if(verTD){
			value+=512;
		}
		return value;
	}
	private static void getConfigFlag(){
		NodeList list = element.getElementsByTagName("forbidSaveAs");
		if(list!=null && list.getLength()>0){
			Element node = (Element) list.item(0);
			String val=node.getFirstChild().getNodeValue();
			forbidSaveAs=("1".equals(val)?true:false);
		}
		list = element.getElementsByTagName("copyToClipboard");
		if(list!=null && list.getLength()>0){
			Element node = (Element) list.item(0);
			String val=node.getFirstChild().getNodeValue();
			copyToClipboard=("1".equals(val)?true:false);
		}
		list = element.getElementsByTagName("openLocalImage");
		if(list!=null && list.getLength()>0){
			Element node = (Element) list.item(0);
			String val=node.getFirstChild().getNodeValue();
			openLocalImage=("1".equals(val)?true:false);
		}
		list = element.getElementsByTagName("ctrlMultiMode");
		if(list!=null && list.getLength()>0){
			Element node = (Element) list.item(0);
			String val=node.getFirstChild().getNodeValue();
			ctrlMultiMode=("1".equals(val)?true:false);
		}
		list = element.getElementsByTagName("reserveImage");
		if(list!=null && list.getLength()>0){
			Element node = (Element) list.item(0);
			String val=node.getFirstChild().getNodeValue();
			reserveImage=("1".equals(val)?true:false);
		}
		list = element.getElementsByTagName("verTD");
		if(list!=null && list.getLength()>0){
			Element node = (Element) list.item(0);
			String val=node.getFirstChild().getNodeValue();
			verTD=("1".equals(val)?true:false);
		}
	}
	public static List<Map<String,String>> getReportDelay(){
		List<Map<String,String>> list=new ArrayList<Map<String,String>>();
		NodeList nodeList = element.getElementsByTagName("reportDelay");
		if(nodeList!=null && nodeList.getLength()>0){
			for(int i=0;i<nodeList.getLength();i++){//遍历reportDelay
				Element e=(Element) nodeList.item(i);
				NodeList nodeStatus=e.getElementsByTagName("status");
				NodeList nodeTime=e.getElementsByTagName("time");
				NodeList nodeClass=e.getElementsByTagName("examClass");
				if(nodeStatus!=null && nodeStatus.getLength()>0
					&& nodeTime!=null && nodeTime.getLength()>0
						&& nodeClass!=null && nodeClass.getLength()>0){
					String status=nodeStatus.item(0).getFirstChild().getNodeValue();
					String time=nodeTime.item(0).getFirstChild().getNodeValue();
					String examClass=nodeClass.item(0).getFirstChild().getNodeValue();
					if("1".equals(status)){//开启延时
						if(time.matches("^[1-9]\\d*$")){//延迟时间
							if(examClass!=null && !"".equals(examClass)){//检查类别
								Map<String,String> m=new HashMap<String, String>();
								m.put("time", time);
								m.put("examClass", examClass);
								list.add(m);
							}
						}
					}
				}
			}
		}
		return list;
	}
	public static boolean isWriteSysLog(){
		NodeList nodeList = element.getElementsByTagName("IsWriteSysLog");
		if(nodeList!=null && nodeList.getLength()>0){
			Element e=(Element) nodeList.item(0);
			String boo=e.getFirstChild().getNodeValue();
			if("1".equals(boo)){
				return true;
			}
		}
		return false;
	}
	public static boolean operateAuthority(){
		NodeList nodeList = element.getElementsByTagName("OperateAuthority");
		if(nodeList!=null && nodeList.getLength()>0){
			Element e=(Element) nodeList.item(0);
			String boo=e.getFirstChild().getNodeValue();
			if("1".equals(boo)){
				return true;
			}
		}
		return false;
	}
	
	public static boolean IsShareGroup(){
		NodeList nodeList = element.getElementsByTagName("shareGroup");
		if(nodeList!=null && nodeList.getLength()>0){
			Element e=(Element) nodeList.item(0);
			String boo=e.getFirstChild().getNodeValue();
			if("1".equals(boo)){
				return true;
			}
		}
		return false;
	}
	
	public static boolean isIgnoreTime(){
		if(privateImage==false){
			NodeList list = element.getElementsByTagName("ignoreTime");
			if(list!=null && list.getLength()>0){
				Element node = (Element) list.item(0);
				String value = node.getFirstChild().getNodeValue();
				ignoreTime = ("1".equals(value)?true:false);
			}
		}
		return ignoreTime;
	}
	
	public static List<DictExamClass> getExamClasses(){
		List<DictExamClass> examList = new ArrayList<DictExamClass>();
		NodeList list = element.getElementsByTagName("ExamClasses");
		if(list!=null && list.getLength()>0){
			Element node = (Element) list.item(0);
			Boolean isEnabled = "1".equals(node.getAttribute("enabled"))?true:false;
			if(isEnabled){
				String[] exams = node.getFirstChild().getNodeValue().split(",");
				for(String examName : exams){
					DictExamClass exam = new DictExamClass();
					exam.setExamClassName(examName);
					examList.add(exam);
				}
			}
		}
		return examList;
	}
	
	public static boolean isSSO(){
		NodeList list = element.getElementsByTagName("SSODll");
		if(list!=null && list.getLength()>0){
			Element node = (Element) list.item(0);
			String value = node.getFirstChild().getNodeValue();
			SSODll = ("1".equals(value)?true:false);
		}
		return SSODll;
	}
}
