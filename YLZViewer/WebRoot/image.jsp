<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
String imageMode=com.ylz.util.ConfigUtil.getImageMode();
if(imageMode==null||"".equals(imageMode)){
	imageMode="0";
}
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<%@ include file="/common/common.jsp"%>
<title>易联众医学影像浏览</title>
<meta name="vs_defaultClientScript" content="JavaScript">
<meta name="vs_targetSchema" content="http://schemas.microsoft.com/intellisense/ie5">
<link rel="icon" href="${ctx}/static/images/favicon.ico" type="image/x-icon" />
<link rel="shortcut icon" href="${ctx}/static/images/favicon.ico" mce_href="${ctx}/static/images/favicon.ico" type="image/x-icon" />
<script type="text/javascript" src="${ctx}/static/js/jquery.min.js"></script>
<script type="text/javascript">	
	var imageMode="<%=imageMode%>";

	$(function(){init();});	
	var path,url,viewmode;
	function init(){
		var applyNo='${param.applyNo}';	
		var examNo='${param.examNo}';	
		var studyNo='${param.studyNo}';	
		var orderNo='${param.orderNo}';	
		viewmode='${param.viewmode}';	
		if(studyNo){
		   studyNoForm(studyNo);
		}else if(applyNo||examNo||orderNo){
			$.ajax({
				type: 'post',
				url:"imgRpt/getExamStudy",
				data: {applyNo:applyNo,examNo:examNo,orderNo:orderNo},
				dataType: 'json',
				success: function (data){
					if(data){
						if(data.success){
							//window.location.href = window.path+ 'html/image.htm?StudyNo='+data.studyNo;
							if(data.data.length>1){//跳到多图像页面
							    examNoForm(data.data[0].examNo);
							}else{//直接打开唯一图像
							    studyNoForm(data.data[0].studyNo);
							}
						}
						else $('h1').html(data.errMsg);							
					}				
				}
			});
		}else{
			$('h1').html('查询条件不够,studyNo,申请单号applyNo或检查流水号examNo不能为空!');
			return false;
		}			
	}
	function studyNoForm(studyNo){
	    document.forms.form.studyNo.value=studyNo;		
		var form = document.forms.form;
		var jspName;
		if(("ActiveXObject" in window)){
			switch(imageMode){
				case "2":{
					jspName='/jsp/_image.jsp';
					break;
				}
				case "3":{
					jspName='/dicom/image.jsp';
					break;
				}
				default :{
					jspName='/jsp/image.jsp';
					break;
				}
			}
		}else{
			if(this.imageMode=="3"||this.imageMode=="1"){
				jspName='/dicom/image.jsp';
			}else{
				jspName='/jsp/_image.jsp';
			}
		}
		form.action = '${ctx}'+jspName;
		form.submit();
	}		
	
	function examNoForm(examNo){
	    document.forms.form.examNo.value=examNo;
		document.forms.form.viewmode.value=viewmode;
		var form = document.forms.form;
		form.action = '${ctx}'+'/jsp/images.jsp';
		form.submit();
	}	
</script>
</head>
<body>
<h1></h1>
<form id="form" method="post" target="_self">
	<input name="studyNo" id="studyNo" type="hidden">
	<input name="examNo" id="examNo" type="hidden">
    <input name="viewmode" id="viewmode" type="hidden">
</form>
</body>
</html>