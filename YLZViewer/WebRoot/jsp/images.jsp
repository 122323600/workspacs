<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String examNo = request.getParameter("examNo");
if(examNo==null||"".equals(examNo)||"null".equals(examNo)){
	examNo=(String)request.getSession().getAttribute("examNo");
}else{
	request.getSession().setAttribute("examNo",examNo); 
}

String imageMode=com.ylz.util.ConfigUtil.getImageMode();
if(imageMode==null||"".equals(imageMode)){
	imageMode="0";
}
%>
<html>
<head>
<base href="<%=basePath%>">
<title>检查图像列表</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="vs_defaultClientScript" content="JavaScript">
<meta name="vs_targetSchema" content="http://schemas.microsoft.com/intellisense/ie5">
<style type="text/css"> 
<!--
.pheader{
	background: linear-gradient(to bottom, #EFF5FF 0px, #E0ECFF 100%) repeat-x scroll 0 0 transparent;
	border-width:1px;
	border-style: solid;
	border-color: #95B8E7;
	height:30px;
	progid:DXImageTransform.Microsoft.gradient(startColorstr=#EFF5FF,endColorstr=#E0ECFF,GradientType=0); BACKGROUND-COLOR: #e0ecff;
	font-size:12px;
	text-align:center;
}	
.pheader div{margin-top:5px;}
#copyright {
	font: 12px/2 "Trebuchet MS",arial;
	left: 0;
	position: absolute;
	width: 100%; color:#666666;
}
-->
</style>
<%@ include file="/common/common.jsp"%>
<link rel="stylesheet" type="text/css" href="${ctx}/static/css/easyui.css">
<script type="text/javascript" src="${ctx}/static/js/jquery.easyui.min.js"></script>
<script type="text/javascript" src="${ctx}/static/js/util.js"></script>
<script language='JavaScript'>
	util.imageMode="<%=imageMode%>";

	$(function(){
		$('#studylist').datagrid({
			rownumbers:true,fit:true,border:false,
			columns : [[				
				{field:'patientName',width:100,align:'center',title:'病人姓名'},
				{field:'imageCount',width:60,align:'center',title:'图数'},
				//{field:'keyImageCount',width:70,align:'center',title:'关键图'},				
				{field:'seriesCount',width:70,align:'center',title:'序列数'},
				{field:'modality',width:80,align:'center',title:'类型'},
				{field:'deviceName',width:100,align:'center',title:'设备名称'},
				{field:'studyTime',width:150,align:'center',title:'检查时间'},
				{field:'studyDescription',width:300,align:'center',title:'检查描述'},
				{field:'studyNo',width:160,align:'center',title:'操作',formatter:function(v, r, i) {				
					return '<a studyno=' + v +
						' class="easyui-linkbutton l-btn l-btn-small" ' +
						' data-options="plain:false" onclick="util.openImage(this);"' +
						' href="javascript:void(0)"><span class="l-btn-left"><span class="l-btn-text">影像浏览</span></span></a>';
				}}
			]],
			toolbar:'#toolbar',
			url:'${ctx}/imgRpt/getStudys',
			onLoadSuccess:function(data){
				if(!data || data.total==0)$.messager.show({title: '提示',msg: '没有查询到相关信息!'});
				else //$('#content').panel('setTitle', '检查图像列表 - '+data.rows[0].patientName);
				$('#main').layout('panel','center').panel('setTitle', '检查图像列表 - '+data.rows[0].patientName);
				$('#studylist').datagrid('clearSelections');
			}				
		});
	});
function onload(){
	$('#studylist').datagrid({url:'${ctx}/imgRpt/getStudys', queryParams:{examNo:"<%=examNo%>"}});
}
</script>
</head>
<body id="main" class="easyui-layout" onLoad="onload();">
<div data-options="region:'north',border:false,collapsed:false" style="height:60px;background:url(${ctx}/static/images/bg.png);padding:10px;overflow:hidden;">
    <div style="float:left;margin-top:-8px;"><img src="${ctx}/static/images/logo.png"></div>
</div>
<div data-options="region:'center',title:'检查图像列表',border:false" id="content" style="overflow:hidden;">
<!--    <table id="studylist" class="easyui-datagrid" data-options="rownumbers:true,fit:true,border:false">
        <thead><tr>
            <th data-options="field:'patientName',width:80,align:'center'">病人姓名</th>
            <th data-options="field:'imageCount',width:60,align:'center'">图数</th>
            <th data-options="field:'keyImageCount',width:70,align:'center'">关键图</th>
            <th data-options="field:'modality',width:80,align:'center'">类型</th>
            <th data-options="field:'deviceName',width:100,align:'center'">设备名称</th>
            <th data-options="field:'studyTime',width:150,align:'center'">检查时间</th>
            <th data-options="field:'studyDescription',width:300,align:'center'">检查描述</th>
        </tr></thead>
    </table>-->
    <table id="studylist"></table>
</div>
<div data-options="region:'south',border:false" class="pheader"><div id="copyright">Copyright © 2013 www.ylzinfo.com 易联众 版权所有</div></div>
</body>
</html>