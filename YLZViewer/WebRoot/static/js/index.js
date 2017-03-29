//全局变量
	var layer;//弹出层
	var form;//子页面form对象
	var iframeUrl;
	var webRootUrl = getWebAppRoot();
	
	//左侧高度
	function setLeftHeight(){
		var winHeight = $(window).height();
		var headHeight = $("#head").height();
		$("#left").height(winHeight-headHeight);
	}
	
	//右侧高度
	function setRightHeight(){
		var leftHeight = $("#left").height();
		$("#right").height(leftHeight);
	}
	
	//弹出层初始化  用于弹出框、消息提示框、警告框等
	function layerInit(){
		layui.use('layer', function(){
	  	layer = layui.layer;
		});
	}
	
	//滑动左侧菜单效果
	function menuSwith(){
		$("#menuUl").find("li").hover(function(){
			$(this).find(".lightIcon").show();
			$(this).find(".darkIcon").hide();
		},function(){
			$(this).find(".darkIcon").show();
			$(this).find(".lightIcon").hide();
		});
	}
	
	//页面加载默认选择第一个菜单
	function selectFirstMenu(){
		/*$("#menuUl").find("li:first").find(".lightIcon").show();
		$("#menuUl").find("li:first").find(".darkIcon").hide();
		$("#menuUl").find("li:first").addClass("menuClick");*/
		$("#menuUl").find("li:first").click();
	}
	
	//菜单点击事件
	function menuClick(){
		$("#menuUl").find("li").click(function(){
			$(this).find(".lightIcon").show();
			$(this).find(".darkIcon").hide();
			$(this).addClass("menuClick");
			$(this).siblings().removeClass("menuClick");
			/*$(this).find(".lightIcon").css("left","18px");
			$(this).siblings().find(".lightIcon").css("left","26px");*/
			
			$(this).siblings().find(".darkIcon").show();
			$(this).siblings().find(".lightIcon").hide();
			
			//获取当前点击的菜单的id
			var pFunId = $(this).find(".funId").text();
			//alert(pFunId);
			// alert(navLi);
			//清空iframe链接
			$("#mainIframe").attr("src","");
			//刷新二级菜单
			flushNav(pFunId);
		});
	}
	
	//刷新二级菜单
	function flushNav(funId){
		
		$.ajax({
			  url: webRootUrl+"/function/listByPId",
			  type:'post',
			  dataType:'json',
			  data:{pfunId:funId},
			  //async:false,
			  success: function(data){
				//alert(data);
				data = jQuery.parseJSON(data)
				 //alert(data.status);
			    if(data.status!=0){
			    	layer.alert('打开二级菜单出现错误！<br />错误信息：'+data.message+'<br />错误码 ：'+data.status,{
			    	    skin: 'layui-layer_custom',
			    		title:'错误',
			    		closeBtn: 0,
			    		icon:5
			    	  });
			    }else{
			    	var navLi = "";
					   for(var i=0;i<data.result.length;i++){
						   //var munuUrl = webRootUrl+'/business/main.jsp';
						   var munuUrl ='';
						   var funName = '';
						   if(data.result[i].menuUrl!=null){
							   munuUrl =  webRootUrl+"/"+data.result[i].menuUrl;
						   }
						   if(data.result[i].funName!=null){
							   funName =  data.result[i].funName;
						   }
						   navLi += '<li><span>'+munuUrl+'</span>'+funName+'</li>';
					   }
					  
					   $("#nav").find("ul").html(navLi);
					   $("#nav").find("ul li:first").click();
			    }
			    
			  }
			});
	}
	
	//二级菜单切换 点击事件
	function navSwitch(){
		
		$("#nav ul").delegate('li','click',function(){
			$(this).addClass("select");
			$(this).siblings().removeClass("select");
			
			iframeUrl = $(this).find("span").text();
			iframeSwitch(iframeUrl);
		});
	}
	
	
	//头部任务图标 滑动效果
	function taskIconSwitch(){
		$("#head").find(".task").hover(function(){
			$(this).find(".alarmDark").hide();
			$(this).find(".alarmLight").show();
		},function(){
			$(this).find(".alarmDark").show();
			$(this).find(".alarmLight").hide();
		})
	}
	
	//设置mainiframe高度  给子页面调用
	function setMainIframeHeight(height){
		$("#mainIframe").height(height+100);
	}

	//在父页面调用弹出框的通用方法
	function openDialog(title,url,width,height,iframeId){
  		
		var winHeight = $(window).height();
  		var dialogHeight = winHeight+'px';
  		if(winHeight-100>0){
  			dialogHeight = (winHeight-100)+'px';
  		}
  		width==null?width='900px':width;
  		height ==null?height=dialogHeight:height;
		
  		layer.open({
		  type: 2, 
		  title:title,
		  id:iframeId,
		  area: [width, height],
		  skin: 'dialogBtn',
		  scrollbar: true,
		  maxmin :true,
		  content: url, //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no'],
		  btn: ['保存', '取消'],
   		  yes: function(index, layero){
    		//按钮【按钮一】的回调
   		    $(form).submit();
   		    
  		 },btn2: function(index, layero){
    		//按钮【按钮二】的回调
    		//alert(2);
  		}
		});//layer.open
 		
	}
	
	//供给子页面 调用 让子页面将对象写入到父页面的全局变量中
	function getFormObj(formObj){
		form=formObj;
		return form;
	}
	
	//iframe 页面切换
	function iframeSwitch(){
		$("#mainIframe").attr("src",iframeUrl);
	}
	
	//子页面表单 jquery_validate设置错误信息 统一用到 
	function setErrorMsg(msg){
		$("#error").html(msg);
	}
	//子页面表单 jquery_validate获取错误信息 统一用到 
	function getErrorMsg(){
		
		return $("#error").html();
	}
	
	//子页面表单 jquery_validate设置错误信息 加换行用到
	function appendMsg(){
		
		return $("#error").append("<br />");
	}
	
	//表单校验提示框 公用方法
	function alertValidateMsg(msg){
		layer.alert(msg,{
		    skin: 'layui-layer_custom',
			title:'校验错误',
			closeBtn: 0,
			shift:6, //动画类型
			icon:5,
			offset: 'rb',
			shade: 0,
			time:5000
		  });
	}
	
	//表单校验提示框 公用方法
	function alertErrorMsg(msg){
		layer.alert(msg,{
		    skin: 'layui-layer_custom',
			title:'错误',
			closeBtn: 0,
			shift:6, //动画类型
			icon:5,
			offset: 'rb',
			shade: 0,
			time:5000
		  });
	}
	
	function alertSuccessMsg(){
		
		layer.alert('操作成功',{
		    skin: 'layui-layer_custom',
			title:'提示',
			closeBtn: 0,
			shift:2, //动画类型
			icon:6,
			offset: 'rb',
			shade: 0,
			time:4000
		  });
	}
	
	function alertFaildMsg(msg,status){
		
		layer.alert(msg+',错误码：'+status,{
		    skin: 'layui-layer_custom',
			title:'错误',
			closeBtn: 0,
			shift:2, //动画类型
			icon:5,
			offset: 'rb',
			shade: 0,
			time:4000
		  });
	}
	
	
	//获取当前web项目的根路径
	function getWebAppRoot(){
		
		var strURL="";	
		var strFullPath=window.document.location.href;
		var strPath=window.document.location.pathname;
		var pos=strFullPath.indexOf(strPath);
		var prePath=strFullPath.substring(0,pos);
		var postPath=strPath.substring(0,strPath.substr(1).indexOf('/')+1);
		var webPath=prePath+postPath;
		
		return webPath;
	}