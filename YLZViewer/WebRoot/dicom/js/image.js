/**
 * Created by jmupanda on 2015/9/9.
 *layoutProject;布局
 * eventProject:事件分配器\触发器
 * windowProject:多窗变动方法
 * canvasProject:dicom图像编辑方法
 * measureProject:测量用方法
 * reportProject:报告用方法
 * loadProject:加载用方法
 */
(function() {
    if (window.image) return;
    function init(studyNo, studySeries) {
        layoutProject.init();//布局的初始化
        windowProject.windowArrayInit();//窗体及窗体数组初始化
        eventProject.init();//点击事件初始化
        RemoteProxy.init("");//ajax加载器初始化
        loadProject.init(studyNo, studySeries);//序列信息初始化
    }
    //////////////////////////////////////////
    //布局初始化
    //////////////////////////////////////////
    var layoutProject = {
        boardFunctionHeight:0,
        init: function () {
            this.initSize();
            this.buttonInit();
        },
        initSize: function () {
            $("body").css({//另主页面宽高与屏幕适应
                "width": $(window).width(),
                "height": $(window).height()
            });
            $(".boardImage").css({//图像面板宽度
                "width": $("body").width() - 320
            });
            $(".order-info").css({//序列信息高度
                "height": $(".boardOrder").height() - $(".order-header").get(0).offsetHeight
            });
        },
        buttonInit: function () {
            this.appendBoardFunctionPart("partShow", "显示功能");
            this.appendBoardFunctionPart("partDraw", "测量功能");
            var height = 0, part = $(".boardFunction-part");
            for (var i = 0, l = part.length; i < l; i++) {
                height += part[i].scrollHeight;
            }
            this.boardFunctionHeight = height;
            this.boardFunctionCollapse(height);
            $(".swapPage").addClass("buttonClick");
        },
        appendBoardFunctionPart: function (id, name) {
            var dom = [];
            dom.push("<div class='boardFunction-part " + id + "'>");
            dom.push("<div class='part-title' id='" + id + "-title'>");
            dom.push("<a data-toggle='collapse' data-parent='.boardFunction-main' href='#" + id + "-body'>" + name + "</a>");
            dom.push("<span class='part-title-icon glyphicon glyphicon-chevron-up'></span></div>");
            dom.push("<div class='part-body collapse in' id='" + id + "-body'></div></div>");
            $(".boardFunction").append(dom.join(""));
            this.appendButton(id);
        },
        appendButton: function (id) {
            var buttonArray = dataList.functionArray();
            var dom = [], name;
            for (var i = 0, l = buttonArray.length; i < l; i++) {
                if (buttonArray[i].father === id && buttonArray[i].display) {
                    name = buttonArray[i].id;
                    dom = [];
                    dom.push("<button class='boardFunction-button " + name + "' name=" + name + ">");
                    dom.push("<img src=" + buttonArray[i].src + " alt=" + buttonArray[i].name + "/><span>" + buttonArray[i].name + "</span></button>");
                    $("#" + id + "-body").append(dom.join(""));
                }
            }
        },
        boardFunctionCollapse: function(height) {
            var a = height ? height : this.boardFunctionHeight;
            //手风琴效果的初始化
            if (a > $(".boardFunction").height() - 50) {
                $(".boardFunction-part").find('.part-body').collapse("hide");
                //$(".boardFunction-part").find('.part-body:eq(0)').collapse("show");
                eventProject.boardFunctionCollapseSign = true;
            } else {
                eventProject.boardFunctionCollapseSign = false;
            }
        },
    };
    //////////////////////////////////////////
    //以下为各类触发器\事件分配器
    //////////////////////////////////////////
    var eventProject = {
        isOut: true,//鼠标是否在下拉菜单的外面
        track: {//用于存储鼠标轨迹等
            num: 0,
            firstTime: 0,
            measure: []
        },
        selectNow: {//被选中
            canvas: "panelCanvas_r0c0",
            button: "move"
        },
        loadTimer:null,//ajax定时器
        seriesSynchronousSign: false,//序列同步标志
        positioningLineSign: false,//定位线开启标志
        boardFunctionCollapseSign: false,//功能面板自动隐藏标志
        lesionsPointSign:false,//病灶定位开启标志
        multipleSeriesSign: false,//多序列显示标志
        //以下为事件
        init: function () {
            this.buttonClickInit();
            this.orderEventInit();
            this.windowEventInit();
            this.imageEvent();
            this.otherEventInit();
        },
        //功能列表的按钮点击事件
        buttonClickInit: function () {
            //显示功能按钮点击事件
            $(".partShow").on("click", ".boardFunction-button", function () {
                var name = $(this).attr("name");//获取按钮的名称
                swapdata.send({
                    mode:'buttonClick',
                    type: 'show',
                    data:{
                        name: name
                    }
                });
                eventProject.fireEventFromPartShow(this, name);//事件分配
                eventProject.createAExtendedBox(this, name);//创建弹出窗
            });
            $(".partDraw").on("click", ".boardFunction-button", function () {
                var name = $(this).attr("name");
                swapdata.send({
                    mode:'buttonClick',
                    type: 'draw',
                    data:{
                        name: name
                    }
                });
                eventProject.fireEventFromPartDraw(this, name);
                eventProject.createAExtendedBox(this, name);
            });
            $(".partOther").on("click", "button", function () {
                var name = $(this).attr("name");
                if (name == "report") {
                    $(".modalReport").fadeIn("fast");
                    $(".reportBody-body").find("textarea").css({
                        "height": ($(".reportBody").height() - 250) / 2
                    });
                }
            });
            //弹出框点击事件
            $("#extendedBox").click(function (e) {
                e.stopPropagation();//阻止事件冒泡
                this.isOut = false;//表示鼠标仍然在弹出框内部
            });
            //弹出框内按钮点击事件
            $("#extendedBox").on("click", "button,li", function () {
                var name = $(this).attr("name");
                swapdata.send({
                    mode:'buttonClick',
                    type: 'extended',
                    data:{
                        name: name
                    },
                });
                eventProject.fireEventFromExtendedBox(this, name);
            });
        },
        //测量模块的事件分配
        fireEventFromPartDraw: function (dom, name) {
            eventProject.selectNow.button = name;
            if (name == "measure") {
                canvasProject.mode = "measure";
                eventProject.fireEventToCanvasProject(dom);
            } else if (name == "view") {
                var a = $(".view span").text();
                if (a == "显示") {
                    $(".canvas-measure,.outside-measure").hide();
                    $(".view img").attr({
                        "src": "images/hide.png",
                        "alt": "隐藏"
                    });
                    $(".view span").text("隐藏");
                } else {
                    $(".canvas-measure,.outside-measure").show();
                    $(".view img").attr({
                        "src": "images/view.png",
                        "alt": "显示"
                    });
                    $(".view span").text("显示");
                }
            } else if (name == "cleanDraw") {
                var truthBeTold = window.confirm("确认清除当前画布的所有测量标注?");
                if (truthBeTold) {
                    swapdata.send({
                        mode:'buttonClick',
                        type:'clean',
                        data:{
                            name: name
                        }
                    });
                    canvasProject.reloadDicomByClick(name);
                }
            } else if (name == "select" || name == "arrowNote" || name == "textNote") {
                eventProject.fireEventToCanvasProject(dom);
            }
        },
        //弹出框内按钮的事件分配
        fireEventFromExtendedBox: function (dom, name) {
            var buttonNow = this.selectNow.button;
            if (buttonNow == "link") {
                if (name == "allLink") {
                    image.canvasProject.link = 2;
                    $(".link img").attr("src", "images/link.png");
                    $(".link span").text("全联动");
                } else if (name == "orderLink") {
                    image.canvasProject.link = 1;
                    $(".link img").attr("src", "images/orderLink.png");
                    $(".link span").text("序列联动");
                } else {
                    image.canvasProject.link = 0;
                    $(".link img").attr("src", "images/noneLink.png");
                    $(".link span").text("无联动");
                }
            } else if (buttonNow == "turn") {
                var state = canvasProject.aCanvas.dicom.state;
                if (name == "recover") {
                    state.horizontal = 1;
                    state.vertical = 1;
                    state.rotate = 0;
                } else {
                    if (name == "right90") {
                        state.rotate += 90;
                        if (state.rotate == 360) {
                            state.rotate = 0;
                        }
                    } else if (name == "left90") {
                        state.rotate -= 90;
                        if (state.rotate < 0) {
                            state.rotate = 270;
                        }
                    } else if (name == "horizon") {
                        state.horizontal = -state.horizontal;
                    } else {
                        state.vertical = -state.vertical;
                    }
                }
                canvasProject.beforeTransform();
            } else if (buttonNow == "measure") {
                measure.mode = name;
                $("button.measure").children('img').attr({
                    src:$(dom).children('img').attr('src'),
                    alt:name,
                });
                $("button.measure").children('span').text($(dom).children('span').text());
            } else if (name == "original") {
                canvasProject.original();
            } else if (name == "windowLi") {
                if (canvasProject.aCanvas.dicom.pixelBytes === 3) {
                    alert('彩图无法进行窗宽高的设置');
                    return;
                }
                var wc = $(dom).attr("value");
                swapdata.send({
                    mode:'otherEvent',
                    type:'windowLi',
                    data:{
                        wc:wc,
                    }
                });
                canvasProject.changeWindowHeightAndCenter(wc);
            } else if (name == "windowSetButton") {
                if (canvasProject.aCanvas.dicom.pixelBytes === 3) {
                    alert('彩图无法进行窗宽高的设置');
                    return;
                }
                var text = prompt("分别输入窗宽,窗位(用空格隔开)", "");
                if (text != null && text != "") {
                    var a = text.match(" ");
                    var b = text.match(/[a-zA-z]/g);
                    if (a && !b) {
                        var w = parseInt(text.slice(0, a.index)),
                            c = parseInt(text.slice(a.index + 1));
                        swapdata.send({
                            mode:'otherEvent',
                            type:'windowSet',
                            data:{
                                w:w,
                                c:c
                            }
                        });
                        canvasProject.changeWindowHeightAndCenter(w, c);
                    } else {
                        alert("格式错误");
                    }
                }
            } else if (name == 'seriesSynchronousButton' ){
                var sign = this.seriesSynchronousSign;
                if (sign) {
                    this.seriesSynchronousSign = false;
                    $('#seriesSynchronousButton').text('关闭中').addClass('btn-default').removeClass('btn-primary');
                } else {
                    this.seriesSynchronousSign = true;
                    $('#seriesSynchronousButton').text('开启中').removeClass('btn-default').addClass('btn-primary');
                }
                return ;
            } else if (name == 'positioningLineButton') {
                if (this.positioningLineSign) {
                    this.positioningLineSign = false;
                    var i = 0, cav = $('.canvas-positioningLine');
                    while (i < cav.length) {
                        cav.get(i).getContext('2d').clearRect(0, 0, cav.get(i).clientWidth, cav.get(i).clientHeight);
                        i += 1;
                    }
                    $('#positioningLineButton').text('关闭中').addClass('btn-default').removeClass('btn-primary');
                } else {
                    canvasProject.findWindowToDrawPL(canvasProject.aCanvas);
                    this.positioningLineSign = true;
                    $('#positioningLineButton').text('开启中').removeClass('btn-default').addClass('btn-primary');
                }
                return ;
            } else if (name == 'lesionsPointButton') {
                if (this.lesionsPointSign) {
                    this.lesionsPointSign = false;
                    var i = 0, cav = $('.canvas-lesionsPoint');
                    while (i < cav.length) {
                        cav.get(i).getContext('2d').clearRect(0, 0, cav.get(i).clientWidth, cav.get(i).clientHeight);
                        i += 1;
                    }
                    $('#lesionsPointButton').text('关闭中').addClass('btn-default').removeClass('btn-primary');
                } else {
                    this.lesionsPointSign = true;
                    $('#lesionsPointButton').text('开启中').removeClass('btn-default').addClass('btn-primary');
                }
                return ;
            } else if (name == 'multipleSeriesButton') {
                if (this.multipleSeriesSign) {
                    this.multipleSeriesSign = false;
                    $('#multipleSeriesButton').text('关闭中').addClass('btn-default').removeClass('btn-primary');
                } else {
                    this.multipleSeriesSign = true;
                    $('#multipleSeriesButton').text('开启中').removeClass('btn-default').addClass('btn-primary');
                }
                return ;
            }
            $("#extendedBox").hide();
        },
        //显示功能的事件分配
        fireEventFromPartShow: function (dom, name) {
            eventProject.selectNow.button = name;//保存这一次点击的按钮的名称
            //利用按钮名称来判断所点击的按钮
            if (name === 'window'||name == "link" || name == "turn") {
                return;
            } else if (name == "antiColor") {
                canvasProject.changeColor(1);
            } else if (name == "pseudoColor") {
                if (canvasProject.aCanvas.dicom.pixelBytes==3) {
                    alert("RGB图像无法进行伪彩处理");
                } else {
                    canvasProject.changeColor(2);
                }
            } else if (name == "clean") {
                var truthBeTold = window.confirm("确认初始化图像?");
                if (truthBeTold) {
                    swapdata.send({
                        mode:'buttonClick',
                        type:'clean',
                        data:{
                            name: name
                        }
                    });
                    canvasProject.reloadDicomByClick(name);
                }
            } else if (name == "infoShow") {
                var a = $(".panelCanvas-info").css("display");
                if (a == "none") {
                    $(".panelCanvas-info").show();
                    $(".infoShow img").attr({
                        "src": "images/view.png",
                    });
                } else {
                    $(".panelCanvas-info").hide();
                    $(".infoShow img").attr({
                        "src": "images/hide.png",
                    });
                }
            } else {
                eventProject.fireEventToCanvasProject(dom);
            }
        },
        //canvasProject所属的方法
        fireEventToCanvasProject: function (dom) {
            canvasProject.mode = $(dom).attr("name");
            $(".boardFunction-button").removeClass("buttonClick");
            $(dom).addClass("buttonClick");
        },
        //盒子位置
        extendedBoxPos: function (dom) {
            var pos = $(dom).get(0).getBoundingClientRect();
            $("#extendedBox").css({
                top: pos.top - 2,
                left: pos.left + pos.width
            }).empty().show();
            eventProject.isOut = false;
        },
        //创建一个弹出框
        createAExtendedBox: function (dom, name) {
            var aArray = dataList.functionArray();
            var box = [], i;
            if (name == "window") {
                var maxCols =  windowProject.window_maxCols,
                    maxRows = windowProject.window_maxRows;
                for (var i = 1;i <= maxRows; i++) {
                    for (var j = 1; j <= maxCols; j++) {
                        if (i <= windowProject.window_rows && j <= windowProject.window_cols) {
                            box.push('<div class="windowNum_div" style="background:#aaa" id="window_r' + i + 'c' + j + '"></div>');
                        } else {
                            box.push('<div class="windowNum_div" id="window_r' + i + 'c' + j + '"></div>');
                        }
                    }
                }
                box.push('<table style="float:left;margin-top:5px">');
                box.push('<tr><td style="padding:2px;font-size:12px;color:#000;">多序列显示</td>');
                box.push('<td><button name="multipleSeriesButton" id="multipleSeriesButton"');
                box.push('style="margin-left:7px;font-size:10px;padding:2px;"');
                if (this.multipleSeriesSign){
                    box.push('class="btn btn-primary">开启中');
                } else {
                    box.push('class="btn btn-default">关闭中');
                }
                box.push('</button></td></tr>');
                box.push('<tr><td style="padding:4px;font-size:12px;color:#000;">序列同步</td>');
                box.push('<td><button name="seriesSynchronousButton" id="seriesSynchronousButton"');
                box.push('style="margin-left:7px;font-size:10px;padding:2px;"');
                if (this.seriesSynchronousSign){
                    box.push('class="btn btn-primary">开启中');
                } else {
                    box.push('class="btn btn-default">关闭中');
                }
                box.push('</button></td></tr>');
                box.push('<tr><td style="padding:4px;font-size:12px;color:#000;">定位线</td>');
                box.push('<td><button name="positioningLineButton" id="positioningLineButton"');
                box.push('style="margin-left:7px;font-size:10px;padding:2px;"');
                if (this.positioningLineSign) {
                    box.push('class="btn btn-primary">开启中');
                } else {
                    box.push('class="btn btn-default">关闭中');
                }
                box.push('</button></td></tr>');
                box.push('<tr><td style = "padding:4px;font-size:12px;color:#000;">病灶定位</td>');
                box.push('<td><button name="lesionsPointButton" id="lesionsPointButton"');
                box.push('style="margin-left:7px;font-size:10px;padding:2px;"');
                if (this.lesionsPointSign) {
                    box.push('class="btn btn-primary">开启中');
                } else {
                    box.push('class="btn btn-default">关闭中');
                }
                box.push('</button></td></tr>');
                box.push('</table>');
                $("#extendedBox").css({
                    height: 30 * maxCols + 105,
                    width: 30 * maxRows + 5
                });
            } else if (name == "windowing") {
                var theArray = dataList.windowPresetArray();
                for (i = 0; i < theArray.length; i++) {
                    box.push("<li class='" + theArray[i].name + " window-li' name='windowLi' value=" + theArray[i].name + ">" + theArray[i].display + "</li>");
                }
                box.push("<button class='btn btn-primary' name='windowSetButton' id='windowSetButton'>自定义</button>");
                var height = ((theArray.length + 1) * 30 + 10) + "px";
                $("#extendedBox").css({
                    height: height,
                    width: "62px"
                });
            } else {
                for (i = 0; i < aArray.length; i++) {
                    if (aArray[i].id == name) {
                        if (!aArray[i].count) return;
                        for (var j = 0; j < aArray[i].count; j++) {
                            box.push("<button class='extendedBox-button " + aArray[i].buttonClass[j] + "' name=" + aArray[i].buttonClass[j] + ">");
                            box.push("<img src=" + aArray[i].imgSrc[j] + " alt=" + aArray[i].buttonName[j] + "/><span>" + aArray[i].buttonName[j] + "</span></button>");
                        }
                        break;
                    }
                }
                $("#extendedBox").css({
                    height: "62px",
                    width: 65 * aArray[i].count + 5
                });
            }
            if(box.length !== 0) {
                this.extendedBoxPos(dom);
                $("#extendedBox").append(box.join(""));
            }
        },
        //鼠标在画布内移动的事件初始化
        imageEvent: function () {
            var mouse = {},//正常鼠标轨迹
                mouse2 = {//双击检测用鼠标轨迹
                    x: 0,
                    y: 0
                },
                track = eventProject.track,
                panel = null,
                that = this,
                time = new Date();//检测双击事件的事件标签
            $(".boardImage").on("mousedown", ".panelCanvas,.panelCanvasOutside", function (e) {
                panel = $(this).attr('id');
                //窗口选中
                if (panel != canvasProject.aCanvas.id) {
                    swapdata.send({
                        mode:'imageEvent',
                        type:'windowSelect',
                        data:{
                            id:panel
                        }
                    });
                    windowProject.windowSelect(panel);
                }
                //双击检测,窗口放大
                if (Date.now() - time > 100 && Date.now() - time < 500) {
                    if(measure.pointInTheArea(mouse2, {x: e.pageX, y: e.pageY}, 5) && !measure.movingSign.found){
                        swapdata.send({
                            mode:'otherEvent',
                            type:'windowZoom',
                            data:{
                                id:panel
                            }
                        });
                        windowProject.windowZoom(panel);
                        time = 0;
                    }
                } else {
                    time = Date.now();
                }
                mouse = {
                    x: e.pageX,
                    y: e.pageY
                };
                mouse2 = {
                    x: e.pageX,
                    y: e.pageY
                };
                track.status = true;//更新鼠标状态,true为鼠标按下中
                if(e.button == 2 ||e.buttons == 2) {
                    canvasProject.windowing("mousedown", mouse);
                    track.rightButton = true;
                } else {
                    eventProject.fireEvent("mousedown", mouse);
                }
            }).on("mousemove", function (e) {
                mouse.x = e.pageX;
                mouse.y = e.pageY;
                if(track.rightButton) {
                    canvasProject.windowing("mousemove", mouse);
                } else {
                    eventProject.fireEvent("mousemove", mouse);
                }
            }).on("mouseup", function (e) {
                if (track.status) {
                    if(e.button == 2 || e.buttons == 2) {
                        canvasProject.windowing("mouseup", mouse);
                        track.rightButton = false;
                    } else {
                        eventProject.fireEvent("mouseup", mouse);
                    }
                    if (measure.pointInTheArea(mouse2, mouse, 5)){
                        canvasProject.mode = "swapPage";
                        $(".boardFunction-button").removeClass("buttonClick");
                        $(".swapPage").addClass("buttonClick");
                    }
                    track.status = false;
                }
            }).on("mouseleave", function (e) {
                if (track.status) {
                    track.status = false;
                    if(e.button == 2||e.buttons == 2) {
                        canvasProject.windowing("mouseup", mouse);
                    } else {
                        eventProject.fireEvent("mouseup", mouse);
                    }
                    if(canvasProject.mode === "magnifier"){
                        $(".canvas-magnifier").remove();
                        swapdata.send({
                            mode:'imageEvent',
                            type:'magnifier',
                            data:{
                                eventName:'mouseup',
                                mouse:mouse,
                            }
                        })
                    }
                }
            });
        },
        //画布内鼠标事件分配
        fireEvent: function (eventName, mouse)  {
            var operate, track = this.track;
            if (!canvasProject.aCanvas.dicom) {
                return;
            }
            if (canvasProject.mode == "select") {
                mouse = measure.windowToCanvas(mouse.x, mouse.y);
                measure.selectEvent(eventName, mouse);
            } else if (canvasProject.mode == "measure") {
                mouse = measure.windowToCanvas(mouse.x, mouse.y);
                if (measure.mode == "angleMeasure") {
                    measure.angleMeasure(eventName, mouse);
                } else if(measure.mode == 'ctMeasure'){
                    measure.ctMeasure(eventName, mouse);
                } else {
                    measure.otherMeasure(eventName, mouse)
                }
            } else if (canvasProject.mode == "arrowNote") {
                mouse = measure.windowToCanvas(mouse.x, mouse.y);
                measure.arrowNote(eventName, mouse);
            } else if (canvasProject.mode == "textNote") {
                mouse = measure.windowToCanvas(mouse.x, mouse.y);
                measure.textNote(eventName, mouse);
            } else if (canvasProject.mode == 'magnifier'){
                mouse = canvasProject.getMouseXYofCanvas(mouse.x, mouse.y);
                if (eventName === 'mousemove') {
                    if (track.status) {
                        swapdata.send({
                            mode:'imageEvent',
                            type: 'magnifier',
                            data:{
                                eventName: eventName,
                                mouse: measure.getDicomOrigin('save', mouse),
                            }
                        });
                        canvasProject.magnifier(eventName, mouse);
                    }
                } else {
                    swapdata.send({
                        mode:'imageEvent',
                        type: 'magnifier',
                        data:{
                            eventName: eventName,
                            mouse: measure.getDicomOrigin('save', mouse),
                        }
                    });
                    canvasProject.magnifier(eventName, mouse);
                }
            } else if(canvasProject.mode == 'swapPage'){
                if (eventName === 'mousemove') {
                    if(track.status){
                        if(mouse.y - track.mousey > 2){
                            loadProject.scrollFunction(1, 'wheelDelta');
                            track.mousey = mouse.y;
                        } else if(mouse.y - track.mousey < -2){
                            loadProject.scrollFunction(-1, 'wheelDelta');
                            track.mousey = mouse.y;
                        }
                    }
                } else if (eventName === 'mousedown') {
                    track.mousey = mouse.y;
                    if(eventProject.lesionsPointSign) {
                        canvasProject.drawLesionsPoint(measure.windowToCanvas(mouse.x, mouse.y), canvasProject.aCanvas.currentIndex, canvasProject.aCanvas.currentSeries);
                    }
                } else {
                    swapdata.send({
                        mode:'none',
                        data:{
                        }
                    });
                }
            } else {
                operate = canvasProject.mode;
                if (eventName == "mousemove") {
                    if (track.status) {
                        canvasProject[operate] && canvasProject[operate](eventName, mouse);
                    }
                } else {
                    canvasProject[operate] && canvasProject[operate](eventName, mouse);
                }
            }
        },
        windowEventInit: function () {
            //多窗选择
            $("#extendedBox").on("mouseover", ".windowNum_div", function () {
                $(".windowNum_div").css({"background": "#555"});
                var id = $(this).attr("id");
                var rc = windowProject.getColAndRowFromID(id);
                for(var i = 1;i <= rc.r;i++){
                    for(var j = 1;j <= rc.c;j++){
                        $("#window_r"+i+"c"+j).css({"background": "#aaa"});
                    }
                }
            }).on("click", ".windowNum_div", function () {
                var id = $(this).attr("id");
                var rc = windowProject.getColAndRowFromID(id);
                swapdata.send({
                    mode:'windowEvent',
                    data:{
                        r:rc.r,
                        c:rc.c
                    }
                });
                image.windowProject.windowChange(rc.c, rc.r);
                $("#extendedBox").hide();
            });
            $("#extendedBox").on("mouseleave",function() {
                $(".windowNum_div").css({"background": "#555"});
                for (var i = 1; i <= windowProject.window_rows; i++) {
                    for (var j = 1; j <= windowProject.window_cols; j++) {
                        $("#window_r"+i+"c"+j).css({"background": "#aaa"});
                    }
                }
            });
            $("#extendedBox").on("click","#windowNum_button",function(){
                var text = prompt("分别输入行,列(用空格隔开)", "");
                if (text != null && text != "") {
                    var a = text.match(" ");
                    var b = text.match(/[a-zA-z]/g);
                    if (a && !b) {
                        var r = parseInt(text.slice(0, a.index)),
                            c = parseInt(text.slice(a.index + 1));
                        swapdata.send({
                            mode:'windowEvent',
                            data:{
                                r:r,
                                c:c
                            }
                        });
                        windowProject.windowChange(c, r);
                    } else {
                        alert("格式错误");
                    }
                }
            });
        },
        orderEventInit: function () {
            //序列点击
            $(".order-info").on("click", ".order-info-part", function () {//hehe
                var id = $(this).find("img").attr("id");
               if (loadProject.singleSeriesSign) {
                    id = parseInt(id.substr(6));
                   swapdata.send({
                       mode:'orderEvent',
                       data:{
                           index: id,
                           series: 0,
                           isShow: true,
                           isInit: false
                       }
                    });
                    if (!eventProject.multipleSeriesSign) {
                        loadProject.synchronousInsideSeries(canvasProject.aCanvas, 2, id);
                    } else {
                        loadProject.loadSingleDicom(id, 0, true);
                    }
                } else {
                    id = parseInt(id.substr(7));
                    swapdata.send({
                        mode:'orderEvent',
                        data:{
                            index: 0,
                            series: id,
                            isShow: true,
                            isInit: false
                        }
                    });
                   if (!eventProject.multipleSeriesSign) {
                       loadProject.synchronousInsideSeries(canvasProject.aCanvas, 2, id);
                   } else {
                       loadProject.loadSingleDicom(0, id, true);
                       if (eventProject.seriesSynchronousSign) {
                           loadProject.synchronousSeriesJudge(canvasProject.aCanvas);
                       }
                       if (eventProject.positioningLineSign) {
                           canvasProject.findWindowToDrawPL(canvasProject.aCanvas);
                       }
                   }
                }
                $('.order-info-part').removeClass('order-info-active');
                $(this).addClass('order-info-active');
            });
        },
        otherEventInit: function () {
            //模拟a标签点击,使其展开面板
            $(".part-title").click(function () {
                if (eventProject.boardFunctionCollapseSign) {
                    $(".part-body").collapse('hide');
                }
                $(this).parent().children(".part-body").collapse('toggle');
            });
            $(".part-body").on("show.bs.collapse", function () {
                $(this).parent().find(".part-title-icon").css({
                    transform: "rotate(0deg)",
                    right: "10px"
                });
            });
            $(".part-body").on("hide.bs.collapse", function () {
                $(this).parent().find(".part-title-icon").css({
                    transform: "rotate(180deg)",
                    right: "13px"
                });
            });
            //面板高度自动化
            //用于使下拉列表点击外围消失
            $("body").click(function () {
                if (eventProject.isOut) {
                    $("#extendedBox").hide();
                }
                if (measure.isOut) {
                    $("#shapeTextRuler").hide();
                }
                measure.isOut = true;
                eventProject.isOut = true;
            });
            $(".quit").click(function () {
                if (confirm("您确定要关闭本页吗？")) {
                } else {
                    return;
                }
            });
            //浏览器的大小发生变化
            $(window).resize(function () {
                windowProject.windowResize();
                layoutProject.boardFunctionCollapse();
            });
            //鼠标滚轮事件
            $(".boardImage").get(0).onmousewheel = function (e) {
                swapdata.send({
                    mode:'otherEvent',
                    type: 'scrollToSwitch',
                    data:{
                        wheel: e.wheelDelta,
                        sign:'wheelDelta'
                    }
                });
                loadProject.scrollFunction(e.wheelDelta, 'wheelDelta');
            };
            $(".panelCanvasOutside").get(0).onmousewheel = function (e) {
                swapdata.send({
                    mode:'otherEvent',
                    type: 'scrollToSwitch',
                    data:{
                        wheel: e.wheelDelta,
                        sign:'wheelDelta'
                    }
                });
                loadProject.scrollFunction(e.wheelDelta, 'wheelDelta');
            };
            if (document.body.addEventListener) {
                $(".boardImage").get(0).addEventListener("DOMMouseScroll", function (e) {
                    swapdata.send({
                        mode:'otherEvent',
                        type: 'scrollToSwitch',
                        data:{
                            wheel: e.detail,
                            sign:'detail'
                        }
                    });
                    loadProject.scrollFunction(e.detail, 'detail')
                }, false);
                $(".panelCanvasOutside").get(0).addEventListener("DOMMouseScroll", function (e) {
                    swapdata.send({
                        mode:'otherEvent',
                        type: 'scrollToSwitch',
                        data:{
                            wheel: e.detail,
                            sign:'detail'
                        }
                    });
                    loadProject.scrollFunction(e.detail, 'detail')
                }, false);
            }
            //键盘事件
            $("body").on("keyup", function (e) {
                if (e.keyCode == 46) {//46为DEL的键盘码
                    if (canvasProject.mode == "select") {
                        var movingSign = measure.movingSign;
                        if (movingSign.no) {
                            var array = canvasProject.aCanvas.dicom.measure.array;
                            for (var i = 0, length = array.length; i < length; i++) {
                                if (movingSign.no == array[i].no) {
                                    array = array.splice(i, 1);
                                    swapdata.send({
                                        mode:'otherEvent',
                                        type:'deleteMeasure',
                                        data:{
                                            array:array
                                        }
                                    });
                                    measure.drawAll();
                                    measure.saveCanvas();
                                    break;
                                }
                            }
                        }
                    }
                } else if (e.keyCode == 27) {//27为ESC的键盘码
                    if (!$(".panelCanvasOutside").is(":hidden")) {
                        var id = $(".panelCanvasOutside").attr("id");
                        swapdata.send({
                            mode:'otherEvent',
                            type:'windowZoom',
                            data:{
                                id: id
                            }
                        });
                        windowProject.windowZoom(id);
                    }
                } else if (e.keyCode == 113) {

                }
            });
            //ajax监听
            $(document).ajaxStop(function(){
                if (typeof(dataList.dicomSeries.series) !== 'undefined') {
                    eventProject.loadTimer = setTimeout( function(){
                        var aCanvas = canvasProject.aCanvas,
                            nowSeriesImages = typeof(dataList.dicomSeries.series[aCanvas.currentSeries].images) === 'undefined' ? []:dataList.dicomSeries.series[aCanvas.currentSeries].images,
                            seriesLoadState = loadProject.seriesLoadState;
                        var num = 0;
                        if (!loadProject.singleSeriesSign && seriesLoadState[aCanvas.currentSeries].LOAD_STATE === 'finish') {
                            for (var i = 0, l = dataList.dicomSeries.series.length; i < l; i += 1) {
                                var aSeries = dataList.dicomSeries.series[i];
                                if (seriesLoadState[i].LOAD_STATE !== 'finish') {
                                    for (var j = 0, m = aSeries.images.length; j < m; j += 1) {
                                        if (!aSeries.images[j].LOAD_STATE) {
                                            loadProject.loadSingleDicom(j, i);
                                            num += 1;
                                            if (num === 5) {
                                                break;
                                            }
                                        }
                                    }
                                    break;
                                }
                            }
                        } else {
                            for (var i = 0,l = nowSeriesImages.length; i < l; i += 1) {
                                if (!nowSeriesImages[i].LOAD_STATE) {
                                    num += 1;
                                    loadProject.loadSingleDicom(i, aCanvas.currentSeries);
                                    if (num === 5) {
                                        break;
                                    }
                                }
                            }
                        }
                    }, 1000);
                }
            });
            $(document).ajaxStart(function(){
                clearTimeout(eventProject.loadTimer);
            });
            $(document).ajaxSend(function(){
            });
            $(document).ajaxComplete(function(){
            });
            $("#order-downloadProgress").click(function() {
                clearTimeout(eventProject.loadTimer);
            });
        },
    };
    //////////////////////////////////////////
    //以下为多窗处理方法
    //////////////////////////////////////////
    var windowProject = {
        zoomingWindow: "",
        time: null,
        window_cols: 1,//现列数
        window_rows: 1,//现行数
        window_maxCols: 4,//最大列数
        window_maxRows: 4,//最大行数
        windowArray: [],//窗体数组
        //窗口及数组初始化
        windowArrayInit: function () {
            var windowArray = this.windowArray;
            var dom = [];
            for (var i = 0; i < this.window_maxRows; i++) {
                windowArray[i] = [];
                for (var j = 0; j < this.window_maxCols; j++) {
                    windowArray[i][j] = {
                        id: null,
                        currentIndex: null,
                        currentSeries: null,
                        cav: null,
                        ctx: null,
                        dicom: {},
                        baseState: {},
                        measure_cav: null,
                        measure_ctx: null
                    };
                }
            }
            /*
             * 放大用单窗数据初始化以及放大用单窗在dom上的创建
             */
            //输出dom
            var id = 'panelCanvas_r' + i + 'c0';
            dom.push("<div class='panelCanvasOutside' id=" + id + ">");
            dom.push("<canvas id='outside-dicom' style='position: absolute'></canvas>");
            dom.push("<canvas id='outside-measure' style='position: absolute'></canvas>");
            dom.push("<p id='outside-info'>双击或按ESC键退出全屏模式</p>");
            dom.push("</div>");
            $(".boardImage").append(dom.join(""));
            this.zoomSize();
            this.appendPatientInfo(id);//四角信息
            var panel = $(".panelCanvasOutside"),
                panel_cav = panel.children("#outside-dicom"),
                panel_measure = panel.children("#outside-measure");
            //数组信息
            windowArray[i] = [];
            windowArray[i][0] = {
                id: id,
                currentIndex: null,
                currentSeries: null,
                cav: panel_cav,
                ctx: panel_cav.get(0).getContext("2d"),
                dicom: {},
                baseState: {},
                measure_cav: panel_measure,
                measure_ctx: panel_measure.get(0).getContext("2d")
            };
            //普通窗口
            dom = [];
            dom.push("<tbody>");
            for (i = 0; i < this.window_rows; i++) {
                dom.push("<tr>");
                for (j = 0; j < this.window_cols; j++) {
                    dom.push("<td></td>");
                }
                dom.push("</tr>");
            }
            dom.push("</tbody>");
            $(".panelImage").append(dom.join(""));
            this.newWindow(0, 0);
            this.windowSize(this.window_rows, this.window_cols);
            canvasProject.aCanvas = windowArray[0][0];
        },
        //创建新窗
        newWindow: function (i, j) {
            var theWindow = this.windowArray[i][j],
                id = "panelCanvas_r" + i + "c" + j;
            //以下进行窗口的添加
            var dom = [];
            dom.push("<div class='panelCanvas' id=" + id + ">");
            dom.push("<canvas class= 'canvas-dicom'></canvas>");
            dom.push("<canvas class= 'canvas-measure'></canvas>");
            dom.push('<canvas class= "canvas-positioningLine"></canvas>');
            dom.push('<canvas class= "canvas-lesionsPoint"></canvas>');
            dom.push("<div class='errorBox'><p class='errorBox-info'></p></div>");
            $(".panelImage").find("tr:eq(" + i + ")").children("td:eq(" + j + ")").append(dom.join(""));
            this.appendPatientInfo(id);
            //为数组赋值
            var plane = $("#" + id);
            theWindow.id = id;
            theWindow.cav = plane.children(".canvas-dicom");
            theWindow.ctx = theWindow.cav.get(0).getContext("2d");
            theWindow.measure_cav = plane.find(".canvas-measure");
            theWindow.measure_ctx = theWindow.measure_cav.get(0).getContext("2d");
            theWindow.positioningLine_cav = plane.find(".canvas-positioningLine");
            theWindow.positioningLine_ctx = theWindow.positioningLine_cav.get(0).getContext('2d');
            theWindow.lesionsPoint_cav = plane.find(".canvas-lesionsPoint");
            theWindow.lesionsPoint_ctx = theWindow.lesionsPoint_cav.get(0).getContext('2d');
            theWindow.currentIndex = null;
            theWindow.currentSeries = null;
        },
        //窗口大小变化
        windowSize: function (i, j) {
            $(".panelCanvas").css({//窗体宽高
                height: $(".boardImage").height() / i - 4,
                width: $(".boardImage").width() / j - 4
            });
            var panel = $(".panelCanvas");
            var width = panel.width(),
                height = panel.height();
            width = (width < height) ? width : height;
            $(".canvas-dicom").attr({//对dicom的canvas进行宽高初设,否则在载入图像时会出现比例失调
                "width": width,
                "height": width
            });
            $(".canvas-positioningLine").attr({
                "width": panel.width(),
                "height": panel.height()
            });
            $(".canvas-lesionsPoint").attr({
                "width": panel.width(),
                "height": panel.height()
            });
            $(".canvas-measure").attr({
                "width": panel.width(),
                "height": panel.height()
            });
            $(".panelCanvas-info").css('font-size',width / 40);
            $(".panelCanvas-staff-right").attr({
                "height": panel.height() * 0.5,
                'width': 10
            }).css({
                'right': $(".panelCanvas-right").width() + width / 40 + 5
            });
            $(".panelCanvas-staff-right").css('right',$(".panelCanvas-right").width() + width / 40 + 5)
        },
        //添加窗口四角信息
        appendPatientInfo: function (panel) {
            var dom = [];
            dom.push("<div class='panelCanvas-info panelCanvas-windowInfo'>");
            dom.push("<p>W:<span class='panelCanvas-windowWidth'></span></p>");
            dom.push("<p>C:<span class='panelCanvas-windowCenter'></span></p></div>");
            dom.push("<div class='panelCanvas-info panelCanvas-patientInfo'>");
            dom.push("<p><span class='patient-name'></span></p>");
            dom.push("<p><span class='patient-sex'></span>/<span class='patient-age'></span></p>");
            dom.push("<p><span class='modality'></span></p>");
            dom.push("<p><span class='patient-weight'></span>kg</p></div>");
            dom.push("<div class='panelCanvas-info panelCanvas-date'>");
            dom.push("<p><span class='patient-checkDate'></span></p>");
            dom.push("<p><span class='patient-checkTime'></span></p></div>");
            dom.push("<div class='panelCanvas-info panelCanvas-study'>");
            dom.push("<p>Srs:<span class='studyNo'></span></p>" +
                "<p>Img:<span class='imageNo'></span></p></div>");
            dom.push('<div class="panelCanvas-info panelCanvas-down">[<span class="panelCanvas-direction-bottom"></span>]</div>');
            dom.push('<div class="panelCanvas-info panelCanvas-right">[<span class="panelCanvas-direction-right"></span>]</div>');
            dom.push('<canvas class="panelCanvas-info panelCanvas-staff-right"></canvas>');
            dom.push('<div class="panelCanvas-info panelCanvas-staff-length"></div>');
            if (panel) {
                $("#" + panel).append(dom.join(""));
            } else {
                $(".panelCanvas").append(dom.join(""));
            }
        },
        //窗数改变则触发此方法
        windowChange: function (cols, rows, sign) {//sign为界面刷新用标志
            if (this.window_cols != cols || this.window_rows != rows || sign) {
                var windowArray = this.windowArray,
                    i, j, k, l, dom = [];
                var dicomSeries = dataList.dicomSeries;
                this.window_cols = cols;
                this.window_rows = rows;
                for (i = 0; i < rows; i++) {
                    dom.push("<tr>");
                    for (j = 0; j < cols; j++) {
                        dom.push("<td></td>");
                    }
                    dom.push("</tr>");
                }
                $(".panelImage tbody").empty().append(dom.join(""));
                for (i = 0; i < rows; i++) {
                    for (j = 0; j < cols; j++) {
                        this.newWindow(i, j);
                    }
                }
                this.windowSize(rows, cols);
                if (loadProject.singleSeriesSign || eventProject.multipleSeriesSign) {
                    var firstIndex = windowArray[0][0].currentIndex;
                    var minIndex = (Math.floor(firstIndex - cols * rows / 2) - 1 < 0) ? 0 : (Math.floor(firstIndex - cols * rows / 2) - 1);
                    l = dataList.dicomSeries.series[0].images.length;
                    for (i = 0; i < rows; i++) {
                        for (j = 0; j < cols; j++) {
                            if (minIndex < l) {
                                loadProject.loadSingleDicom(minIndex, 0, true, true, windowArray[i][j]);
                            }
                            minIndex += 1;
                        }
                    }
                } else {
                    var firstSeries = windowArray[0][0].currentSeries;
                    var minSeries = (Math.floor(firstSeries - cols * rows / 2) - 1 < 0) ? 0 : (Math.floor(firstSeries - cols * rows / 2) - 1);
                    l = dataList.dicomSeries.series.length;
                    for (i = 0; i < rows; i++) {
                        for (j = 0; j < cols; j++) {
                            if (minSeries < l) {
                                loadProject.loadSingleDicom(0, minSeries, true, true, windowArray[i][j]);
                            }
                            minSeries += 1;
                        }
                    }
                }
                this.windowSelect(windowArray[0][0].id);
            }
        },
        //窗口被选中
        windowSelect: function (panel) {
            $(".panelCanvas").css({
                "border-color": "#666"
            });
            $('#' + panel).css({
                "border-color": "#d00"
            });
            //切换画布
            var rc = this.getColAndRowFromID(panel);
            canvasProject.aCanvas = this.windowArray[rc.r][rc.c];
            measure.aCanvas = canvasProject.aCanvas;
            measure.movingSign.no = 0;
            $(".order-info-part").removeClass("order-info-active");
            if (loadProject.singleSeriesSign) {
                $("#order-info-part-"+canvasProject.aCanvas.currentIndex).addClass("order-info-active");
            } else {
                $("#order-info-part-"+canvasProject.aCanvas.currentSeries).addClass("order-info-active");
            }
            if (eventProject.positioningLineSign) {
                canvasProject.findWindowToDrawPL(this.windowArray[rc.r][rc.c]);
            }
        },
        //窗口被放大
        windowZoom: function (panel) {
            var windowArray = this.windowArray,
                dom = [];
            if (panel == "panelCanvas_r" + this.window_maxRows + "c0") {
                $(".panelCanvasOutside").hide();
                $(".window").show();
                $(".link").show();
                $(".boardImage").css({
                    overflow:"hidden"
                });
                var rc = this.getColAndRowFromID(this.zoomingWindow);
                var outsideWindow = windowArray[this.window_maxRows][0];
                var theWindow = windowArray[rc.r][rc.c];
                this.windowSelect(this.zoomingWindow);
                canvasProject.beforeTransform();
                loadProject.loadSingleDicom(outsideWindow.currentIndex, theWindow.currentSeries, true, false, theWindow);
                return;
            }
            if (this.window_cols > 1 || this.window_rows > 1) {
                //对所放大的窗口进行保存
                this.zoomingWindow = panel;
                //界面的一些显示和隐藏
                var panel2 = $(".panelCanvasOutside");
                panel2.show();
                $("#outside-info").hide().css({
                    "left": (panel2.width() - $("#outside-info").width()) / 2
                }).fadeIn("slow");
                if (this.time) {
                    clearTimeout(this.time);
                }
                this.time = setTimeout(function () {
                    $("#outside-info").fadeOut("slow");
                }, 3000);
                $(".window").hide();
                $(".link").hide();
                $(".boardImage").css({
                    overflow:"visible"
                })
                //选中该窗
                var rc = this.getColAndRowFromID(panel);
                var outsideWindow = windowArray[this.window_maxRows][0];
                this.windowSelect(outsideWindow.id);
                //绘制
                this.zoomSize();
                loadProject.loadSingleDicom(windowArray[rc.r][rc.c].currentIndex, windowArray[rc.r][rc.c].currentSeries, true, false, outsideWindow);
            }
        },
        //重置放大用单幅panel的尺寸
        zoomSize:function(){
            var panel = $(".panelCanvasOutside"),
                panel_cav = panel.children("#outside-dicom"),
                panel_measure = panel.children("#outside-measure");
            //宽高控制
            panel.css({
                width: $("body").width() - 120,
                height: $(".boardImage").height()
            });
            var width = panel.width(),
                height = panel.height(),
                size = (width < height) ? width : height;
            panel_cav.attr({//对dicom的canvas进行宽高初设,否则在载入图像时会出现比例失调
                "width": size,
                "height": size
            });
            panel_measure.attr({
                "width": $("body").width() - 120,
                "height": height
            });
            panel.find(".panelCanvas-info").css('font-size',size / 40);
            panel.find(".panelCanvas-staff-right").attr({
                "height": panel.height() * 0.5,
                'width': 10
            }).css({
                'right': panel.find(".panelCanvas-right").width() + size / 40 + 5
            });
            panel.find(".panelCanvas-staff-right").css('right',$(".panelCanvas-right").width() + size / 40 + 5)
        },
        //从panel的ID中获取行列值
        getColAndRowFromID:function(id){
            var r = parseInt(id.substring(id.indexOf("r") + 1, id.indexOf("c")));
            var c = parseInt(id.substring(id.indexOf("c") + 1));
            return {r: r, c: c};
        },
        windowResize:function(){
            layoutProject.initSize();
            var rows = this.window_rows;
            var cols = this.window_cols;
            var windowArray = this.windowArray;
            this.windowSize(rows, cols);
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++) {
                    if (windowArray[i][j].currentSeries !== null) {
                        loadProject.loadSingleDicom(windowArray[i][j].currentIndex, windowArray[i][j].currentSeries, true, false, windowArray[i][j]);
                    }
                }
            }
            if (!$(".panelCanvasOutside").is(':hidden')) {
                this.zoomSize();
                loadProject.loadSingleDicom(windowArray[this.window_maxRows][0].currentIndex, windowArray[this.window_maxRows][0].currentSeries, true, false, windowArray[this.window_maxRows][0]);
            }
        }
    };
    //////////////////////////////////////////
    //以下为canvas相关的处理方法
    //////////////////////////////////////////
    var canvasProject = {
        link: 1,//联动模式,默认为序列联动
        mode: "swapPage",//当前控制模式
        aCanvas: null,//当前选择的数组
        magnifierState: {//放大镜样式
            width: 150,
            height: 150,
            shape: "square",
            scale: 2
        },
        track: eventProject.track,
        /**
         * 重置状态信息
         *
         * @private
         */
        _resetState: function (windowView) {
            var aCanvas = windowView ? windowView : this.aCanvas;
            var dicom = aCanvas.dicom;
            if (!dicom) {
                return;
            }
            var state = dicom.state;
            state.antiColor = false;
            state.pseudoColor = false;
            state.windowWidth = dicom.windowWidth;
            state.windowCenter = dicom.windowCenter;
            if (dicom.pixelBytes === 3) {
                state.contrast = dicom.contrast;
                state.brightness = dicom.brightness;
                state.threshold = dicom.threshold;
            }
            this._resetTransform(windowView);
        },
        _resetTransform: function (windowView) {
            var aCanvas = windowView ? windowView : this.aCanvas;
            var dicom = aCanvas.dicom;
            if (!dicom) {
                return;
            }
            var state = aCanvas.dicom.state;
            state.posX = 0;
            state.posY = 0;
            state.scale = 1;
            state.horizontal = 1;
            state.vertical = 1;
            this._resetCanvasSize(windowView);
            state.rotate = 0;// 旋转角度
        },
        /**
         * 根据Dicom改变画板尺寸
         */
        _resetCanvasSize: function (windowView) {
            var aCanvas = windowView ? windowView : this.aCanvas;
            var dicom = aCanvas.dicom;
            $(aCanvas.cav).attr({
                "width": dicom.columns,
                "height": dicom.rows
            });
        },
        //绘制前图像操作
        beforeDrawDicom: function (windowView) {
            var aCanvas = windowView ? windowView : this.aCanvas;
            if (this.link === 0) {
                this.drawDicom(aCanvas);
            } else {
                var state = aCanvas.dicom.state;
                var images = dataList.dicomSeries.series[aCanvas.currentSeries].images;
                for (var i = 0, l = images.length; i < l; i++) {
                    images[i].state.antiColor = state.antiColor;
                    images[i].state.pseudoColor = state.pseudoColor;
                    images[i].state.windowWidth = state.windowWidth;
                    images[i].state.windowCenter = state.windowCenter;
                    if (aCanvas.dicom.pixelBytes === 3){
                        images[i].state.brightness = state.brightness;
                        images[i].state.contrast = state.contrast;
                        images[i].state.threshold = state.threshold;
                    }
                }
                if ($(".panelCanvasOutside").css('display') == 'none'){
                    var cols = windowProject.window_cols,
                        rows = windowProject.window_rows,
                        windowArray = windowProject.windowArray;
                    for (var i = 0; i < rows; i++) {
                        for (var j = 0; j < cols; j++) {
                            if (windowArray[i][j].currentSeries === aCanvas.currentSeries){
                                this.drawDicom(windowArray[i][j]);
                            }
                        }
                    }
                } else {
                    this.drawDicom(aCanvas);
                }
            }
        },
        //绘制图像
        drawDicom: function (windowView) {
            var aCanvas = windowView ? windowView : this.aCanvas;
            var dicom = aCanvas.dicom,
                state = aCanvas.dicom.state,
                imageData = aCanvas.ctx.createImageData(dicom.columns, dicom.rows);
            var i, p;
            aCanvas.ctx.clearRect(0, 0, $(".panelCanvas").width(), $(".panelCanvas").height());
            switch (dicom.pixelBytes) {
                case 2:
                {
                    var pixelNum = dicom.rows * dicom.columns * dicom.samplesPerPixel;
                    //非线性算法*/
                    var grayBoard = this.LUTBoard(state.windowWidth, state.windowCenter, dicom.minGray, dicom.maxGray);
                    if (state.antiColor) {//反色
                        for (i = 0; i < pixelNum; i++) {
                            p = 255 - grayBoard[dicom.pixelData[i]];
                            imageData.data[i * 4] = p;
                            imageData.data[i * 4 + 1] = p;
                            imageData.data[i * 4 + 2] = p;
                            imageData.data[i * 4 + 3] = 255;
                        }
                    } else if (state.pseudoColor) { //伪彩
                        var rgb = [];
                        for (i = 0; i < pixelNum; i++) {
                            p = grayBoard[dicom.pixelData[i]];
                            rgb = this.pseudoColorChange(p);
                            imageData.data[i * 4] = rgb[0];
                            imageData.data[i * 4 + 1] = rgb[1];
                            imageData.data[i * 4 + 2] = rgb[2];
                            imageData.data[i * 4 + 3] = 255;
                        }
                    } else {
                        for (i = 0; i < pixelNum; i++) {//正常
                            p = grayBoard[dicom.pixelData[i]];
                            imageData.data[i * 4] = p;
                            imageData.data[i * 4 + 1] = p;
                            imageData.data[i * 4 + 2] = p;
                            imageData.data[i * 4 + 3] = 255;
                        }
                    }
                    this.showWindowInfo(aCanvas.id, state.windowWidth, state.windowCenter);
                }
                    break;
                case 3:
                {
                    var brightness = state.brightness,
                        contrast = state.contrast,
                        threshold = state.threshold;
                    pixelNum = dicom.rows * dicom.columns;
                    if (state.antiColor) {//反色
                        for (i = 0; i < pixelNum; i++) {
                            imageData.data[i * 4 + 2] = 255 - this.BAndC(brightness, contrast, dicom.pixelData[i * 3], threshold);
                            imageData.data[i * 4 + 0] = 255 - this.BAndC(brightness, contrast, dicom.pixelData[i * 3 + 1], threshold);
                            imageData.data[i * 4 + 1] = 255 - this.BAndC(brightness, contrast, dicom.pixelData[i * 3 + 2], threshold);
                            imageData.data[i * 4 + 3] = 255;
                        }
                    } else {
                        for (i = 0; i < pixelNum; i++) {//正常
                            imageData.data[i * 4 + 2] = this.BAndC(brightness, contrast, dicom.pixelData[i * 3], threshold);
                            imageData.data[i * 4 + 0] = this.BAndC(brightness, contrast, dicom.pixelData[i * 3 + 1], threshold);
                            imageData.data[i * 4 + 1] = this.BAndC(brightness, contrast, dicom.pixelData[i * 3 + 2], threshold);
                            imageData.data[i * 4 + 3] = 255;
                        }
                    }
                    this.showWindowInfo(aCanvas.id, brightness, contrast);
                }
                    break;
            }
            aCanvas.ctx.putImageData(imageData, 0, 0);
        },
        //展示病人信息
        showPatientInfo: function (windowView) {
            var aCanvas = windowView ? windowView : this.aCanvas;
            var dicom = aCanvas.dicom;
            var selectNow = $("#" + aCanvas.id);
            if ($(".panelCanvas-info").is(":hidden")) {
                selectNow.find(".panelCanvas-info").show();
                $(".infoShow img").attr({
                    "src": "images/view.png",
                });
            }
            selectNow.find(".patient-name").text(dicom.patientName || "");
            selectNow.find(".patient-sex").text(dicom.patientSex || "");
            selectNow.find(".patient-age").text(dicom.patientAge || "");
            selectNow.find(".patient-height").text(dicom.patientSize || "");
            selectNow.find(".patient-weight").text(dicom.patientWeight || "");
            selectNow.find(".patient-checkTime").text(dicom.studyTime || "");
            selectNow.find(".patient-checkDate").text(dicom.studyDate || "");
            selectNow.find(".modality").text(dicom.modality || "");
            selectNow.find(".studyNo").text(dataList.dicomSeries.series[aCanvas.currentSeries].seriesNumber || "");
            selectNow.find(".imageNo").text(dicom.imageNumber? dicom.imageNumber + "/" + dataList.dicomSeries.series[aCanvas.currentSeries].imageCount : "");
        },
        //宽高信息
        showWindowInfo: function (dom, w, c) {
            $("#" + dom).find(".panelCanvas-windowWidth").text(w);
            $("#" + dom).find(".panelCanvas-windowCenter").text(c);
        },
        //方向信息
        showDirection: function (windowView) {
            var aCanvas = windowView ? windowView : this.aCanvas;
            var dicom = aCanvas.dicom;
            var selectNow = $("#" + aCanvas.id);
            if (typeof (dicom.direction) === 'undefined') {
                selectNow.find(".panelCanvas-right").hide();
                selectNow.find(".panelCanvas-down").hide();
                return;
            }
            var bottom = dicom.direction[1],
                right = dicom.direction[0],
                a;
            if (dicom.state.horizontal == -1) {
                right = -right;
            }
            if (dicom.state.vertical == -1){
                bottom = -bottom;
            }
            if (dicom.state.rotate > 0) {
                if (dicom.state.rotate == 90) {
                    a = right;
                    right = -bottom;
                    bottom = a;
                } else if(dicom.state.rotate == 180) {
                    right = -right;
                    bottom = -bottom;
                } else{
                    a = right;
                    right = bottom;
                    bottom = -a;
                }
            }
            if (bottom === 1) {
                bottom = 'L';
            } else if (bottom === -1) {
                bottom = 'R';
            } else if (bottom === 2) {
                bottom = 'P'
            } else if (bottom === -2) {
                bottom = 'A'
            } else if (bottom === 3) {
                bottom = 'H'
            } else {
                bottom = 'F'
            }
            if (right === 1) {
                right = 'L';
            } else if (right === -1) {
                right = 'R';
            } else if (right === 2) {
                right = 'P'
            } else if (right === -2) {
                right = 'A'
            } else if (right === 3) {
                right = 'H'
            } else {
                right = 'F'
            }
            selectNow.find(".panelCanvas-direction-bottom").text(bottom);
            selectNow.find(".panelCanvas-direction-right").text(right);

        },
        //展示长度尺
        showStaff: function(windowView){
            var aCanvas = windowView ? windowView : this.aCanvas;
            var dicom = aCanvas.dicom;
            var selectNow = $("#" + aCanvas.id),
                cav = selectNow.find(".panelCanvas-staff-right"),
                ctx = cav.get(0).getContext('2d');
            var cav_height = cav.height(),
                cav_width = cav.width(),
                length = Math.round(dicom.pixelSpacing[1] / (dicom.state.scale * aCanvas.baseState.scale) / 10 * cav_height),
                lattice = cav_height / length / 2;
            var x1 = 0, x2 = cav_width, x3 = cav_width * 0.5, y =0;
            ctx.clearRect(0, 0, cav_width, cav_height);
            ctx.save();
            ctx.fillStyle = '#fff';
            ctx.strokeStyle = '#fff';
            ctx.font = 'normal normal 600 ' + (cav_height / 25) +'px serif';
            for (var i = 0;i <= length * 2;i += 1) {
                if(i % 2 !== 0){
                    ctx.beginPath();
                    ctx.moveTo(x3, y + lattice * i);
                    ctx.lineTo(x2, y + lattice * i);
                    ctx.lineTo(x2, y + lattice * (i - 1));
                } else {
                    ctx.beginPath();
                    ctx.moveTo(x1, y + lattice * i);
                    ctx.lineTo(x2, y + lattice * i);
                    ctx.lineTo(x2, y + lattice * (i - 1));
                }
                ctx.stroke();
            }
            if (length == 0 || isNaN(length)) {
                selectNow.find('.panelCanvas-staff-length').hide();
            }else {
                selectNow.find('.panelCanvas-staff-length').text(length + "cm");
            }
            ctx.restore();
        },
        //LUT灰度板制作
        LUTBoard: function (windowWidth, windowCenter, minGray, maxGray) {
            var dicom = this.aCanvas.dicom, state = this.aCanvas.dicom.state;
            if (dicom.windowWidth == 0 || dicom.windowCenter == 0) {// dicom原图像中未存储窗宽窗位，此处全窗显示
                var maxCT = this._ct_gray("gray", maxGray);
                var minCT = this._ct_gray("gray", minGray);
                dicom.windowWidth = windowWidth = state.windowWidth = maxCT - minCT;
                dicom.windowCenter = windowCenter = state.windowCenter = Math["round"]((maxCT + minCT) / 2);
            }
            var showMinCT = windowCenter - (windowWidth >> 1), showMaxCT = windowCenter
                + (windowWidth >> 1);
            // ct转换为gray
            if (dicom.rescaleSlope == 0) {
                dicom.rescaleSlope = 1;
            }
            var showMinGray = this._ct_gray("ct", showMinCT);
            var showMaxGray = this._ct_gray("ct", showMaxCT);
            // 生成灰度映射板
            var grayPanel = [], i;
            var step = 255.0 / windowWidth;
            for (i = minGray; i < showMinGray; i++) {
                grayPanel[i] = 0;
            }
            for (i = showMinGray; i <= showMaxGray; i++) {
                grayPanel[i] = (i - showMinGray) * step;// 线性变化
            }
            for (i = showMaxGray + 1; i <= maxGray; i++) {
                grayPanel[i] = 255;
            }
            return grayPanel;
        },
        //CT-灰度转化
        _ct_gray: function (type, value) {
            var dicom = this.aCanvas.dicom;
            if (!dicom) {
                return;
            }
            var slope = dicom.rescaleSlope, intercept = dicom.rescaleIntercept, newVal = value;
            if (slope == 0 && intercept == 0) {
                return value;
            }
            if (type === "ct") {
                newVal = (value - intercept) / slope;
            } else if (type == "gray") {
                newVal = value * slope + intercept;
            }
            return Math["floor"](newVal);
        },
        //////////////////////////////////////////
        //判断事件进行窗宽位改变.
        windowing: function (eventType, mouse) {
            var track = this.track,
                state = this.aCanvas.dicom.state,
                dicom = this.aCanvas.dicom,
                cols = windowProject.window_cols,
                rows = windowProject.window_rows,
                windowArray = windowProject.windowArray,
                i;
            if (eventType == "mousemove") {
                if (eventProject.track.status) {
                    if (dicom.pixelBytes == 2) {
                        var windowChangeX = track.start_width + Math.round(( mouse.x - track.start_x ) * dicom.maxGray / window.innerWidth);
                        var windowChangeY = track.start_center + Math.round(( mouse.y - track.start_y ) * dicom.maxGray / window.innerHeight);
                        this.changeWindowHeightAndCenter(windowChangeX, windowChangeY);
                    } else if (dicom.pixelBytes == 3) {
                        this.changeSL(mouse.x - track.start_x, mouse.y - track.start_y);
                    }
                }
            } else if (eventType == "mousedown") {
                track.start_x = mouse.x;
                track.start_y = mouse.y;
                if (dicom.pixelBytes == 2) {
                    track.start_width = state.windowWidth;
                    track.start_center = state.windowCenter;
                } else if (dicom.pixelBytes == 3) {
                    track.brightness = state.brightness;
                    track.contrast = state.contrast;
                }
            } else {
                swapdata.send({
                    mode:'imageEvent',
                    type:'draw',
                    data:{
                        state: state
                    }
                });
            }
        },
        //RGB图像变化
        changeSL: function (x, y) {
            var dicom = this.aCanvas.dicom, track = this.track,
                state = dicom.state,
                threshold = state.threshold,//总平均灰度
                brightness = track.brightness + x / 5,//亮度
                contrast = track.contrast + y;//对比度
            brightness = Math.round(Math.max(-255, Math.min(255, brightness || 0)));//限制亮度和对比度的大小
            contrast = Math.round(Math.max(-255, Math.min(255, contrast || 0)));
            state.brightness = brightness;
            state.contrast = contrast;
            state.threshold = this.BAndC(brightness, contrast, threshold, threshold);
            this.beforeDrawDicom();
        },
        //进行对比度和亮度的转换
        BAndC: function (brightness, contrast, pixel, threshold) {
            var a;
            //非线性
            if (contrast >= 0) {
                a = pixel + brightness;
                if (pixel > threshold) {
                    a = a + (255 - threshold) * contrast / 255;
                } else {
                    a = a - (threshold * contrast / 255);
                }
                return a;//newRGB=(RGB+Brightness)*(RGB-Threshold)*(1/(1-Contrast/255)-1)
            } else {
                a = pixel + (pixel - threshold) * contrast / 255;
                a = a + brightness;
                return a;//newRGB=(RGB+(RGB-Threshold)*Contrast/255)+Brightness
            }
        },
        //改变窗高窗位
        changeWindowHeightAndCenter: function (w, c) {
            var state = this.aCanvas.dicom.state;
            var dicom = this.aCanvas.dicom;
            if (typeof(c) == "undefined") {//预设窗
                if (w == "defaults") {
                    state.windowWidth = dicom.windowWidth;
                    state.windowCenter = dicom.windowCenter;
                } else if (w == "full") {
                    var maxCT = this._ct_gray("gray", dicom.maxGray);
                    var minCT = this._ct_gray("gray", dicom.minGray);
                    state.windowWidth = maxCT - minCT;
                    state.windowCenter = Math["round"]((maxCT + minCT) / 2);
                } else {
                    var a = w.indexOf("w");
                    var b = w.indexOf("c");
                    state.windowWidth = parseInt(w.substring(a + 1, b));
                    state.windowCenter = parseInt(w.substring(b + 1));
                }
            } else {//鼠标控制窗
                if (w < 0) {
                    w = 0;
                }
                state.windowWidth = w;
                state.windowCenter = c;
            }
            this.beforeDrawDicom();
        },
        //获取鼠标相对于画布的位置
        getMouseXYofCanvas: function (x, y) {
            var offset = $("#" + this.aCanvas.id).offset();
            return {
                x: Math.floor((x - offset.left)),
                y: Math.floor((y - offset.top))
            };
        },
        windowToCanvas: function (x, y) {
            var bbox = $(".panelImage").get(0).getBoundingClientRect();
            return {
                x: x - bbox.left * ($(".panelImage").width() / bbox.width),
                y: y - bbox.top * ($(".panelImage").height() / bbox.height)
            };
        },
        //移动
        move: function (eventType, mouse) {
            var track = this.track,
                state = this.aCanvas.dicom.state;
            if (eventType == "mousemove") {
                state.posX = track.posX + mouse.x - track.start_x;
                state.posY = track.posY + mouse.y - track.start_y;
                this.beforeTransform();
            } else if (eventType == "mousedown") {
                track.start_x = mouse.x;
                track.start_y = mouse.y;
                track.posX = state.posX;
                track.posY = state.posY;
            } else if (eventType == "mouseup") {
                swapdata.send({
                    mode:'imageEvent',
                    type:'transform',
                    data:{
                        state: state
                    }
                });
            }
        },
        //翻转
        rotateByClick: function (type) {
            var state = this.aCanvas.dicom.state;
            if (type == "right90") {
                state.rotate += 90;
                if (state.rotate == 360) {
                    state.rotate = 0;
                }
            } else if (type == "left90") {
                state.rotate -= 90;
                if (state.rotate < 0) {
                    state.rotate = 270;
                }
            } else if (type == "horizon") {
                state.horizontal = -state.horizontal;
            } else {
                state.vertical = -state.vertical;
            }
            this.beforeTransform();
        },
        //缩放
        scale: function (eventType, mouse) {
            var track = this.track;
            var state = this.aCanvas.dicom.state;
            if (eventType == "mousemove") {
                state.scale = track.scale + (mouse.y - track.start_y) * 0.01;
                if (state.scale < 0.1) state.scale = 0.1;
                else if (state.scale > 5) state.scale = 5;//进行最大化和最小化的限制
                this.beforeTransform();
            } else if (eventType == "mousedown") {
                track.start_y = mouse.y;
                track.scale = state.scale;
            } else if (eventType == "mouseup") {
                swapdata.send({
                    mode:'imageEvent',
                    type:'transform',
                    data:{
                        state: state
                    }
                });
            }
        },
        //颜色事件
        changeColor: function (sign) {
            var state = this.aCanvas.dicom.state;
            if (sign == 1) {
                if (state.antiColor == true) {
                    state.antiColor = false;
                } else {
                    state.antiColor = true;
                    state.pseudoColor = false;
                }
            } else {
                if (state.pseudoColor == true) {
                    state.pseudoColor = false;
                } else {
                    state.pseudoColor = true;
                    state.antiColor = false;
                }
            }
            this.beforeDrawDicom();
        },
        //灰度-彩色转换算法
        pseudoColorChange: function (gray) {
            var r, g, b;
            if (gray < 64) {
                r = 0;
                g = 4 * gray;
                b = 255;
            } else if (gray < 128) {
                r = 0;
                g = 255;
                b = (127 - gray) * 4;
            } else if (gray < 192) {
                r = (gray - 128) * 4;
                g = 255;
                b = 0;
            } else {
                r = 255;
                g = (255 - gray) * 4;
                b = 0;
            }
            return [r, g, b];
        },
        magnifier: function (eventType, mouse) {
            var magnifierState = this.magnifierState,
                state = this.aCanvas.dicom.state,
                width = magnifierState.width,
                height = magnifierState.height,
                selectNow = $("#" + this.aCanvas.id);
            if (eventType == "mousedown") {
                selectNow.append("<canvas class='canvas-magnifier' width=" + width + " height=" + height + "></canvas>");
                $(".canvas-magnifier").css({
                    "top": (mouse.y - width / 2) + "px",
                    "left": (mouse.x - height / 2) + "px"
                });
                this.getMagnifierData(mouse);
            } else if (eventType == "mousemove") {
                $(".canvas-magnifier").css({
                    "top": (mouse.y - width / 2) + "px",
                    "left": (mouse.x - height / 2) + "px"
                });
                this.getMagnifierData(mouse);
            } else if (eventType == "mouseup") {
                $(".canvas-magnifier").remove();
            }
        },
        //获取放大镜所需的数据
        getMagnifierData: function (mouse) {
            var magnifierState = this.magnifierState,
                state = this.aCanvas.dicom.state,
                scale = state.scale * this.aCanvas.baseState.scale,
                plane = $("#" + this.aCanvas.id),
                canvas = this.aCanvas.cav,
                context2 = plane.find(".canvas-magnifier").get(0).getContext("2d"),
                offset = plane.offset(),//获取大面板的在视界的坐标
                offset2 = this.aCanvas.cav.offset(),//获取dicom画布在视界的坐标
                x = offset2.left - offset.left,//两者相减,获得dicom画布相对于大面板的坐标;
                y = offset2.top - offset.top,
                width = magnifierState.width / magnifierState.scale / scale,
                height = magnifierState.height / magnifierState.scale / scale,
                pos_x = (mouse.x - x) / scale - width / 2,
                pos_y = (mouse.y - y) / scale - height / 2;//宽高及位置随着画布放缩比例而修改.
            if (state.rotate) {
                if (state.rotate == 90) {
                    pos_x = (mouse.y - y) / scale - height / 2;
                    pos_y = canvas.height() - (mouse.x - x) / scale - width / 2;
                } else if (state.rotate == 270) {
                    pos_x = canvas.width() - (mouse.y - y) / scale - height / 2;
                    pos_y = (mouse.x - x) / scale - width / 2;
                } else if (state.rotate == 180) {
                    pos_x = canvas.width() - (mouse.x - x) / scale - width / 2;
                    pos_y = canvas.height() - (mouse.y - y) / scale - height / 2;
                }
            }
            if (state.horizontal == -1)
                pos_x = canvas.width() - pos_x - height;
            if (state.vertical == -1)
                pos_y = canvas.height() - pos_y - width;
            plane.find(".canvas-magnifier").css({
                transform: "rotate(" + state.rotate + "deg) scale(" + state.horizontal + "," + state.vertical + ")"
            });
            context2.clearRect(0, 0, magnifierState.width, magnifierState.height);
            context2.drawImage(canvas.get(0), pos_x, pos_y, width, height, 0, 0, magnifierState.width, magnifierState.height);
        },
        //原大小
        original: function () {
            this.aCanvas.dicom.state.scale = 1 / this.aCanvas.baseState.scale;
            this.beforeTransform();
        },
        //还原判断
        reloadDicomByClick: function (name) {
            var state = this.aCanvas.dicom.state,
                canvas = this.aCanvas.cav,
                mode = this.mode,
                i = 0, j = 0,
                cols = windowProject.window_cols,
                rows = windowProject.window_rows,
                windowArray = windowProject.windowArray;
            if (name == "clean") {
                this._resetState();
                this.beforeTransform();
                this.beforeDrawDicom();
            } else if (name == "cleanDraw") {
                measure.aCanvas.dicom.measure.array = [];
                measure.aCanvas.measure_ctx.clearRect(0, 0, $(".canvas-measure").width(), $(".canvas-measure").height());
                $(".panelCanvas-shape").empty();
                measure.saveCanvas();
            }
        },
        //变化前处理
        beforeTransform: function (windowView) {
            var aCanvas = windowView ? windowView : this.aCanvas;
            var thatState = aCanvas.dicom.state,
                link = this.link;
            if (link === 0 || !$(".panelCanvasOutside").is(":hidden")) {//无联动
                this.transformCanvas(aCanvas);
            } else {
                var cols = windowProject.window_cols,
                    rows = windowProject.window_rows,
                    windowArray = windowProject.windowArray;
                if (link === 1) {//序列联动时
                    var images = dataList.dicomSeries.series[aCanvas.currentSeries].images;
                    //对该序列的状态进行改动
                    //对状态进行完全继承。因为同一序列下，状态互通。
                    for (var i = 0, l = images.length; i < l; i++) {
                        images[i].state = $.extend(true, {}, thatState);
                    }
                    for (var i = 0; i < rows; i++) {
                        for (var j = 0; j < cols; j++) {
                            if (windowArray[i][j].currentSeries === aCanvas.currentSeries){
                                this.transformCanvas(windowArray[i][j]);
                            }
                        }
                    }
                } else if (link === 2) {//全部联动时
                    var series = dataList.dicomSeries.series;
                    var thatBaseState = this.aCanvas.baseState;
                    for (var i = 0, l = series.length; i < l; i++) {
                        var aSeries = series[i];
                        var state = series[i].images[0].state;
                        state.antiColor = thatState.antiColor;
                        state.pseudoColor = thatState.pseudoColor;
                        state.posX = thatState.posX;
                        state.posY = thatState.posY;
                        state.scale = thatState.scale;
                        state.horizontal = thatState.horizontal;
                        state.vertical = thatState.vertical;
                        state.rotate = thatState.rotate;// 旋转角度
                        for (var j = 0, m = aSeries.images.length; j < m; j++) {
                            aSeries.images[j].state = $.extend(true, {}, state);
                        }
                    }
                    for (var i = 0; i < rows; i++) {
                        for (var j = 0; j < cols; j++) {
                            if (windowArray[i][j].currentSeries !== null){
                                this.transformCanvas(windowArray[i][j]);
                            }
                        }
                    }
                }
            }
        },
        //变化矩阵刷新Canvas
        transformCanvas: function (windowView) {
            var aCanvas = windowView ? windowView : this.aCanvas;
            var state = aCanvas.dicom.state;
            var posx = state.posX + aCanvas.baseState.posX,
                posy = state.posY + aCanvas.baseState.posY,
                scale = state.scale * aCanvas.baseState.scale;
            $(aCanvas.cav).css({
                transform: "translate(" + posx + "px," + posy + "px) rotate(" + state.rotate + "deg) " +
                "scale(" + (state.horizontal * scale) + "," + (state.vertical * scale) + ")"
            });
            this.showDirection(aCanvas);
            this.showStaff(aCanvas);
            measure.drawAll("", aCanvas);
            measure.saveCanvas("", aCanvas);
        },
        //全窗联动变换刷新
        transformCanvasAll: function () {
            var cols = windowProject.window_cols,
                rows = windowProject.window_rows,
                windowArray = windowProject.windowArray,
                thatState = this.aCanvas.dicom.state,
                thatBaseState = this.aCanvas.baseState;
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++) {
                    var aCanvas = windowArray[i][j];
                    var state = aCanvas.dicom.state;
                    if (typeof (state.antiColor) == "boolean") {
                        state.antiColor = thatState.antiColor;
                        state.pseudoColor = thatState.pseudoColor;
                        state.posX = thatState.posX;
                        state.posY = thatState.posY;
                        state.scale = thatState.scale/* + thatBaseState.scale - aCanvas.baseState.scale*/;
                        state.horizontal = thatState.horizontal;
                        state.vertical = thatState.vertical;
                        state.rotate = thatState.rotate;// 旋转角度
                        var posx = state.posX + aCanvas.baseState.posX,
                            posy = state.posY + aCanvas.baseState.posY,
                            scale = state.scale * aCanvas.baseState.scale;
                        window.measure.drawAll(null, aCanvas);
                        window.measure.saveCanvas(aCanvas);
                        var images = dataList.dicomSeries.series[aCanvas.currentSeries].images;
                        for (var k = 0, l = images.length; k < l; k++) {
                            images[k].state = $.extend(true, {}, state);
                        }
                    }
                }
            }
        },
        //寻找定位线的两点
        findCrossPoint: function(dicom1, dicom2){//dicom1定位图,dicom2切片图
            if(typeof(dicom1.imagePositionPatient) === 'undefined' || !dicom1.imagePositionPatient){
                return false;//判断定位信息是否存在
            }
            //首先获取定位图的相关信息
            var vector_o1 = dicom1.imagePositionPatient;//获取定位图左上点
            var rc = dicom1.imageOrientationPatient,
                vector_r1 = rc.vector1, vector_c1 = rc.vector2;//获取定位图方向向量
            var normalVector = dicom1.normalVector,
                pixelSpacing_1 = dicom1.pixelSpacing;
            //获取切片图的相关信息
            var vector_o2 = dicom2.imagePositionPatient;
            var rc = dicom2.imageOrientationPatient,
                vector_r2 = rc.vector1, vector_c2 = rc.vector2;
            var pixelSpacing_2 = dicom2.pixelSpacing,
                srcHeight = dicom2.rows,
                srcWidth = dicom2.columns;
            //计算切片图四点坐标
            var pointArray= [];
            pointArray[0] = vector_o2;
            pointArray[1] = {
                x: pointArray[0].x + vector_r2.x * pixelSpacing_2[1] * srcHeight,
                y: pointArray[0].y + vector_r2.y * pixelSpacing_2[1] * srcHeight,
                z: pointArray[0].z + vector_r2.z * pixelSpacing_2[1] * srcHeight
            };
            pointArray[2] = {
                x: pointArray[1].x + vector_c2.x * pixelSpacing_2[0] * srcWidth,
                y: pointArray[1].y + vector_c2.y * pixelSpacing_2[0] * srcWidth,
                z: pointArray[1].z + vector_c2.z * pixelSpacing_2[0] * srcWidth
            };
            pointArray[3] = {
                x: pointArray[0].x + vector_c2.x * pixelSpacing_2[0] * srcWidth,
                y: pointArray[0].y + vector_c2.y * pixelSpacing_2[0] * srcWidth,
                z: pointArray[0].z + vector_c2.z * pixelSpacing_2[0] * srcWidth
            };
            //计算矢量位移
            var dvArray = [];
            for (var i = 0; i < 4; i += 1) {
                dvArray[i] = (pointArray[i].x - vector_o1.x) * normalVector.x + (pointArray[i].y - vector_o1.y) * normalVector.y + (pointArray[i].z - vector_o1.z) * normalVector.z;
            }
            //计算交点
            var crossPoint = {}, crossPointArray = [];
            for (var i = 0; i < 4; i += 1) {
                if (i == 3) {
                    crossPoint = toolProject.isCross(3, 0, dvArray, pointArray);
                } else {
                    crossPoint = toolProject.isCross(i, i+1, dvArray, pointArray);
                }
                if (crossPoint) {
                    crossPointArray.push(crossPoint);
                }
            }
            if (crossPointArray.length < 2) {
                return false;
            }
            //将crossPoint转换为二维坐标
            var vector_a1 = toolProject.vectorMinus(crossPointArray[0], vector_o1),
                vector_a2 = toolProject.vectorMinus(crossPointArray[1], vector_o1);
            var angle1 = Math.acos(toolProject.getVectorCos(vector_r1, vector_a1)),
                angle2 = Math.acos(toolProject.getVectorCos(vector_r1, vector_a2));
            angle1 = toolProject.dotProduct(toolProject.crossProduct(vector_r1, vector_a1), dicom1.normalVector) > 0 ? -angle1 : angle1;//判断角的正负
            angle2 = toolProject.dotProduct(toolProject.crossProduct(vector_r1, vector_a2), dicom1.normalVector) > 0 ? -angle2 : angle2;//判断角的正负
            var length1 = toolProject.getLength(crossPointArray[0], vector_o1),
                length2 = toolProject.getLength(crossPointArray[1], vector_o1);
            var point1 = {
                    x: (Math.round(length1 * Math.cos(angle1)) - dicom1.columns / 2 * pixelSpacing_1[0]) / pixelSpacing_1[0] ,
                    y: (-Math.round(length1 * Math.sin(angle1)) - dicom1.rows / 2 * pixelSpacing_1[1]) / pixelSpacing_1[1]
                },
                point2 = {
                    x: (Math.round(length2 * Math.cos(angle2)) - dicom1.columns / 2 * pixelSpacing_1[0]) / pixelSpacing_1[0],
                    y: (-Math.round(length2 * Math.sin(angle2)) - dicom1.rows / 2 * pixelSpacing_1[1]) / pixelSpacing_1[1]
                };
            return {
                point1:point1,
                point2:point2
            }
        },
        //寻找适合绘制定位线的窗口
        findWindowToDrawPL: function(aCanvas) {
            var window_rows = windowProject.window_rows,
                window_cols = windowProject.window_cols,
                windowArray = windowProject.windowArray;
            if (window_rows === 1 && window_cols === 1 || typeof(aCanvas.dicom.imagePositionPatient) == 'undefined' || aCanvas.dicom.imagePositionPatient == null) {
            //如果仅是单窗状态或者切片图没有定位信息或者图片为定位图,则不需要绘制
                return;
            }
            for (var i = 0; i < window_rows; i += 1) {
                for (var j = 0; j < window_cols; j += 1) {
                    var aDicom = windowArray[i][j].dicom;
                    var crossPoint = aCanvas.id === windowArray[i][j].id || toolProject.isSynchronous(aDicom, aCanvas.dicom) ? false : this.findCrossPoint(aDicom, aCanvas.dicom);
                    //当窗口不等于操作窗口,并且操作窗口的dicom不与其他窗的dicom平行(或接近平行)
                    if (crossPoint) {
                        this.drawPositioningLine(crossPoint.point1, crossPoint.point2, windowArray[i][j], aCanvas);
                    } else {
                        var ctx = windowArray[i][j].positioningLine_ctx;
                        ctx.clearRect(0, 0, windowArray[i][j].positioningLine_cav.width(), windowArray[i][j].positioningLine_cav.height());
                    }
                }
            }
        },
        //绘制定位线
        drawPositioningLine: function(point1, point2, aCanvas, baseWindow) {
            var ctx = aCanvas.positioningLine_ctx;
            ctx.clearRect(0, 0, aCanvas.positioningLine_cav.width(), aCanvas.positioningLine_cav.height());
            var series =  dataList.dicomSeries.series[baseWindow.currentSeries],
                firstDicom = series.images[0],
                lastDicom = series.images[series.images.length - 1];
            var crossPoint = toolProject.isSynchronous(aCanvas.dicom, firstDicom) ? false : this.findCrossPoint(aCanvas.dicom, firstDicom);
            var modality = dataList.dicomSeries.modality;
            if (crossPoint && modality !== 'MR') {
                this.drawALine(crossPoint.point1, crossPoint.point2, aCanvas, 1);
            }
            crossPoint = lastDicom.LOAD_STATE === 'finish' && !toolProject.isSynchronous(aCanvas.dicom, lastDicom) ? this.findCrossPoint(aCanvas.dicom, lastDicom) : false;
            if (crossPoint && modality !== 'MR') {
                this.drawALine(crossPoint.point1, crossPoint.point2, aCanvas, series.images.length);
            }
            this.drawALine(point1, point2, aCanvas, baseWindow.currentIndex + 1, true);
        },
        //绘制一条定位线
        drawALine: function (point1, point2, aCanvas, index, sign) {
            //二维坐标转换
            point1 = toolProject.pointToChange(point1, aCanvas, 'draw');
            point2 = toolProject.pointToChange(point2, aCanvas, 'draw');
            //绘制定位线
            var deltaX = point2.x - point1.x,
                deltaY = point2.y - point1.y;
            var length = toolProject.getLength(point1, point2);
            var numDash = Math.floor(length / 4);
            var ctx = aCanvas.positioningLine_ctx;
            ctx.save();
            ctx.lineWidth = 2;
            ctx.strokeStyle = sign ? "#8c9ed5" : "#fff";
            ctx.fillStyle = sign ? "#8c9ed5" : "#fff";
            ctx.beginPath();
            for (var i = 0;i < numDash;i += 1) {
                ctx[i % 2 === 0 ? 'moveTo' : 'lineTo'](point1.x + i * deltaX / numDash, point1.y + i * deltaY / numDash);
            }
            ctx.stroke();
            ctx.fillText(index, point1.x > point2.x ? point1.x + 4 : point2.x + 4, point1.x > point2.x ? point1.y + 4 : point2.y + 4);
            ctx.restore();
        },
        //绘制病灶点
        drawLesionsPoint:function(point, index, series) {
            point = toolProject.pointToChange(point, canvasProject.aCanvas, 'count');
            var i = 0, cav = $('.canvas-lesionsPoint');
            while (i < cav.length) {
                cav.get(i).getContext('2d').clearRect(0, 0, cav.get(i).clientWidth, cav.get(i).clientHeight);
                i += 1;
            }
            //point传入时,将从鼠标初始坐标mouse转换为基于DICOM图像中点的坐标
            var dicomSeries = dataList.dicomSeries
            var dicom = dicomSeries.series[series].images[index];
            var vector_o1 = dicom.imagePositionPatient;//左上点
            var rc = dicom.imageOrientationPatient,
                vector_r1 = rc.vector1, vector_c1 = rc.vector2;//方向向量
            var pixelSpacing_1 = dicom.pixelSpacing,//点距
                srcHeight = Math.round(point.x + dicom.rows / 2),
                srcWidth = Math.round(point.y + dicom.columns / 2);//改变坐标系
            if (srcHeight < 0 || srcHeight > dicom.rows || srcWidth < 0 || srcWidth > dicom.columns) {//超出了图像范围,则无需定位
                return false;
            }
            var point3D= {//计算该点的三维坐标
                x: vector_o1.x + vector_r1.x * pixelSpacing_1[1] * srcHeight + vector_c1.x * pixelSpacing_1[0] * srcWidth,
                y: vector_o1.y + vector_r1.y * pixelSpacing_1[1] * srcHeight + vector_c1.y * pixelSpacing_1[0] * srcWidth,
                z: vector_o1.z + vector_r1.z * pixelSpacing_1[1] * srcHeight + vector_c1.z * pixelSpacing_1[0] * srcWidth
            };
            for (var i = 0, l = windowProject.window_rows; i < l; i += 1) {
                for (var j = 0,m = windowProject.window_cols;j < m; j += 1) {//遍历可见的窗口
                    var windowView = windowProject.windowArray[i][j];
                    if ((windowView.id !== canvasProject.aCanvas.id) && (windowView.currentSeries !== null)) {//非当前窗口
                        var aSeries = dicomSeries.series[windowView.currentSeries];
                        var dvArray = [];
                        var trueImage = 0,
                            image = aSeries.images[0];
                        if (image.LOAD_STATE !== 'finish') continue;
                        var vector_o2 = image.imagePositionPatient;//初始话对比数据
                        var minDv = (point3D.x - vector_o2.x) * image.normalVector.x + (point3D.y - vector_o2.y) * image.normalVector.y + (point3D.z - vector_o2.z) * image.normalVector.z;
                        for (var k = 1, n = aSeries.images.length; k < n; k += 1) {
                            //计算所有三维坐标到定位图的距离
                            image = aSeries.images[k];
                            if (image.LOAD_STATE !== 'finish') continue;
                            vector_o2 = image.imagePositionPatient;
                            var dv = (point3D.x - vector_o2.x) * image.normalVector.x + (point3D.y - vector_o2.y) * image.normalVector.y + (point3D.z - vector_o2.z) * image.normalVector.z;
                            if (Math.abs(dv) < Math.abs(minDv)) {
                                minDv = dv;
                                trueImage = k;
                            }
                        }
                        image = aSeries.images[trueImage];//获取最小距离的图像
                        var pointInTrueImage = {//计算点击位置在定位图上的投影
                            x: point3D.x - minDv * image.normalVector.x,
                            y: point3D.y - minDv * image.normalVector.y,
                            z: point3D.z - minDv * image.normalVector.z
                        }
                        var vector = toolProject.vectorMinus(pointInTrueImage, image.imagePositionPatient),
                            angle1 = Math.acos(toolProject.getVectorCos(image.imageOrientationPatient.vector1, vector));
                        angle1 = toolProject.dotProduct(toolProject.crossProduct(image.imageOrientationPatient.vector1, vector), image.normalVector) > 0 ? -angle1 : angle1;//判断角的正负
                        var length1 = toolProject.getLength(pointInTrueImage, image.imagePositionPatient);

                        pointInTrueImage = {//将点转化为二维坐标,以供绘制
                            x: (Math.round(length1 * Math.cos(angle1)) - image.columns / 2 * image.pixelSpacing[0]) / image.pixelSpacing[0] ,
                            y: (-Math.round(length1 * Math.sin(angle1)) - image.rows / 2 * image.pixelSpacing[1]) / image.pixelSpacing[1]
                        }
                        if (eventProject.positioningLineSign && trueImage !== windowView.currentIndex) {
                            loadProject.loadSingleDicom(trueImage, windowView.currentSeries, true, false, windowView);
                            //因为窗图像可能发生变动,那么需要重绘定位线
                            var crossPoint = toolProject.isSynchronous(dicom, windowView.dicom) ? false : this.findCrossPoint(image, dicom);
                            //当图像号发生了改变,并且操作窗口的dicom不与其窗的dicom影像平行(或接近平行)时,才计算.
                            if (crossPoint) {
                                this.drawPositioningLine(crossPoint.point1, crossPoint.point2, windowView, canvasProject.aCanvas);
                            } else {
                                var ctx = windowView.positioningLine_ctx;
                                ctx.clearRect(0, 0, windowView.positioningLine_cav.width(), windowView.positioningLine_cav.height());
                            }
                        } else {
                            loadProject.loadSingleDicom(trueImage, windowView.currentSeries, true, false, windowView);
                        }
                        this.lesionsPoint(toolProject.pointToChange(pointInTrueImage, windowView, 'draw'), windowView);
                    }
                }
            }
        },
        lesionsPoint: function(point, aCanvas) {//绘制一个病灶点
            var cav = aCanvas.lesionsPoint_cav,
                ctx = aCanvas.lesionsPoint_ctx;
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(point.x, point.y + 2);
            var j = 0,a = 8, b = 4;//a,b为样式标尺
            for (;j < 5; j += 1) {
                ctx.moveTo(point.x + 10 + j * a, point.y);
                ctx.lineTo(point.x + 10 + j * a + b, point.y);
            }
            for (j = 0;j < 5; j += 1) {
                ctx.moveTo(point.x - (10 + j * a), point.y);
                ctx.lineTo(point.x - (10 + j * a + b), point.y);
            }
            for (j = 0;j < 5; j += 1) {
                ctx.moveTo(point.x, point.y + 10 + j * a);
                ctx.lineTo(point.x, point.y + 10 + j * a + b);
            }
            for (j = 0;j < 5; j += 1) {
                ctx.moveTo(point.x, point.y - (10 + j * a));
                ctx.lineTo(point.x, point.y - (10 + j * a + b));
            }
            ctx.stroke();
        }
    };
    ////////////////////////////////////////
    //数据加载方法
    ////////////////////////////////////////
     var loadProject = {
         filePath: "",//文件路径
         PRELOAD_NUM: 5,//预加载数量
         loaded: 0,//已加载数量
         imageNum: 0,//总图片数量
         singleSeriesSign: false,//单一序列模式
         seriesLoadState:[],//序列加载状态
         ajaxRequestPending:0,//待处理的ajax请求数量
         /**
          * 加载数据(所有缩略数据及其他信息)
          */
         init: function (study) {
             var that = this;
             var param=study?JSON.stringify(study):{};
             RemoteProxy.getStudy({
                     param:param
                 }, function (data) {
                 if (!data) {
                     that.showMessage("未找到要阅览的影像文件，请联系管理员。");
                 } else {
                     // 加载完成
                     if(data.modality === 'CT' || data.modality === 'MR') {
                         eventProject.multipleSeriesSign = true;
                     };
                     that.filePath = data.localPath + "\\" + data.storePath + "\\";//组合文件路径
                     if (data.series.length) { //如果有任何图像的序列信息
                         if (data.series.length === 1) {//单序列判断
                             that.singleSeriesSign = true;
                         }
                         dataList.dicomSeries = data;//存储返回的数据
                         if (that.singleSeriesSign) {
                             loadProject.createSingleSeries(data);//单序列的序列面板显示
                         } else {
                             loadProject.createSeries(data);//多序列的序列面板显示
                         }
                         //默认操作的为第一窗口
                         canvasProject.aCanvas = windowProject.windowArray[0][0];
                         window.measure.aCanvas = windowProject.windowArray[0][0];
                         //默认加载第一序列的第一张图片
                         if(data.series[0].imageCount) loadProject.loadSingleDicom(0, 0, true, true);
                         else that.showMessage("当前序列没有影像文件可以浏览。");
                         //令第一序列(或图片)高亮
                         $(".order-info-part:eq(0)").addClass('order-info-active');

                     } else {
                         that.showMessage("当前没有影像文件可以浏览。");
                     }
                     //测量画布初始化
                     measure.measureCanvasInit();
                     //初始化完成.进行标志的加载以及回调
                     swapdata.finishSign = true;
                     swapdata.finish();
                 }
             }, function () {
                 that.showMessage("未找到要阅览的影像文件，请联系管理员。");
             });
         },
         /*
          * 模拟序列
          * */
         virtualSeries: function (data) {
             var i, l, j, m, dicom, series = [];
             for (i = 0, l = data.length; i < l; i++) {
                 dicom = data[i];
                 for (j = 0, m = series.length; j < m; j++) {
                     if (dicom.seriesNumber == series[j].seriesNumber) {
                         series[j].imageCount += 1;
                         series[j].images.push(dicom);
                         break;
                     }
                 }
                 if (j == m) {
                     series.push({
                         seriesNumber: dicom.seriesNumber,
                         imageCount: 1,
                         modality: dicom.modality,
                         images: [dicom]
                     });
                 }
             }
             var seriesArray = {};
             seriesArray.series = series;
             return seriesArray;
         },
         /*
          * 创建单序列多图像序列
          * */
         createSingleSeries: function (data) {
             var series = data.series,
                 imgFile = this.filePath;
             var dom = [], dicom, aSeries, i, l, num = 0;
             //遍历数组,为dicom补充一些必要的数据
             aSeries = series[0];
             this.seriesLoadState[0] = {
                 no: 0,
                 imageCount: aSeries.imageCount,
                 imageLoaded:0,
                 LOAD_STATE: 'noLoading',
             };
             aSeries.imageCount = aSeries.images.length;//修正图片数量(此处修正有待考虑)
             for (i = 0, l = aSeries.images.length; i < l; i++) {
                 dicom = aSeries.images[i];
                 dicom.LOAD_STATE = null;//加载状态
                 dicom.state = {};//图像状态
                 dicom.measure = {//测量数组
                     array: [],
                     imageData: null
                 };
                 dicom.imageNumber = i + 1;
                 num += 1;
                 dom.push('<div class="order-info-part" id="order-info-part-');
                 dom.push(i);
                 dom.push('"><img class="order-info-img" id="image-');
                 dom.push(i);
                 dom.push('" class="order-info-img"');
                 dom.push('" src="');
                 var filepath = RemoteProxy.getJpegURL() + '?filePath=';
                 if (aSeries.images[i].filePath) {
                     filepath += aSeries.images[i].filePath;
                 } else {
                     filepath += (imgFile + aSeries.images[i].fileName);
                 }
                 filepath += '&rows=128&columns=128';
                 dom.push(filepath);
                 dom.push('" data-index="');
                 dom.push(i);
                 dom.push('" /><p class="order-info-no">图像号:<span>');
                 dom.push(i+1);
                 dom.push('</span></p><p class="order-info-count">图片数量:<span>');
                 dom.push(aSeries.imageCount);
                 dom.push('</span></p><p class="order-info-modality">图像类型:<span>');
                 dom.push(data.modality);
                 dom.push('</span></p></div>');
             }
             $(".order-info").append(dom.join(""));
             this.imageNum = num;
             //在界面上创建进度条
             $("#order-seriesNum").text(series.length);
             $("#order-imageNum").text(num);
             $("#order-downloadProgress").children("div").attr({
                 "aria-valuenow": "0",
                 "aria-valuemin": "0",
                 "aria-valuemax": num
             });
         },
         /*
          * 创建序列
          * */
         createSeries: function (data) {
             var series = data.series,
                 imgFile = this.filePath;
             var dom = [], dicom, aSeries, i, j, l, m, num = 0;
             //遍历数组,为dicom补充一些必要的数据
             for (i = 0, l = series.length; i < l; i++) {
                 aSeries = series[i];
                 dom = [];
                 this.seriesLoadState[i] = {//序列加载
                     no: i,
                     imageCount: aSeries.imageCount,
                     imageLoaded:0,
                     LOAD_STATE: 'noLoading',
                 };
                 aSeries.imageCount = aSeries.images.length;//修正图片数量(此处修正有待考虑)
                 for (j = 0, m = aSeries.images.length; j < m; j++) {//数据补充
                     dicom = aSeries.images[j];
                     dicom.LOAD_STATE = null;//加载状态
                     dicom.state = {};//图像状态
                     dicom.measure = {//测量数组
                         array: [],
                         imageData: null
                     };
                     num += 1;
                 }
                 //在界面上创建序列列表
                 dom.push('<div class="order-info-part" id="order-info-part-');
                 dom.push(i);
                 dom.push('"><div class="order-info-imgBox"><img class="order-info-img" id="series-');
                 dom.push(i);
                 dom.push('" class="order-info-img"');
                 dom.push('" src="');
                 if (series[i].images.length) {
                     var filepath = RemoteProxy.getJpegURL() + '?filePath=';
                     if (series[i].images[0].filePath) {
                         filepath += series[i].images[0].filePath;
                     } else {
                         filepath += (imgFile + series[i].images[0].fileName);
                     }
                     filepath += '&rows=128&columns=128';
                 } else {
                     filepath = '';
                 }
                 dom.push(filepath);
                 dom.push('" data-index="');
                 dom.push(series[i].seriesNumber);
                 dom.push('" /></div><p class="order-info-no">序列号:<span>');
                 dom.push(series[i].seriesNumber);
                 dom.push('</span></p><p class="order-info-count">图片数量:<span>');
                 dom.push(series[i].imageCount);
                 dom.push('</span></p><p class="order-info-modality">图像类型:<span>');
                 dom.push(data.modality);
                 dom.push('</span></p><div class="progress order-info-progress">');
                 dom.push('<div class="progress-bar" role="progressbar"style="width: 0%"></div>');
                 dom.push('</div></div>')
                 $(".order-info").append(dom.join(""));
                 //loadProject.loadSingleDicom(0, i);
                 //loadProject.loadSingleDicom(aSeries.images.length - 1, i);
             }
             this.imageNum = num;
             //在界面上创建进度条
             $("#order-seriesNum").text(series.length);
             $("#order-imageNum").text(num);
             $("#order-downloadProgress").children("div").attr({
                 "aria-valuenow": "0",
                 "aria-valuemin": "0",
                 "aria-valuemax": num
             });
         },
         /**
          * 展示缩略图
          */
         showThumbnail: function (dicoms) {
             var buff = [], dicom;
             for (var i = 0, l = dicoms.length; i < l; i++) {
                 dicom = dicoms[i];
                 buff.push("<div class='order-info-part'><img class='order-info-img' id='dicom-");
                 buff.push(i);
                 buff.push("' class='order-info-img");
                 buff.push("'  src='");
                 var filepath = RemoteProxy.getJpegURL() + '?filePath=' + dicom.filePath + '&rows=128&columns=128';
                 buff.push(filepath);
                 buff.push("' data-index='");
                 buff.push(i);
                 buff.push("' /><p class='order-info-no'>序号:<span>");
                 buff.push(dicom.imageNumber);
                 buff.push("</span></p><p class='order-info-count'>图片数量:<span>");
                 buff.push(1);
                 buff.push("</span></p><p class='order-info-modality'>图像类型:<span>");
                 buff.push(dicom.modality);
                 buff.push("</span></div>");
             }
         },
         /**
          * 加载压缩过的dicom影像
          *index 图像在当前序列的索引
          * seriesNum 序列号
          */
         loadSinglePicture: function (index, seriesNum, isShow, isInit, windowView) {
             var dicoms = dataList.dicomSeries[seriesNum].dicoms;
             if ((index < 0) || (index >= dicoms.length)) {
                 return;
             }
             if (isShow) {
                 this.showMessage();
             }
             var dicom = dataList.dicoms[index];
             if (dicom.LOAD_STATE) {
                 if (dicom.LOAD_STATE === "loading") {
                     return;//请求中
                 }
                 isShow && this.render(index, isInit);
             } else {
                 var self = this;
                 var filepath = RemoteProxy.getJpegURL() + '?filePath=' + dicom.filePath + '&rows=1024&columns=1024';
                 $("#imageBox").attr("src", filepath);
                 $("#imageBox").load(function () {
                     //等待图片加载结束
                     var ctx = $("#canvas-image").get(0).getContext("2d");
                     var img = document.getElementById("imageBox");
                     ctx.drawImage(img, 0, 0);
                     var dicomData = ctx.getImageData(0, 0, 1024, 1024);
                     var pixelData = [],
                         max = (dicomData.data[i * 4] + dicomData.data[i * 4 + 1] + dicomData.data[i * 4 + 2]) / 3,
                         min = max, gray = 0;
                     for (var i = 0, a = 1024 * 1024; i < a; i++) {
                         gray = Math.round((dicomData.data[i * 4] + dicomData.data[i * 4 + 1] + dicomData.data[i * 4 + 2]) / 3);
                         pixelData[i] = gray;
                         max = (max > gray) ? max : gray;
                         min = (gray > min) ? min : gray;
                     }
                     dicom.pixelData = pixelData;
                     dicom.pixelBytes = 2;
                     dicom.rescaleSlope = 1;
                     dicom.rescaleIntercept = 0;
                     dicom.rows = 1024;
                     dicom.columns = 1024;
                     dicom.pixelSpacing = "";
                     dicom.maxGray = max;
                     dicom.minGray = min;
                     dicom.windowWidth = 0;
                     dicom.windowCenter = 0;
                     dicom.samplesPerPixel = 1;
                     dicom.LOAD_STATE = "finish";
                     self._newState(dicom);
                     if (isShow) {
                         self.render(index, isInit, windowView);
                     }
                 });
             }
         },
         /**
          * 加载一张Dicom影像
          *index 图像在当前序列的索引
          *seriesNum 序列号
          */
         loadSingleDicom: function (index, seriesNum, isShow, isInit, windowView) {
             var data = dataList.dicomSeries,
                 imgFile = this.filePath;
             var images = data.series[seriesNum].images;
             if ((index < 0) || (index >= images.length)) {
                 return;
             }
             if (isShow) {
                 this.showMessage("", windowView);
             }
             var dicom = images[index];
             var self = this;
             //加载判断
             if (dicom.LOAD_STATE) {
                 if (dicom.LOAD_STATE === "loading" && isShow) {//加载中的标志
                     dicom.LOAD_STATE = "drawing";//正在绘制绘制标志
                     var drawing = setInterval(function () {//创建定时器,定时查看图像状态用于加载.
                         if (dicom.LOAD_STATE === "finish") {
                             self.render(index, seriesNum, isInit, windowView);
                             clearInterval(drawing);
                         }
                     }, 500);
                     return;
                 } else if (dicom.LOAD_STATE === "drawing") {
                     return;
                 } else {
                     isShow && this.render(index, seriesNum, isInit, windowView);
                 }
             } else {
                 dicom.LOAD_STATE = isShow ? "drawing" : "loading";
                 if (dicom.filePath) {
                     var file = dicom.filePath;
                 } else {
                     file = imgFile + dicom.fileName;
                 }
                 RemoteProxy.getDicomData({
                     filePath: file,
                     size: 0
                     //size: this.sizeJudge(dicom) || 0//dicom.dicomPath,
                 }, function (dicomObject) {
                     if (dicomObject && (dicomObject.rows || dicomObject.columns)) {
                         self.loadProgressControl(index, seriesNum);
                         self._extend(dicom, dicomObject);
                         //计算图像法向量,计算图像方向
                         if (typeof(dicomObject.imageOrientationPatient) === 'string' && dicomObject.imageOrientationPatient !== '') {
                             var aArray = toolProject.getPoint(dicomObject.imageOrientationPatient);
                             dicom.imageOrientationPatient = {
                                 vector1: aArray[0],
                                 vector2: aArray[1]
                             }//图片方向向量
                             dicom.normalVector = toolProject.crossProduct(aArray[0], aArray[1]);//法向量
                             dicom.direction = toolProject.getDirection(aArray);//方向
                             dicom.imagePositionPatient = typeof(dicomObject.imagePositionPatient) !== 'undefined' ? toolProject.getPoint(dicom.imagePositionPatient) : null;//原点位置
                         }
                         //判断是否为定位图以及数据分割
                         dicom.isLocalizer = (typeof (dicom.imageType) !== 'undefined'&& dicom.imageType.match(new RegExp('localizer','i')))
                         || (typeof (dicom.seriesDescription) !== 'undefined' && dicom.seriesDescription.match(new RegExp('localizer','i'))) ? true : false;
                         dicom.pixelSpacing = dicom.pixelSpacing == ""? dicom.pixelSpacing : dicom.pixelSpacing.split('|');
                         dicom.pixelSpacing[0] = dicom.pixelSpacing[0] == "" || dicom.pixelSpacing[0] == 0 ? 1 : parseFloat(dicom.pixelSpacing[0]);
                         dicom.pixelSpacing[1] = dicom.pixelSpacing[1] == "" || dicom.pixelSpacing[1] == 0 ? 1 : parseFloat(dicom.pixelSpacing[1]);
                         //三位图数据补充
                         if (dicom.pixelBytes === 3) {
                             dicom.contrast = 1;
                             dicom.brightness = 0;
                             var pixelNum = dicom.rows * dicom.columns, allValue = 0;
                             for (var i = 0; i < pixelNum; i++) {
                                 allValue += dicom.pixelData[i];
                             }
                             dicom.threshold = allValue / pixelNum;
                         }
                         //修改加载状态
                         dicom.LOAD_STATE = "finish";
                         if (isShow) {
                             self.render(index, seriesNum, isInit, windowView);
                         }
                     } else {
                         if (isShow) {
                             self.showMessage("未找到要阅览的影像文件，请联系管理员。", windowView);
                         }
                     }
                 });
             }
         },
         //加载进度控制及显示sss
         loadProgressControl: function (index, seriesNumber) {
             this.loaded += 1;
             var loadedNum = this.loaded;//已加载图片数量
             var seriesLoadState = this.seriesLoadState[seriesNumber];//序列加载状况
             //控制进度条
             $("#order-downloadProgress").children("div").attr("aria-valuenow", loadedNum).css({
                 "width": (loadedNum / this.imageNum) * 100 + "%"
             }).text(loadedNum);
             if (loadedNum == this.imageNum) {
                 setTimeout(function () {
                     $(".order-header").slideUp("slow");
                     $(".order-info").animate({
                         "height": $(".boardOrder").height()
                     }, "slow");
                 }, 3000)
             }
             //控制序列加载
             if (!this.singleSeriesSign && seriesLoadState.LOAD_STATE !== 'finish') {
                 seriesLoadState.imageLoaded += 1;
                 if (seriesLoadState.imageLoaded === seriesLoadState.imageCount) {
                     seriesLoadState.LOAD_STATE = 'finish';
                     //$("#order-info-canvas-"+seriesLoadState.no).hide();
                 } else {
                     seriesLoadState.LOAD_STATE = 'loading';
                     //this._canvasLoading('order-info-canvas-'+seriesLoadState.no, 60, 60, seriesLoadState.imageLoaded / seriesLoadState.imageCount);
                 }
                 $('#order-info-part-'+seriesNumber).find(".progress-bar").css('width', seriesLoadState.imageLoaded / seriesLoadState.imageCount * 100 + '%');
             }
         },
         //canvasLoading用于显示序列的加载进度
         _canvasLoading: function (canvas, width, height, percent) {
             var ctx = $("#" + canvas).get(0).getContext('2d');
             ctx.clearRect(0, 0, width, height);
             ctx.save();
             ctx.fillStyle = 'rgba(155,155,255,0.4)';
             ctx.strokeStyle = 'rgba(155,155,255,0.4)';
             ctx.beginPath();
             ctx.arc(width / 2, height / 2, width / 2, 0, 2 * Math.PI, false);
             ctx.lineTo(width, 0);
             ctx.lineTo(0, 0);
             ctx.lineTo(0, height);
             ctx.lineTo(width, height);
             ctx.lineTo(width, height / 2);
             ctx.closePath();
             ctx.fill();
             ctx.translate(width / 2, height / 2);
             ctx.rotate(-Math.PI / 180 * 90);
             ctx.beginPath();
             ctx.arc(0, 0, width / 2 - 5, 0, 2 * Math.PI * percent, true);
             ctx.lineTo(0, 0);
             ctx.lineTo(width / 2 - 5, 0);
             ctx.fill();
             ctx.restore();
         },
         /**
          *渲染图像(图像级更新)
          **/
         render: function (index, seriesNum, isInit, windowView) {
             var self = this,
                 aCanvas = windowView ? windowView : canvasProject.aCanvas,
                 dicom = dataList.dicomSeries.series[seriesNum].images[index];
             if (aCanvas && !$("#" + aCanvas.id).length) {//判断载入图像时,此窗是否存在
                 return false;
             }
             aCanvas.baseState = this._newState(dicom, aCanvas);//形成基础状态
             if (typeof (dicom.state.posX) == "undefined") {//若dicom状态尚未初始化,则初始化
                 dicom.state = $.extend(true, {}, aCanvas.baseState);
                 dicom.state.posX = 0;
                 dicom.state.posY = 0;
                 dicom.state.scale = 1;
             }
             aCanvas.currentIndex = index;
             aCanvas.currentSeries = seriesNum;
             aCanvas.dicom = dicom;//赋予窗体数组新的数据与dicom指针
             measure.movingSign.no = 0;//对测量模块的数据进行重置
             this.showMessage(false, aCanvas);//绘制成功,即可隐藏信息窗
             if (isInit) {
                 canvasProject._resetState(aCanvas);
             } else {
                 canvasProject._resetCanvasSize(aCanvas);
             }
             canvasProject.showPatientInfo(aCanvas);
             canvasProject.transformCanvas(aCanvas);
             canvasProject.drawDicom(aCanvas);
             //以下为预加载
             if (this.loaded !== this.imageNum) {
                 if (this.preloadTimer) {
                     clearTimeout(this.preloadTimer);
                 }
                 this.preloadTimer = setTimeout(function () {
                     self._preload(index, seriesNum);
                     self.preloadTimer = null;
                 }, 1000);
             }
         },
         /**
          * 预加载
          */
         _preload: function (index, seriesNum) {
             var images = dataList.dicomSeries.series[seriesNum].images, min = Math.floor(index / this.PRELOAD_NUM)
                 * this.PRELOAD_NUM, max = this.PRELOAD_NUM + min, dicom;
             for (var i = 0, l = images.length; i < l; i++) {
                 dicom = images[i];
                 if (i >= min && i <= max) {
                     if (!dicom.LOAD_STATE) {
                         loadProject.loadSingleDicom(i, seriesNum);
                     }
                 } else if (this.AUTO_RECYCLE) {
                     delete dicom.LOAD_STATE;
                 }
             }
         },
         /*
         * 同步序列判断
         * */
         synchronousSeriesJudge: function (aCanvas) {
             var frameOfReferenceUID = aCanvas.dicom.frameOfReferenceUid,
                 sliceLocation = aCanvas.dicom.sliceLocation;
             var dicomSeries = dataList.dicomSeries;
             for (var i = 0, l = windowProject.window_rows; i < l; i++) {
                 for (var j = 0, m = windowProject.window_cols; j < m; j++) {
                     var windowView = windowProject.windowArray[i][j];
                     if ((windowView.id !== aCanvas.id) && (windowView.currentSeries !== null)) {
                         var aSeries = dicomSeries.series[windowView.currentSeries],
                             index = 0,
                             minLocation = Math.abs(aSeries.images[index].sliceLocation - sliceLocation);
                         for (var k = 1, n = aSeries.images.length; k < n; k += 1) {
                             var dicom = aSeries.images[k];
                             if (toolProject.isSynchronous(dicom, aCanvas.dicom)) {
                                 var nowLocation = Math.abs(dicom.sliceLocation - sliceLocation);
                                 if (minLocation > nowLocation) {
                                     index = k;
                                     minLocation = nowLocation;
                                 }
                             }
                         }
                         if ( aSeries.images[index].frameOfReferenceUid === frameOfReferenceUID && Math.abs(toolProject.getVectorCos(aCanvas.dicom.normalVector, aSeries.images[index].normalVector)) > 0.7) {
                             this.loadSingleDicom(index, windowView.currentSeries, true, false, windowView);
                         }
                     }
                 }
             }
         },
         /*
         * 序列内图像顺序显示
         * */
         synchronousInsideSeries: function (aCanvas, type, a) {
             var windowArray = windowProject.windowArray,
                 cols = windowProject.window_cols,
                 rows = windowProject.window_rows,
                 series = dataList.dicomSeries.series[aCanvas.currentSeries],
                 id = windowProject.getColAndRowFromID(aCanvas.id),
                 count1 = id.r * cols + id.c,//当前窗位
                 count2 = rows * cols - 1;//总窗位
             var i = 0 , j = 0;
             switch(type) {
                 case 1 ://switchIndex
                     if (a) {
                         var maxIndex = aCanvas.currentIndex + count2 - count1 + 1;
                         if (maxIndex >= series.images.length) {
                             maxIndex = series.images.length - 1;
                         }
                         for (i = rows - 1;i >= 0; i -= 1) {
                             for (j = cols - 1; j >= 0 ; j -= 1) {
                                 loadProject.loadSingleDicom(maxIndex--, aCanvas.currentSeries, true, false, windowArray[i][j]);
                             }
                         }
                     } else {
                         var minIndex = aCanvas.currentIndex - count1 - 1;
                         if (minIndex < 0) {
                             minIndex = 0;
                         }
                         for (;i < rows; i += 1) {
                             for(j = 0;j < cols; j += 1) {
                                 loadProject.loadSingleDicom(minIndex++, aCanvas.currentSeries, true, false, windowArray[i][j]);
                             }
                         }
                     }
                     break;
                 case 2 ://switchSeries
                     var minSeries = loadProject.singleSeriesSign ? 0 : a;
                     minIndex = loadProject.singleSeriesSign ? a : 0;
                     for (;i < rows; i += 1) {
                         for(j = 0;j < cols; j += 1) {
                             loadProject.loadSingleDicom(minIndex++, minSeries, true, false, windowArray[i][j]);
                         }
                     }
                     break;
                 default :
                     return false;
             }
         },
         //进行属性添加
         _extend: function (src, attrs) {
             for (var k in attrs) {
                 if (attrs.hasOwnProperty(k)) {
                     src[k] = attrs[k];
                 }
             }
         },
         //载入初始的状态值
         _newState: function (dicom, windowView) {
             var state = {};
             if (windowView) {
                 var sandBoxWidth = $("#" + windowView.id).width(), sandBoxHeight = $("#" + windowView.id).height();
             } else {
                 sandBoxWidth = $(".panelCanvas").width();
                 sandBoxHeight = $(".panelCanvas").height();
             }
             state.antiColor = false;
             state.pseudoColor = false;
             state.windowWidth = dicom.windowWidth;
             state.windowCenter = dicom.windowCenter;
             state.posX = (sandBoxWidth - dicom.columns) / 2;
             state.posY = (sandBoxHeight - dicom.rows) / 2;
             state.scale = (((sandBoxHeight / dicom.rows > sandBoxWidth / dicom.columns) ? sandBoxWidth / dicom.columns : sandBoxHeight / dicom.rows));
             state.horizontal = 1;
             state.vertical = 1;
             state.rotate = 0;// 旋转角度
             state.contrast = dicom.contrast;
             state.brightness = dicom.brightness;
             state.threshold = dicom.threshold;
             return state;
         },
         //显示错误信息
         showMessage: function (text, windowView) {
             var aCanvas = windowView ? windowView : canvasProject.aCanvas;
             var func = (text !== false) ? "show" : "hide", txt = text
                 || "图片正在加载，请稍候...";
             var errorBox = $("#" + aCanvas.id + " .errorBox");
             if (func == "show") {
                 errorBox.show();
                 errorBox.children("p").text(txt);
                 var width = errorBox.width(), height = errorBox.height();
                 errorBox.css({
                     "margin-left": -width / 2,
                     "margin-top": -height / 2
                 });
             } else {
                 errorBox.hide();
                 errorBox.children("p").text();
             }
         },
         //判断影像的宽高
         sizeJudge: function (dicom) {
             var dom = $(".panelImage");
             return dom.width() > dom.height() ? dom.width() : dom.height();
         },
         //滚动加载图像
         scrollFunction: function(wheel, sign) {
             var aCanvas = canvasProject.aCanvas;
             var index = aCanvas.currentIndex,
                 series = aCanvas.currentSeries,
                 length = dataList.dicomSeries.series[series].images.length;
             var a = sign === 'wheelDelta' ? -1 : 1;
             if (!eventProject.multipleSeriesSign) {
                 loadProject.synchronousInsideSeries(aCanvas, 1, wheel * a > 0);
             } else if (wheel * a > 0) {
                 index++;
                 if (index <= length - 1) {
                     loadProject.loadSingleDicom(index, series, true, false, aCanvas);
                     if (eventProject.seriesSynchronousSign) {
                         loadProject.synchronousSeriesJudge(aCanvas);
                     }
                     if (eventProject.positioningLineSign) {
                         canvasProject.findWindowToDrawPL(canvasProject.aCanvas);
                     }
                     if (loadProject.singleSeriesSign) {
                         $(".order-info-part").removeClass('order-info-active');
                         $("#order-info-part-" + index).addClass("order-info-active");
                     }
                 }
             } else {
                 index--;
                 if (index >= 0) {
                     loadProject.loadSingleDicom(index, series, true, false, aCanvas);
                     if (eventProject.seriesSynchronousSign) {
                         loadProject.synchronousSeriesJudge(aCanvas);
                     }
                     if (eventProject.positioningLineSign) {
                         canvasProject.findWindowToDrawPL(canvasProject.aCanvas);
                     }
                     if (loadProject.singleSeriesSign) {
                         $(".order-info-part").removeClass('order-info-active');
                         $("#order-info-part-" + index).addClass("order-info-active");
                         if (eventProject.seriesSynchronousSign) {
                             loadProject.synchronousInsideSeries(aCanvas);
                         }
                     }
                 }
             }
         }
     };
    //////////////////////////////////////////
    //以下数据存储区
    //////////////////////////////////////////
    var dataList= {
        //多窗信息数组
        windowArray: [],
        //dicom序列数据
        dicomSeries: [],
        state: 1,
        //功能面板的数据数组
        functionArray: function () {
            //id:标志名(唯一
            //father:按钮所属模块
            //name:按钮名称
            //src:按钮图像
            //triggerSign:触发机制标志(0为不触发直接事件,1为长触发,2为短触发)
            //count:详细按钮个数
            //buttonName:详细按钮名称
            //buttonClass:详细按钮类名
            //imgSrc:按钮图像
            var functionArray = [];
            var i = 0;
            var father1 = "partShow", father2 = "partDraw";
            functionArray[i++] = {
                display:true,
                id: "window",
                father: "partShow",
                name: "多窗",
                src: "images/window.png",
                count: 1,
                buttonName: ["图像多窗"],
                buttonClass: ["imgWindow"],
                imgSrc: ["images/window.png"]
            };
            functionArray[i++] = {
                display:true,
                id: "link",
                father: "partShow",
                name: "联动",
                src: "images/link.png",
                count: 3,
                buttonName: ["序列联动", "全联动", "无联动"],
                buttonClass: ["orderLink", "allLink", "noneLink"],
                imgSrc: ["images/orderLink.png", "images/link.png", "images/noneLink.png"]
            };
            functionArray[i++] = {
                display:true,
                id: "swapPage",
                father: "partShow",
                name: "点击",
                src: "images/pointer.png",
                triggerSign: 1,
            };
            functionArray[i++] = {
                display:true,
                id: "move",
                father: "partShow",
                name: "移动",
                src: "images/move.png",
                triggerSign: 1
            };
            functionArray[i++] = {
                display:true,
                id: "windowing",
                father: "partShow",
                name: "调窗",
                src: "images/windowing.png",
                triggerSign: 1,
                count: 1,
                buttonName: ["预设窗"],
                buttonClass: ["setWindowing"],
                imgSrc: ["images/setWindowing.png"]
            };
            functionArray[i++] = {
                display:true,
                id: "scale",
                father: "partShow",
                name: "缩放",
                src: "images/scale.png",
                triggerSign: 1,
                count: 1,
                buttonName: ["原大"],
                buttonClass: ["original"],
                imgSrc: ["images/original.png"]
            };
            functionArray[i++] = {
                display:true,
                id: "magnifier",
                father: "partShow",
                name: "放大镜",
                src: "images/magnifier.png",
                triggerSign: 1
            };
            functionArray[i++] = {
                display:true,
                id: "turn",
                father: "partShow",
                name: "翻转",
                src: "images/turn.png",
                triggerSign: 0,
                count: 5,
                buttonName: ["倒置翻转", "镜像翻转", "左转90°", "右转90°", "还原"],
                buttonClass: ["vertical", "horizon", "left90", "right90", "recover"],
                imgSrc: ["images/vertical.png", "images/turn.png", "images/left90.png", "images/right90.png", "images/initialize.png"]
            };
            functionArray[i++] = {
                display:true,
                id: "antiColor",
                father: "partShow",
                name: "反色",
                src: "images/antiColor.png",
                triggerSign: 2
            };
            functionArray[i++] = {
                display:true,
                id: "pseudoColor",
                father: "partShow",
                name: "伪彩",
                src: "images/pseudoColor.png",
                triggerSign: 2
            };
            functionArray[i++] = {
                display:true,
                id: "infoShow",
                father: "partShow",
                name: "四角信息",
                src: "images/view.png",
                triggerSign: 2
            };
            functionArray[i++] = {
                display:true,
                id: "clean",
                father: "partShow",
                name: "初始化",
                src: "images/initialize.png",
                triggerSign: 2
            };
            functionArray[i++] = {
                display:true,
                id: "select",
                father: father2,
                name: "选取",
                src: "images/pointer.png",
                triggerSign: 1
            };
            functionArray[i++] = {
                display:true,
                id: "measure",
                father: father2,
                name: "测量",
                src: "images/measure.png",
                triggerSign: 1,
                count: 5,
                buttonName: ["点测量","长度测量", "角度测量", "矩形测量", "椭圆测量"],
                buttonClass: ["ctMeasure","lineMeasure", "angleMeasure", "squareMeasure", "circleMeasure"],
                imgSrc: ["images/hu.png","images/line.png", "images/angle.png", "images/square.png", "images/circle.png"]
            };
            functionArray[i++] = {
                display:true,
                id: "arrowNote",
                father: father2,
                name: "箭头标注",
                src: "images/arrow.png",
                triggerSign: 1
            };
            functionArray[i++] = {
                display:true,
                id: "textNote",
                father: father2,
                name: "文字标识",
                src: "images/textNote.png",
                triggerSign: 1
            };
            functionArray[i++] = {
                display:true,
                id: "view",
                father: father2,
                name: "显示",
                src: "images/view.png",
                triggerSign: 2
            };
            functionArray[i++] = {
                display:true,
                id: "cleanDraw",
                father: father2,
                name: "清除",
                src: "images/clean.png",
                triggerSign: 2
            };
            return functionArray;
        },
        //预设窗数值
        windowPresetArray: function () {
            var array = [{
                name: "defaults",
                display: "默认值"
            }, {
                name: "full",
                display: "全窗"
            }, {
                name: "w100c40",
                display: "头颅"
            }, {
                name: "w1000c40",
                display: "骨骼"
            }, {
                name: "w300c40",
                display: "鼻咽"
            }, {
                name: "w400c300",
                display: "胸部"
            }, {
                name: "w1500c-700",
                display: "肺部"
            }, {
                name: "w400c40",
                display: "腹部"
            }, {
                name: "w150c40",
                display: "肝脾"
            }, {
                name: "w250c30",
                display: "肾脏"
            }, {
                name: "w320c35",
                display: "胰腺"
            }, {
                name: "w300c40",
                display: "四肢"
            }];
            return array;
        }
    };
    window.image={
        init:init,
        canvasProject:canvasProject,
        windowProject:windowProject,
        eventProject:eventProject,
        loadProject:loadProject,
        dataList:dataList
    };
})();