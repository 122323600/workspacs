/**
*Created by jmupanda on 2016/3/23.
 */
//存储的jq对象开头均为_
(function(){
    if(window.view) return;

    //用于存储三大面板的jq对象
    var board={
        _boardWindow:null,//窗口面板
        _boardButton:null,//按钮面板
        _boardSeries:null//序列面板
    };

    //初始化
    var init=function(){
        //初始化jq对象
        board._boardButton=$(".boardFunction");
        board._boardSeries=$(".boardOrder");
        board._boardWindow=$('.boardImage');
        //按钮视图初始化
        buttonView.init();
        //全窗口尺寸初始化
        initSize();
    };
    //初始化页面的宽高
    var initSize=function(){
        var _body=$("body");
        _body.css({//另主页面宽高与屏幕适应
            "width":$(window).width(),
            "height":$(window).height()
        });
        board._boardWindow.css({//图像面板宽度
            "width":_body.width()-320
        });
        board._boardSeries.children(".order-info").css({//序列信息高度
            "height":board._boardSeries.height()-$(".order-header").get(0).offsetHeight
        });
        buttonView.boardFunctionCollapse();
        //修正单幅窗的各类css
        var _panel=$("#panelCanvasOutside"),
            _cav=_panel.children(".canvas-dicom"),
            _measure=_panel.children(".canvas-measure");
        //宽高控制
        _panel.css({
            width:_body.width()-120,
            height:$(".boardImage").height()
        });
        var width=_panel.width(),
            height=_panel.height(),
            size=(width < height) ? width :height;
        _cav.attr({//对dicom的canvas进行宽高初设,否则在载入图像时会出现比例失调
            "width":size,
            "height":size
        });
        _measure.attr({
            "width":_body.width()-120,
            "height":height
        });
        _panel.find(".panelCanvas-info").css('font-size',size/40);
        _panel.find(".panelCanvas-staff-right").attr({
            "height":_panel.height()*0.5,
            'width':10
        }).css({
            'right':_panel.find(".panelCanvas-right").width()+size/40+5
        });
        _panel.find(".panelCanvas-staff-right").css('right',$(".panelCanvas-right").width()+size/40+5);
        //消息窗口位置
        var _info=$('#outside-info');
        _info[0].style.left=(_panel.width()-180)/2+'px';
    };
    //总窗口视图
    var windowView=(function(){
        //定时器
        var timer;
        //视窗组
        var windows={
            maxCols:0,
            maxRows:0,
            cols:0,
            rows:0
        };
        //窗口构造函数
        function DicomWindow(id){
            this.id=id;
            this.infoDisplay=false;//消息显示标志
            this._window=$('#'+id);//窗口的jq对象
            this._cav=this._window.children(".canvas-dicom");
            //this.ctx=this._cav.get(0).getContext("2d");
            //this.measureCav=new MeasureCav(this._window.find(".canvas-measure"));
            //this.positioningLineCav=new PositionCav(this._window.find(".canvas-positioningLine"));
            //this.lesionsPointCav=new LesionsPointCav(this._window.find(".canvas-lesionsPoint"));
        }

        //该窗口显示提示信息
        DicomWindow.prototype.showMessage=function(data){
            var text=data.message;
            var func=(text !== false) ? "show" :"hide", txt=text
                || "图片正在加载，请稍候...";
            var errorBox=$("#"+this.id+" .errorBox");
            if(func == "show"){
                errorBox.show();
                errorBox.children("p").text(txt);
                var width=errorBox.width(), height=errorBox.height();
                errorBox.css({
                    "margin-left":-width/2,
                    "margin-top":-height/2
                });
            } else {
                errorBox.hide();
                errorBox.children("p").text();
            }
            return true;
        };
        //修正该窗cav的大小,用来适配dicom大小
        DicomWindow.prototype.resetCanvasSize=function(data){
            this._cav.attr({
                "width":data.width,
                "height":data.height
            });
            return true;
        };
        //根据用户的操作进行cav变化
        DicomWindow.prototype.transformCanvas=function(data){
            this._cav.css({
                transform:"translate("+data.posx+"px,"+data.posy+"px) rotate("+data.rotate+"deg) " +
                "scale("+(data.horizontal*data.scale)+","+(data.vertical*data.scale)+")"
            });
            return true;
        };
        //显示该窗的加载信息
        DicomWindow.prototype.showInfo=function(data){
            if(data.show && this.infoDisplay && !systemStatus.get('infoShow')){
                this._window.find(".panelCanvas-info").show();
            } else {
                this._window.find(".panelCanvas-info").hide();
            }
        };
        //根据用户的操作对dicom影像进行显示
        DicomWindow.prototype.drawDicom=function(data){
            canvasMethod.cleanCanvas(this._cav, this.ctx);
            canvasMethod.setCanvas(this.ctx, data.imageData);
        };
        //显示该窗的图片信息
        DicomWindow.prototype.showPatientInfo=function(data){
            var _window=this._window;
            if(data){
                _window.find(".patient-name").text(data.patientName || "");
                _window.find(".patient-sex").text(data.patientSex || "");
                _window.find(".patient-age").text(data.patientAge || "");
                _window.find(".patient-height").text(data.patientSize || "");
                _window.find(".patient-weight").text(data.patientWeight || "");
                _window.find(".patient-checkTime").text(data.studyTime || "");
                _window.find(".patient-checkDate").text(data.studyDate || "");
                _window.find(".modality").text(data.modality || "");
                _window.find(".studyNo").text(data.seriesNumber || "");
                _window.find(".imageNo").text(data.imageNumber ? data.imageNumber+"/"+data.imageCount :"");
                if(!systemStatus.get('infoShow')){
                    _window.find(".panelCanvas-info").show();
                    this.infoDisplay=true;
                }
            } else {
                _window.find(".panelCanvas-info").hide();
                this.infoDisplay=false;
            }
            return true;
        };
        //显示该窗图像的窗宽窗位
        DicomWindow.prototype.showWindowingInfo=function(data){
            var _window=this._window;
            _window.find(".panelCanvas-windowWidth").text(data.w);
            _window.find(".panelCanvas-windowCenter").text(data.c);
            return true;
        };
        //显示该窗图像的方向
        DicomWindow.prototype.showDirection=function(data){
            var _window=this._window;
            if(!data.bottom || data.bottom === ""){
                _window.find(".panelCanvas-direction-bottom").text('');
                _window.find(".panelCanvas-direction-right").text('');
                return false;
            }
            _window.find(".panelCanvas-direction-bottom").text('['+data.bottom+']');
            _window.find(".panelCanvas-direction-right").text('['+data.right+']');
            return true;
        };
        //显示该窗图像的标尺
        DicomWindow.prototype.showStaff=function(data){
            var _window=this._window,
                _cav=_window.find(".panelCanvas-staff-right"),
                ctx=_cav.get(0).getContext('2d');
            var cav_height=_cav.height(),
                cav_width=_cav.width(),
                length=Math.round(data.length*cav_height),//图像总长度
                lattice=cav_height/length/2;//标尺格子数, 总长度窗高度的一半
            var x1=0, x2=cav_width, x3=cav_width*0.5, y=0;
            ctx.clearRect(0, 0, cav_width, cav_height);
            ctx.save();
            ctx.fillStyle='#fff';
            ctx.strokeStyle='#fff';
            ctx.font='normal normal 600 '+(cav_height/25)+'px serif';
            for (var i=0; i <= length*2; i += 1){
                if(i % 2 !== 0){
                    ctx.beginPath();
                    ctx.moveTo(x3, y+lattice*i);
                    ctx.lineTo(x2, y+lattice*i);
                    ctx.lineTo(x2, y+lattice*(i-1));
                } else {
                    ctx.beginPath();
                    ctx.moveTo(x1, y+lattice*i);
                    ctx.lineTo(x2, y+lattice*i);
                    ctx.lineTo(x2, y+lattice*(i-1));
                }
                ctx.stroke();
            }
            if(length == 0 || isNaN(length)){
                _window.find('.panelCanvas-staff-length').hide();
            } else {
                _window.find('.panelCanvas-staff-length').text(length+"cm");
            }
            ctx.restore();
        };
        //窗被选中
        DicomWindow.prototype.selected=function(data){
            $(".panelCanvas").css({
                "border-color":"#666"
            });
            this._window.css({
                "border-color":"#d00"
            });
            return true;
        };
        //窗清除
        DicomWindow.prototype.clean=function(){
            canvasMethod.cleanCanvas(this._cav, this.ctx);
        };

        //各类构造函数,构造各类的绘制上下文,并为其添加部分方法
        //寄生组合式继承
        function object(o){
            function F(){}
            F.prototype=o;
            return new F();
        }
        function inheritPrototype(subType, superType){
            var prototype=object(superType.prototype); //创建对象
            prototype.constructor=subType; //增强对象
            subType.prototype=prototype; //指定对象
        }
        function Cav(_cav){
            this._cav=_cav;
            this.ctx=_cav.get(0).getContext("2d");
            this.strokeStyle='rgba(43,256,238,0.6)';
            this.fillStyle='#2bffee';
            this.lineWidth=2;
            this.font="normal normal 600 14px serif";
        }
        //获取窗内画布的imageDate对象
        Cav.prototype.getImageData=function(){
            return canvasMethod.getImageData(this._cav, this.ctx);
        };
        //用imageDate对象设置窗内画布
        Cav.prototype.set=function(data){
            if(!data.imageData){
                canvasMethod.cleanCanvas(this._cav, this.ctx);
            } else {
                canvasMethod.setCanvas(this.ctx, data.imageData);
                return true;
            }
        };
        //清除画布
        Cav.prototype.clean=function(){
            canvasMethod.cleanCanvas(this._cav, this.ctx);
        };
        function MeasureCav(_cav){
            Cav.call(this , _cav);
        }
        //inheritPrototype(MeasureCav, Cav);
        //测量画布,绘制ct值
        MeasureCav.prototype.CTPoint=function(data){
            this.ctx.save();
            canvasMethod.setStyle.call(this);
            this.ctx.fillText(data.text.modality+":" +
                data.text.number, data.position.x, data.position.y);
            this.ctx.restore();
        };
        //绘制直线
        MeasureCav.prototype.line=function(data){
            this.ctx.save();
            canvasMethod.setStyle.call(this);
            this.ctx.beginPath();
            this.ctx.moveTo(data.point[0].x, data.point[0].y);
            this.ctx.lineTo(data.point[1].x, data.point[1].y);
            this.ctx.fillText(data.length+(data.pixelSpacing == "" ? "pixel" :"mm"), (data.point[0].x+data.point[1].x)/2, (data.point[0].y+data.point[1].y)/2);
            this.ctx.stroke();
            this.point(data.point[0]);
            this.point(data.point[1]);
            this.ctx.restore();
        };
        //绘制矩形
        MeasureCav.prototype.square=function(data){
            this.ctx.save();
            canvasMethod.setStyle.call(this);
            this.ctx.beginPath();
            this.ctx.rect(data.point[0].x, data.point[0].y, data.point[1].x-data.point[0].x, data.point[1].y-data.point[0].y);
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.restore();
            if(data.area){
                var string="面积:"+data.area.area+"mm2  周长:"+data.area.perimeter+"mm",
                    string2="最大值:"+data.area.max+"  最小值:"+data.area.min+"  均值:"+data.area.average;
                var p={
                    x:data.point[0].x < data.point[1].x ? data.point[0].x :data.point[1].x,
                    y:data.point[0].y > data.point[1].y ? data.point[0].y :data.point[1].y
                };
                this.text({x:p.x, y:p.y+14}, string2);
                data.pixelSpacing != "" && this.text({x:p.x, y:p.y+30}, string);
            }
        };
        //绘制椭圆
        MeasureCav.prototype.circle=function(data){
            this.ctx.save();
            canvasMethod.setStyle.call(this);
            this.ctx.save();
            var x=(data.point[0].x+data.point[1].x)/2,
                y=(data.point[0].y+data.point[1].y)/2,
                a=Math.abs(data.point[0].x-data.point[1].x)/2,
                b=Math.abs(data.point[0].y-data.point[1].y)/2;
            this.ctx.translate(x, y);
            //选择a、b中的较大者作为arc方法的半径参数
            var r=(a > b) ? a :b;
            var ratioX=a/r; //横轴缩放比率
            var ratioY=b/r; //纵轴缩放比率
            this.ctx.scale(ratioX, ratioY); //进行缩放（均匀压缩）
            this.ctx.beginPath();
            //从椭圆的左端点开始逆时针绘制
            this.ctx.moveTo(a/ratioX, 0);
            this.ctx.arc(0, 0, r, 0, 2*Math.PI);
            this.ctx.closePath();
            this.ctx.restore();
            this.ctx.stroke();
            this.ctx.restore();
            if(data.area){
                var string="面积:"+data.area.area+"mm2  周长:"+data.area.perimeter+"mm",
                    string2="最大值:"+data.area.max+"  最小值:"+data.area.min+"  均值:"+data.area.average;
                var p={
                    x:data.point[0].x < data.point[1].x ? data.point[0].x :data.point[1].x,
                    y:data.point[0].y > data.point[1].y ? data.point[0].y :data.point[1].y
                };
                this.text({x:p.x, y:p.y+14}, string2);
                data.pixelSpacing != "" && this.text({x:p.x, y:p.y+30}, string);
            }
        };
        //绘制角度
        MeasureCav.prototype.angle=function(data){
            this.ctx.save();
            canvasMethod.setStyle.call(this);
            this.ctx.beginPath();
            this.ctx.moveTo(data.point[0].x, data.point[0].y);
            this.ctx.lineTo(data.point[1].x, data.point[1].y);
            data.point[2] && this.ctx.lineTo(data.point[2].x, data.point[2].y);
            this.ctx.stroke();
            this.point(data.point[0]);
            this.point(data.point[1]);
            data.point[2] && this.point(data.point[2]);
            if(data.angle){
                this.ctx.fillText(data.angle, data.point[1].x+10, data.point[1].y+10);
            }
            this.ctx.restore();
        };
        //绘制点
        MeasureCav.prototype.point=function(point){
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.fillStyle="rgba(250,255,61,0.5)";
            this.ctx.arc(point.x, point.y, 5, 0, 2*Math.PI);
            this.ctx.fill();
            this.ctx.restore();
        };
        //绘制文字
        MeasureCav.prototype.text=function(point, text){
            this.ctx.save();
            this.ctx.fillStyle="#2bffee";
            this.ctx.font="normal normal 600 12px serif";
            this.ctx.fillText(text, point.x, point.y);
            this.ctx.restore();
        };
        //绘制箭头标注
        MeasureCav.prototype.arrowNote=function(data){
            this.ctx.save();
            canvasMethod.setStyle.call(this);
            this.ctx.beginPath();
            this.ctx.moveTo(data.point[0].x, data.point[0].y);
            this.ctx.lineTo(data.point[1].x, data.point[1].y);
            this.ctx.stroke();
            this.ctx.save();
            //画箭头
            this.ctx.translate(data.point[0].x, data.point[0].y);
            //箭头本垂直向下，算出直线偏离Y的角，然后旋转 ,rotate是顺时针旋转的，所以加个负号
            var ang=(data.point[0].x-data.point[1].x)/(data.point[0].y-data.point[1].y);
            ang=Math.atan(ang);
            if(data.point[0].y-data.point[1].y >= 0){
                this.ctx.rotate(-ang);
            } else {
                this.ctx.rotate(Math.PI-ang);//加个180度，反过来
            }
            this.ctx.lineTo(0, 3);
            this.ctx.lineTo(-6, -12);
            this.ctx.lineTo(0, -6);
            this.ctx.lineTo(6, -12);
            this.ctx.lineTo(0, 3);
            this.ctx.fill(); //箭头是个封闭图形
            this.ctx.restore();   //恢复到堆的上一个状态，其实这里没什么用。
            this.ctx.closePath();
            this.ctx.restore();
            this.ctx.restore();
        };
        //绘制文字标注
        MeasureCav.prototype.textNote=function(data){
            this.point(data.point[0]);
            this.text({x:data.point[0].x+8, y:data.point[0].y+4}, data.text);
        };

        //定位线画布
        function PositionCav(_cav){
            Cav.call(this, _cav);
        }
        //inheritPrototype(PositionCav, Cav);
        PositionCav.prototype.draw=function(data){
            //绘制定位线
            var deltaX=data.point2.x-data.point1.x,
                deltaY=data.point2.y-data.point1.y;
            var length=measureTool.countLength(data.point1, data.point2);
            var numDash=Math.floor(length/4);
            this.ctx.save();
            this.ctx.lineWidth=2;
            this.ctx.strokeStyle=data.sign ? "#8c9ed5" :"#fff";
            this.ctx.fillStyle=data.sign ? "#8c9ed5" :"#fff";
            this.ctx.beginPath();
            for (var i=0;i < numDash;i += 1){
                this.ctx[i % 2 === 0 ? 'moveTo' :'lineTo'](data.point1.x+i*deltaX/numDash, data.point1.y+i*deltaY/numDash);
            }
            this.ctx.stroke();
            this.ctx.fillText(data.index, data.point1.x > data.point2.x ? data.point1.x+4 :data.point2.x+4, data.point1.x > data.point2.x ? data.point1.y+4 :data.point2.y+4);
            this.ctx.restore();
        };

        //病灶点画布
        function LesionsPointCav(_cav){
            Cav.call(this, _cav);
        }
        //inheritPrototype(LesionsPointCav, Cav);
        LesionsPointCav.prototype.draw=function(data){
            this.ctx.strokeStyle='#fff';
            this.ctx.lineWidth=2;
            this.ctx.beginPath();
            this.ctx.moveTo(data.point.x, data.point.y);
            this.ctx.lineTo(data.point.x, data.point.y+2);
            var j=0,a=8, b=4;//a,b为样式标尺
            for (;j < 5; j += 1){
                this.ctx.moveTo(data.point.x+10+j*a, data.point.y);
                this.ctx.lineTo(data.point.x+10+j*a+b, data.point.y);
            }
            for (j=0;j < 5; j += 1){
                this.ctx.moveTo(data.point.x-(10+j*a), data.point.y);
                this.ctx.lineTo(data.point.x-(10+j*a+b), data.point.y);
            }
            for (j=0;j < 5; j += 1){
                this.ctx.moveTo(data.point.x, data.point.y+10+j*a);
                this.ctx.lineTo(data.point.x, data.point.y+10+j*a+b);
            }
            for (j=0;j < 5; j += 1){
                this.ctx.moveTo(data.point.x, data.point.y-(10+j*a));
                this.ctx.lineTo(data.point.x, data.point.y-(10+j*a+b));
            }
            this.ctx.stroke();
        };
        //私有方法
        //普遍使用的绘制,数据获取等等
        var canvasMethod={
            setCanvas:function(ctx, imageData){
                /*if(!imageData){
                    return false;
                }
                ctx.putImageData(imageData, 0, 0);*/
                return true;
            },
            getImageData:function(cav, ctx){
                return ctx.getImageData(0, 0, cav.width(), cav.height());
            },
            cleanCanvas:function(_cav, ctx){
                //ctx.clearRect(0, 0, _cav.width(), _cav.height());
            },
            setStyle:function(ctx){
                ctx=ctx || this.ctx;
                ctx.strokeStyle=this.strokeStyle || "rgba(43,256,238,0.6)";
                ctx.fillStyle=this.fillStyle || "#2bffee";
                ctx.lineWidth=this.lineWidth || 2;
                ctx.font=this.font || "normal normal 600 14px serif";
            }
        };

        //新窗体
        function newWindow(i, j){
            var id="panelCanvas_r"+i+"c"+j;
            var dom=[];
            dom.push("<div class='panelCanvas' id="+id+">");//大盒子
            //dom.push("<canvas class='canvas-dicom'></canvas>");//dicom影像绘制画布
			dom.push("<img class='canvas-dicom' style='display:none;'>");//dicom影像绘制画布
            //dom.push("<canvas class='canvas-measure'></canvas>");//测量标注绘制画布
            //dom.push('<canvas class="canvas-positioningLine"></canvas>');//定位线绘制画布
            //dom.push('<canvas class="canvas-lesionsPoint"></canvas>');//病灶点绘制画布
            dom.push("<div class='errorBox'><p class='errorBox-info'></p></div>");//消息信息显示盒子
            dom.push("<div class='panelCanvas-info panelCanvas-windowInfo'>");//窗宽位信息
            dom.push("<p>W:<span class='panelCanvas-windowWidth'></span></p>");
            dom.push("<p>C:<span class='panelCanvas-windowCenter'></span></p></div>");
            dom.push("<div class='panelCanvas-info panelCanvas-patientInfo'>");//病人信息
            dom.push("<p><span class='patient-name'></span></p>");
            dom.push("<p><span class='patient-sex'></span>/<span class='patient-age'></span></p>");
            dom.push("<p><span class='modality'></span></p>");
            dom.push("<p><span class='patient-weight'></span>kg</p></div>");
            dom.push("<div class='panelCanvas-info panelCanvas-date'>");//日期信息
            dom.push("<p><span class='patient-checkDate'></span></p>");
            dom.push("<p><span class='patient-checkTime'></span></p></div>");
            dom.push("<div class='panelCanvas-info panelCanvas-study'>");//序列信息
            dom.push("<p>Srs:<span class='studyNo'></span></p><p>Img:<span class='imageNo'></span></p></div>");
            dom.push('<div class="panelCanvas-info panelCanvas-down"><span class="panelCanvas-direction-bottom"></span></div>');//下方向
            dom.push('<div class="panelCanvas-info panelCanvas-right"><span class="panelCanvas-direction-right"></span></div>');//右方向
            dom.push('<canvas class="panelCanvas-info panelCanvas-staff-right"></canvas>');//标尺
            dom.push('<div class="panelCanvas-info panelCanvas-staff-length"></div>');//标尺数值
            dom.push('</div>');
            $(".panelImage").find("tr:eq("+i+")").children("td:eq("+j+")").append(dom.join(""));
            //实例化窗体
            windows[id]=new DicomWindow(id);
        }

        //放大镜自带功能
        var magnifier=(function(){
            var _magnifier=null;
            var magnifierStyle={//放大镜样式
                width:150,
                height:150,
                shape:"square",
                scale:2
            };
            return {
                create:function(windowId){
                    $('#'+windowId).append("<canvas class='canvas-magnifier' width="+magnifierStyle.width+" height="+magnifierStyle.height+"></canvas>");
                    magnifierStyle._magnifier=$('.canvas-magnifier');
                },
                move:function(x, y){
                    magnifierStyle._magnifier && magnifierStyle._magnifier.css({
                        "top":(y-magnifierStyle.width/2)+"px",
                        "left":(x-magnifierStyle.height/2)+"px"
                    });
                },
                draw:function(data){
                    magnifierStyle._magnifier && magnifierStyle._magnifier.css({
                        transform:"rotate("+data.rotate+"deg) scale("+data.horizontal+","+data.vertical+")"
                    });
                    var ctx=magnifierStyle._magnifier.get(0).getContext("2d");
                    ctx.clearRect(0, 0, magnifierStyle.width, magnifierStyle.height);
                    ctx.drawImage(data.cav, data.posX, data.posY, data.width, data.height, 0, 0, magnifierStyle.width, magnifierStyle.height);
                },
                delete:function(){
                    magnifierStyle._magnifier.remove();
                    delete(magnifierStyle._magnifier);
                },
                getStyle:function(){
                    return magnifierStyle;
                }
            }
        })();

        //接口
        return {
            //初始化窗口
            init:function(rows, cols){
                windows.maxCols=cols;
                windows.maxRows=rows;
                var i, j, dom=[];
                //构造窗口的基本框架
                for (i=0; i < rows; i++){
                    dom.push("<tr>");
                    for (j=0; j < cols; j++){
                        dom.push("<td></td>");
                    }
                    dom.push("</tr>");
                }
                $(".panelImage tbody").empty().append(dom.join(""));
                //为框架添加窗体
                for (i=0; i < rows; i++){
                    for (j=0; j < cols; j++){
                        newWindow(i, j);
                    }
                }
                //实例化特殊窗口窗体
                windows['panelCanvasOutside']=new DicomWindow('panelCanvasOutside');
            },
            //展示窗口
            showWindow:function(rows, cols){
                var _panelImage=$(".panelImage"),
                    i, j, _tr;
                _panelImage.find('tr').hide();
                _panelImage.find('td').hide();
                for (i=0; i < rows; i += 1){
                    _tr=_panelImage.find('tr:eq('+i+')');
                    _tr.show();
                    for (j=0; j < cols; j += 1){
                        _tr.find('td:eq('+j+')').show();
                    }
                }
                windowView.windowSize(rows, cols);
            },
            //修改所有窗口的大小
            windowSize:function(i, j){
                i=i ? i :windows.rows;
                j=j ? j :windows.cols;
                var _panel=$(".panelImage").find(".panelCanvas");
                _panel.css({//窗体宽高
                    height:board._boardWindow.height()/i-4,
                    width:board._boardWindow.width()/j-4
                });
                var width=_panel.width(),
                    height=_panel.height();
                width=(width < height) ? width :height;
                _panel.find(".canvas-dicom").attr({//对dicom的canvas进行宽高初设,否则在载入图像时会出现比例失调
                    "width":width,
                    "height":width
                });
                _panel.find(".canvas-measure").attr({//.canvas-positioningLine,.canvas-lesionsPoint,
                    "width":_panel.width(),
                    "height":_panel.height()
                });
                _panel.find(".panelCanvas-info").css('font-size', width/40);
                var rightWidth=_panel.find(".panelCanvas-right").width(),
                    _staff=_panel.find(".panelCanvas-staff-right");
                _staff.attr({
                    "height":_panel.height()*0.5,
                    'width':10
                }).css({
                    'right':rightWidth+width/40+5
                });
                _staff.css('right', rightWidth+width/40+5);
            },
            //显示\隐藏图像信息
            showAllInfo:function(show){
                for (var a in windows){
                    if(windows.hasOwnProperty(a) && typeof(windows[a]) === 'object'){
                        windows[a].showInfo({show:true});
                    }
                }
                if(show){
                    $(".infoShow img").attr({
                        "src":"images/hide.png",
                        "alt":"隐藏"
                    });
                } else {
                    $(".infoShow img").attr({
                        "src":"images/view.png",
                        "alt":"显示"
                    });
                }
            },
            //隐藏测量
            showMeasure:function(show){
                if(show){
                    $(".canvas-measure,.outside-measure").hide();
                    $(".view img").attr({
                        "src":"images/hide.png",
                        "alt":"隐藏"
                    });
                    $(".view span").text("隐藏");
                } else {
                    $(".canvas-measure,.outside-measure").show();
                    $(".view img").attr({
                        "src":"images/view.png",
                        "alt":"显示"
                    });
                    $(".view span").text("显示");
                }
            },
            //调用窗口对象的普通方法
            getWindowMethod:function(id, method, data){
                if(windows[id]){
                    var dicomWindow=windows[id];
                    if(dicomWindow[method]){
                        return dicomWindow[method](data);
                    }
                }
                return false;
            },
            //获取窗口对象的属性
            getWindowAttr:function(id, attr){
                if(id){
                    if(windows[id]){
                        var dicomWindow=windows[id];
                        return dicomWindow.hasOwnProperty(attr) ? dicomWindow[attr] :null;
                    }
                } else {
                    return windows.hasOwnProperty(attr) ? windows[attr] :null;
                }
                return null;
            },
            //调用窗口对象绘制方法
            getWindowCavMethod:function(id, cavType, method, data){
                var cav;
                if(cavType){
                    var _window=windows[id];
                    if(_window){
                        var a=cavType+'Cav';
                        cav=_window[a];
                        if(cav[method]){
                            return cav[method](data);
                        }
                    }
                }
                return false;
            },
            //清除所有的绘制画布
            cleanAllCav:function(cavType){
                $.each(windows, function(){
                    if(this instanceof DicomWindow){
                        var type=cavType+'Cav';
                        this[type].clean();
                    }
                })
            },
            //单幅放大
            windowZoom:function(display){
                //界面的一些显示和隐藏
                var panel2=$("#panelCanvasOutside");
                if(display){
                    panel2.show();
                    var info=$("#outside-info");
                    info.hide().fadeIn("slow");
                    if(timer){
                        clearTimeout(timer);
                    }
                    timer=setTimeout(function(){
                        info.fadeOut("slow");
                        timer=null;
                    }, 3000);
                    $(".window").hide();
                    $(".link").hide();
                    $(".boardImage").css({
                        overflow:"visible"
                    });
                } else {
                    panel2.hide();
                    $(".window").show();
                    $(".link").show();
                    $(".boardImage").css({
                        overflow:"hidden"
                    });
                }
            },
            //放大镜
            magnifier:magnifier,
            //改变指针样式
            cursorStyle:function(style){
                $(".panelCanvas,.panelCanvasOutside").css({
                    cursor:style
                });
            }
        }
    })();
    //按钮面板视图
    var buttonView=(function(){
        //以下为私有变量
        var boardFunctionHeight=0;//面板高度
        var buttons={};//按钮对象的集合
        var _extendedBox=null;
        //Button构造函数
        function Button(info){
            this.info=info || {};
            this.activeSign=false;
        }

        //按钮打开
        Button.prototype.on=function(){
            $('.'+this.info.id).addClass('buttonClick');
            this.activeSign=true;
        };
        //按钮关闭
        Button.prototype.off=function(){
            $('.'+this.info.id).removeClass('buttonClick');
            this.activeSign=false;
        };
        //在按钮旁边创建一个弹出框
        Button.prototype.createTheExtendedBox=function(){
            extendedBox.append(this.info.id);
        };
        //用一个按钮样式替换本按钮,仅替换文本与图片
        Button.prototype.replace=function(data){
            var button=document.getElementsByClassName(this.info.id)[0],
                replaceButton=document.getElementsByClassName(data.name)[0];
            if(!replaceButton) return;
            button.childNodes[0].src=replaceButton.childNodes[0].src;
            button.childNodes[1].innerHTML=replaceButton.childNodes[1].innerHTML;
        };
        //以下为私有方法

        //弹出框自带功能
        var extendedBox=(function(){
            //创建固定样式的弹出框按钮
            function normalExtendedBox(array){
                var box=[], w1=0, w2=0;
                for (var i=0, l=array.length; i < l; i += 1){
                    if(array[i].id === 'extendedBox-line'){
                        box.push('<div class="extendedBox-line"></div>');
                        w2 += 1;
                    } else {
                        if(array[i].icon){
                            box.push("<button class='extendedBox-button "+array[i].id+"' name="+array[i].id+">");
                            box.push("<div class='extendedBox-buttonIcon "+array[i].icon+"'></div>");
                            box.push("<span>"+array[i].name+"</span>");
                        } else {
                            box.push("<button class='extendedBox-textButton "+array[i].id+"' name="+array[i].id+">");
                            box.push("<p>"+array[i].name+"</p>");
                        }
                        box.push("</button>");
                        w1 += 1;
                        //    <img src="+array[i].imageSrc+" alt="+array[i].name+"/>
                    }
                }
                _extendedBox.css({
                    height:"62px",
                    width:65*w1+16*w2+5
                });
                return box;
            }
            //对不同的按钮适配不同的弹出框
            var buttonsBox={
                window:function(){
                    var maxCols=windowView.getWindowAttr('', 'maxCols'),
                        maxRows=windowView.getWindowAttr('', 'maxRows'),
                        cols=windowView.getWindowAttr('', 'cols'),
                        rows=windowView.getWindowAttr('', 'rows'),
                        box=[],
                        i, j, l;
                    for (i=1; i <= maxRows; i++){
                        for (j=1; j <= maxCols; j++){
                            if(i <= rows && j <= cols){
                                box.push('<div class="windowNum_div" style="background:#aaa" id="window_r'+i+'c'+j+'"></div>');
                            } else {
                                box.push('<div class="windowNum_div" id="window_r'+i+'c'+j+'"></div>');
                            }
                        }
                    }
                    var buttonArray=[
                        {name:'多序列显示',id:'multipleSeries'},
                        {name:'序列同步',id:'seriesSynchronous'}/*,
                        {name:'定位线',id:'positioningLine'},
                        {name:'病灶定位',id:'lesionsPoint'}*/
                    ];
                    box.push('<table style="float:left;margin-top:5px">');
                    for (i=0, l=buttonArray.length; i < l; i += 1){
                        box.push('<tr><td style="padding:4px 2px;font-size:12px;color:#000;">'+buttonArray[i].name+'</td>');
                        box.push('<td><button name="'+buttonArray[i].id+'Button"'+' id="'+buttonArray[i].id+'Button"');
                        box.push('style="margin-left:7px;font-size:10px;padding:2px;"');
                        if(systemStatus.get(buttonArray[i].id)){
                            box.push('class="btn btn-primary">开启中');
                        } else {
                            box.push('class="btn btn-default">关闭中');
                        }
                        box.push('</button></td></tr>');
                    }
                    box.push('</table>');
                    _extendedBox.css({
                        height:30*maxCols+25*l+5,
                        width:30*maxRows+5
                    });
                    return box;
                },
                windowing:function(){
                    var buttonArray=[
                        {name:"defaults",display:"默认值"},
                        {name:"full",display:"全窗"},
                        {name:"w100c40",display:"头颅"},
                        {name:"w1000c40",display:"骨骼"},
                        {name:"w300c40",display:"鼻咽"},
                        {name:"w400c300",display:"胸部"},
                        {name:"w1500c-700",display:"肺部"},
                        {name:"w400c40",display:"腹部"},
                        {name:"w150c40",display:"肝脾"},
                        {name:"w250c30",display:"肾脏"},
                        {name:"w320c35",display:"胰腺"},
                        {name:"w300c40",display:"四肢"}
                    ];
                    var box=[];
                    for (var i=0; i < buttonArray.length; i++){
                        box.push("<li class='"+buttonArray[i].name+" window-li' name='windowLi' value="+buttonArray[i].name+">"+buttonArray[i].display+"</li>");
                    }
                    box.push("<button class='btn btn-primary' name='windowSetButton' id='windowSetButton'>自定义</button>");
                    var height=((buttonArray.length+1)*30+10)+"px";
                    $("#extendedBox").css({
                        height:height,
                        width:"62px"
                    });
                    return box;
                },
                link:function(){
                    var buttonArray=[
                        {name:'序列联动',id:'orderLink',icon:'orderLinkIcon'},
                        {name:'全联动',id:'allLink',icon:'linkIcon'},
                        {name:'无联动',id:'noneLink',icon:'noneLinkIcon'},
                        {id:'extendedBox-line'},
                        {name:'强制调窗同步',id:'manSyncWindows'}
                    ];
                    return normalExtendedBox(buttonArray);
                },
                scale:function(){
                    var buttonArray=[
                        {name:'原大',id:'original',icon:'originalIcon'},
                    ];
                    return normalExtendedBox(buttonArray);
                },
                turn:function(){
                    var buttonArray=[
                        {name:'倒置翻转',id:'vertical',icon:'verticalIcon'},
                        {name:'镜像翻转',id:'horizon',icon:'turnIcon'},
                        {name:'左转90°',id:'left90',icon:'left90Icon'},
                        {name:'右转90°',id:'right90',icon:'right90Icon'},
                        {name:'还原',id:'recover',icon:'initializeIcon'}
                    ];
                    return normalExtendedBox(buttonArray);
                },
                measure:function(){
                    var buttonArray=[
                        {name:'点测量',id:'ctMeasure',icon:'huIcon'},
                        {name:'长度测量',id:'lineMeasure',icon:'lineIcon'},
                        {name:'角度测量',id:'angleMeasure',icon:'angleIcon'},
                        {name:'矩形测量',id:'squareMeasure',icon:'squareIcon'},
                        {name:'椭圆测量',id:'circleMeasure',icon:'circleIcon'}
                    ];
                    return normalExtendedBox(buttonArray);
                }
            };
            return {
                //显示或隐藏弹出框
                show:function(sign){
                    if(sign){
                        systemStatus.set('isOut', false);
						var w=null;
						$.each(modal.windowModal.windows,function(i,v){
							if(this.display)w=this;
						});
						var id=w.id;
						var r=parseInt(id.substring(id.indexOf("r")+1,id.indexOf("c")))+1;
						var c=parseInt(id.substring(id.indexOf("c")+1))+1;
						this.lightWindowNumDiv(r, c);
                        _extendedBox.show();
                    } else {
                        _extendedBox.hide();
                    }
                },
                //修改弹出框的内容
                append:function(button){
                    var box=buttonsBox[button] ? buttonsBox[button]() :[];
                    if(box.length !== 0){
                        var pos=$('.'+button).get(0).getBoundingClientRect();
                        _extendedBox.css({
                            top:pos.top-2,
                            left:pos.left+pos.width
                        }).empty().append(box.join(""));
                    }
                },
                //弹出框按钮内部的状态改变
                changeWindowButton:function(name){
                    var sign=systemStatus.get(name),
                        _button=$('#'+name+'Button');
                    if(sign){
                        _button.text('关闭中').addClass('btn-default').removeClass('btn-primary');
                    } else {
                        _button.text('开启中').removeClass('btn-default').addClass('btn-primary');
                    }
                },
                //弹出框内部的选择窗数面板事件
                lightWindowNumDiv:function(r, c){
                    $(".windowNum_div").css({"background":"#555"});
                    if(!r){
                        r=windowView.getWindowAttr('', 'rows');
                        c=windowView.getWindowAttr('', 'cols');
                    }
                    for (var i=1; i <= r; i += 1){
                        for (var j=1; j <= c; j += 1){
                            $("#window_r"+i+"c"+j).css({"background":"#aaa"});
                        }
                    }
                },
                //判断按钮是否存在弹出框
                hasExtendedBox:function(button){
                    return buttonsBox[button] ? true :false;
                }
            }
        })();

        //返回按钮区域及其包含的按钮列表
        function boardFunctionPart(){
            return [{
                id:'partShow',
                name:'显示功能',
                buttonCount:12,
                buttons:[
                    {display:true,id:"window",name:"多窗",icon:"windowIcon",triggerSign:0},
					{display:true,id:"link",name:"不联动",icon:"linkIcon",triggerSign:0},
					{display:true,id:"swapPage",name:"点击",icon:"pointerIcon",triggerSign:1},
					{display:true,id:"move",name:"移动",icon:"moveIcon",triggerSign:1},
                    {display:true,id:"windowing",name:"调窗",icon:"windowingIcon",triggerSign:1},
					{display:true,id:"scale",name:"缩放",icon:"scaleIcon",triggerSign:1},
       				{display:true,id:"magnifier",name:"放大镜",icon:"magnifierIcon",triggerSign:1},
					{display:true,id:"turn",name:"翻转",icon:"turnIcon",triggerSign:0},
					{display:true,id:"antiColor",name:"反色",icon:"antiColorIcon",triggerSign:0},
					{display:false,id:"pseudoColor",name:"伪彩",icon:"pseudoColorIcon",triggerSign:0},
					{display:true,id:"infoShow",name:"四角信息",icon:"viewIcon",triggerSign:0},
					{display:true,id:"clean",name:"初始化",icon:"initializeIcon",triggerSign:0}  
                ]
/*            }, {
                id:'partDraw',
                name:'测量功能',
                buttonCount:6,
                buttons:[
                    {display:true,id:"select",name:"选取",icon:"pointerIcon",triggerSign:1},
					{display:true,id:"measure",name:"测量",icon:"measureIcon",triggerSign:1},
					{display:true,id:"arrowNote",name:"箭头标注",icon:"arrowIcon",triggerSign:1},
					{display:true,id:"textNote",name:"文字标识",icon:"textNoteIcon",triggerSign:1},
					{display:true,id:"view",name:"显示",icon:"viewIcon",triggerSign:2},
					{display:true,id:"cleanDraw",name:"清除",icon:"cleanIcon",triggerSign:2}					
                ]*/
            }];
        }

        //添加按钮面板
        function appendBoardFunctionPart(){
            var dom=[], i, j, l,
                functionData=boardFunctionPart();
            for (i=0, l=functionData.length; i < l; i += 1){
                //构造按钮面板字符串
                dom.push("<div class='boardFunction-part "+functionData[i].id+"'>");
                dom.push("<div class='part-title' id='"+functionData[i].id+"-title'>");
                dom.push("<a data-toggle='collapse' data-parent='.boardFunction-main' href='#"+functionData[i].id+"-body'>"+functionData[i].name+"</a>");
                dom.push("<span class='part-title-icon glyphicon glyphicon-chevron-up'></span></div>");
                dom.push("<div class='part-body collapse in' id='"+functionData[i].id+"-body'>");
                for (j=0; j < functionData[i].buttonCount; j += 1){
                    var thisButton=functionData[i].buttons[j];
                    if(thisButton.display){
                        dom.push("<button class='boardFunction-button "+thisButton.id+"' name="+thisButton.id+">");
                        //单独请求式图标
                        //dom.push("<img src="+ this.Button.imgSrc+" alt="+thisButton.name+"/>")
                        //雪碧图式图标
                        dom.push("<div class='boardFunction-buttonIcon "+thisButton.icon+"'></div>");
                        //angleIcon
                        //dom.push("<div class='angleIcon'></div>");
                        dom.push("<span>"+thisButton.name+"</span></button>");
                        buttons[thisButton.id]=new Button(thisButton);
                    }
                }
                dom.push('</div></div>');
            }
            board._boardButton.append(dom.join(""));
        }

        //接口
        return {
            //初始化按钮面板方法
            init:function(){
                appendBoardFunctionPart();
                //计算按钮的总高度
                var height=0, part=$(".boardFunction-part");
                for (var i=0, l=part.length; i < l; i++){
                    height += part[i].scrollHeight;
                }
                boardFunctionHeight=height;
                _extendedBox=$('#extendedBox');
                //默认swapPage开启
                buttons.swapPage.on();
            },
            //按钮活动
            buttonActive:function(name){
                if(!buttons[name]) return false;
                switch (buttons[name].info.triggerSign){
                    case 0://短触发
                        break;
                    case 1://长触发
                        if(!buttons[name].activeSign){
                            for (var a in buttons){
                                if(buttons.hasOwnProperty(a)){
                                    buttons[a].off();
                                }
                            }
                            buttons[name].on();
                        }
                        break;
                }
                if(extendedBox.hasExtendedBox(name)){
                    systemStatus.get('recentlyButton') !== name && buttons[name].createTheExtendedBox();
                    extendedBox.show(true);
                }
            },
            //手风琴自动打开与关闭标志
            boardFunctionCollapse:function(){
                //手风琴效果的初始化
                if(boardFunctionHeight > board._boardButton.height()-50){
                    $(".boardFunction-part").find('.part-body').collapse("hide");
                    systemStatus.set('boardFunctionCollapseSign', true);
                } else {
                    systemStatus.set('boardFunctionCollapseSign', false);
                }
            },
            //弹出框
            extendedBox:extendedBox,
            //调用按钮对象的方法
            getButtonMethod:function(id, method, data){
                if(buttons[id]){
                    var button=buttons[id];
                    if(button[method]){
                        return button[method](data);
                    }
                }
                return false;
            }
        }
    })();
    //序列面板视图
    var seriesView=(function(){
        //私有变量
        var data={
            imageLoaded :0
        };
        //私有方法
        //接口
        return {
            //初始化序列方法
            init:function(){
                data.seriesCount=arguments[0];
                data.imagesCount=arguments[1];
                $("#order-seriesNum").text(arguments[0]);
                $("#order-imageNum").text(arguments[1]);
                $("#order-downloadProgress").children("div").attr({
                    "aria-valuenow":"0",
                    "aria-valuemin":"0",
                    "aria-valuemax":arguments[1]
                });
            },
            //添加序列
            appendSeries:function(data){
                data.filePath=data.filePath !== '' ? data.filePath :'images/seriesImage.png';
				var dom=[];
				dom.push('<div class="order-info-part" id="order-info-part-');
				dom.push(data.no);
				dom.push('"><div class="order-info-imgBox"><img class="order-info-img" id="series-'+data.no+'"');
				dom.push('class="order-info-img" src="'+data.filePath+'" /></div>');
				if(data.type===1){                
					dom.push('<p class="order-info-no">序列:<span>');
					dom.push(data.seriesNumber);
					dom.push('</span></p>');
					dom.push('<p class="order-info-count">图数:<span>')
					dom.push(data.imageCount);
					dom.push('</span></p>');
					dom.push('<p class="order-info-modality">类型:<span>');
					dom.push(data.modality);
					dom.push('</span></p>');
					dom.push('<div class="progress order-info-progress"><div class="progress-bar" role="progressbar" style="width:0"></div></div>');
					dom.push('</div>');                
				}else{					
					dom.push('<p class="order-info-no">图像:<span>');
					dom.push(++data.no);
					dom.push('</span></p>');
/*					dom.push('<p class="order-info-count">图数:<span>')
					dom.push(data.imageCount);
					dom.push('</span></p>');*/
					dom.push('<p class="order-info-modality">类型:<span>');
					dom.push(data.modality);
					dom.push('</span></p>');					
					dom.push('</div>'); 
				}				
				$(".order-info").append(dom.join(""));
            },
            //点亮某个序列
            seriesLight:function(id){
                $('.order-info-part').removeClass('order-info-active');
                $('.order-info-part:eq('+id+')').addClass('order-info-active');
            },
            //加载进度控制
            loadProcess:function(no, percent){
                $('#order-info-part-'+no).find(".progress-bar").css('width', percent*100+'%');
				if(percent==1){
					$('#order-info-part-'+no).find('.progress').slideUp('slow');
				}
                //控制进度条
                if(data.imageLoaded != data.imagesCount){
                    $("#order-downloadProgress").children("div").attr("aria-valuenow", ++data.imageLoaded).css({
                        "width":(data.imageLoaded/data.imagesCount)*100+"%"
                    }).text(data.imageLoaded);
                    if(data.imageLoaded == data.imagesCount){
                        setTimeout(function(){
                            $(".order-header").slideUp("slow");
                            $(".order-info").animate({
                                "height":$(".boardOrder").height()
                            }, "slow");
                        }, 3000)
                    }
                }
            }
        }
    })();
    window.view={
        windowView:windowView,
        buttonView:buttonView,
        seriesView:seriesView,
        initSize:initSize,
        init:init
    }
})();