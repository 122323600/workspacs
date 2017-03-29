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
<html lang="en">
<head>
    <meta charset="UTF-8">
    <%@ include file="/common/common.jsp"%>
    <title>dicom影像浏览</title>    
    <link type="text/css" rel="stylesheet" href="${ctx}/dicom/css/bootstrap.min.css">
    <link type="text/css" rel="stylesheet" href="${ctx}/dicom/css/image.css">
    <script src="${ctx}/dicom/js/jquery-1.11.3.min.js"></script>
    <script src="${ctx}/dicom/js/bootstrap.min.js"></script>
    <script src="${ctx}/dicom/js/tool.js"></script>
    <script src="${ctx}/dicom/js/_Status.js"></script>
    <script src="${ctx}/dicom/js/_View-ado.js?v=3"></script>
    <script src="${ctx}/dicom/js/_Modal.js"></script>
    <script src="${ctx}/dicom/js/_Control.js"></script>
    <script src="${ctx}/dicom/js/_indexedDB.js"></script>
    <script src="${ctx}/dicom/js/querystring.js"></script>
    <script>
        //判断浏览器类型及大小
        window.queryString = new QueryStringParser();
        var studyNo=queryString.getParam('study_no');
        var studySeries=queryString.getParam('study_series');
        var deviceAgent = navigator.userAgent.toLowerCase();
        var isMobile = deviceAgent.match(/(iphone|ipod|ipad|android)/);
        if(isMobile){
            if (window.outerWidth > 700) {
                window.location.href='mobile/image-pad.jsp?study_no=' + studyNo + '&study_series=' + studySeries;
            } else {
                window.location.href='mobile/image.jsp?study_no=' + studyNo + '&study_series=' + studySeries;
            }
        }

        //ajax
        var RemoteProxy = (function() {
			var ctx = null, urls = {
				getDicomData:"<%=basePath%>study/getData",
				getJpeg:"<%=basePath%>study/getJpeg",
				getStudy:"<%=basePath%>study/getStudy?imagePath=${param.imagePath}",
				getInfo:"<%=basePath%>study/getInfo",
			};
			/**
			 * ajax请求
			 */
			function _sendAjax(url, params, success, error, type, isSync) {
				$.ajax({
					async : !isSync,
					url : ctx + url,// + "?d=" + (new Date()),
					type : type || "post",
					data : params || {},
					success : function(data) {
						success(data);
					},
					error : function() {
						error && error();
					}
				});
				//success(window.dicomData);
			}
			return {
				/**
				 * 初始化
				 */
				init : function(c) {
					ctx = c;
				},
				/**
				 * 通过获取study所有信息
				 */
				getStudy: function(params, callback, error) {
					_sendAjax(urls["getStudy"], params, callback, error);
				},
				/**
				 * 通过获取jpeg图像URL
				 */
				getJpegURL: function() {
					return urls["getJpeg"];
				},
				/**
				 * 获取单个dicom数据
				 */
				getDicomData : function(params, callback, error) {
					_sendAjax(urls["getDicomData"], params, callback, error);
				},
				/**
				 * 获取单个dicom信息
				 */
				getInfo:function(params, callback, error) {
					_sendAjax(urls["getInfo"], params, callback, error);
				}
			};
		})();

        //start
        $(function(){
            if (!studyNo) studyNo = "<%=studyNo%>";
            if (!studySeries) studySeries = "<%=studySeries%>";
            var study = {};
            study.studyNo = studyNo;
            if (studySeries) {
                var arr = studySeries.split(",");
                study.series = [];
                for (var i = 0; i < arr.length; i++) {
                    var serie = {};
                    serie.seriesUid = arr[i];
                    study.series.push(serie);
                }
            }
            //初始化
            //初始状态设置
            systemStatus.set('link', 0);
            view.init();
            RemoteProxy.init("");//ajax加载器初始化
            modal.init(study);
            control.init();
            //reportPlugin_YLZ.init();
        });
    </script>
    <style>
        #panelCanvasOutside{
            display: none;
            position: absolute;
            top:0;
            left:0;
            height:100%;
            background-color: #000;
            cursor:default;
            overflow: hidden;
            z-index:15;
        }
        #outside-info{
            display: none;
            position: absolute;
            top:30px;
            background-color: rgba(233,233,233,0.6);
            color:#000;
            font-size:14px;
            padding:10px;
            border-radius: 5px;
            z-index:20;
        }
    </style>
</head>

<body oncontextmenu="return false" onselectstart="return false" ondragstart="return false" onbeforecopy="return false" oncopy=document.selection.empty() onselect=document.selection.empty()>
    <div class="boardFunction">
        <div id="extendedBox"></div>
    </div>
    <div class="boardImage" id="boardImage">
        <table class="panelImage" cellspacing="0" cellpadding="0">
            <tbody></tbody>
        </table>
        <div class='panelCanvas' id="panelCanvasOutside">
        	<img class='canvas-dicom'>
 <!--           <canvas class= 'canvas-dicom'></canvas>
            <canvas class= 'canvas-measure'></canvas>
            <canvas class= "canvas-positioningLine"></canvas>
            <canvas class= "canvas-lesionsPoint"></canvas>-->
            <div class='errorBox'><p class='errorBox-info'></p></div>
            <div class='panelCanvas-info panelCanvas-windowInfo'>
                <p>W:<span class='panelCanvas-windowWidth'></span></p>
                <p>C:<span class='panelCanvas-windowCenter'></span></p>
            </div>
            <div class='panelCanvas-info panelCanvas-patientInfo'>
                <p><span class='patient-name'></span></p>
                <p><span class='patient-sex'></span>/<span class='patient-age'></span></p>
                <p><span class='modality'></span></p>
                <p><span class='patient-weight'></span>kg</p></div>
            <div class='panelCanvas-info panelCanvas-date'>
                <p><span class='patient-checkDate'></span></p>
                <p><span class='patient-checkTime'></span></p>
            </div>
            <div class='panelCanvas-info panelCanvas-study'>
                <p>Srs:<span class='studyNo'></span></p><p>Img:<span class='imageNo'></span></p>
            </div>
            <div class="panelCanvas-info panelCanvas-down"><span class="panelCanvas-direction-bottom"></span></div>
            <div class="panelCanvas-info panelCanvas-right"><span class="panelCanvas-direction-right"></span></div>
            <canvas class="panelCanvas-info panelCanvas-staff-right"></canvas>
            <div class="panelCanvas-info panelCanvas-staff-length"></div>
            <p id='outside-info'>双击或按ESC键退出全屏模式</p>
        </div>
    </div>
    <div class="boardOrder">
        <header class="order-header">
            <p>共有<span id="order-seriesNum">0</span>个序列,<span id="order-imageNum">0</span>张图像</p>
            <div class="progress" id="order-downloadProgress">
                <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>
            </div>
        </header>
        <div class="order-info"></div>
    </div>
    <!--这是一个文本镜像,用于检查文本的宽高,不进行显示-->
    <span id="shapeTextMirror"></span>
</body>
</html>