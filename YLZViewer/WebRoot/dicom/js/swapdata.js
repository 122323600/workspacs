/**
 * Created by jmupanda on 2015/11/24.
 */
(function(){
    window.swapdata= {
        finishSign:false,
        swapDataMode:'allSend',
        finish:function(){
        },
        callback: function (data) {
        },
        receive: function (data) {
            if (!this.finishSign || !data) {
                return false;
            }
            if (data.type !== 'initialization') {
                var aCanvas = image.canvasProject.aCanvas;
                if (aCanvas.id !== data.aCanvas.id) {
                    image.windowProject.windowSelect(data.aCanvas.id);
                }
                if (aCanvas.currentIndex !== data.aCanvas.index || aCanvas.currentSeries !== data.aCanvas.series) {
                    image.loadProject.loadSingleDicom(data.aCanvas.index, data.aCanvas.series, true);
                }
            }
            switch (data.mode) {
                case 'buttonClick':
                    var dom = $("."+data.name);
                    if (data.type === 'show') {
                        image.eventProject.fireEventFromPartShow(dom, data.data.name);
                    }else if (data.type === 'draw') {
                        image.eventProject.fireEventFromPartDraw(dom, data.data.name);
                    }else if (data.type === 'extended') {
                        image.eventProject.fireEventFromExtendedBox(dom, data.data.name);
                    }else if (data.type === 'clean') {
                        image.canvasProject.reloadDicomByClick(data.data.name);
                    }
                    break;
                case 'orderEvent':
                    image.loadProject.loadSingleDicom(data.data.index, data.data.series, data.data.isShow, data.data.isInit, data.aCanvas);
                    break;
                case 'windowEvent':
                    image.windowProject.windowChange(data.data.c, data.data.r);
                    break;
                case 'imageEvent':
                    if (data.type === 'windowSelect') {
                        image.windowProject.windowSelect(data.data.id);
                    } else if (data.type === 'measure') {
                        image.canvasProject.aCanvas.dicom.measure.array = $.extend(true, [], data.data.array);
                        measure.drawAll();
                        measure.saveCanvas();
                    } else if (data.type === 'draw') {
                        image.canvasProject.aCanvas.dicom.state = $.extend(true, {}, data.data.state);
                        image.canvasProject.beforeDrawDicom();
                    } else if (data.type === 'transform') {
                        image.canvasProject.aCanvas.dicom.state = $.extend(true, {}, data.data.state);
                        image.canvasProject.beforeTransform();
                    } else if (data.type === 'magnifier') {
                        var mouse = measure.getDicomOrigin('draw', data.data.mouse);
                        image.canvasProject.magnifier(data.data.eventName, mouse);
                    }
                    break;
                case 'otherEvent':
                    if (data.type === 'scrollToSwitch') {
                        image.loadProject.scrollFunction(data.data.wheel, data.data.sign);
                    } else if (data.type === 'deleteMeasure') {
                        image.canvasProject.aCanvas.dicom.measure.array = $.extend(true, [], data.data.array);
                        measure.drawAll();
                        measure.saveCanvas();
                    } else if (data.type === 'windowZoom') {
                        image.windowProject.windowZoom(data.data.id);
                    } else if (data.type === 'windowSet') {
                        image.canvasProject.changeWindowHeightAndCenter(data.data.w, data.data.c);
                    } else if (data.type === 'windowLi') {
                        image.canvasProject.changeWindowHeightAndCenter(data.data.wc);
                    } else if (data.type === 'initialization') {
                        var series = image.dataList.dicomSeries.series;
                        for(var i = 0,l = data.measure.length; i < l; i += 1){
                            for(var j = 0,k = data.measure[i].length;j < k; j += 1){
                                series[i].images[j].measure.array = $.extend({}, true, data.measure[i][j]);
                            }
                        }
                        for(i = 0,l = data.state.length; i < l; i += 1){
                            for(j = 0,k = data.state[i].length;j < k; j += 1){
                                series[i].images[j].state = $.extend({}, true, data.state[i][j]);
                            }
                        }
                        image.windowProject.windowChange(data.window.cols, data.window.rows);
                        var windowArray = image.windowProject.windowArray;
                        for (i = 0;i < data.window.rows;i += 1) {
                            for (j = 0;j < data.window.cols;j += 1) {
                                image.loadProject.loadSingleDicom(data.window.array[i][j].currentIndex, data.window.array[i][j].currentSeries, true, false ,windowArray[i][j]);
                            }
                        }
                        if (data.zoom) image.windowProject.windowZoom(data.aCanvas.id);
                        image.windowProject.windowSelect(data.aCanvas.id);
                    }
                    break;
                default :
                    console.log(0);
            }
        },
        send: function (data) {
            if (typeof(data.aCanvas) === 'undefined') {
                data.aCanvas = {
                    id:image.canvasProject.aCanvas.id,
                    index:image.canvasProject.aCanvas.currentIndex,
                    series:image.canvasProject.aCanvas.currentSeries
                }
            }
            switch (data.mode) {
                case 'buttonClick':
                    if(data.type === 'show') {
                        if (data.data.name === 'clean' || data.data.name === 'window' || data.data.name === 'link' || data.data.name === 'turn'){
                            return;
                        }
                    } else if (data.type === 'draw') {
                        if (data.data.name === 'cleanDraw'){
                            return;
                        }
                    } else if (data.type === 'extended') {
                        if (data.data.name === 'windowSetButton' || data.data.name === 'windowLi'){
                            return;
                        }
                    }
                    break;
                case 'orderEvent':
                    break;
                case 'windowEvent':
                    break;
                case 'imageEvent':
                    break;
                case 'otherEvent':
                    break;
                default :
                    console.log(0);
            }
            if (swapdata.swapDataMode == 'allSend') {
                data = swapdata.initialization();
            }
            window.swapdata.callback(data);
        },
        //
        initialization: function () {
            var data = {
                mode:'otherEvent',
                type:'initialization',
                aCanvas:{
                    id:image.canvasProject.aCanvas.id,
                    index:image.canvasProject.aCanvas.currentIndex,
                    series:image.canvasProject.aCanvas.currentSeries
                },
                window:{
                    cols:image.windowProject.window_cols,
                    rows:image.windowProject.window_rows,
                    array:[]
                },
                measure:[],
                state:[],
                zoom:false
            };
            var windowArray = image.windowProject.windowArray;
            for (var x in windowArray) {
                if (windowArray.hasOwnProperty(x)) {
                    data.window.array[x] = [];
                    for (var y in windowArray[x]) {
                        if (windowArray[x].hasOwnProperty(y)) {
                            data.window.array[x][y] = {};
                            for (var z in windowArray[x][y]){
                                if (windowArray[x][y].hasOwnProperty(z)) {
                                    if(z == 'currentIndex' || z == 'currentSeries'){
                                        data.window.array[x][y][z] = windowArray[x][y][z];
                                    }
                                }
                            }
                        }
                    }
                }
            }
            var series = image.dataList.dicomSeries.series;
            for (x in series) {
                if(series.hasOwnProperty(x)){
                    data.measure[x] = [];
                    data.state[x] = [];
                    for (y in series[x]) {
                        if (series[x].hasOwnProperty(y) && y === 'images') {
                            var images = series[x].images;
                            for(z in images) {
                                if (images.hasOwnProperty(z)){
                                    for(var a in images[z]) {
                                        if (images[z].hasOwnProperty(a) && (a == 'measure' || a == 'state')){
                                            if (a === 'measure' && images[z].measure.array.length !== 0) {
                                                data.measure[x][z] = $.extend({}, true, images[z].measure.array);
                                            } else if (a === 'state' && typeof (images[z].state.antiColor) !== 'undefined') {
                                                data.state[x][z] = $.extend({}, true, images[z].state);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if($(".panelCanvasOutside").is(":visible")){
                data.zoom = true;
            }
            return data;
        },
        addNewImagesForSingleSeries: function(link){
            var dicomSeries = image.dataList.dicomSeries.series[0];
            var dom = [];
            for (var i = 0,l = link.length;i < l; i += 1) {
                var num = dicomSeries.imageCount;
                dicomSeries.imageCount += 1;
                var dicom = {};
                dicom.LOAD_STATE = null;
                dicom.state = {};
                dicom.measure = {
                    array: [],
                    imageData: null
                };
                dicom.imageNumber = num;
                dicom.filePath = link[i];
                dicomSeries.images.push(dicom);
                dom.push('<div class="order-info-part" id="order-info-part-');
                dom.push(num);
                dom.push('"><img class="order-info-img" id="image-');
                dom.push(num);
                dom.push('" class="order-info-img"');
                dom.push('" src="');
                var filepath = RemoteProxy.getJpegURL() + '?filePath=';
                filepath += link[i];
                filepath += '&rows=128&columns=128';
                dom.push(filepath);
                dom.push('" data-index= "');
                dom.push(num);
                dom.push('" /><p class="order-info-no">图像号:<span>');
                dom.push(num);
                dom.push('</span></p><p class="order-info-count">图片数量:<span>');
                dom.push('</span></p><p class="order-info-modality">图像类型:<span>');
                dom.push(image.dataList.dicomSeries.modality);
                dom.push('</span></p></div>');
               // image.loadProject.loadSingleDicom(num, 0);
            }
            $(".order-info").append(dom.join(""));
            dicomSeries.imageCount = dicomSeries.images.length;
            $(".order-info-count span").text(dicomSeries.imageCount);
            image.loadProject.seriesLoadState[0].imageCount = dicomSeries.imageCount;
            image.loadProject.imageNum += i - 1;
            $("#order-imageNum").text(image.loadProject.imageNum);
            $("#order-downloadProgress").children("div").attr({
                "aria-valuenow": "0",
                "aria-valuemin": "0",
                "aria-valuemax": image.loadProject.imageNum
            });
            if(!image.windowProject.windowArray[0][0].currentIndex) image.loadProject.loadSingleDicom(0, 0, true, true);
        }
    }
})();