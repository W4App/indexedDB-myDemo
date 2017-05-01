/**
 * Created by AnGame on 2017/5/1.
 */
var Item='题目1';
var Answers='答案1';
var mDate='时间1';
var myData={};
function selItem(obj,field) {
    var opt=obj.options;
    for(var ii=0;ii<opt.length;ii++){
        if(opt[ii].selected){
            switch (field){
                case 1:
                    Item=opt[ii].value;
                    break;
                case 2:
                    Answers=opt[ii].value;
                    break;
                case 3:
                    mDate=opt[ii].value;
                    break;
            }
        }
    }
}
function pClick(pele) {
    pele.innerText='{Item: '+Item+ ' ,Answers: '+Answers+' ,mDate: '+mDate+'}';
    myData['Item']=Item;
    myData['Answers']=Answers;
    myData['mDate']=mDate;
}
function openDB() {
    window.myDB.db.open(function () {
        console.log('DB open, do something (trans ... etc.),and it be closed!')
    })
}
function init() {
    window.myDB.db.init('Test',1,'Item');
   /* window.myDB.db.storeName='Test';
    window.myDB.db.ver=1;
    window.myDB.db.keyPath='Item';*/
}
function save() {
    window.myDB.db.save(myData,function () {

    })
}
function get() {
    window.myDB.db.get(Item,function (data) {
        console.log(data);
    })
}
function getAll() {
    window.myDB.db.getAll(function (datas) {
        console.log(datas);
    })
}
function delAll() {
    window.myDB.db.deleteAll(function () {

    })
}
function delOne() {
    window.myDB.db.delOne(Item,function () {

    })
}
function delDBase() {
    window.myDB.db.delDBase();
}