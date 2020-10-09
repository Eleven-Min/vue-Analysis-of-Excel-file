<template>
    <div>
        <h1>地图下砖</h1>
        <div>
            <el-button
                v-if="mapName != '广西'"
                style="padding: 8px 30px; font-size: 14px"
                size="mini"
                type="primary"
                @click="registerMap('广西')"
                >返回</el-button
            >
        </div>
        <div :ref="className" :class="className" :style="{ height, width }" />
    </div>
</template>

<script>
/* eslint-disable */
// 参考地址：https://gallery.echartsjs.com/editor.html?c=xdExzKlpOh
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import geoJson from "@/assets/json/guangxi.json";
import nanningJson from "@/assets/json/nanning.json";
import baiseJson from "@/assets/json/baise.json";
import hechiJson from "@/assets/json/hechi.json";
import liuzhouJson from "@/assets/json/liuzhou.json";
import guilinJson from "@/assets/json/guilin.json";
import hezhouJson from "@/assets/json/hezhou.json";
import wuzhouJson from "@/assets/json/wuzhou.json";
import laibinJson from "@/assets/json/laibin.json";
import guigangJson from "@/assets/json/guigang.json";
import yulinJson from "@/assets/json/yulin.json";
import qinzhouJson from "@/assets/json/qinzhou.json";
import fangchenggangJson from "@/assets/json/fangchenggang.json";
import beihaiJson from "@/assets/json/beihai.json";
import chongzuoJson from "@/assets/json/chongzuo.json";

export default {
    name: "MapArea",
    props: {
        // 动画效果
        animation: {
            type: Boolean,
            default: true,
        },
        // 显示Legend
        showLegend: {
            type: Boolean,
            default: true,
        },
        // 动画间隔时间
        animationDuration: {
            type: Number,
            default: 2000,
        },
        // 图表名称
        title: {
            type: String,
            default: "",
        },
        // 地理坐标数据
        geoCoordMap: {
            type: Object,
            default: () => ({
                南宁: [108.467414, 23.055856],
            }),
        },
        // 弹窗消息
        popupMsg: {
            type: Object,
            default: () => ({}),
        },
        // 坐标轴数值配置
        axis: {
            type: Object,
            default: () => ({
                name: "系统名称",
                property: "name",
            }),
        },
        // 条形数值配置
        series: {
            type: Array,
            default: () => [
                {
                    name: "登录次数",
                    property: "loginTime",
                },
            ],
        },
        // 颜色列表
        colorList: {
            type: Array,
            default: () => [
                "#D85965",
                "#F39762",
                "#3079FC",
                "#07B8C5",
                "#628be8",
                "#ae83f3",
            ],
        },

        // 是否排序
        sort: {
            type: Boolean,
            default: false,
        },
        // 图表背景
        background: {
            type: String,
            default: "transparent",
        },
        // 字体基数
        scale: {
            type: Number,
            default: 1,
        },
        // 类名
        className: {
            type: String,
            default: "chart",
        },
        // 宽度
        width: {
            type: String,
            default: "100%",
        },
        // 高度
        height: {
            type: String,
            default: "561px",
        },
        // 顶部距离
        geoTop: {
            type: String,
            default: "10%",
        },
    },
    watch: {
        areaStatistics(data) {
            const keys = Object.keys(data);
            // 非空对象
            if (keys.length) {
                this.getMsg();
            } else {
                this.initChart();
            }
        },
    },
    data() {
        return {
            chart: null,
            option: {},
            linesData: [],
            popMsgZIndex: 30,
            chartData: [
                {
                    name: "兴宁区",
                    value: 0,
                },
                {
                    name: "青秀区",
                    value: 0,
                },
                {
                    name: "江南区",
                    value: 0,
                },
                {
                    name: "西乡塘区",
                    value: 0,
                },
                {
                    name: "良庆区",
                    value: 0,
                },
                {
                    name: "邕宁区",
                    value: 0,
                },
                {
                    name: "武鸣区",
                    value: 0,
                },
            ],
            geoCoordMaps: {
                南宁: [108.320004, 22.82402],
                柳州: [109.411703, 24.314617],
                桂林: [110.299121, 25.274215],
                梧州: [111.297604, 23.474803],
                北海: [109.119254, 21.473343],
                防城港: [108.345478, 21.614631],
                钦州: [108.624175, 21.967127],
                贵港: [109.602146, 23.0936],
                玉林: [110.154393, 22.63136],
                百色: [106.616285, 23.897742],
                贺州: [111.552056, 24.414141],
                河池: [108.062105, 24.695899],
                来宾: [109.229772, 23.733766],
                崇左: [107.353926, 22.404108],
            },
            dataIndex: 0,
            mapName: "广西",
            areaStatistics: {
                loading: false,
                series: [
                    // {
                    //     name: "在建工程数（个）",
                    //     property: "project",
                    //     type: "bar",
                    // },
                    // {
                    //     name: "在职人数（个）",
                    //     property: "people",
                    //     type: "bar",
                    // },
                ],
                axis: {
                    property: "name",
                },
                chartData: [
                    // {
                    //     name: "南宁",
                    //     project: 2,
                    //     people: 6,
                    // },
                ],
            },
        };
    },
    mounted() {
        this.$nextTick(() => {
            echarts.registerMap("广西", geoJson);
            this.chart = echarts.init(this.$refs[this.className]);
            this.initChart();
        });
    },
    beforeDestroy() {
        if (!this.chart) {
            return;
        }
        this.chart.dispose();
        this.chart = null;
        clearInterval(this.timer);
        this.timer = null;
    },
    watch: {
        "areaStatistics.chartData": function () {
            this.initChart();
        },
    },
    methods: {
        async initChart() {
            let vm = this;
            // let coordinateData = [];
            // for (let name in this.geoCoordMap) {
            //     coordinateData.push({
            //         name,
            //         value: this.geoCoordMap[name],
            //     });
            // }

            // 处理消息显示数据格式
            let msgSeries = [];
            this.areaStatistics.series.forEach((v, index) => {
                const series = {
                    name: v.name,
                    type: "map",
                    geoIndex: index,
                    data: this.areaStatistics.chartData.map((item) => {
                        return { name: item.name, value: item[v.property] };
                    }),
                };

                msgSeries.push(series);
            });
            const toolTipMap = this.areaStatistics.chartData
                .map((item) => {
                    const tips = this.areaStatistics.series
                        .map((v, index) => {
                            let extre = v.extre ? v.extre : "";
                            return `<div style="line-height:1.8;min-width:100px"><span style="width:8px;height:8px;background:${
                                this.colorList[index]
                            };display:inline-block;margin-right:12px"></span>${
                                v.name
                            }：${item[v.property]}${extre}</div>`;
                        })
                        .join("");
                    let extre = this.areaStatistics.extre
                        ? this.areaStatistics.extre
                        : "";
                    return {
                        key: item.name,
                        tip: `<div style="margin-bottom:8px">${item.name}${extre}</div>${tips}`,
                    };
                })
                .reduce((a, b) => {
                    a[b.key] = b.tip;

                    return a;
                }, {});
            var planePath =
                "path://M.6,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705";
            this.option = {
                backgroundColor: this.background,
                color: this.colorList,

                tooltip: {
                    show: false,
                    formatter: (data) => {
                        this.$emit("changeToolTip", data);
                        return toolTipMap[data.name];
                    },
                    backgroundColor: "rgba(15,28,66,.9)",
                },
                legend: {
                    show: this.showLegend,
                    right: 10 * this.scale,
                    left: "1%",
                    top: "5%",
                    orient: "vertical",
                    itemWidth: 8,
                    itemHeight: 8,
                    itemGap: 18,
                    textStyle: {
                        color: "#A3E2F4",
                        fontSize: 14 * this.scale,
                        fontWeight: 0,
                    },
                },
                // 地图
                geo: {
                    map: this.mapName,
                    label: {
                        show: true,
                        color: "#5C8EC9",
                    },
                    top: this.geoTop,
                    // 地图变形，1为不变形
                    aspectScale: 1,
                    zoom: 1.1,
                    // 地图样式
                    itemStyle: {
                        normal: {
                            areaColor: "#214A9D",
                            borderColor: "#4FE4FF",
                            borderWidth: 2,
                        },
                        emphasis: {
                            areaColor: "#4FE4FF",
                        },
                    },
                },
                series: [...msgSeries],
            };
            let _this = this;

            this.chart.setOption(this.option, true);
            this.chart.on("click", function (e) {
                vm.$emit("click", e.name);
                _this.registerMap(e.name);
            });
            if (this.animation && this.option.series[0]) {
                this.setAnimation(this.option);
            }
            this.chart.on("mouseover", function (e) {
                _this.dataIndex = e.dataIndex;
                _this.chart.dispatchAction({
                    type: "downplay",
                    seriesIndex: 0,
                });
                _this.chart.dispatchAction({
                    type: "highlight",
                    seriesIndex: 0,
                    dataIndex: _this.dataIndex, //第几个tooltip
                });

                _this.chart.dispatchAction({
                    type: "showTip",
                    seriesIndex: 0, //第几条series
                    dataIndex: _this.dataIndex, //第几个tooltip
                });
                clearInterval(_this.timer);
            });
            this.chart.on("mouseout", function () {
                _this.setAnimation(_this.option);
            });
        },
        registerMap(name) {
            let city = null;
            switch (name) {
                case "广西":
                    city = geoJson;
                    break;
                case "南宁":
                    city = nanningJson;
                    break;
                case "百色":
                    city = baiseJson;
                    break;
                case "河池":
                    city = hechiJson;
                    break;
                case "柳州":
                    city = liuzhouJson;
                    break;
                case "桂林":
                    city = guilinJson;
                    break;
                case "贺州":
                    city = hezhouJson;
                    break;
                case "梧州":
                    city = wuzhouJson;
                    break;
                case "玉林":
                    city = yulinJson;
                    break;
                case "来宾":
                    city = laibinJson;
                    break;
                case "贵港":
                    city = guigangJson;
                    break;
                case "钦州":
                    city = qinzhouJson;
                    break;
                case "北海":
                    city = beihaiJson;
                    break;
                case "防城港":
                    city = fangchenggangJson;
                    break;
                case "崇左":
                    city = chongzuoJson;
                    break;
            }
            if (city) {
                this.mapName = name;
                this.$nextTick(() => {
                    echarts.registerMap("广西", city);
                    this.chart.setOption(this.option, true);
                });
            }
        },
        setAnimation(option) {
            this.dataIndex = -1;
            if (this.timer) {
                clearInterval(this.timer);
            }

            this.timer = setInterval(() => {
                var dataLen = option.series[0].data.length;
                // 取消之前高亮的图形
                this.chart.dispatchAction({
                    type: "downplay",
                    seriesIndex: 0,
                });
                this.dataIndex = (this.dataIndex + 1) % dataLen;

                // 高亮当前图形
                this.chart.dispatchAction({
                    type: "highlight",
                    seriesIndex: 0,
                    dataIndex: this.dataIndex,
                });

                // 显示 tooltip
                this.chart.dispatchAction({
                    type: "showTip",
                    seriesIndex: 0,
                    dataIndex: this.dataIndex,
                });
            }, this.animationDuration);
        },
        convertData(data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = this.geoCoordMaps[data[i].name];
                if (geoCoord) {
                    res.push({
                        name: data[i].name,
                        value: geoCoord.concat(data[i].value),
                    });
                }
            }
            return res;
        },
    },
};
</script>
