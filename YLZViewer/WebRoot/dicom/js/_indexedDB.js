(function(window, $){
    var indexedDBModal = (function(window, $){
        var db,
            dbName = 'YLZ_DicomImageDB',
            version = 1,
            queue = [],
            maxCount = 100,//最大存储数据
            thisPageCount = 0,
            nowCount = 0,
            deleteNum = 10,
            timer;
        //查询数据
        function getData(uid, success, error) {
            var transaction = db.transaction(["images"]);
            transaction.oncomplete = function(e) {
                //console.log('getData事务执行完毕');
            };
            transaction.onerror = function(e) {
                //console.error('getData事务执行失败');
            };
            var objectStore = transaction.objectStore("images");
            var request = objectStore.get(uid);
            request.onsuccess = function(event) {
                if (event.target.result) {
                    thisPageCount += 1;
                }
                success(event);

            };
            request.onerror = error;
        }

        //添加队列的缓存数据
        function addData(data){
            if (thisPageCount >= 100) {
                return;
            }
            for (var i = 0, l= data.length;i < l; i += 1) {
                queue.push(data[i]);
            }
            if (!timer) {
                //开启事务
                timer = setTimeout(function(){
                    var transaction = db.transaction(["images"], "readwrite");
                    transaction.oncomplete = function(e) {
                        //console.log('addData事务执行完毕');
                    };
                    transaction.onerror = function(e) {
                        //console.error('addData事务执行失败');
                    };
                    var objectStore = transaction.objectStore("images");
                    while (queue.length !== 0) {
                        var request = objectStore.add(queue[0]);
                        request.onsuccess = function(e) {
                            //console.log('数据添加完成');
                            nowCount += 1;
                            console.log(thisPageCount);
                            thisPageCount += 1;
                            if (nowCount > maxCount) {
                                deleteDataStatic(objectStore);
                            }
                        };
                        request.onerror = function(e) {
                            console.error('addError:'+ e.target.error.name + ' ' + e.target.error.message);
                        };
                        queue.shift();
                    }
                    timer = null;
                }, 50);
            }
        }

        //删除固定长度的数据
        function deleteDataStatic(objectStore) {
            var num = deleteNum;
            objectStore.openCursor().onsuccess = function(event){
                var cursor = event.target.result;
                if (cursor) {
                    var request = objectStore.delete(cursor.key);
                    request.onsuccess = function(){
                        nowCount -= 1;
                    };
                    num -= 1;
                    num && cursor.continue();
                }
            };
        }
        //计算缓存数据条目
        function countData() {
            //此处要进行数据的删除
            var transaction = db.transaction(["images"], 'readwrite');
            var objectStore = transaction.objectStore("images");
            var request = objectStore.count();
            request.onsuccess = function(event) {
                nowCount = event.target.result;
                console.log(nowCount);
            };

        }

        //打开数据库
        function openDB (callback) {
            //检测是否支持
            if (!window.indexedDB) {
                window.alert('您的浏览器不支持离线缓存功能, 网页在重新打开时需要重新下载图片');
                systemStatus.set('indexedDB', false);
                callback();
                return;
            }
            //打开数据库
            var request = window.indexedDB.open(dbName, version);

            //生成处理函数
            request.onerror = function(e) {
                //在启用IndexedDB时, 浏览器会提示用户
                //用户有可能决定不允许你的webapp访问以创建一个数据库.
                //或者浏览器本身就处在隐私模式下
                //在打开数据库时常见的可能出现的错误之一是 VER_ERR。这表明存储在磁盘上的数据库的版本高于你试图打开的版本。这是一种必须要被错误处理程序处理的一种出错情况。
                console.error('indexedDB error: ' + e.target.error);
                systemStatus.set('indexedDB', false);
                callback();
            };
            request.onsuccess = function(e) {
                db = request.result;
               // systemStatus.set('indexedDB', true);
                callback();

                //数据库处理
                countData();
                //防并发
                db.onversionchange = function(){
                    db.close();
                };
            };
            //数据库第一次被打开或者版本号改变时会触发此事件
            request.onupgradeneeded = function(e) {
                //创建一个对象存储空间来持有有关客户的信息
                db = e.target.result;
                if (!db.objectStoreNames.contains('images')) {
                    var objectStore = db.createObjectStore("images", {keyPath: 'uid'});
                }
                systemStatus.set('indexedDB', true);
                callback();
            }
        }
        //关闭数据库
        function closeDB(){
            db.close();
        }
        //删除数据库
        function deleteDB(){
            var DBDeleteRequest = window.indexedDB.deleteDatabase(dbName);
            DBDeleteRequest.onerror = function(e) {
                console.error(dbName + '数据库删除失败');
            };
            DBDeleteRequest.onsuccess = function(e) {
                console.info(dbName + '数据库删除成功');
            };
        }
        return {
            openDB: openDB,
            closeDB: closeDB,
            deleteDB: deleteDB,
            addData: addData,
            getData: getData,
            countData: countData
        }
    })(window, $);

    window.indexedDBModal = indexedDBModal;
})(window, $);

