$(function(){
	plumeLog("进入commondityManagement1模板自定义js-"+plumeTime());
	$('.table-block').on('click','.btn-taking',function() {
		getProductId(this)
		derict(this, "takingGoods", "nochangeurl");
	});		

	$('.table-block').on('click','.btn-compile',function() {
		getGoodsPsgId(this);
		derict(this, "compileGoods", "nochangeurl");
	});
	getProductGoodsData()

	$(".btn-search").bind('click',function() {
		var keyword = $('#keyword').val();
		getProductGoodsData(keyword)
	})
})