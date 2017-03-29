/**
 * Created by jmupanda on 2016/3/23.
 */
(function(){
    if (window.systemStatus) return;

    //状态集
    var stateSets = {
    };

    //Status构造函数
    function Status(id, val){
        this.id = id || '';
        this.val = val || false;
    }
    function set(id, val){
        if(!id) return false;
        if (stateSets[id]) {
            stateSets[id].val = val;
        } else {
            stateSets[id] = new Status(id, val);
        }
        return true;
    }
    function get(id) {
        return id ? stateSets[id] ? stateSets[id].val : false : false;
    }
    function toggle(id) {
        if(!id) return false;
        if (stateSets[id]) {
            if (typeof (stateSets[id].val) === 'boolean') {
                stateSets[id].val = !stateSets[id].val;
            }
        } else {
            stateSets[id] = new Status(id, true);
        }
        return true;
    }
    function deleteState(id) {
        if (!id) return false;
        delete stateSets[id];
    }
    window.systemStatus = {
        set: set,//设置
        get: get,//获取
        toggle: toggle,//切换, 仅适用布尔型, 如果状态不是布尔型, 则强制转化为布尔型.
        delete: deleteState//删除
    }
})();