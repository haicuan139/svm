$(function () {

    var goodsDraftInit = {

        /**
         * 初始化总控制器
         */
        initData: function () {
            plumeLog("进入goodsDraft模板自定义js-" + plumeTime());

            $('#startDate').cxCalendar();
            $('#endDate').cxCalendar();

            setPageCount();
            tablecheckbox();

            this.initBindEvent().initRequestData().initTableData();
        },

        /**
         * 初始化页面事件
         * @returns {goodsDataManageInit}
         */
        initBindEvent: function () {
            var own = this;

            $(".search-block").on("click", '.gdm-btn-search', function () {
                own.initRequestData().initTableData();
                $(".nav-pagination").off();
                return false;
            }).on('click', ".gdm-btn-reload", function () {
                derict(null, "goodsDraft", "nochangeurl");
                return false;
            });

            return own;
        },

        initRequestData: function () {
            this.data = {
                "page": 1,
                "limit": onePageCount(),
                'productName': $("#productName").val(),
                'startDate': $("#startDate").val(),
                'endDate': $("#endDate").val()
            };

            return this;
        },

        /**
         * 绑定table事件
         * @returns {goodsAuditManageInit}
         */
        bingListEvent: function () {
            $(".table-block").on("click", ".gda-btn-edit", function () {
                session.goods_code = $(this).attr("code");
                session.goods_showMyGoods_productId = $(this).attr("productId");
                session.goods_showMyGoods_type = "draft";
                session.goods_showMyGoods_page = "goodsDraft";
                derict(this, "myGoods", "nochangeurl");
                return false;
            });

            return this;
        },

        /**
         * 翻页请求
         * @param requestData
         * @param totalPage
         */
        paginationData: function (totalPage) {
            var own = this;

            newPage(totalPage, function (page) {
                own.data.page = page;
                $.commonAjax({
                    type: "POST",
                    url: 'listDraft',
                    list: true,
                    data: own.data,
                    success: function (data) {
                        $(".gdm-table-data").find("[list-node]").remove();
                        $(".gdm-table-data").setPageData(data);
                        own.bingListEvent();
                    },
                    error: function (res) {
                    }
                });
                $(".gdm-table-data").find("[list-node]").remove();
                $(".gdm-table-data").setPageData(data);
                binFun();
                unloading();
            }
        });
    }

//按钮绑定方法
    function binFun() {
        $(".gda-btn-edit").unbind().bind("click", function () {
            session.goods_code=$(this).attr("code");
            session.goods_showMyGoods_type = "draft";
            session.goods_showMyGoods_page = "goodsDraft";
            derict(this, "myGoods", "nochangeurl");
        });
    }

//回车搜索
    $(".search-block input[type=text]").bind('focus',function() {
       key.keydownEnter('.gdm-btn-search');   
    });

    $(".search-block input[type=text]").bind('blur',function() {
       key.unkeydownEnter('.gdm-btn-search');   
    });    

            });
        },

        /**
         * 初始化列表数据
         */
        initTableData: function () {
            var own = this;
            $.commonAjax({
                type: "POST",
                url: 'listDraft',
                list: true,
                data: own.data,
                success: function (data) {
                    $(".gdm-table-data").find("[list-node]").remove();
                    $(".gdm-table-data").setPageData(data);
                    own.bingListEvent();
                    own.paginationData(Math.ceil(data.countRecord / onePageCount()));
                },
                error: function (res) {
                }
            });
        }
    };

    goodsDraftInit.initData();

});