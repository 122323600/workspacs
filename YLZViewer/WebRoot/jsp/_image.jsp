<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String studyNo = request.getParameter("studyNo");
String studySeries=request.getParameter("studySeries");
if(studyNo==null||"".equals(studyNo)||"null".equals(studyNo)){
	studyNo=(String)request.getSession().getAttribute("studyNo");
}else{
	request.getSession().setAttribute("studyNo",studyNo); 
}
if(studySeries==null||"".equals(studySeries)||"null".equals(studySeries)){
	studySeries=(String)request.getSession().getAttribute("studySeries");
}else{
	request.getSession().setAttribute("studySeries",studySeries); 
}
if(studySeries==null||"".equals(studySeries)||"null".equals(studySeries))studySeries="";
%>
<!DOCTYPE html>
<html >
<head>
<base href="<%=basePath%>">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="stylesheet" href="<%=basePath%>css/_image.css">
<%@ include file="/common/common.jsp"%>
<script type="text/javascript" src="<%=basePath%>js/client.js"></script>
<script type="text/javascript" src="<%=basePath%>js/cookie.js"></script>
<script type="text/javascript" src="<%=basePath%>js/querystring.js"></script>
<script type="text/javascript" src="<%=basePath%>js/_image.js?v=1"></script>
<title>易联众医学影像浏览</title>
<script type="text/javascript">
	var studyNo="<%=studyNo%>"; studySeries="<%=studySeries%>";
	window.queryString = new QueryStringParser();
	function load(){ 
		util.resizeWindow();	
		if(studyNo=='null'){
			if(queryString.getParam('study_no')){
				studyNo=queryString.getParam('study_no');
			}else if(queryString.getParam('StudyNo')){
				studyNo=queryString.getParam('StudyNo');
			}
		}
		image.init();
	}
   //$(function(){image.init();});
</script>
</head>
<body onLoad="load();">
<form name="ImageForm" id="ImageForm" onSubmit="return false;">
<div id="box">
<table width="100%" height="100%" border="0" class="mainTable" id="mainTable">
  <tr height="100%">
    <td id="leftPanel" valign="top" onContextMenu="return false">    	
		<div id="tablePanel" style="text-align:center;"></div>       
    </td>
    <td id="rightPanel" width=200px>
       	<table width=100% height=100% border="0">
          <tr>
            <td id="menuPanel" valign="top">
            	<table width="100%" height="100%" border="0" id="menuTable">                  
                  <tr>
                    <td width="40%">显示模式：</td>
                    <td width="60%"><select name="modeSelect" id="modeSelect" data-role="none"></select></td>
                  </tr>
                  <tr>
                    <td>窗宽窗位：</td>
                    <td><select name="valueSelect" id="valueSelect" data-role="none"></select></td>
                  </tr>
                  <tr>
                    <td><div id=imageControl><p><label><input name="imageControl" type="checkbox" id="chkbox_enlarge" value="enlarge" data-role="none">放大镜</label></p></div></td>
                    <td >
                    	<select name="synchSelect" id="synchSelect" data-role="none">
                            <option value=1 selected>不联动</option>
                            <option value=2>序列联动</option>
                            <option value=3>全部联动</option>
                        </select>
                    </td>
                  </tr>
                  <tr>                    
                    <td colspan="2"><font style="display:none; color:#ff0000; size:+1">未注册版本</font></td>
                  </tr>
                </table>
            </td>
          </tr>
          <tr height="100%">
            <td id="imageList" valign="top" style="background:#000000"></td>
          </tr>
        </table>
    </td>
  </tr>
</table>
</div>
<iframe id="popup" scrolling="no" frameborder="0"></iframe>
<div id="imode" style="width:200px;height:130px;padding:5px 10px;overflow:hidden">
    <div class="infoitem">
        <label>行数:</label><input name="rowCount" id="rowCount" style="width:80px;">
    </div>
    <div class="infoitem">
        <label>列数:</label><input name="colCount" id="colCount" style="width:80px;">
    </div>    
</div>
<div id="dwvalue" style="width:200px;height:160px;padding:5px 10px;overflow:hidden">	
    <div class="infoitem">
        <label>标题:</label><input name="title" id="title" style="width:80px;"><input name="index" id="index" type="hidden">
    </div>
    <div class="infoitem">
        <label>窗宽:</label><input name="windowWidth" id="windowWidth" style="width:80px;">
    </div>
    <div class="infoitem">
        <label>窗位:</label><input name="windowCenter" id="windowCenter" style="width:80px;">
    </div>  
</div>
<div id="dwindow" style="width:400px;height:300px;overflow:hidden">
    <center><table id="wtable"></table></center>
    <div id="toolbar" style="height:auto">
        <a href="javascript:void(0)" class="easyui-linkbutton" data-options="iconCls:'icon-add',plain:true" onclick="image.add()">添加</a>
        <a href="javascript:void(0)" class="easyui-linkbutton" data-options="iconCls:'icon-edit',plain:true" onclick="image.edit()">修改</a>
        <a href="javascript:void(0)" class="easyui-linkbutton" data-options="iconCls:'icon-remove',plain:true" onclick="image.del()">删除</a>
        <a href="javascript:void(0)" class="easyui-linkbutton" data-options="iconCls:'icon-reload',plain:true" onclick="image.refresh()">刷新</a>
    </div>
</div>
<div id="menu" style="display:none">	
    <span>控</span>
    <span>件</span>
    <span>浏</span>
    <span>览</span>
    <span>模</span>
    <span>式</span>
</div>		
</form>
</body>
</html>