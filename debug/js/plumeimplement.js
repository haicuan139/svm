function pageInit(){
    plumeLog("初始化plume-pageInit-"+plumeTime());
}
//--index模板初始化函数
function index_init(){
    plumeLog("初始化index-"+plumeTime());
    plumeUtil.js(plumePath+"/js/index.js");
    plumeLog("完成index模板加载-"+plumeTime());
}
//--index模板初始化函数
function login_init(){
    plumeLog("初始化index-"+plumeTime());
    plumeUtil.js(plumePath+"/js/login.js");
    plumeLog("完成index模板加载-"+plumeTime());
}
//--test模板初始化函数--
function test_init(){
    plumeLog("初始化test模板-"+plumeTime());
    plumeUtil.js(plumePath+"/js/test.js");
    plumeLog("完成test模板加载-"+plumeTime());
}
//--test1模板初始化函数--
function test1_init(){
    plumeLog("初始化test1模板-"+plumeTime());
    plumeUtil.js(plumePath+"/js/test1.js");
    plumeLog("完成test1模板加载-"+plumeTime());
}
//--transmit模板初始化函数--
function transmit_init(){
    plumeLog("初始化transmit模板-"+plumeTime());
    plumeUtil.js(plumePath+"/js/transmit.js");
    plumeLog("完成transmit模板加载-"+plumeTime());
}
//--welcome模板初始化函数--
function welcome_init(){
    plumeLog("初始化welcome模板-"+plumeTime());
    plumeUtil.js(plumePath+"/js/welcome.js");
    plumeLog("完成welcome模板加载-"+plumeTime());
}
//--table模板初始化函数--
function table_init(){
    plumeLog("初始化table模板-"+plumeTime());
    plumeUtil.js(plumePath+"/js/table.js");
    plumeLog("完成table模板加载-"+plumeTime());
}

function agencyList_init() {
    plumeUtil.js(plumePath+"/js/agencyList.js");
}
function agencyCreateCompany_init() {
    plumeUtil.js(plumePath+"/js/agencyCreateCompany.js");
}
function agencyShowCompany_init() {
    plumeUtil.js(plumePath+"/js/agencyShowCompany.js");
}
function agencyAddAccount_init() {
    plumeUtil.js(plumePath+"/js/agencyShowCompany.js");
}
function shopList_init() {
    plumeUtil.js(plumePath+"/js/shopList.js");
}
function shopCreate_init() {
    plumeUtil.js(plumePath+"/js/shopCreate.js");
}
function shopShowCompany_init() {
    plumeUtil.js(plumePath+"/js/shopShowCompany.js");
}
function shopAlter_init() {
    plumeUtil.js(plumePath+"/js/shopAlter.js");
}

//--msgmanage模板初始化函数--
function idmanage_init(){
    plumeLog("初始化msgmanage模板-"+plumeTime());
    plumeUtil.js(plumePath+"/js/idmanage.js");
    plumeLog("完成msgmanage模板加载-"+plumeTime());
}
//--changepwd模板初始化函数--
function changepwd_init(){
    plumeLog("初始化msgmanage模板-"+plumeTime());
    plumeUtil.js(plumePath+"/js/changepwd.js");
    plumeLog("完成msgmanage模板加载-"+plumeTime());
}
//--secondreg模板初始化函数--
function secondreg_init(){
    plumeLog("初始化secondreg模板-"+plumeTime());
    plumeUtil.js(plumePath+"/js/secondreg.js");
    plumeLog("完成secondreg模板加载-"+plumeTime());
}