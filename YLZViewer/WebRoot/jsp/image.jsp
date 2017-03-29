<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String studyNo = request.getParameter("studyNo");
String studySeries=request.getParameter("studySeries");
String modality=request.getParameter("modality");
System.out.println(studySeries);
String viewmode = request.getParameter("viewmode");
if(studyNo==null||"".equals(studyNo)||"null".equals(studyNo)){
	studyNo=(String)request.getSession().getAttribute("studyNo");
}else{
	request.getSession().setAttribute("studyNo",studyNo); 
}

if(studySeries==null||"null".equals(studySeries)){
	studySeries=(String)request.getSession().getAttribute("studySeries");
}else if("".equals(studySeries)){
	request.getSession().setAttribute("studySeries","");
}else{
	request.getSession().setAttribute("studySeries",studySeries); 
}

if(viewmode==null||"".equals(viewmode)||"null".equals(viewmode)){
	viewmode=(String)request.getSession().getAttribute("viewmode");
}else{
	request.getSession().setAttribute("viewmode",viewmode); 
}
String imageMode=com.ylz.utils.ConfigUtil.getImageMode();
if(imageMode==null||"".equals(imageMode)){
	imageMode="0";
}
%>
<html>
<head>
<base href="<%=basePath%>">
<title>易联众医学影像浏览</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="vs_defaultClientScript" content="JavaScript">
<meta name="vs_targetSchema" content="http://schemas.microsoft.com/intellisense/ie5">
<link rel="icon" href="<%=basePath%>images/favicon.ico" type="image/x-icon" />
<link rel="shortcut icon" href="<%=basePath%>images/favicon.ico" type="image/x-icon" />
<style type="text/css"> 
<!--
body {
	margin-left: 0px;
	margin-top: 0px;
	margin-right: 0px;
	margin-bottom: 0px;	
	position:relative;
}
#menu{
	display:none;
	position:absolute;
	line-height:20px;
	height:140px;
	width:25px;
	cursor:pointer;
	word-wrap:break-word;
	left:0;
	top:0;
	color:#000;
	z-index:1001;
	background-color:#fff;
	text-align:center;
	font-size:14px;
}
#menu span{
	margin-left:4px;
}

ul li{
	list-style-type:none;
}
h1{
	text-align:center;
	padding:0px;
	margin:0px;
	font-size:42px;	
}
h3{
	padding:0px;
	margin-top:20px;
	margin-bottom:0px;
	font-size:14px;
}

#detail{
	margin-left:20px;
}

#detail a{
	color:red;
}
-->
</style>
<script type="text/javascript" src="<%=basePath%>js/jquery.min.js"></script>
<script type="text/javascript" src="<%=basePath%>js/util.js"></script>
<script type="text/javascript" src="js/querystring.js"></script>
<script language='JavaScript'>
window.queryString = new QueryStringParser();
var studyNo="<%=studyNo%>";
var studySeries="<%=studySeries%>";
var modality="<%=modality%>";
var viewmode="<%=viewmode%>";
var imageMode="<%=imageMode%>";
function toUnobject(){	
	var form = document.createElement("form");		
	document.body.appendChild(form);
	var input = document.createElement("input");
	input.type = "hidden";
	form.appendChild(input);
	input.id = 'studyNo';
	input.name = 'studyNo';
	input.value = studyNo;
	
	var input1 = document.createElement("input");
	input1.type = "hidden";
	form.appendChild(input1);
	input1.id = 'studySeries';
	input1.name = 'studySeries';
	input1.value = studySeries;
	
	form.name = "form";
	form.method = "post";
	form.target = "_self";
	form.action = 'jsp/image.jsp';
	if(navigator.userAgent.toLowerCase().match(/(iphone|ipod|ipad|android)/)){
		 if (window.outerWidth > 700) {
			 //form.action ='dicom/mobile/image-pad.jsp?study_no='+studyNo+'&study_series='+studySeries;
			 form.action ='dicom/mobile/image-pad.jsp';
         } else {
        	 form.action ='dicom/mobile/image-phone.jsp';
        	 //form.action ='dicom/mobile/image.jsp?study_no='+studyNo+'&study_series='+studySeries;
         }
	}else{
		if(imageMode=="3"||imageMode=="1"){
			form.action='dicom/image.jsp';
		}else{
			form.action='jsp/_image.jsp';
		}
	}
	form.submit();
}
function showTips(){
	document.getElementById('object').style.display='none';
	document.getElementById('tips').style.display='block';
}

function hideTips(){
	document.getElementById('object').style.display='block';
	document.getElementById('tips').style.display='none';
} 		
function stateChange(obj){
	var o;
	try{
		o = new ActiveXObject("IMAGEVIEWERCTRL.ImageViewerCtrlCtrl.1"); 
		if (typeof(o) != 'undefined'){					  
			o = null;
			hideTips();
			//alert("转向控件模式");  
			//<!--return true;--> 			
		}
		$(document.body).unload(function(e) {
            ImageViewerObj.CloseFrame();
        });
	}catch(e){  
		o = null;  
		//alert("转向非控件模式");  
		//toUnobject();
		//<!--return false;-->
		showTips();//转向控件安装模式		
	}
}

function load(){ 
//		window.opener = 'xxx';
//		window.close();	
	util.resizeWindow();	
	if(studyNo=='null'){
		if(queryString.getParam('study_no')){
			studyNo=queryString.getParam('study_no');
		}else if(queryString.getParam('StudyNo')){
			studyNo=queryString.getParam('StudyNo');
		}
	}
	if("ActiveXObject" in window==false){
		toUnobject();			
	}
//}

//$(function(){
	if(viewmode==1)toUnobject();
	if($('#object').css('display')=='block'){
		try{
			$.ajax({
				type: 'post',
				url: "imgRpt/getImageInfo",
				data: {"studyNo":studyNo,"studySeries":(studySeries==null || studySeries=='null')?' ':studySeries},
				dataType: 'json',
				success: function (data){				
					if(data){
						if(data.success){	
						/* 	if(modality){
								ImageViewerObj.SetShowOrientation(modality,true);//影像显示部位位置方向
							} */
							if(data.ftpPort){
								ImageViewerObj.SetServerInfoPort(data.ftpPort);
							}
							if(data.hiddenPrivateImage==false||data.privateImageCount==0){								
								if(data.passwordEncrypt)
									ImageViewerObj.SetSeverInfoEncrypt(data.userId, data.passwordEncrypt, data.shareName, data.ipAddr,data.clinicTransType);
								else ImageViewerObj.SetSeverInfo(data.userId, data.password, data.shareName, data.ipAddr,data.clinicTransType);								
							}else{
								if(data.seriesFileName && data.seriesFileName.length>=1){
									if(data.passwordEncrypt)
									ImageViewerObj.SetSeverInfoEncrypt(data.userId, data.passwordEncrypt, data.shareName, data.ipAddr,data.clinicTransType);
								else ImageViewerObj.SetSeverInfo(data.userId, data.password, data.shareName, data.ipAddr,data.clinicTransType);
								}else alert("对不起,没有可浏览的图像!");
							}	
							if(data.seriesFileName){
								for(var i=0;i<data.seriesFileName.length;i++){
									ImageViewerObj.AddImageFile(data.seriesFileName[i]);
								}
							}
							ImageViewerObj.SetReportURL(data.reportUrl);
							
							//ImageViewerObj.SetConfigValue(256);
							//ImageViewerObj.SetConfigValue(data.configValue);
							ImageViewerObj.SetImageCount(data.imageCount);
							
							ImageViewerObj.SetImageInfo('name='+data.name);					
							ImageViewerObj.OpenRemoteDir(data.storePath);
							ImageViewerObj.ShowViewer();
							
							if(ImageViewerObj.IsProgOpen()==0){
								//window.opener = 'xxx';
								//window.close();
								window.opener=null;
								window.open('','_self','');
								window.close(); 
							}
						}
						else{
							alert(data.errMsg);
						}
					}					
				}
			});
		}catch(e){  
			showTips();
		}
		var timeout;
		$(document.body).mousemove(function(e){
			if(e.pageX<=30&&$("#menu").css('display')=='none'){			
				document.getElementById('menu').style.left=1;
				var top;
				if(e.pageY<$(document.body).height()-140){
					if(e.pageY-70<0){
						top=0;
					}else{
						top=e.pageY-70;
					}
				}else{
					top=$(document.body).height()-140;
				}
				
				document.getElementById('menu').style.top=top;
				$("#menu").show();
				if(timeout)clearTimeout(timeout)
				timeout=setTimeout(function(e){$("#menu").hide()},5000);
			}
		});	
		
		$('#menu').mouseleave(function(e){
			if($("#menu").css('display')=='block')
			$("#menu").hide();
		}).click(function(e){
			toUnobject();
		});		
	}
}
//});
</script>
</head>
<body onLoad="load();" scroll=no>
<div id="tips" style="display:none">
	<h1>浏览器未安装看图控件，请下载安装！</h1>
    <hr>
    <div id=detail>
    	<ul>
        	<li><h3>点击<a href="dll/WebImageViewerInstall.exe">控件下载</a>到本地并安装后<a href="javascript:void();" onClick="window.location.reload();">刷新</a>页面</h3><img src="images/object.png"></li>
            <li><h3>不安装控件,请直接<a href="javascript:toUnobject();">转到非控件</a>模式</h3><img src="images/wado.png"></li>
        </ul>
	</div>
</div>
<div id="menu">
	<span>非</span>
    <span>控</span>
    <span>件</span>
    <span>浏</span>
    <span>览</span>
    <span>模</span>
    <span>式</span>
    <iframe id='iframebar' src="about:blank" frameBorder=0 marginHeight=0 marginWidth=0
  style="position:absolute; visibility:inherit; top:0px;left:0px;height:140px;width:25px; z-Index:-1;">
     </iframe>
</div>
<div id="object" style="display:none">
<OBJECT id="ImageViewerObj" width="100%" height="100%" onreadystatechange="stateChange(this)"
    classid="clsid:2DEEE3DC-11A2-4FA2-92E8-45C70296221F" codeBase="dll/ImageViewer.inf#version=3,5,42"
    VIEWASTEXT>
    <param name="wmode" value="transparent"> 
    <PARAM NAME="_Version" VALUE="65536">
    <PARAM NAME="_ExtentX" VALUE="5080">
    <PARAM NAME="_ExtentY" VALUE="2540">
    <PARAM NAME="_StockProps" VALUE="0">
</OBJECT>
<script type="text/javascript">
ImageViewerObj.CompareVersion('3.5.42.1010');
ImageViewerObj.SetQueryWindowTitle("易联众PACS临床浏览系统");
ImageViewerObj.SetConfigValue(<%=com.ylz.utils.ConfigUtil.getConfigValue() %>);
</script>
</div>
</body>
</html>