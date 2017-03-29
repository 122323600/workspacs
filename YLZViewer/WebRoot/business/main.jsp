<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<%@ include file="/common/common.jsp"%>
<script src="${ctx}/static/js/main.js"></script>
<script type="text/javascript">
	$(function(){
		//table 的奇数行变换颜色
		trColorChange();
		//点击操作按钮效果
		editBtnClick();
		//隐藏操作按钮弹出的div
		hideEditDiv();
		//设置父页面高度 子页面通用方法 设置父页面的高度 
		//注意：子页面 一定 要包在 id为main的div中
		setParentMainIframeHeight();
		//分页控件初始化
		pagingInit();
	});
	
	
	//分页栏
	function pagingInit(){
		
	layui.use(['laypage', 'layer'], function(){
  		var laypage = layui.laypage,
  		layer = layui.layer;
		
		laypage({
		    cont: 'page',
		    pages: 100,
		    groups: 5,
		    skin:'#5760d5',
		    first:1,
		    last:100,
		    skip:true,
		    jump: function(obj, first){
		      if(!first){
		        layer.msg('第 '+ obj.curr +' 页');
		     }
	    }
  	  });
  	  
	});
	}
	
	function openimages(studyNo,studySeries,examNo){
		$.ajax({
			url : 'img/getStudys',
			type : 'post',
			dataType: 'json',
			data: {examNo:examNo},
			success:function(data){
				if($.isArray(data)&&data.length>0){
					if(data.length==1){
						openImage(data[0]);
					}else{
						$('#studyDialog').dialog('open').dialog('setTitle','图像列表'+'-'+data[0].patientName);
						$('#studylist').datagrid('loadData',data);
					}
				}
			}
		});
	}
	
	function openImage(data){
		var form = document.createElement("form");		
		document.body.appendChild(form);
		var input = document.createElement("input");
		input.type = "hidden";
		form.appendChild(input);
		input.id = 'studyNo';
		input.name = 'studyNo';
		input.value = data.studyNo;
		var input1 = document.createElement("input");
		input1.type = "hidden";
		form.appendChild(input1);
		input1.id = 'studySeries';
		input1.name = 'studySeries';
		
		if(data.studySeries){			
			input1.value = data.studySeries;
		}else{
			input1.value ='';
		}
		
		form.name = "form";
		form.method = "post";

		form.target = "_blank";	
		form.action='dicom/image.jsp';
		
		form.submit();
	}
	
	//................表格排序....................
	var k=0;
	function sortTable(sTableId,iCol,sDataType){
	    var oTable=document.getElementById(sTableId);//获取表格的ID
	    var oTbody=oTable.tBodies[0]; //获取表格的tbody
	    var colDataRows=oTbody.rows; //获取tbody里的所有行的引用
	    var aTRs=new Array(); //定义aTRs数组用于存放tbody里的行
	    for(var i=0;i<colDataRows.length;i++){//依次把所有行放如aTRs数组
	    	if(colDataRows[i].id.indexOf("Relax_Text")==-1){
		    	aTRs.push(colDataRows[i]);
	    	}
	    }
       
        if(oTable.sortCol==iCol){//非首次排序
        	aTRs.reverse();
        }else{ //首次排序
        	if(k%2==0){//升序
       			aTRs.sort(generateCompareTRs(iCol,sDataType));
			}else if(k%2==1){//降序
				aTRs.sort(generateCompareTRs1(iCol,sDataType));
			}
       	}
           
        var oFragment=document.createDocumentFragment();//创建文档碎片/
        for(var i=0;i<aTRs.length;i++){ //把排序过的aTRs数组成员依次添加到文档碎片
        	oFragment.appendChild(aTRs[i]);
        }
      	oTbody.appendChild(oFragment); //把文档碎片添加到tbody,完成排序后的显示更新
       	oTable.sortCol=iCol;//把当前列号赋值给sortCol,以此来区分首次排序和非首次排序,//sortCol的默认值为-1
    };
       //比较函数，用于两项之间的排序
		//升序
    function generateCompareTRs(iCol,sDataType){
    	return   function compareTRs(oTR1,oTR2){
	        var vValue1=convert(getText(oTR1.cells[iCol]),sDataType);
	        var vValue2=convert(getText(oTR2.cells[iCol]),sDataType);
	        if(vValue1<vValue2){
	        	return -1;
	        }else if(vValue1>vValue2){
	        	return 1;
	        }else{
	        	return 0;
	        }
        };
    };
     
	//降序
    function generateCompareTRs1(iCol,sDataType){
       return   function compareTRs(oTR1,oTR2){
	       var vValue1=convert(getText(oTR1.cells[iCol]),sDataType);
	       var vValue2=convert(getText(oTR2.cells[iCol]),sDataType);
	       if(vValue1>vValue2){
	           return -1;
	       }else if(vValue1<vValue2){
	       	   return 1;
	       }else{
	       	   return 0;
	       }
	   };
    };
     
    //数据类型转换函数
    function convert(sValue,sDataType){
    	  if(sValue.indexOf('月')>-1 && sValue.indexOf('岁')==-1){
    		  sValue=parseInt(sValue)/12;
    	  }
    	  switch(sDataType){
              case "int":return parseInt(sValue);
	          case "float": return parseFloat(sValue);
	          case "date":return new Date(Date.parse(sValue));
	          default:return sValue.toString();
          }
    };
    
    function getText(target){
    	if(target.firstChild!=null){
    		if(target.firstChild.nodeValue!=null)
    			return target.firstChild.nodeValue;
    		else
    			return target.firstChild.innerHTML;	
    	}
    	return '0';
    }

	//................表格排序....................
</script>
</head>
<body>
<div id="main">
	<div id="operDiv">
		<span class="addBtn" onclick="openDialog('应用列表','${ctx}/business/main.jsp','1000px')">添加应用</span>
	</div>
	<table id="MyDataGrid" sortCol="-1">
		<thead>
			<tr>
				<th>应用名称</th>
				<th style="cursor:pointer" onclick="sortTable('MyDataGrid',1,'int')">版本</th>
				<th style="cursor:pointer" >状态</th>
				<th style="cursor:pointer" >权限</th>
				<th style="cursor:pointer" width="10%">操作</th>
			</tr>
		</thead>
		
		<tbody>
			<tr>
				<td>云PACS</td>
				<td>1岁</td>
				<td>已启用</td>
				<td>用户注册  单位列表 可以这样 可以那样</td>
				<td><a href="javascript:openimages('0003123659','','0003356558');">报告</a> 图像</td>
			</tr>
			<tr id=Relax_Text_8  style="DISPLAY: none" ><td colspan="5" height=200px><div id='div_8'>&nbsp;</div></td></tr>
			
			<tr>
				<td>云PACS</td>
				<td>13岁</td>
				<td>已启用</td>
				<td>用户注册  单位列表 可以这样 可以那样</td>
				<td>报告 图像</td>
			</tr>
			<tr id=Relax_Text_8  style="DISPLAY: none" ><td colspan="5" height=200px><div id='div_8'>&nbsp;</div></td></tr>
			<tr>
				<td>云PACS</td>
				<td></td>
				<td>已启用</td>
				<td>用户注册  单位列表 可以这样 可以那样</td>
				<td>报告 图像</td>
			</tr>
			<tr id=Relax_Text_8  style="DISPLAY: none" ><td colspan="5" height=200px><div id='div_8'>&nbsp;</div></td></tr>
			<tr>
				<td>云PACS</td>
				<td>22</td>
				<td>已启用</td>
				<td>用户注册  单位列表 可以这样 可以那样</td>
				<td>报告 图像</td>
			</tr>
			<tr id=Relax_Text_8  style="DISPLAY: none" ><td colspan="5" height=200px><div id='div_8'>&nbsp;</div></td></tr>
			<tr>
				<td>云PACS</td>
				<td>1岁4月</td>
				<td>已启用</td>
				<td>用户注册  单位列表 可以这样 可以那样</td>
				<td>报告 图像</td>
			</tr>
			<tr id=Relax_Text_8  style="DISPLAY: none" ><td colspan="5" height=200px><div id='div_8'>&nbsp;</div></td></tr>
			<tr>
				<td>云PACS</td>
				<td>31岁</td>
				<td>已启用</td>
				<td>用户注册  单位列表 可以这样 可以那样</td>
				<td>报告 图像</td>
			</tr>
			<tr id=Relax_Text_8  style="DISPLAY: none" ><td colspan="5" height=200px><div id='div_8'>&nbsp;</div></td></tr>
			<tr>
				<td>云PACS</td>
				<td>16</td>
				<td>已启用</td>
				<td>用户注册  单位列表 可以这样 可以那样</td>
				<td>报告 图像</td>
			</tr>
			<tr id=Relax_Text_8  style="DISPLAY: none" ><td colspan="5" height=200px><div id='div_8'>&nbsp;</div></td></tr>
			<tr>
				<td>云PACS</td>
				<td>35</td>
				<td>已启用</td>
				<td>用户注册  单位列表 可以这样 可以那样</td>
				<td>报告 图像</td>
			</tr>
			<tr id=Relax_Text_8  style="DISPLAY: none" ><td colspan="5" height=200px><div id='div_8'>&nbsp;</div></td></tr>
			<tr>
				<td>云PACS</td>
				<td>102岁</td>
				<td>已启用</td>
				<td>用户注册  单位列表 可以这样 可以那样</td>
				<td>报告 图像</td>
			</tr>
			<tr id=Relax_Text_8  style="DISPLAY: none" ><td colspan="5" height=200px><div id='div_8'>&nbsp;</div></td></tr>
			<tr>
				<td>云PACS</td>
				<td>23岁</td>
				<td>已启用</td>
				<td>用户注册  单位列表 可以这样 可以那样</td>
				<td>报告 图像</td>
			</tr>
			<tr id=Relax_Text_8  style="DISPLAY: none" ><td colspan="5" height=200px><div id='div_8'>&nbsp;</div></td></tr>
		<tbody>
	</table>
	
	<div id="page">
		
	</div>
</div> <!--main-->
</body>
</html>