/**
 * Created by AnGame on 2017/5/1.
 */
(function (window)            //class~
{
    var db = {
        ver: 1,
        storeName: 'indexdb_task',      // 指定名字...
        keyPath: 'id',                  //指定的索引. 至少有一个键值
        dbInstance: {},                 // 执行体.....
        // 更新构架.跟随打开操作...
        upDate: function (e) {
            var _db = e.target.result;
            var names = _db.objectStoreNames;
            var name = db.storeName;
            if (!names.contains(name)) {
                _db.createObjectStore(name, {keyPath: db.keyPath});
            }
        },
        open: function (cb) {
            var req = window.indexedDB.open(db.storeName, db.ver);
            req.onerror = function (e) {
                console.log('打开数据库错误: ' + e.target.error);
            };
            req.onupgradeneeded = db.upDate;
            req.onsuccess = function (e) {
                db.dbInstance = req.result;
                db.dbInstance.onerror = function (e) {
                    console.log('实例生成错误: ' + e.target)
                    console.log(e.target);
                };
                cb();                    //所有事务型操作...所有操作都在打开的基础上进行....
                db.dbInstance.close();    //操作完后及时关闭数据库.以免更新shema是出错, 甚至不能删除...
            }

        },
        // 内部工具函数....
        getObjStore: function (mode) {
            var mode = mode || 'readonly';
            var trans = db.dbInstance.transaction([db.storeName], mode);
            var store = trans.objectStore(db.storeName);
            return store;
        },
        /* 写数据*/
        save: function (data, cb) {
            db.open(function () {
                var mode = 'readwrite';
                var store = db.getObjStore(mode);
                var id = db.keyPath;
                var req = data[id] ? store.put(data) : store.add(data);
                req.onsuccess = cb;
            })
        },
        // 读出所有
        getAll: function (cb) {
            db.open(function () {
                var store = db.getObjStore('readonly');
                var cursor = store.openCursor();
                var data = [];
                cursor.onsuccess = function (e) {
                    var result = e.target.result;
                    if (result && result !== null) {
                        data.push(result.value);
                        result.continue();
                    }
                    else {
                        cb(data);
                    }
                }
            });
        },
        // 读出一个数据
        get: function (id, cb) {
            db.open(function () {
                var store = db.getObjStore();
                var req = store.get(id);
                req.onsuccess = function (e) {
                    cb(e.target.result);
                }
            })
        },
        // 删除指定数据
        delOne: function (id, cb) {
            db.open(function () {
                var mode = 'readwrite';
                var store = db.getObjStore(mode);
                var req = store.delete(id);
                req.onsuccess = cb;
            });
        },
        // 删除所有数据
        deleteAll: function (cb) {
            db.open(function () {
                var mode = 'readwrite';
                var store = db.getObjStore(mode);
                var req = store.clear();
                req.onsuccess = cb;
            });
        },
        init:function (name,ver,keypath) {
            db.storeName=name;
            db.ver=ver;
            db.keyPath=keypath;
        },
        delDBase:function () {
            // only webkit
            var req = window.indexedDB.webkitGetDatabaseNames();
            req.onsuccess = function (e) {
                var str = e.target.result;
                for (var ii = 0; ii < str.length; ii++) {
                    window.indexedDB.deleteDatabase(str[ii]);
                    console.log(str[ii]+ '  deleted');
                }
            }
        }
    };
    window.myDB = window.myDB || {};
    window.myDB.db = db;
}(window));
