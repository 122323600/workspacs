(function(){	
	if(window.util)return false;
	var BASEPATH;
	var imageMode;
	String.prototype._indexOf = String.prototype.indexOf; 
	String.prototype.indexOf = function(){ 
		if(typeof(arguments[arguments.length - 1]) != 'boolean') return this._indexOf.apply(this,arguments); 
		else { 
			var bi = arguments[arguments.length - 1]; 
			var thisObj = this; 
			var idx = 0; 
			if(typeof(arguments[arguments.length - 2]) == 'number'){ 
				idx = arguments[arguments.length - 2]; 
				thisObj = this.substr(idx); 
			} 					 
			var re = new RegExp(arguments[0],bi?'i':''); 
			var r = thisObj.match(re); 
			return r==null?-1:r.index + idx; 
		} 
	} 
	function getFormObject(from){
		var array = from.serializeArray();
		if($.isArray(array)==false) return null;
		var o = new Object;
		for(var i=0; i<array.length; i++){
			if(array[i].value){
				o[array[i].name] = array[i].value;
			}
		}
		return o;	
	}
	
	function dateformat(n){
		var date = new Date();
		if(typeof n == 'number')date.setDate(date.getDate()+n);
		var y = date.getFullYear();
		var m = date.getMonth()+1;
		var d = date.getDate();
		return y+'-'+(m<10?('0'+m):m)+'-'+(d<10?('0'+d):d);
	}
	
	function yearlist(n){
		if(typeof n != 'number')n=10;
		var l = [];
		var d = new Date();
		var y = d.getFullYear();
		for(var i=y;i>y-n;i--){
			var o = new Object;
			o["value"] = i;
			o["text"] = i;
			l.push(o);
		}
		l[0]["selected"]=true;
		return l;
	}
	
	function monthlist(){
		var l = [];
		for(i=1;i<13;i++){
			var o = new Object;
			o["value"] = i;
			o["text"] = i;
			l.push(o);
		}
		var m = (new Date).getMonth();
		l[m]["selected"]=true;
		return l;
	}
	
	function tochar(n){return n<10?'0'+n:n;}
	
	function hospitalcombo(){
		$('#hospital').combo({
			required:true,
			editable:false
		});
		$.ajax({
			type: 'post',
			url:"code/hospital",			
			dataType: 'json',
			success: function (data){
				if($.isArray(data)){
					var cbs = ['<input name="all" type="checkbox" value="all" checked><span>全部</span><br/>'];
					for(var i=0; i<data.length; i++){
						cbs.push('<input name="item" type="checkbox" value="'+data[i].hospitalCode+'" checked><span>'+data[i].hospitalName+'</span><br/>');
					}
					$('#hospitalPanel').html(cbs.join(''));
					$('#hospitalPanel').appendTo($('#hospital').combo('panel'));
					$('#hospital').combo('setValue','all').combo('setText', '全部');
					$('#hospitalPanel input').click(function(e){
						var v = $(this).val();
						if(v=='all'){
							if(e.target.checked){
								$('#hospitalPanel input').attr('checked',true);
								$('#hospital').combo('setValue', v).combo('setText', '全部');
							}
							else{
								$('#hospitalPanel input').attr('checked',false);
								$('#hospital').combo('clear');
							}
						}
						else{
							var s=[],t=[];
							
							var items = $('#hospitalPanel input[name="item"]:checked'); 						
							if(items.length==data.length){
								$('#hospitalPanel input[name="all"]').attr('checked',true);
								$('#hospital').combo('setValue', v).combo('setText', '全部');
							}else{
								for(var i=0; i<items.length; i++){									
									s.push(items[i].value);
									t.push(items[i].nextSibling.innerHTML);
								}
								$('#hospitalPanel input[name="all"]').attr('checked',false);
								$('#hospital').combo('setValues', s).combo('setText', t);
							}
						}
						var values = $('#hospital').combo('getValues');
						if($.isArray(values)&&values.length==1&&values[0]!='all'){
							deptSelect({'hospitalCode': values[0]});
						}else {
							deptSelect({'clear': true});							
						}
					});
				}
			}
		});
	}
	
	function examclasscombo(){
		$('#examClass').combo({
			required:true,
			editable:false,
			panelHeight:'auto'
		});
		$.ajax({
			type: 'post',
			url:"code/examClass",			
			dataType: 'json',
			success: function (data){
				if($.isArray(data)){
					//var cp = document.getElementById("comboPanel");
					var cbs = ['<input name="all" type="checkbox" value="all" checked><span>全部</span><br/>'];
					for(var i=0; i<data.length; i++){
/*						var cb = document.createElement('input');
						cb.setAttribute("type", "checkbox");
						cb.setAttribute("value", data[i].examClassName);*/
						cbs.push('<input name="item" type="checkbox" value="'+data[i].examClassName+'" checked><span>'+data[i].examClassName+'</span><br/>');
					}
					$('#examClassPanel').html(cbs.join(''));
					$('#examClassPanel').appendTo($('#examClass').combo('panel'));
					//$('#comboPanel input').attr('checked',true);
					$('#examClass').combo('setValue','all').combo('setText', '全部');
					$('#examClassPanel input').click(function(e){
/*						var v = $(this).val();
						var s = $(this).next('span').text();
						$('#examClass').combo('setValue', v).combo('setText', s).combo('hidePanel');*/
						var v = $(this).val();
						if(v=='all'){
							if(e.target.checked){
								$('#examClassPanel input').attr('checked',true);
								$('#examClass').combo('setValue', v).combo('setText', '全部');
							}
							else{
								$('#examClassPanel input').attr('checked',false);
								$('#examClass').combo('clear');
							}
						}
						else{
							var s=[];
							var items = $('#examClassPanel input[name="item"]:checked'); 						
							if(items.length==data.length){
								$('#examClassPanel input[name="all"]').attr('checked',true);
								$('#examClass').combo('setValue', v).combo('setText', '全部');
							}else{
								for(var i=0; i<items.length; i++){									
									s.push(items[i].value);									
								}
								$('#examClassPanel input[name="all"]').attr('checked',false);
								$('#examClass').combo('setValues', s).combo('setText', s);
							}
						}
					});
				}
			}
		});
	}
	//病人来源下拉框，新增日期：2015-01-13 ，林华邦
	function patientSourceCombo(){
		$.ajax({
			type: 'post',
			url:"code/patientSource",			
			dataType: 'json',
			success: function (data){
				if($.isArray(data)){
					var a=[];
					var f={'value':'','text':'全部','selected':true};
					a.push(f);
					for(var i=0;i<data.length;i++){
						a.push({
							'value':data[i].patientSourceName,
							'text':data[i].patientSourceName
						});
					}
					$('#patientSource').combobox({
						 data:a
					});
				}
			}
		});
	}
				
	function getPosition(){// - $(parent.document.activeElement).offset().left
		var o = new Object;
		o.top = ($(window.top).height()-$('#dialog').height())/2-80;
		o.left = ($(window.top).width()-$('#dialog').width())/2;
		return o;
	}
	
	function openReport(e){
		//var url = util.BASEPATH+'imgRpt/getReport';
		//window.open(url+"?reportNo=1&examNo=" + e.getAttribute('examno'),"_blank","top=0,left=0,scrollbars=yes,fullscreen=no,toolbar=no,status=no,menubar=no,resizable=yes,location=no,z-look=yes,width="+(screen.width)+",height="+(screen.height));
		var form = document.createElement("form");		
		document.body.appendChild(form);
		var einput = document.createElement("input");
		einput.type = "hidden";
		form.appendChild(einput);
		einput.id = 'examNo';
		einput.name = 'examNo';
		einput.value = e.getAttribute('examno');
		var rinput = document.createElement("input");
		rinput.type = "hidden";
		form.appendChild(rinput);
		rinput.id = 'reportNo';
		rinput.name = 'reportNo';
		rinput.value = e.getAttribute('reportno');
		form.name = "form";
		form.method = "post";
		form.target = "_blank";
		form.action = 'report/viewer';
		form.submit();
	}
	
	function openImage(e){
		var form = document.createElement("form");		
		document.body.appendChild(form);
		var input = document.createElement("input");
		input.type = "hidden";
		form.appendChild(input);
		input.id = 'studyNo';
		input.name = 'studyNo';
		input.value = e.studyNo?e.studyNo:e.getAttribute('studyno');
		var input1 = document.createElement("input");
		input1.type = "hidden";
		form.appendChild(input1);
		input1.id = 'studySeries';
		input1.name = 'studySeries';
				
		if(e.studySeries){			
			input1.value = e.studySeries;
		}else{
			input1.value ='';
		}
		//Start新增检查设备类型
		var input2 = document.createElement("input");
		input2.type = "hidden";
		form.appendChild(input2);
		input2.id = 'modality';
		input2.name = 'modality';
				
		if(e.modality){			
			input2.value = e.modality;
		}else{
			input2.value ='';
		}
		//End
		form.name = "form";
		form.method = "post";

		var mobile=navigator.userAgent.toLowerCase().match(/(iphone|ipod|ipad|android)/); 
		if(mobile){
			form.target="_self";
			if (window.outerWidth > 700) {
				form.action='dicom/mobile/image-pad.jsp';
			} else {
				form.action='dicom/mobile/image-phone.jsp';
			}
		}else{
			form.target = "_blank";	
			if(("ActiveXObject" in window)){
				switch(this.imageMode){
/*					case "1":{
						form.action='jsp/image.jsp';
						break;
					}*/
					case "2":{
						form.action='jsp/_image.jsp';
						break;
					}
					case "3":{
						form.action='dicom/image.jsp';
						break;
					}
					default :{
						form.action='jsp/image.jsp';
						break;
					}
				}
			}else{
				//调用
		        //reviewStudy("linkimaging", "ylzinfo", "D:/LocalTestDicom/ylzinfo/image/US/20161020/1001013_1.2.156.600734.0003356621.20161020.3183933");
		       // return;
				if(this.imageMode=="3"||this.imageMode=="1"){
					form.action='dicom/image.jsp';
				}else{
					form.action='jsp/_image.jsp';
				}
			}
		}	
		
		form.submit();
	}
	
	//浏览检查，studyPath为路径，如D:\\LocalTestDicom\\头部CT\\
    function reviewStudy(username, vendorCode, studyPath) {
        if (!studyPath)
        {
            alert("studyPath 为空,无法加载");
            return;
        }
        studyPath = studyPath.replace(/(^\s*)|(\s*$)/g, "");//trim掉左右空格(必须，否则会影响Md5 value)
        ///生成图像Url
        var hostAddr = "demo.link-imaging.com";//window.location.host;
        var dataid = studyPath;
        var expiresDate = new Date()
        expiresDate.setMinutes(expiresDate.getMinutes() + 120);//120分钟后过期
        var expires = Date.parse(expiresDate) / 1000; //Url过期时间
        var signature = hex_md5(vendorCode + expires + dataid);//Url签名,使用MD5加密(UTF8 编码)，请注意保密
        var code = "0";  
        //if (base64Code) {//base64 编码，避免路径url可读
            dataid = base64.encode(studyPath);
            code = "b";
        //}
        var linkviewurl = "http://" + hostAddr + "/LinkViewer/Index"
        var param = "?dataid=" + dataid + "&ds=local" + "&username=" + username + "&vendorCode=" + vendorCode + "&code=" + code +
            "&expires=" + expires + "&signature=" + signature;
        linkviewurl = linkviewurl + param;
        var viewer = window.open(linkviewurl, "YLZViewer");//打开连接
    }
    
	function logout(){
		window.location.href = (util.BASEPATH?util.BASEPATH:'')+"logout";
	}
	
	function URLEncode(s) {
		var output = '';
		var x = 0;
		s = s.toString();
		var regex = /(^[a-zA-Z0-9-_.]*)/;
		while (x < s.length) {
			var match = regex.exec(s.substr(x));
			if (match != null && match.length > 1 && match[1] != '') {
				output += match[1];
				x += match[1].length;
			} else {
				if (s.substr(x, 1) == ' ') {
					// 原文在此用 s[x] == ' ' 做判断, 但ie不支持把字符串当作数组来访问,
					// 修改后两种浏览器都可兼容
					output += '+';
				} else {
					var charCode = s.charCodeAt(x);
					var hexVal = charCode.toString(16);
					output += '%' + (hexVal.length < 2 ? '0' : '')
							+ hexVal.toUpperCase();
				}
				x++;
			}
		}
		return output;
	}
	
	function hospitalSelect(o){
		$.ajax({
			url : 'code/hospital',
			type : 'post',
			dataType: 'json',
			success : function(data){
				if($.isArray(data)){
					var defaultValue;
					if(o&&o.required || data.length==1){
						defaultValue=data[0].hospitalCode;
						if(defaultValue)deptSelect({'hospitalCode': defaultValue});
					}
					else {
						data.unshift({hospitalName:"全部", hospitalCode:""});
						defaultValue="";												
					}
					
					$('#hospital').combobox({
						data: data,
						editable: false,
						valueField:'hospitalCode',   
						textField:'hospitalName',
						value:defaultValue,
						onSelect:function(o){
							if(o.hospitalCode)deptSelect({'hospitalCode': o.hospitalCode});
							else deptSelect({'clear': true});
						}
					});					
				}
			}
		});
	}
	
	function deptSelect(o){
		if(o&&o.clear){
			if($('#dept').combo('options').data.length>1)$('#dept').combobox({
				data: [{deptCode:'', deptName:'全部'}],
				editable: true,
				valueField:'deptCode',   
				textField:'deptName'
			});
			doctorSelect({'clear': true});
			return false;
		}
		var url,data;
		if(o&&o.hospitalCode){
			url='dept/hospital';
			data.hospitalCode=o.hospitalCode;
		}else url='dept/all';
			
		$.ajax({
			url : url,
			data: data,
			type : 'post',
			dataType: 'json',
			success : function(data){
				if($.isArray(data)){
					var defaultValue=o.defaultValue;
					var editable=true;
					if(o&&o.required || data.length==1){
						if(data[0].deptCode)defaultValue=data[0].deptCode;
						if(defaultValue)doctorSelect({'deptCode': defaultValue});
						editable=false;
					}
					else {
						data.unshift({deptName:"全部", deptCode:""});
						if(data.length==1){
							editable=false;
						}
						defaultValue="";
					}
					$('#dept').combobox({
						data: data,
						editable: true,
						valueField:'deptCode',   
						textField:'deptName',
						value:defaultValue?defaultValue:o.defaultValue,
						onSelect:function(o){
							if(o.deptCode){
								doctorSelect({'deptCode': o.deptCode});
							}else{
								doctorSelect({});
							}
						},
						onLoadSuccess:function(){
							if(data.length>1){
								doctorSelect(data[0]);
							}
						},
						onHidePanel:function(){
							var v=$(this).combobox('getValue');
							if(undefined==v){
								var data=$(this).combobox('getData');
								$(this).combobox('select',data[0].deptCode);
							}
						},
						filter:function(q, row){
							if(row.inputCode){
								return row.inputCode.indexOf(q,0,true) == 0;
							}else if(row.deptName){
								return row.deptName.indexOf(q) >= 0;
							}
						}
					});
				}
			}
		});
	}
	
	function doctorSelect(o){
		var url="";
		var data={};
		if(o&&o.clear){
			if($('#doctor').combo('options').data.length>1)$('#doctor').combobox({
				data: [{staffNo:'', name:'全部'}],
				editable: false,
				valueField:'staffNo',   
				textField:'name'
			});
			return false;
		}
		
//		if(!o.deptCode)return false;
		if(o&&o.deptCode){//有科室
			url="user/findByDept";
			data={'deptCode': o.deptCode};
		}else{//全部科室
			url="user/findAllByClinic";
		}
		$.ajax({
			url : url,
			data: data,
			type : 'post',
			dataType: 'json',
			success : function(data){
				if($.isArray(data)){
					var defaultValue;
					var editable=true;
					var d=[];
					for(var i=0; i<data.length; i++){
						data[i].value = data[i].name;
						d.push(data[i]);
					}
//					if(o&&o.required){
//						defaultValue=d[0].name;
//					}
//					else {
//						data.unshift({name:"全部", value:""});
//						defaultValue="";												
//					}
					if(data.length==1){
						defaultValue=data[0].name;
						editable=false;
					}else{
						data.unshift({name:"全部", value:""});
						if(data.length==1){
							editable=false;
						}
						defaultValue="";	
					}
					$('#doctor').combobox({
						data: data,
						editable: editable,
						valueField:'value',   
						textField:'name',
						value:defaultValue,
						onHidePanel:function(){
							var v=$(this).combobox('getValue');
							if(undefined==v){
								var data=$(this).combobox('getData');
								$(this).combobox('select',data[0].value);
							}
						},
						filter:function(q, row){
							if(row.inputCode){
								return row.inputCode.indexOf(q,0,true) == 0;
							}else if(row.name){
								return row.name.indexOf(q) >= 0;
							}
						}
					});
				}
			}
		});
	}
	
	function examclassSelect(o){
		$.ajax({
//			url : 'user/hasClass',
			url : 'code/examClass',
			type : 'post',
			dataType: 'json',
			success : function(data){
				if($.isArray(data)){
					var d=[];
					//d.push({examClassName:"全部", examClassCode:""});
					for(var i=0; i<data.length; i++){
						data[i].examClassCode = data[i].examClassName;
						d.push(data[i]);
					}
					var defaultValue;				
					if(o&&o.required){
						defaultValue=d[0].examClassCode;
						if(defaultValue)subclassSelect({'examClassName': defaultValue});
					}
					else {
						d.unshift({examClassName:"全部", examClassCode:""});
						defaultValue="";												
					}				
					$('#examClass').combobox({
						data: d,
						editable: false,
						valueField:'examClassCode',   
						textField:'examClassName',
						value:defaultValue,
						onSelect:function(o){
							if(o.examClassName)subclassSelect({'examClassName': o.examClassName});
						}
					});
				}
			}
		});
	}
	
	function subclassSelect(o){
		if(o&&o.clear){
			if($('#examSubClass').combo('options').data.length>1)$('#examSubClass').combobox({
				data: [{subclassCode:'', subclassName:'全部'}],
				editable: false,
				valueField:'subclassCode',   
				textField:'subclassName'
			});
			return false;
		}
		
		if(!o.examClassName)return false;
		$.ajax({
			url : 'code/subclass',
			data: {'examClassName': o.examClassName},
			type : 'post',
			dataType: 'json',
			success : function(data){
				if($.isArray(data)){
					var defaultValue;
					var d=[];
					for(var i=0; i<data.length; i++){
						data[i].subclassCode = data[i].subclassName;
						d.push(data[i]);
					}
					if(o&&o.required){
						defaultValue=d[0].subclassName;
					}
					else {
						data.unshift({subclassName:"全部", subclassCode:""});
						defaultValue="";												
					}
					$('#examSubClass').combobox({
						data: data,
						editable: false,
						valueField:'subclassCode',   
						textField:'subclassName',
						value:defaultValue
					});
				}
			}
		});
	}
	
	function checkDateString(s){
		if(s.length!=10)return false;
		var reg = /^((((19|20)\d{2})-(0?(1|[3-9])|1[012])-(0?[1-9]|[12]\d|30))|(((19|20)\d{2})-(0?[13578]|1[02])-31)|(((19|20)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))-0?2-29))$/
		if(reg.test(s)){
			return true;
		}
		return false; 
	}
	
	function sizeof(s){  
		var l = 0;  
		for (var i=0; i<s.length; i++) {   
			var c = s.charCodeAt(i); 	 
			if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {   
				l++;   
			}   
			else l+=2;
		}   
		return l;  
	} 
	
	function chart(o){
		var d=new Object;
		d["data"] = o.data;
		d["chart"] = {
			"baseFontSize": "12",//字体大小
			"formatNumberScale": "0"//是否对大数值以k,M方式表示
		};
		var w = o.width-20;
		var h = o.height-(o.multiple?30:10);
		var myChart = new FusionCharts( "chart/Column3D.swf", "myChartId"+Math.floor(Math.random()*100+1), w, h, "0", "1" );
		myChart.setJSONData(d);
		myChart.render(o.id);
	}
	
	function timeSelector(){
		var daterow = $('#upload_condition').find('tr[model="date"]');
		var monthrow = $('#upload_condition').find('tr[model="month"]');
		var yearrow = $('#upload_condition').find('tr[model="year"]');
		
		$('select[name="year"]').each(function(i, e){
            $('#'+e.id).combobox({
				data: yearlist(),
				editable: false,
				valueField:'value',   
				textField:'text'
			});
        });
		$('select[name="month"]').each(function(i, e){
            $('#'+e.id).combobox({
				data: monthlist(),
				editable: false,
				valueField:'value',   
				textField:'text'
			});
        });

		$('#starttime').datebox('setValue', dateformat());
		$('#endtime').datebox('setValue', dateformat());
					
		$('#timeType').combobox({
			data:[{'value':0,'text':'按日统计'},{'value':1,'text':'按月统计'},{'value':2,'text':'按年统计'}],   
			valueField:'value',   
			textField:'text',
			editable: false,
			value: '0',
			panelHeight: 'auto',
			onSelect:function(e){
				switch(e.value){
					case 0:
							daterow.show();
							monthrow.hide();
							yearrow.hide();
							break;
					case 1: 
							daterow.hide();
							monthrow.show();
							yearrow.hide();
							break;
					case 2: 
							daterow.hide();
							monthrow.hide();
							yearrow.show();
							break;
				}
			}
		});
	}
	
	function toExamStatus(v){
		var s='未知';
		switch(v){
			case '00':s='取消检查';break;
			case '10':s='收到申请';break;
			case '20':s='申请确认';break;
			case '30':s='正在检查';break;
			case '40':s='检查完毕';break;
			case '50':s='收到影像';break;
			case '60':s='初步报告';break;
			case '65':s='审核退回';break;
			case '70':s='确认报告';break;
			case '80':s='复审确认';break;
		}
		return s;
	}
	
	 function isNullObject(o){
		for(var attr in o)if(o.hasOwnProperty(attr))return false;
		return true;
	}
	
	function resizeWindow(){
		if(window.screen) {//判断浏览器是否支持window.screen判断浏览器是否支持screen    
			var myw = screen.availWidth;   //定义一个myw，接受到当前全屏的宽    
			var myh = screen.availHeight;  //定义一个myw，接受到当前全屏的高    
			window.moveTo(0, 0);           //把window放在左上脚    
			window.resizeTo(myw, myh);     //把当前窗体的长宽跳转为myw和myh    
		}
	}
	function lengthLimit(str,maxLen){
			var len=0;//存储统计str的字节数
			for(var i=0;i<str.length;i++){
				var c=str.charAt(i);
				//非中文+1，中文+2
				if (c.match(/[^\x00-\xff]/ig) == null) {  
					len++;  
				} 
					else {    
					len+=2;  
				} 
				if(len>maxLen){
					//如果字节数超过了，则截取字符串
					str=str.substr(0,i); 
				}
			}
			return str;
	};
	window.util = {
		BASEPATH:BASEPATH,
		tochar: tochar, 
		dateformat : dateformat, 
		yearlist : yearlist, 
		monthlist : monthlist, 
		getFormObject :getFormObject,
		examclasscombo : examclasscombo,
		hospitalcombo : hospitalcombo,
		examclassSelect : examclassSelect,
		hospitalSelect : hospitalSelect,
		deptSelect : deptSelect,
		getPosition: getPosition,
		openImage:openImage,
		openReport:openReport,
		logout: logout,
		URLEncode: URLEncode,
		checkDateString: checkDateString,
		sizeof: sizeof,
		chart: chart,
		timeSelector: timeSelector,
		toExamStatus: toExamStatus,
		isNullObject: isNullObject,
		resizeWindow: resizeWindow,
		patientSourceCombo:patientSourceCombo,
		lengthLimit:lengthLimit
	};
})();