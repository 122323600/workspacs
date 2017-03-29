/**
 * Created by jmupanda on 2015/9/21.
 */
var measure= {
    aCanvas: {},
    selectNow: image.eventProject.selectNow,
    mode: "lineMeasure",//模式
    cornerFinishSign: false,//夹角绘画完成标注
    movingSign:{
        found:false,
        type:"",
        no:0,
        point:{},
        shape:{}
    },//正在移动
    isOut: true,
    //用于存储临时数据
    track: image.eventProject.track,
    //初始化
    measureCanvasInit: function () {
        this.aCanvas = image.canvasProject.aCanvas;
        var panelCanvas = $(".panelCanvas");
        $(".canvas-measure").attr({
            "width": panelCanvas.width(),
            "height": panelCanvas.height()
        });
    },
    selectEvent: function (eventName, mouse) {
        var track = this.track;
        if (eventName === "mousemove") {
            if (track.status) {
                if (this.movingSign.found){
                    if(this.movingSign.type === "point"){
                        this.drawAll(mouse);
                    }else{
                        this.drawAll({x: (mouse.x - track.start_x), y: (mouse.y - track.start_y)});
                    }
                }
            } else {
                this.findPoint(mouse);
                if (!this.movingSign.found && this.movingSign.type !== "point") {
                    this.findShape(mouse);
                }
            }
        } else if (eventName === "mousedown") {
            var movingSign = this.movingSign;
            if (movingSign.found){
                if (movingSign.type === "point") {
                    movingSign.point = this.findPoint(mouse);
                    movingSign.no = movingSign.point.no;
                    if (movingSign.point.type === 'text') {
                        if ((typeof (track.time) === 'undefined' || !track.time)) {
                            track.time = Date.now();
                        } else {
                            if (Date.now() - track.time > 100 && Date.now() - track.time < 500) {
                                this.changeText(movingSign.point);
                            }
                            track.time = null;
                        }
                    }
                } else {
                    movingSign.shape = this.findShape(mouse);
                    movingSign.no = movingSign.shape.no;
                    if (movingSign.shape.type === 'text') {
                        if ((typeof (track.time) === 'undefined' || !track.time)) {
                            track.time = Date.now();
                        } else {
                            if (Date.now() - track.time > 100 && Date.now() - track.time < 500) {
                                this.changeText(movingSign.shape);
                            }
                            track.time = null;
                        }
                    }
                }
            } else {
                this.movingSign.no = 0;
                this.movingSign.point = {};
                this.movingSign.shape = {};
                this.drawAll();
            }
            track.start_x = mouse.x;
            track.start_y = mouse.y;
        } else if (eventName === "mouseup") {
            this.saveCanvas();
            swapdata.send({
                mode:'imageEvent',
                type:'measure',
                data:{
                    array: this.aCanvas.dicom.measure.array
                }
            });
        }
    },
    //CT值测量事件分配
    ctMeasure: function (eventName, mouse) {
        var track = this.track,
            ctx = this.aCanvas.measure_ctx;
        if (eventName == 'mousemove' || eventName == 'mousedown') {
            this.getCanvas();
            if (track.status) {
                var dicom = this.aCanvas.dicom,
                    dicomData = dicom.pixelData;
                var point = this.getDicomOrigin('save', mouse);
                point = {
                    x: point.x + dicom.columns / 2,
                    y: point.y + dicom.rows / 2
                };
                var loc = Math.round(point.x + point.y * dicom.columns);
                if (point.x < 0 || point.y < 0 || point.x > dicom.columns || typeof (dicomData[loc]) === 'undefined') {
                } else {
                    var data = dicom.modality.match(new RegExp('(ct|mr)', 'i')) ? dicomData[loc] : 0;
                    ctx.save();
                    this.lineStyle();
                    ctx.fillText("X:" + Math.round(point.x) + " Y:" + Math.round(point.y) + " " + dicom.modality + ":" + data, mouse.x, mouse.y);
                    ctx.restore();
                }
            }
        } else if (eventName == 'mouseup') {
            this.getCanvas();
        }
    },
    //角度测量事件分配
    angleMeasure: function (eventName, mouse) {
        var track = this.track,
            loc = {};
        if (eventName == "mousemove") {
            if (this.cornerFinishSign) {
                this.getCanvas();
                loc = {
                    x: track.point2_x,
                    y: track.point2_y
                };
                this.drawAConner(loc, mouse, this.cornerFinishSign);
            } else if (track.status) {
                this.getCanvas();
                loc = {
                    x: track.point1_x,
                    y: track.point1_y
                };
                this.drawAConner(loc, mouse, this.cornerFinishSign);
            }
        } else if (eventName == "mousedown") {
            if (!this.cornerFinishSign) {
                track.point1_x = mouse.x;
                track.point1_y = mouse.y;
            }
        } else if (eventName == "mouseup") {
            if (track.status) {
                if (this.pointInTheArea({x:track.point1_x,y:track.point1_y},mouse,5)){
                    image.canvasProject.mode="select";
                    $(".boardFunction-button").removeClass("buttonClick");
                    $(".select").addClass("buttonClick");
                    this.getCanvas();
                    return;
                }
                if (this.cornerFinishSign) {
                    this.cornerFinishSign = false;
                    this.pushTheCorner(mouse, this.cornerFinishSign);
                    swapdata.send({
                        mode:'imageEvent',
                        type:'measure',
                        data:{
                            array: this.aCanvas.dicom.measure.array
                        }
                    });
                } else if (!this.cornerFinishSign) {
                    this.cornerFinishSign = true;
                    track.point2_x = mouse.x;
                    track.point2_y = mouse.y;
                    this.pushTheCorner(mouse, this.cornerFinishSign);
                }
            }
            this.saveCanvas();
        }
    },
    //箭头标注
    arrowNote: function (eventName, mouse) {
        var track = this.track;
        if (eventName == "mousemove") {
            if (track.status) {
                this.getCanvas();
                var loc = {
                    x: track.start_x,
                    y: track.start_y
                };
                this.drawAArrow(loc, mouse);
            }
        } else if (eventName == "mousedown") {
            track.start_x = mouse.x;
            track.start_y = mouse.y;
        } else if (eventName == "mouseup") {
            if (this.pointInTheArea({x:track.start_x,y:track.start_y},mouse,5)){
                this.getCanvas();
                image.canvasProject.mode="select";
                $(".boardFunction-button").removeClass("buttonClick");
                $(".select").addClass("buttonClick");
            } else {
                this.pushTheArrow(mouse);
                this.saveCanvas();
                swapdata.send({
                    mode:'imageEvent',
                    type:'measure',
                    data:{
                        array: this.aCanvas.dicom.measure.array
                    }
                });
            }
        } else {
            console.log("error");
        }
    },
    //判断点在某范围内
    pointInTheArea:function(origin, point, area) {
        if (point.x < origin.x + area && point.x > origin.x - area) {
            if (point.y < origin.y + area && point.y > origin.y - area) {
                return true;
            }
        }
        return false;
    },
    //文本标注事件
    textNote: function (eventName, mouse) {
        if (eventName == "mousedown") {
            var text = prompt("请输入文本", "");
            if (text != null && text != "") {
                this.drawAText(mouse, text);
                this.pushTheText(mouse, text);
                this.saveCanvas();
                swapdata.send({
                    mode:'imageEvent',
                    type:'measure',
                    data:{
                        array: this.aCanvas.dicom.measure.array
                    }
                });
            }
        }
    },
    //其他一些测量事件分配
    otherMeasure: function (eventName, mouse) {
        var track = this.track;
        if (eventName == "mousemove") {
            if (track.status) {
                this.getCanvas();
                var loc = {
                    x: track.start_x,
                    y: track.start_y
                };
                if (this.mode == "lineMeasure") {
                    this.drawAline(loc, mouse);
                } else if (this.mode == "squareMeasure") {
                    this.drawASquare(loc, mouse);
                } else if (this.mode == "circleMeasure") {
                    this.drawACircle(loc, mouse);
                }
            }
        } else if (eventName == "mousedown") {
            track.start_x = mouse.x;
            track.start_y = mouse.y;
        } else if (eventName == "mouseup") {
            if (this.pointInTheArea({x:track.start_x,y:track.start_y},mouse,5)){
                image.canvasProject.mode="select";
                $(".boardFunction-button").removeClass("buttonClick");
                $(".select").addClass("buttonClick");
                this.getCanvas();
            } else {
                if (this.mode == "lineMeasure") {
                    this.pushTheLine(mouse);//如果不是在移动点的状态,则将这条新线推入数组
                } else if (this.mode == "squareMeasure") {
                    this.pushTheSquare(mouse);
                } else if (this.mode == "circleMeasure") {
                    this.pushTheCircle(mouse);
                }
                this.saveCanvas();
                swapdata.send({
                    mode:'imageEvent',
                    type:'measure',
                    data:{
                        array: this.aCanvas.dicom.measure.array
                    }
                });
            }
        } else {
            console.log("error");
        }
    },
    //添加新文本
    pushTheText: function (loc, text) {
        var measureArray = this.aCanvas.dicom.measure.array;
        var aText = {
            no: 0,
            type: "text",
            point: [],
            text: text
        };
        if (measureArray.length == 0) {
            aText.no = 1;
        } else {
            aText.no = measureArray[measureArray.length - 1].no + 1;
        }
        var point = this.getDicomOrigin("save", loc);
        aText.point.push(point);
        measureArray.push(aText);
    },
    //添加新箭头
    pushTheArrow: function (loc) {
        var track = this.track, measureArray = this.aCanvas.dicom.measure.array,
            aLine = {
                no: 0,
                type: "arrow",
                point: []
            };
        if (measureArray.length == 0) {
            aLine.no = 1;
        } else {
            aLine.no = measureArray[measureArray.length - 1].no + 1;
        }
        var point1 = this.getDicomOrigin("save", {x: track.start_x, y: track.start_y}),
            point2 = this.getDicomOrigin("save", loc);
        aLine.point.push(point1);
        aLine.point.push(point2);
        measureArray.push(aLine);
    },
    //添加新椭圆
    pushTheCircle: function (loc) {
        var track = this.track,
            measureArray = this.aCanvas.dicom.measure.array,
            loc1 = {
                x: track.start_x,
                y: track.start_y
            },
            loc2 = loc;
        var aCircle = {
            no: 0,
            type: "circle",
            point: []
        };
        if (measureArray.length == 0) {
            aCircle.no = 1;
        } else {
            aCircle.no = measureArray[measureArray.length - 1].no + 1;
        }
        var point = this.getDicomOrigin("save", {x: (loc1.x + loc2.x) / 2, y: loc1.y});
        aCircle.point.push(point);
        point = this.getDicomOrigin("save", {x: (loc1.x + loc2.x) / 2, y: loc2.y});
        aCircle.point.push(point);
        point = this.getDicomOrigin("save", {x: loc1.x, y: (loc1.y + loc2.y) / 2});
        aCircle.point.push(point);
        point = this.getDicomOrigin("save", {x: loc2.x, y: (loc1.y + loc2.y) / 2});
        aCircle.point.push(point);
        measureArray.push(aCircle);
        this.shapeArea(aCircle);
    },
    //添加新矩形
    pushTheSquare: function (loc) {
        var track = this.track,
            measureArray = this.aCanvas.dicom.measure.array,
            loc1 = {
                x: track.start_x,
                y: track.start_y
            },
            loc2 = loc;
        var aSquare = {
            no: 0,
            type: "square",
            point: []
        };
        if (measureArray.length == 0) {
            aSquare.no = 1;
        } else {
            aSquare.no = measureArray[measureArray.length - 1].no + 1;
        }
        var point = this.getDicomOrigin("save", {x: (loc1.x + loc2.x) / 2, y: loc1.y});
        aSquare.point.push(point);
        point = this.getDicomOrigin("save", {x: (loc1.x + loc2.x) / 2, y: loc2.y});
        aSquare.point.push(point);
        point = this.getDicomOrigin("save", {x: loc1.x, y: (loc1.y + loc2.y) / 2});
        aSquare.point.push(point);
        point = this.getDicomOrigin("save", {x: loc2.x, y: (loc1.y + loc2.y) / 2});
        aSquare.point.push(point);
        measureArray.push(aSquare);
        this.shapeArea(aSquare);
    },
    //添加新角
    pushTheCorner: function (loc, sign) {
        var aCorner = {},
            measureArray = this.aCanvas.dicom.measure.array,
            track = this.track,
            i = 0,
            point;
        if (sign) {//sign用来判断此角是否已绘制结束
            if (measureArray.length == 0) {
                aCorner.no = 1;
            } else {
                aCorner.no = measureArray[measureArray.length - 1].no + 1;
            }
            aCorner.type = "corner";
            aCorner.point = [];
            point = this.getDicomOrigin("save", {x: track.point1_x, y: track.point1_y});
            aCorner.point.push(point);
            point = this.getDicomOrigin("save", loc);
            aCorner.point.push(point);
            measureArray.push(aCorner);
        } else {
            i = measureArray.length - 1;
            point = this.getDicomOrigin("save", loc);
            measureArray[i].point.push(point);
            this.cornerAngle(measureArray[i]);
        }
    },
    //添加新线
    pushTheLine: function (loc) {
        var track = this.track, measureArray = this.aCanvas.dicom.measure.array,
            aLine = {
                no: 0,
                type: "line",
                point: []
            };
        if (measureArray.length == 0) {
            aLine.no = 1;
        } else {
            aLine.no = measureArray[measureArray.length - 1].no + 1;
        }
        var point1 = this.getDicomOrigin("save", {x: track.start_x, y: track.start_y}),
            point2 = this.getDicomOrigin("save", loc);
        aLine.point.push(point1);
        aLine.point.push(point2);
        measureArray.push(aLine);
    },
    //样式
    lineStyle: function () {
        var context = this.aCanvas.measure_ctx;
        context.strokeStyle = "rgba(43,256,238,0.6)";
        context.fillStyle = "#2bffee";
        context.lineWidth = 2;
        context.font = "normal normal 600 14px serif";
    },
    //获得已存在的点
    setPoint: function (point, sign, i, type) {
        /*
         x:横轴
         y:纵轴
         sign:点位标志
         i:第几号线段/角/定位线
         type:是角是线
         */
        point = this.getDicomOrigin("draw", point);
        var point2 = {
            x: point.x,
            y: point.y,
            sign: sign,
            type: type,
            no: i
        };
        this.movingSign.type = "point";
        this.movingSign.found = true;
        return point2;
    },
    //寻找已存在的点
    findPoint: function (loc) {
        var measureArray = this.aCanvas.dicom.measure.array;
        var i, j;//k为搜索的像素范围
        loc = this.getDicomOrigin("save", loc);
        for (i = measureArray.length - 1; i >= 0;) {
            for (j = measureArray[i].point.length - 1; j >= 0; j--) {
                if (this.pointInTheArea(measureArray[i].point[j], loc, 6)) {
                    if(measureArray[i].type == "square"||measureArray[i].type == "circle"){
                        this.showThePoint(measureArray[i]);
                    }
                    $(".panelCanvas,.panelCanvasOutside").css({
                        cursor: "move"
                    });
                    return this.setPoint(measureArray[i].point[j], j, measureArray[i].no, measureArray[i].type);
                }
            }
            i--;
        }
        if (i == -1) {
            $(".panelCanvas").css({
                cursor: "default"
            });
            if(this.movingSign !== "shape") {
                this.movingSign.found = false;
                this.movingSign.type = "";
                this.getCanvas();
            }
            return false;
        }
    },
    showThePoint:function(shape){
        var point={};
        for (var j = shape.point.length - 1; j >= 0; j--) {
            point=this.getDicomOrigin("draw",shape.point[j] );
            this.drawAPoint(point,1);
        }
    },
    //寻找已存在的图形
    findShape: function (loc) {
        var measureArray = this.aCanvas.dicom.measure.array;
        var ctx = this.aCanvas.measure_ctx;
        var point1, point2;
        for (var i = measureArray.length - 1; i >= 0; i--) {
            if (measureArray[i].type === "square" || measureArray[i].type === "circle") {
                var pointArray = this.getPointAndSize(measureArray[i]);
                point1 = pointArray[0];
                point2 = pointArray[1];
                point1 = this.getDicomOrigin("draw", point1);
                point2 = this.getDicomOrigin("draw", point2);
                ctx.beginPath();
                if (measureArray[i].type === "square") {
                    ctx.rect(point1.x, point1.y, point2.x - point1.x, point2.y - point1.y);
                } else {
                    ctx.save();
                    var x = (point1.x + point2.x) / 2,
                        y = (point1.y + point2.y) / 2,
                        a = Math.abs(point1.x - point2.x) / 2,
                        b = Math.abs(point1.y - point2.y) / 2;
                    ctx.translate(x, y);
                    //选择a、b中的较大者作为arc方法的半径参数
                    var r = (a > b) ? a : b;
                    var ratioX = a / r; //横轴缩放比率
                    var ratioY = b / r; //纵轴缩放比率
                    ctx.scale(ratioX, ratioY); //进行缩放（均匀压缩）
                    //从椭圆的左端点开始逆时针绘制
                    ctx.moveTo(a / ratioX, 0);
                    ctx.arc(0, 0, r, 0, 2 * Math.PI);
                    ctx.restore();
                }
                ctx.closePath();
                if (ctx.isPointInPath(loc.x, loc.y)) {
                    this.movingSign.found = true;
                    this.movingSign.type = "shape";
                    $(".panelCanvas,.panelCanvasOutside").css({
                        cursor: "move"
                    });
                    this.showThePoint(measureArray[i]);
                    return $.extend(true, {}, measureArray[i]);
                }
            } else {
                if (measureArray[i].type === "text") {
                    var shapeTextMirror =  $("#shapeTextMirror");
                    shapeTextMirror.text(measureArray[i].text);
                    point1 = this.getDicomOrigin("draw",measureArray[i].point[0]);
                    point2 = {
                        x: point1.x + shapeTextMirror.width() + 8,
                        y: point1.y
                    };
                    this.makeARect(point1, point2);
                    if (ctx.isPointInPath(loc.x, loc.y)) {
                        this.movingSign.found = true;
                        this.movingSign.type = "shape";
                        $(".panelCanvas").css({
                            cursor: "text"
                        });
                        return $.extend(true, {}, measureArray[i]);
                    }
                } else {
                    for (var j = measureArray[i].point.length - 1; j > 0; j--) {
                        point1 = this.getDicomOrigin("draw", measureArray[i].point[j]);
                        point2 = this.getDicomOrigin("draw", measureArray[i].point[j - 1]);
                        this.makeARect(point1, point2);
                        if (ctx.isPointInPath(loc.x, loc.y)) {
                            this.movingSign.found = true;
                            this.movingSign.type = "shape";
                            $(".panelCanvas").css({
                                cursor: "move"
                            });
                            return $.extend(true, {}, measureArray[i]);
                        }
                    }
                }
            }
        }
        if (i == -1) {
            $(".panelCanvas").css({
                cursor: "default"
            });
            this.movingSign.found = false;
            this.movingSign.type = "";
            this.getCanvas();

            return false;
        }
    },
    //制作搜寻范围,是一个宽为线段长度,高为10的矩形
    makeARect: function (point1, point2) {
        var ctx = this.aCanvas.measure_ctx;
        var length = parseFloat(Math.sqrt(Math.pow((point1.x - point2.x), 2) + Math.pow(point1.y - point2.y, 2)));
        var rotate = Math.atan((point1.y - point2.y) / (point1.x - point2.x));
        ctx.save();
        ctx.translate((point1.x + point2.x) / 2, (point1.y + point2.y) / 2);
        ctx.rotate(rotate);
        ctx.beginPath();
        ctx.rect(-length / 2, -5, length, 10);
        ctx.closePath();
        ctx.restore();
    },
    //计算角度
    cornerAngle: function (corner) {
        var context = this.aCanvas.measure_ctx;
        context.save();
        this.lineStyle();
        var line1 = this.lineLength(corner.point[0].x, corner.point[0].y, corner.point[1].x, corner.point[1].y);
        var line2 = this.lineLength(corner.point[1].x, corner.point[1].y, corner.point[2].x, corner.point[2].y);
        var line3 = this.lineLength(corner.point[0].x, corner.point[0].y, corner.point[2].x, corner.point[2].y);
        var angle = Math.acos((Math.pow(line1, 2) + Math.pow(line2, 2) - Math.pow(line3, 2)) / (2 * line1 * line2)) / Math.PI * 180;
        if (isNaN(angle)) angle = 180.00;
        var point = this.getDicomOrigin("draw", corner.point[1]);
        context.fillText(angle.toFixed(2), point.x + 10, point.y + 10);
        context.restore();
        return angle.toFixed(2);
    },
    //计算线长
    lineLength: function (x1, y1, x2, y2) {
        var length = 0.00,
            dicom = this.aCanvas.dicom,
            pixelSpacing = dicom.pixelSpacing == "" ? [1, 1]: dicom.pixelSpacing;
        length = parseFloat(Math.sqrt(Math.pow((x1 - x2) * pixelSpacing[0], 2) + Math.pow((y1 - y2) * pixelSpacing[1], 2)));
        length = length / (dicom.state.scale * this.aCanvas.baseState.scale);
        //长度=线段像素点*DICOM图像的点距/放大倍数
        length = length.toFixed(2);
        return length;
    },
    //计算面积等
    shapeArea: function (shape) {
        var ctx = this.aCanvas.measure_ctx,
            dicomCav = this.aCanvas.cav,
            dicom = this.aCanvas.dicom,
            dicomData = dicom.pixelData,
            dicomDataNum = dicom.columns * dicom.rows;
        var pointArray = this.getPointAndSize(shape),
            point1 = {
                x: Math.round(pointArray[0].x + dicom.columns / 2),
                y: Math.round(pointArray[0].y + dicom.rows / 2)
            }, point2 = {
                x: Math.round(pointArray[1].x + dicom.columns / 2),
                y: Math.round(pointArray[1].y + dicom.rows / 2)
            };
        var height = Math.abs(point1.y - point2.y),//高度
            width = Math.abs(point1.x - point2.x),//宽度
            area = 0,//面积
            perimeter = 0,//周长
            pixelSpacing = dicom.pixelSpacing != "" ? dicom.pixelSpacing : [1, 1],//点距
            pixelNum = 0;//像素点点数
        var max = image.canvasProject._ct_gray('gray',dicom.minGray),
            min = image.canvasProject._ct_gray('gray',dicom.maxGray),
            average = 0, gray = 0,//平均灰度和每个像素的灰度
            x, y, a, b = 0;
        if (height && width) {
            //以下计算周长和面积,
            if (shape.type == "square") {
                area = height * width * pixelSpacing[0] * pixelSpacing[1];//矩形面积:(宽*点距)*(高*点距)
                perimeter = (height * pixelSpacing[1] + width * pixelSpacing[0]) * 2 ;//周长
                //以下获取像素数据,获取左上坐标以及宽高
                pixelNum = width * height;//获取像素点数量
                for (var i = 0, l = height;i < l; i += 1) {
                    for (var j = 0, m = width;j < m; j += 1){
                        var loc = point1.x + j + (point1.y + i) * dicom.columns;
                        if (point1.x < 0 || point1.y < 0 || point1.x + j > dicom.columns || typeof (dicomData[loc]) === 'undefined') {
                        } else {
                            gray = dicomData[loc];
                            average = average + gray;
                            max = (max > gray) ? max : gray;
                            min = (min > gray) ? gray : min;
                        }
                    }
                }
            } else if (shape.type == "circle") {
                if (height >= width) {//判断椭圆长短直径,a为长直径,b为短直径
                    a = height;
                    b = width;
                } else {
                    a = width;
                    b = height;
                }
                area = height * width / 4 * Math.PI * pixelSpacing[0] * pixelSpacing[1];//椭圆面积=(a/2/放缩*点距)*(b/2/放缩*点距)*π
                perimeter = (Math.PI * b + 2 * a - 2 * b) * pixelSpacing[0];//周长=2*π*b/2*4(a-b)/2
                var sign = false, type = (width > height);//sign为是否在椭圆内的标志,type为椭圆的焦点类型
                for (i = 0, l = height;i < l; i += 1) {
                    for (j = 0, m = width;j < m; j += 1){
                        loc = point1.x + j + (point1.y + i) * dicom.columns;
                        if (point1.x + j< 0 || point1.y + i< 0 || point1.x + j > dicom.columns || point1.y + i > dicom.rows ||typeof (dicomData[loc]) === 'undefined') {
                        } else {
                            //x,y是椭圆内的坐标.
                            y = i - Math.round(height / 2);
                            x = j - Math.round(width / 2);
                            sign = this._inTheCircle(type, a, b, x, y);
                            if (sign) {
                                gray = dicomData[loc];
                                average = average + gray;
                                max = (max > gray) ? max : gray;
                                min = (min > gray) ? gray : min;
                                pixelNum++;
                            }
                        }
                    }
                }
            }
            average = Math.round(average / pixelNum);
            //以下为输出
            var string = "面积:" + area.toFixed(2) + "mm2  周长:" + perimeter.toFixed(2) + "mm",
                string2 = "最大值:" + max + "  最小值:" + min + "  均值:" + average;
            point1 = this.getDicomOrigin("draw", pointArray[0]);
            point2 = this.getDicomOrigin("draw", pointArray[1]);
            if (point1.x > point2.x) {
                point1.x = point2.x;
            }
            if (point1.y < point2.y) {
                point1.y = point2.y;
            }
            ctx.save();
            ctx.fillStyle = "#2bffee";
            ctx.font = "normal normal 600 12px serif";
            ctx.fillText(string2, point1.x, point1.y + 14);
            if (dicom.pixelSpacing != "") {
                ctx.fillText(string, point1.x, point1.y + 30);
            }
            ctx.restore();
        }
    },
    //判断点是否在椭圆内部
    _inTheCircle: function (type, a, b, x, y) {
        //根据椭圆公式判断
        if (type) {
            if (Math.pow(x, 2) / Math.pow(a / 2, 2) + Math.pow(y, 2) / Math.pow(b / 2, 2) <= 1) {
                return true
            }
        } else {
            if (Math.pow(x, 2) / Math.pow(b / 2, 2) + Math.pow(y, 2) / Math.pow(a / 2, 2) <= 1) {
                return true
            }
        }
        return false;
    },
    //画一个点
    drawAPoint: function (loc, alpha) {
        var context = this.aCanvas.measure_ctx;
        context.save();
        context.beginPath();
        if (alpha)
            context.fillStyle = "rgba(250,244,61,1)";
        else
            context.fillStyle = "rgba(250,255,61,0.5)";
        context.arc(loc.x, loc.y, 5, 0, 2 * Math.PI);
        context.fill();
        context.restore();
    },
    //画一条线
    drawAline: function (loc1, loc2) {
        var context = this.aCanvas.measure_ctx;
        context.save();
        this.lineStyle();
        context.beginPath();
        context.moveTo(loc1.x, loc1.y);
        context.lineTo(loc2.x, loc2.y);
        context.fillText(this.lineLength(loc1.x, loc1.y, loc2.x, loc2.y) + (this.aCanvas.dicom.pixelSpacing == "" ? "pixel" : "mm"), (loc1.x + loc2.x) / 2, (loc1.y + loc2.y) / 2);
        context.stroke();
        this.drawAPoint(loc1);
        this.drawAPoint(loc2);
        context.restore();
    },
    //画一个箭头
    drawAArrow: function (loc1, loc2) {
        var context = this.aCanvas.measure_ctx;
        context.save();
        this.lineStyle();
        context.beginPath();
        context.moveTo(loc1.x, loc1.y);
        context.lineTo(loc2.x, loc2.y);
        context.stroke();
        context.save();
        //画箭头
        context.translate(loc1.x, loc1.y);
        //箭头本垂直向下，算出直线偏离Y的角，然后旋转 ,rotate是顺时针旋转的，所以加个负号
        var ang = (loc1.x - loc2.x) / (loc1.y - loc2.y);
        ang = Math.atan(ang);
        if (loc1.y - loc2.y >= 0) {
            context.rotate(-ang);
        } else {
            context.rotate(Math.PI - ang);//加个180度，反过来
        }
        context.lineTo(0, 3);
        context.lineTo(-6, -12);
        context.lineTo(0, -6);
        context.lineTo(6, -12);
        context.lineTo(0, 3);
        context.fill(); //箭头是个封闭图形
        context.restore();   //恢复到堆的上一个状态，其实这里没什么用。
        context.closePath();
        context.restore();
        context.restore();
    },
    //画一个角
    drawAConner: function (loc1, loc2, sign) {
        var context = this.aCanvas.measure_ctx;
        context.save();
        this.lineStyle();
        context.beginPath();
        context.moveTo(loc1.x, loc1.y);
        context.lineTo(loc2.x, loc2.y);
        context.closePath();
        context.stroke();
        if (!sign) this.drawAPoint(loc1);//第一点
        this.drawAPoint(loc2);
        context.restore();
    },
    //画一个矩形
    drawASquare: function (loc1, loc2) {
        var ctx = this.aCanvas.measure_ctx;
        ctx.save();
        this.lineStyle();
        ctx.beginPath();
        ctx.rect(loc1.x, loc1.y, loc2.x - loc1.x, loc2.y - loc1.y);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    },
    //画一个文本
    drawAText: function (loc1, text) {
        var ctx = this.aCanvas.measure_ctx;
        ctx.save();
        this.lineStyle();
        ctx.fillText(text, loc1.x + 8, loc1.y + 4);
        ctx.restore();
        this.drawAPoint(loc1);
    },
    //画一个椭圆
    drawACircle: function (loc1, loc2) {
        var ctx = this.aCanvas.measure_ctx;
        ctx.save();
        this.lineStyle();
        ctx.save();
        var x = (loc1.x + loc2.x) / 2,
            y = (loc1.y + loc2.y) / 2,
            a = Math.abs(loc1.x - loc2.x) / 2,
            b = Math.abs(loc1.y - loc2.y) / 2;
        ctx.translate(x, y);
        //选择a、b中的较大者作为arc方法的半径参数
        var r = (a > b) ? a : b;
        var ratioX = a / r; //横轴缩放比率
        var ratioY = b / r; //纵轴缩放比率
        ctx.scale(ratioX, ratioY); //进行缩放（均匀压缩）
        ctx.beginPath();
        //从椭圆的左端点开始逆时针绘制
        ctx.moveTo(a / ratioX, 0);
        ctx.arc(0, 0, r, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.restore();
        ctx.stroke();
        ctx.restore()
    },
    //更改文本
    changeText:function(point) {
        var measure=this.aCanvas.dicom.measure;
        this.track.status=false;
        var text = prompt("请输入修改文本", "");
        if (text != null && text != "") {
            for (var i = 0, l = measure.array.length; i < l; i++) {
                if(measure.array[i].no === point.no){
                    measure.array[i].text=text;
                    break;
                }
            }
            this.drawAll();
            this.saveCanvas();
        }
    },
    //点位改变
    pointChange: function (sign, point, loc) {
        if (sign == 0 || sign == 1) {//判断点位
            if (point[0].x == point[1].x && point[2].y == point[3].y) {
                point[sign].y = loc.y;
                if (sign == 0) {
                    point[2].y = (loc.y + point[1].y) / 2;
                } else {
                    point[2].y = (loc.y + point[0].y) / 2;
                }
                point[3].y = point[2].y;
            } else {
                point[sign].x = loc.x;
                if (sign == 0) {
                    point[2].x = (loc.x + point[1].x) / 2;
                } else {
                    point[2].x = (loc.x + point[0].x) / 2;
                }
                point[3].x = point[2].x;
            }
        } else {
            if (point[2].x == point[3].x) {
                point[sign].y = loc.y;
                if (sign == 2) {
                    point[0].y = (loc.y + point[3].y) / 2;
                } else {
                    point[0].y = (loc.y + point[2].y) / 2;
                }
                point[1].y = point[0].y;
            } else {
                point[sign].x = loc.x;
                if (sign == 2) {
                    point[0].x = (loc.x + point[3].x) / 2;
                } else {
                    point[0].x = (loc.x + point[2].x) / 2;
                }
                point[1].x = point[0].x;
            }
        }
    },
    //重绘所有
    drawAll: function (loc, windowView) {//sign是传输数据的类型标志
        if (windowView) {
            var startCanvas = this.aCanvas;
            this.aCanvas = windowView;
            var aCanvas = windowView
        } else {
            aCanvas = this.aCanvas;
        }
        var context = aCanvas.measure_ctx,
            measureArray = aCanvas.dicom.measure.array,
            movingSign = this.movingSign,
            point1 = {}, point2 = {}, point3 = {};
        context.clearRect(0, 0, aCanvas.measure_cav.width(), aCanvas.measure_cav.height());
        if (typeof(aCanvas.dicom.measure.array) === 'undefined' || !aCanvas.dicom.measure.array.length) {
            if(startCanvas){
                this.aCanvas = startCanvas;
            }
            return false;
        }
        if (loc) {
            if (movingSign.found) {
                if(movingSign.type === "point"){
                    loc = this.getDicomOrigin("save", loc);
                    for (var i = 0; i < measureArray.length; i++) {
                        if (measureArray[i].no == movingSign.point.no) {
                            if (movingSign.point.type == "square" || movingSign.point.type == "circle") {
                                this.pointChange(movingSign.point.sign, measureArray[i].point, loc);
                                this.showThePoint(measureArray[i]);
                            } else {
                                measureArray[i].point[movingSign.point.sign].x = loc.x;
                                measureArray[i].point[movingSign.point.sign].y = loc.y;
                            }
                            break;
                        }
                    }
                }else if(movingSign.type === "shape"){
                    for (i = 0; i < measureArray.length; i++) {
                        if (measureArray[i].no == movingSign.shape.no) {
                            for (var j = 0; j < measureArray[i].point.length; j++) {
                                point1 = this.getDicomOrigin("draw", movingSign.shape.point[j]);
                                point2 = {
                                    x: point1.x + loc.x,
                                    y: point1.y + loc.y
                                };
                                point2 = this.getDicomOrigin("save", point2);
                                measureArray[i].point[j].x = point2.x;
                                measureArray[i].point[j].y = point2.y;
                            }
                            if (movingSign.shape.type == "square" || movingSign.shape.type == "circle"){
                                this.showThePoint(measureArray[i]);
                            }
                            break;
                        }
                    }
                }
            }
        }
        for (var i = 0, l = measureArray.length; i < l; i++) {
            if (measureArray[i].type == "line") {
                point1 = this.getDicomOrigin("draw", measureArray[i].point[0]);
                point2 = this.getDicomOrigin("draw", measureArray[i].point[1]);
                this.drawAline(point1, point2);
            } else if (measureArray[i].type == "corner") {
                point1 = this.getDicomOrigin("draw", measureArray[i].point[0]);
                point2 = this.getDicomOrigin("draw", measureArray[i].point[1]);
                point3 = this.getDicomOrigin("draw", measureArray[i].point[2]);
                this.drawAConner(point1, point2);
                this.drawAConner(point2, point3);
                this.cornerAngle(measureArray[i]);
            } else if (measureArray[i].type == "square" || measureArray[i].type == "circle") {
                var pointArray = this.getPointAndSize(measureArray[i]);
                point1 = pointArray[0];
                point2 = pointArray[1];
                point1 = this.getDicomOrigin("draw", point1);
                point2 = this.getDicomOrigin("draw", point2);
                if (measureArray[i].type == "square") {
                    this.drawASquare(point1, point2);
                    this.shapeArea(measureArray[i]);
                } else if (measureArray[i].type == "circle") {
                    this.drawACircle(point1, point2);
                    this.shapeArea(measureArray[i]);
                }
            } else if (measureArray[i].type == "arrow") {
                point1 = this.getDicomOrigin("draw", measureArray[i].point[0]);
                point2 = this.getDicomOrigin("draw", measureArray[i].point[1]);
                this.drawAArrow(point1, point2);
            } else if (measureArray[i].type == "text") {
                point1 = this.getDicomOrigin("draw", measureArray[i].point[0]);
                this.drawAText(point1, measureArray[i].text);
            }
        }
        if(startCanvas){
            this.aCanvas = startCanvas;
        }
    },
    //获得左上点和右下点
    getPointAndSize: function (shape) {
        var point1 = {}, point2 = {};
        if (shape.point[0].x == shape.point[1].x) {
            if (shape.point[0].y > shape.point[1].y) {
                point1.y = shape.point[1].y;
                point2.y = shape.point[0].y;
            } else {
                point1.y = shape.point[0].y;
                point2.y = shape.point[1].y;
            }
            if (shape.point[2].x > shape.point[3].x) {
                point1.x = shape.point[3].x;
                point2.x = shape.point[2].x;
            } else {
                point1.x = shape.point[2].x;
                point2.x = shape.point[3].x;
            }
        } else {
            if (shape.point[2].y > shape.point[3].y) {
                point1.y = shape.point[3].y;
                point2.y = shape.point[2].y;
            } else {
                point1.y = shape.point[2].y;
                point2.y = shape.point[3].y;
            }
            if (shape.point[0].x > shape.point[1].x) {
                point1.x = shape.point[1].x;
                point2.x = shape.point[0].x;
            } else {
                point1.x = shape.point[0].x;
                point2.x = shape.point[1].x;
            }
        }
        return [point1, point2];
    },
    //坐标转换
    windowToCanvas: function (x, y) {
        var selectNow = this.aCanvas.measure_cav;
        var bbox = selectNow.get(0).getBoundingClientRect();
        return {
            x: x - bbox.left * (selectNow.width() / bbox.width),
            y: y - bbox.top * (selectNow.height() / bbox.height)
        };
    },
    //根据dicom的state进行坐标的转化
    getDicomOrigin: function (type, point) {
        var aCanvas = this.aCanvas;
        var dicom = aCanvas.cav;
        var bbox = dicom.get(0).getBoundingClientRect(),
            bbox2 = aCanvas.measure_cav.get(0).getBoundingClientRect();//获取dicom画布和测量画布的位置,两者相减可得dicom相对于测量的位置
        var state = aCanvas.dicom.state,
            baseState = aCanvas.baseState,
            scale = state.scale * baseState.scale;//获取dicom画布此时的状态
        var origin_x = bbox.left - bbox2.left + dicom.width() * scale / 2,
            origin_y = bbox.top - bbox2.top + dicom.height() * scale / 2;//获取dicom画布的原点坐标
        var a, point2 = {};
        if (type == "save") {//存储通道,测量画布的坐标点转化为dicom的坐标点,进行存储
            point2.x = (point.x - origin_x) / scale * state.horizontal;
            point2.y = (point.y - origin_y) / scale * state.vertical;
            a = point2.x;
            if (state.rotate == 90) {
                point2.x = point2.y;
                point2.y = -a;
            } else if (state.rotate == 180) {
                point2.x = -point2.x;
                point2.y = -point2.y;
            } else if (state.rotate == 270) {
                point2.x = -point2.y;
                point2.y = a;
            }
        } else if (type == "draw") {//绘制通道,dicom的坐标点转化为测量画布的坐标点,进行绘制
            point2 = {
                x: point.x * scale * state.horizontal,
                y: point.y * scale * state.vertical
            };
            a = point2.x;
            if (state.rotate == 90) {
                point2.x = -point2.y;
                point2.y = a;
            } else if (state.rotate == 180) {
                point2.x = -point2.x;
                point2.y = -point2.y;
            } else if (state.rotate == 270) {
                point2.x = point2.y;
                point2.y = -a;
            }
            point2.x = point2.x + origin_x;
            point2.y = point2.y + origin_y;
        }
        return point2;
    },
    saveCanvas: function (windowView) {
        var aCanvas = windowView ? windowView : this.aCanvas;
        aCanvas.dicom.measure.imageData = aCanvas.measure_ctx.getImageData(0, 0, aCanvas.measure_cav.width(), aCanvas.measure_cav.height());
    },
    getCanvas: function () {
        this.aCanvas.measure_ctx.putImageData(this.aCanvas.dicom.measure.imageData, 0, 0);
    },
};
