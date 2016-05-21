$(function () {
    plumeLog("进入goodsDataManage模板自定义js-" + plumeTime());
    var datas = {
        "productName": "",
        "modelNumber": "",
        "categoryId": 0,
        "subCategoryId": 0,
        "baseCategoryId": 0,
        "saleStatus": "",
        "reviewStatus": "",
        "seriesName": ""
    }
    getTableData();
    tablecheckbox();
    $(".gdm-add-goods").bind("click", function () {
        derict(this, "userType", "nochangeurl");
    });
    $(".gdm-btn-search").bind("click", function () {
        var productName = $("#productName").val();
        var modelNumber = $("#modelNumber").val();
        var baseCategoryId = $("#baseCategoryId").val();
        var saleStatus = $("#saleStatus").val();
        var subCategoryId = $("#subCategoryId").val();
        var categoryId = $("#categoryId").val();
        var reviewStatus = $("#reviewStatus").val();
        if (categoryId == "") {
            categoryId = 0;
        }
        var saleStatus = $("#saleStatus").val();
        getTableData(productName, modelNumber, categoryId, subCategoryId, baseCategoryId, saleStatus, reviewStatus, "", 1);
    });
    //分类
    var cls = ["gdm-type-first", "gdm-type-second", "gdm-type-third"];

    function getFirstCategory(categoryId, tag) {
        loading();
        $.get(plumeApi["listProductCategory"] + "/" + categoryId, {}, function (data) {
            unloading();
            $("." + cls[tag]).find("[list-node]").remove();
            $("." + cls[tag]).setPageData(data);
            $("." + cls[tag]).find("select").unbind().bind("change", function () {
                var nowtag = parseInt($(this).attr("tag")) + 1;
                var cid = $(this).val();
                if (nowtag < 3) {
                    getFirstCategory(cid, nowtag)
                }
            });
        })
    }

    getFirstCategory(0, 0);
    //获取表格数据
    function getTableData() {
        var newData = JSON.stringify(datas)
        $("[list-node]").remove();
        loading();
        $.ajax({
            type: "POST",
            url: plumeApi["listProductInfoUpt"],
            data: newData,
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                unloading();
                totalPage = Math.ceil(data.countRecord / 10);
                newPage(totalPage, function (i) {

                })
                $(".gdm-table-data").setPageData(data);
                $(".gdm-btn-del").unbind().bind("click", function () {
                    if (confirm("是否确认删除?")) {
                        loading();
                        var productId = $(this).parent().parent().children().first().attr("productId");
                        $.get(plumeApi["delProductInfo"] + "/" + productId, {}, function (data) {
                            unloading();
                            if (data.ok) {
                                $("[list-node]").remove();
                                getTableData();
                                $('.pop').loadTemp("popTips", "nochangeurl", function () {
                                    $(".pop").find(".popup-title").html("信息提示");
                                    $(".pop").find(".popup-icon").html('<i class="success"></i>');
                                    $(".pop").find(".popup-info").html("删除成功");
                                });
                            } else {
                                $('.pop').loadTemp("popTips", "nochangeurl", function () {
                                    $(".pop").find(".popup-title").html("信息提示");
                                    $(".pop").find(".popup-icon").html('<i class="warning"></i>');
                                    $(".pop").find(".popup-info").html("删除失败");
                                });
                            }
                        });
                    }
                });

                $(".gdm-btn-edit").unbind().bind("click", function () {
                    var productId = $(this).parent().parent().children().first().attr("productId");
                    session.goods_edit_productId = productId;
                    derict(this, "editMyGoods", "nochangeurl");
                });
                $('.gdm-btn-open').each(function () {
                    if ($(this).html() == 1) {
                        $(this).html('禁用');
                    } else {
                        $(this).html('启用');
                    }
                });
                $('.gdm-btn-copy').unbind().bind("click", function () {
                    var productId = $(this).parent().parent().children().first().attr("productId");
                    session.goods_edit_productId = productId;
                    derict(this, "copyMyGoods", "nochangeurl");
                })

            }
        });
    }

    $(".table-block").on("click", ".gdm-btn-open", function () {
        getProductId(this);
        var _this = this;
        $.ajax({
            url: "http://192.168.222.162:8080/productInfo/enableSaleStatus/" + session.productGoods_productId,
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            success: function (data) {
                unloading();
                if ($(_this).html() == "禁用") {
                    $('.pop').loadTemp("popTips", "nochangeurl", function () {
                        $(".pop").find(".popup-title").html("已禁用");
                        $(".pop").find(".popup-icon").html('<i class="success"></i>');
                        $(".pop").find(".popup-info").html("禁用成功");
                    });
                } else {
                    $('.pop').loadTemp("popTips", "nochangeurl", function () {
                        $(".pop").find(".popup-title").html("已启用");
                        $(".pop").find(".popup-icon").html('<i class="success"></i>');
                        $(".pop").find(".popup-info").html("启用成功");
                    });
                }
                getTableData();
            }
        })
    })

//批量导入按钮
    $(".btn-import-data").bind("click", function () {
        $('.pop').loadTemp("popUpLoadBatch", "nochangeurl", function () {
            $(".btn-loadModule").bind("click", function () {
                window.location = "http://api.longguo.hxmklmall.cn:80/excel/importProductGoods/1/1/1/1"
            });
        });
    })

});
