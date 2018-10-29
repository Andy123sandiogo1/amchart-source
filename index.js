// Set theme
// Set theme
// am4core.useTheme(am4themes_animated);

// Generate random data
//
// var data_flow = [];
// var data_top5 = [];
// var data_in = [];
// var data_out = [];

var loaded = false;
var dispose_timer = false;
var chart_flow, chart_top5, chart_in, chart_out;
var ftime_lab, ttime_lab, itime_lab, otime_lab, flow_tlab, flow_ylab;
var in_tlab, in_ylab;
var out_tlab, out_ylab;
var top5_tlab, top5_tlab1, top5_tlab2, top5_tlab3, top5_tlab4;
var flow_t, flow_y, in_t, in_y, out_t, out_y;
var data_flow = [], data_top5 = [], data_in = [], data_out = [];
var default_interval = 5;
var env = "test";
var dateFormatter = new am4core.DateFormatter();
var global_datetime_format = "d MMM, yyyy H:m:s";
var axisBreakThreshold = 0.6;
var defaultZoomPoints = 100;

function bytes_to_bps(value, interval) {
    interval = interval || default_interval;
    return parseFloat(value) * 8 / interval;
}

function bps_to_gbps(value) {
    mbps = parseFloat(value) / 1000 / 1000;
    gbps = mbps / 1000;
    if (gbps > 1) {
        return Math.round(gbps * 10) / 10 + 'Gbps';
    } else {
        return Math.round(mbps * 10) / 10 + 'Mbps';
    }
}

function dispose() {
    console.log("cahrt_flow",chart_flow);
    if (chart_flow && !chart_flow.isDisposed()) chart_flow.dispose();
    if (chart_in && !chart_in.isDisposed()) chart_in.dispose();
    if (chart_out && !chart_out.isDisposed()) chart_out.dispose();
    if (chart_top5 && !chart_top5.isDisposed()) chart_top5.dispose();
}

function create() {

    var prevZoomPos = {
        st: 0,
        en: 1
    };
    var curPosData = {
        x: null,
        y: null
    };
    var curPos = {
        x: null,
        y: null
    };
    var curFlow = {
        x: null,
        y: null
    };
    var curTop5 = {
        x: null,
        y: null
    };
    var curIn = {
        x: null,
        y: null
    };
    var curOut = {
        x: null,
        y: null
    };
    // var data = [];
    // var value1 = 1000, value2 = 1200;
    // var quantity = 30000;
    // for (var i = 0; i < 360; i++) {
    //   value1 += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 100);
    //   data.push({ date: new Date(2015, 0, i), value1: value1 });
    // }
    // // Create chart  -  Flow Count
    // chart_flow = am4core.create("chart_flow", am4charts.XYChart);
    // chart_flow.data = data;
    //
    // var dateAxis = chart_flow.xAxes.push(new am4charts.DateAxis());
    // dateAxis.renderer.grid.template.location = 0;
    // dateAxis.renderer.labels.template.fill = am4core.color("#dfcc64");
    //
    // var valueAxis = chart_flow.yAxes.push(new am4charts.ValueAxis());
    // valueAxis.tooltip.disabled = true;
    // valueAxis.renderer.labels.template.fill = am4core.color("#dfcc64");
    //
    //
    //
    // chart_flow.cursor = new am4charts.XYCursor();
    // chart_flow.cursor.xAxis = dateAxis;
    //
    // chart_flow.cursor.events.on("cursorpositionchanged", function(ev) {
    //   curPosData.x = ev.target.chart.xAxes.getIndex(0).positionToDate(ev.target.xPosition);
    //   curPosData.y = ev.target.chart.yAxes.getIndex(0).positionToValue(ev.target.yPosition);
    //   time_lab.text = curPosData.x.toString();
    //   flow_tlab.text = "Today("+curPosData.y+")";
    // curPos.x = ev.target.xPosition;
    // curPos.y = ev.target.yPosition;
    //
    // curTop5.x = curPos.x * chart_top5.cursor.maxRight;
    // curIn.x = curPos.x * chart_in.cursor.maxRight;
    // curOut.x = curPos.x * chart_out.cursor.maxRight;
    // curTop5.y = curPos.y;
    // curIn.y = curPos.y;
    // curOut.y = curPos.y;
    //
    // chart_top5.cursor.triggerMove(curTop5, true);
    // chart_in.cursor.triggerMove(curIn, true);
    // chart_out.cursor.triggerMove(curOut, true);

    // });
    chart_flow = am4core.createFromConfig({

        // Chart title
        "titles": [{
            "text": "Flow Count",
            "fontSize": 18,
            "marginBottom": 10
        }],

        "data": [],

        // Set settings and data
        "paddingRight": 40,

        // Create X axes
        "xAxes": [{
            "type": "DateAxis",
            "tooltip": {
                "disabled": true
            },
            "renderer": {
                "grid": {
                    "location": 0,
                    "strokeOpacity": 0
                },
                "minGridDistance": 60
            }
        }],

        // Create Y axes
        "yAxes": [{
            "type": "ValueAxis",
            "tooltip": {
                "disabled": true
            },
            "renderer": {
                "minWidth": 35
            }
        }],

        // Create series
        "series": [{
            "id": "s1",
            "type": "LineSeries",
            "dataFields": {
                "dateX": "date1",
                "valueY": "value1"
            },
            "fillOpacity": "0.3",
            "stroke": "#e59165",
            "fill": "#e59165",
        }],

        // Add cursor
        "cursor": {
            "behavior": "selectX",
            "events": {
                "cursorpositionchanged": function (ev) {
                    if (chart_flow.isDisposed()) return;
                    var curDate = ev.target.chart.xAxes.getIndex(0).positionToDate(ev.target.xPosition);
                    var curValue = ev.target.chart.yAxes.getIndex(0).positionToValue(ev.target.yPosition);
                    var curRange = prevZoomPos.en - prevZoomPos.st;
                    var datalen = chart_flow.data.length / 2;
                    var cPos = (prevZoomPos.st + ev.target.xPosition * curRange) * datalen;
                    cPos = Math.round(cPos);

                    ftime_lab.text = dateFormatter.format(curDate, global_datetime_format);
                    flow_tlab.text = "Today(" + data_flow[cPos]["value1"] + ")";
                    curPos.x = ev.target.xPosition;
                    curPos.y = ev.target.yPosition;

                    curTop5.x = curPos.x * chart_top5.cursor.maxRight;
                    curIn.x = curPos.x * chart_in.cursor.maxRight;
                    curOut.x = curPos.x * chart_out.cursor.maxRight;
                    curTop5.y = curPos.y;
                    curIn.y = curPos.y;
                    curOut.y = curPos.y;

                    chart_top5.cursor.triggerMove(curTop5, true);
                    chart_in.cursor.triggerMove(curIn, true);
                    chart_out.cursor.triggerMove(curOut, true);
                },
                // "zoomended": function (ev) {
                //     if (chart_flow.isDisposed()) return;
                //     var curRange = prevZoomPos.en - prevZoomPos.st;
                //     var st = prevZoomPos.st + ev.target.xRange.start * curRange;
                //     var en = prevZoomPos.st + ev.target.xRange.end * curRange;
                //     chart_top5.xAxes.getIndex(0).zoom({start: st, end: en});
                //     chart_in.xAxes.getIndex(0).zoom({start: st, end: en});
                //     chart_out.xAxes.getIndex(0).zoom({start: st, end: en});
                //
                //     prevZoomPos.en = prevZoomPos.st + ev.target.xRange.end * curRange;
                //     prevZoomPos.st = prevZoomPos.st + ev.target.xRange.start * curRange;
                //
                // },
                selectended: function (ev) {
                    var range = ev.target.xRange;
                    var axis = ev.target.chart.xAxes.getIndex(0);
                    var from = parseInt(axis.positionToValue(range.start));
                    var to = parseInt(axis.positionToValue(range.end));

                    // console.log(new Date(from), new Date(to));
                    zoomIn(from, to);
                }
            }
        },
        "zoomOutButton": {
            "disabled": true
        }
    }, "chart_flow", "XYChart");
    chart_top5 = am4core.createFromConfig({

        // Chart title
        "titles": [{
            "text": "Top 5",
            "fontSize": 18,
            "marginBottom": 10
        }],

        // Set settings and data
        "paddingRight": 40,

        // Create X axes
        "xAxes": [{
            "type": "DateAxis",
            "tooltip": {
                "disabled": true
            },
            "renderer": {
                "grid": {
                    "location": 0,
                    "strokeOpacity": 0
                },
                "minGridDistance": 60
            }
        }],

        // Create Y axes
        "yAxes": [{
            "type": "ValueAxis",
            "logarithmic": false,
            "numberFormatter": {
                "type": "NumberFormatter",
                "numberFormat": "#.#a'bps'"
            },
            "tooltip": {
                "disabled": true
            },
            "renderer": {
                "minWidth": 35
            }
        }],

        // Create series
        // "series": [{
        //   "id": "s1",
        //   "type": "LineSeries",
        //   "dataFields": {
        //     "dateX": "date",
        //     "valueY": "value1"
        //   },
        //   "fillOpacity": "0.3"
        // }, {
        //   "id": "s2",
        //   "type": "LineSeries",
        //   "dataFields": {
        //     "dateX": "date",
        //     "valueY": "value2"
        //   },
        //   "fillOpacity": "0.3"
        // }],

        // Add cursor
        "cursor": {
            "type": "XYCursor",
            "lineY": {
                "disabled": true
            },
            "lineX": {
                "stroke": "#A01010",
                "strokeWidth": 2,

                "strokeDasharray": ""
            },
            "behavior": "selectX",
            "events": {
                "cursorpositionchanged": function (ev) {
                    // cursorPosition.x = ev.target.chart.xAxes.getIndex(0).positionToDate(ev.target.xPosition);
                    // cursorPosition.y = ev.target.chart.yAxes.getIndex(0).positionToValue(ev.target.yPosition);
                    var curDate = ev.target.chart.xAxes.getIndex(0).positionToDate(ev.target.xPosition);
                    var curValue = ev.target.chart.yAxes.getIndex(0).positionToValue(ev.target.yPosition);
                    var curRange = prevZoomPos.en - prevZoomPos.st;
                    var datalen = chart_flow.data.length / 2;
                    var cPos = (prevZoomPos.st + ev.target.xPosition * curRange) * datalen;
                    cPos = Math.round(cPos);

                    ttime_lab.text = dateFormatter.format(curDate, global_datetime_format);
                    if (data_top5[cPos]) {
                        top5_tlab.text = "(Unknown)(" + data_top5[cPos]["value1"] + ")";
                        top5_tlab1.text = '(Gentrice)(' + data_top5[cPos]["value2"] + ")";
                        top5_tlab2.text = '(DNS)(' + data_top5[cPos]["value3"] + ")";
                        top5_tlab3.text = '(Syslog)(' + data_top5[cPos]["value4"] + ")";
                        top5_tlab4.text = '(SSL)(' + data_top5[cPos]["value5"] + ")";
                    }
                    curPos.x = ev.target.xPosition;
                    curPos.y = ev.target.yPosition;

                    curFlow.x = curPos.x * chart_flow.cursor.maxRight;
                    curIn.x = curPos.x * chart_in.cursor.maxRight;
                    curOut.x = curPos.x * chart_out.cursor.maxRight;
                    curFlow.y = curPos.y;
                    curIn.y = curPos.y;
                    curOut.y = curPos.y;

                    // chart_flow.cursor.triggerMove(curFlow, true);
                    chart_in.cursor.triggerMove(curIn, true);
                    chart_out.cursor.triggerMove(curOut, true);
                },
                // "zoomended": function (ev) {
                //     var curRange = prevZoomPos.en - prevZoomPos.st;
                //     var st = prevZoomPos.st + ev.target.xRange.start * curRange;
                //     var en = prevZoomPos.st + ev.target.xRange.end * curRange;
                //     chart_flow.xAxes.getIndex(0).zoom({start: st, end: en});
                //     chart_in.xAxes.getIndex(0).zoom({start: st, end: en});
                //     chart_out.xAxes.getIndex(0).zoom({start: st, end: en});
                //
                //     prevZoomPos.en = prevZoomPos.st + ev.target.xRange.end * curRange;
                //     prevZoomPos.st = prevZoomPos.st + ev.target.xRange.start * curRange;
                //
                // },
                selectended: function (ev) {
                    var range = ev.target.xRange;
                    var axis = ev.target.chart.xAxes.getIndex(0);
                    var from = axis.positionToValue(range.start);
                    var to = axis.positionToValue(range.end);

                    zoomIn(from, to);

                }
            }
        },
        "zoomOutButton": {
            "disabled": true
        }
    }, "chart_top5", "XYChart");
    chart_in = am4core.createFromConfig({

        // Chart title
        "titles": [{
            "text": "In",
            "fontSize": 18,
            "marginBottom": 10
        }],

        // Set settings and data
        "paddingRight": 40,

        // Create X axes
        "xAxes": [{
            "type": "DateAxis",
            "tooltip": {
                "disabled": true
            },
            "renderer": {
                "grid": {
                    "location": 0,
                    "strokeOpacity": 0
                },
                "minGridDistance": 60
            }
        }],

        // Create Y axes
        "yAxes": [{
            "type": "ValueAxis",
            "logarithmic": false,
            "numberFormatter": {
                "type": "NumberFormatter",
                "numberFormat": "#.#a'bps'"
            },
            "tooltip": {
                "disabled": true
            },
            "renderer": {
                "minWidth": 35
            }
        }],

        // Create series
        "series": [{
            "id": "s1",
            "type": "LineSeries",
            "dataFields": {
                "dateX": "date1",
                "valueY": "value1"
            },

            "fillOpacity": "0.3",
            "stroke": "#e59165",
            "fill": "#e59165"
        }],

        // Add cursor
        "cursor": {
            "type": "XYCursor",
            "lineY": {
                "disabled": true
            },
            "lineX": {
                "stroke": "#A01010",
                "strokeWidth": 2,

                "strokeDasharray": ""
            },
            "behavior": "selectX",
            "events": {
                "cursorpositionchanged": function (ev) {
                    // cursorPosition.x = ev.target.chart.xAxes.getIndex(0).positionToDate(ev.target.xPosition);
                    // cursorPosition.y = ev.target.chart.yAxes.getIndex(0).positionToValue(ev.target.yPosition);
                    var curDate = ev.target.chart.xAxes.getIndex(0).positionToDate(ev.target.xPosition);
                    var curValue = ev.target.chart.yAxes.getIndex(0).positionToValue(ev.target.yPosition);
                    var curRange = prevZoomPos.en - prevZoomPos.st;
                    var datalen = chart_flow.data.length / 2;
                    var cPos = (prevZoomPos.st + ev.target.xPosition * curRange) * datalen;
                    cPos = Math.round(cPos);

                    itime_lab.text = dateFormatter.format(curDate, global_datetime_format);
                    in_tlab.text = "Today(" + bps_to_gbps(data_in[cPos]["value1"]) + ")";

                    curPos.x = ev.target.xPosition;
                    curPos.y = ev.target.yPosition;

                    curFlow.x = curPos.x * chart_flow.cursor.maxRight;
                    curTop5.x = curPos.x * chart_top5.cursor.maxRight;
                    curOut.x = curPos.x * chart_out.cursor.maxRight;
                    curTop5.y = curPos.y;
                    curFlow.y = curPos.y;
                    curOut.y = curPos.y;

                    chart_flow.cursor.triggerMove(curFlow, true);
                    chart_top5.cursor.triggerMove(curTop5, true);
                    chart_out.cursor.triggerMove(curOut, true);
                },
                // "zoomended": function (ev) {
                //     var curRange = prevZoomPos.en - prevZoomPos.st;
                //     var st = prevZoomPos.st + ev.target.xRange.start * curRange;
                //     var en = prevZoomPos.st + ev.target.xRange.end * curRange;
                //     chart_top5.xAxes.getIndex(0).zoom({start: st, end: en});
                //     chart_in.xAxes.getIndex(0).zoom({start: st, end: en});
                //     chart_out.xAxes.getIndex(0).zoom({start: st, end: en});
                //
                //     prevZoomPos.en = prevZoomPos.st + ev.target.xRange.end * curRange;
                //     prevZoomPos.st = prevZoomPos.st + ev.target.xRange.start * curRange;
                //
                // },
                selectended: function (ev) {
                    var range = ev.target.xRange;
                    var axis = ev.target.chart.xAxes.getIndex(0);
                    var from = axis.positionToValue(range.start);
                    var to = axis.positionToValue(range.end);

                    zoomIn(from, to);

                }
            }
        },
        "zoomOutButton": {
            "disabled": true
        }
    }, "chart_in", "XYChart");
    chart_out = am4core.createFromConfig({

        // Chart title
        "titles": [{
            "text": "Out",
            "fontSize": 18,
            "marginBottom": 10
        }],

        // Set settings and data
        "paddingRight": 40,

        // Create X axes
        "xAxes": [{
            "type": "DateAxis",
            "tooltip": {
                "disabled": true
            },
            "renderer": {
                "grid": {
                    "location": 0,
                    "strokeOpacity": 0
                },
                "minGridDistance": 60
            }
        }],

        // Create Y axes
        "yAxes": [{
            "type": "ValueAxis",
            "logarithmic": false,
            "numberFormatter": {
                "type": "NumberFormatter",
                "numberFormat": "#.#a'bps'"
            },
            "tooltip": {
                "disabled": true
            },
            "renderer": {
                "minWidth": 35
            }
        }],

        // Create series
        "series": [{
            "id": "s1",
            "type": "LineSeries",
            "dataFields": {
                "dateX": "date1",
                "valueY": "value1"
            },

            "fillOpacity": "0.3",
            "stroke": "#e59165",
            "fill": "#e59165"
        }],

        // Add cursor
        "cursor": {
            "behavior": "selectX",
            "type": "XYCursor",
            "lineY": {
                "disabled": true
            },
            "lineX": {
                "stroke": "#A01010",
                "strokeWidth": 2,

                "strokeDasharray": ""
            },
            "events": {
                "cursorpositionchanged": function (ev) {
                    // cursorPosition.x = ev.target.chart.xAxes.getIndex(0).positionToDate(ev.target.xPosition);
                    // cursorPosition.y = ev.target.chart.yAxes.getIndex(0).positionToValue(ev.target.yPosition);
                    var curDate = ev.target.chart.xAxes.getIndex(0).positionToDate(ev.target.xPosition);
                    var curValue = ev.target.chart.yAxes.getIndex(0).positionToValue(ev.target.yPosition);
                    var curRange = prevZoomPos.en - prevZoomPos.st;
                    var datalen = chart_flow.data.length / 2;
                    var cPos = (prevZoomPos.st + ev.target.xPosition * curRange) * datalen;
                    cPos = Math.round(cPos);

                    otime_lab.text = dateFormatter.format(curDate, global_datetime_format);
                    out_tlab.text = "Today(" + bps_to_gbps(data_out[cPos]["value1"]) + ")";

                    curPos.x = ev.target.xPosition;
                    curPos.y = ev.target.yPosition;

                    curFlow.x = curPos.x * chart_flow.cursor.maxRight;
                    curTop5.x = curPos.x * chart_top5.cursor.maxRight;
                    curIn.x = curPos.x * chart_in.cursor.maxRight;
                    curTop5.y = curPos.y;
                    curIn.y = curPos.y;
                    curFlow.y = curPos.y;

                    chart_flow.cursor.triggerMove(curFlow, true);
                    chart_top5.cursor.triggerMove(curTop5, true);
                    chart_in.cursor.triggerMove(curIn, true);
                },
                // "zoomended": function(ev) {
                //     var curRange = prevZoomPos.en - prevZoomPos.st;
                //     var st = prevZoomPos.st + ev.target.xRange.start * curRange;
                //     var en = prevZoomPos.st + ev.target.xRange.end * curRange;
                //     chart_top5.xAxes.getIndex(0).zoom({start: st, end: en});
                //     chart_in.xAxes.getIndex(0).zoom({start: st, end: en});
                //     chart_flow.xAxes.getIndex(0).zoom({start: st, end: en});
                //
                //     prevZoomPos.en = prevZoomPos.st + ev.target.xRange.end * curRange;
                //     prevZoomPos.st = prevZoomPos.st + ev.target.xRange.start * curRange;
                //
                // },
                selectended: function (ev) {
                    var range = ev.target.xRange;
                    var axis = ev.target.chart.xAxes.getIndex(0);
                    var from = axis.positionToValue(range.start);
                    var to = axis.positionToValue(range.end);

                    zoomIn(from, to);
                }
            }
        },
        "zoomOutButton": {
            "disabled": true
        }
    }, "chart_out", "XYChart");
}

today();

function zoomIn(from, to) {
    if (!from) return;
    var interval = Math.floor((to - from) / defaultZoomPoints / 1000);
    interval = interval == 0 ? 1 : interval;

    if (to - from < interval * 20 * 1000) return;

    if (interval < 60) {
        interval = interval + 's';
    } else if (interval < 60 * 60) {
        interval = Math.floor(interval / 60) + 'm';
    } else {
        interval = Math.floor(interval / 60 / 60) + 'h';
    }

    dispose();

    prevZoomPos = {
        st: 0,
        en: 1
    };
    create();
    setDefault();

    callAPI("http://192.168.10.133:60080/api/visualize/Overview-Flow-Count", from, to, interval, "flow", "t");
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-Protocol-Top5", from, to, interval, "top5");
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-NetFlow-In", from, to, interval, "in", "t");
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-NetFlow-Out", from, to, interval, "out", "t");
}

function render_flow(response, day) {
    var res_flow = JSON.parse(response).aggregations.q.buckets['*'].time_buckets.buckets;

    if (day == "t") {
        for (var i = 0; i < res_flow.length; i++) {
            data_flow.push({
                date1: new Date(res_flow[i].key),
                value1: res_flow[i].count.value
            });
        }
        create_axis_break(chart_flow.yAxes.getIndex(0), data_flow, 'value1');
    } else {
        for (var i = 0; i < res_flow.length; i++) {
            data_flow.push({
                date2: new Date(res_flow[i].key),
                value2: res_flow[i].count.value
            });
        }
        create_axis_break(chart_flow.yAxes.getIndex(0), data_flow, 'value2');
    }
    // console.log($.extend(true, {}, data_flow));
    chart_flow.data = data_flow;
    ftime_lab = chart_flow.createChild(am4core.Label);
    ftime_lab.text = "";
    ftime_lab.fontSize = 15;
    ftime_lab.align = "center";
    ftime_lab.isMeasured = false;
    ftime_lab.x = 80;
    ftime_lab.y = 30;
    flow_tlab = chart_flow.createChild(am4core.Label);
    flow_tlab.text = "Today";
    flow_tlab.fontSize = 15;
    flow_tlab.align = "center";
    flow_tlab.isMeasured = false;
    flow_tlab.x = 80;
    flow_tlab.y = 50;
    flow_ylab = chart_flow.createChild(am4core.Label);
    flow_ylab.text = "";
    flow_ylab.fontSize = 15;
    flow_ylab.align = "center";
    flow_ylab.isMeasured = false;
    flow_ylab.x = 80;
    flow_ylab.y = 70;

    chart_flow.invalidateData();
}

function render_top5(response, day) {
    response = JSON.parse(response);
    var res_top5 = response.aggregations.q.buckets['*']['L7_PROTO_NAME'].buckets;
    var graph = res_top5[0].time_buckets.buckets;
    var all_values = [];
    var interval = graph.length > 0 && graph[0].length >= 2 ? (graph[0][1].key - graph[0][0].key) / 1000 : default_interval;

    for (var j = 0; j < graph.length; j++) {
        var timedata = {};
        timedata["date"] = new Date(graph[j].key);
        for (var i = 0; i < res_top5.length; i++) {
            timedata["value" + (i + 1)] = bytes_to_bps(res_top5[i].time_buckets.buckets[j]["sum(IN_BYTES)"].value, interval);
            all_values.push({"value": timedata["value" + (i + 1)]});
        }
        data_top5.push(timedata);
    }

    create_axis_break(chart_top5.yAxes.getIndex(0), all_values, 'value');
    chart_top5.data = data_top5;
    chart_top5.series = [];
    var color;
    for (var i = 0; i < res_top5.length; i++) {
        color = randomColor({
            luminosity: 'bright',
            hue: 'hux'
        });
        var series = chart_top5.series.push(new am4charts.LineSeries());
        series.name = res_top5[i].key;
        series.dataFields.dateX = "date";
        series.dataFields.valueY = "value" + (i + 1);
        series.fillOpacity = "0.3";
        series.stroke = color;
        series.fill = color;
    }
    ttime_lab = chart_top5.createChild(am4core.Label);
    ttime_lab.text = "";
    ttime_lab.fontSize = 15;
    ttime_lab.align = "center";
    ttime_lab.isMeasured = false;
    ttime_lab.x = 130;
    ttime_lab.y = 30;
    top5_tlab = chart_top5.createChild(am4core.Label);
    top5_tlab.text = "(Unknown)";
    top5_tlab.fontSize = 15;
    top5_tlab.align = "center";
    top5_tlab.isMeasured = false;
    top5_tlab.x = 130;
    top5_tlab.y = 50;
    top5_tlab1 = chart_top5.createChild(am4core.Label);
    top5_tlab1.text = "(Gentrice)";
    top5_tlab1.fontSize = 15;
    top5_tlab1.align = "center";
    top5_tlab1.isMeasured = false;
    top5_tlab1.x = 130;
    top5_tlab1.y = 70;
    top5_tlab2 = chart_top5.createChild(am4core.Label);
    top5_tlab2.text = "(DNS)";
    top5_tlab2.fontSize = 15;
    top5_tlab2.align = "center";
    top5_tlab2.isMeasured = false;
    top5_tlab2.x = 130;
    top5_tlab2.y = 90;
    top5_tlab3 = chart_top5.createChild(am4core.Label);
    top5_tlab3.text = "(Syslog)";
    top5_tlab3.fontSize = 15;
    top5_tlab3.align = "center";
    top5_tlab3.isMeasured = false;
    top5_tlab3.x = 130;
    top5_tlab3.y = 110;
    top5_tlab4 = chart_top5.createChild(am4core.Label);
    top5_tlab4.text = "(SSL)";
    top5_tlab4.fontSize = 15;
    top5_tlab4.align = "center";
    top5_tlab4.isMeasured = false;
    top5_tlab4.x = 130;
    top5_tlab4.y = 130;
}

function create_axis_break(axis, arr, key) {
    axis.axisBreaks.clear();

    arr = arr.filter(function (a) {
        return a[key];
    });
    arr = arr.sort(function (a, b) {
        return (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0);
    });

    var total = arr[arr.length - 1][key] - arr[0][key];

    for (var i = 0; i < arr.length - 1; i++) {
        var diff = arr[i + 1][key] - arr[i][key];
        if ((diff / total) >= axisBreakThreshold) {
            axis.min = 0;
            axis.max = arr[arr.length - 1][key] * 1.02;
            axis.strictMinMax = true;

            var axisBreak = axis.axisBreaks.create();
            axisBreak.startValue = arr[i][key];
            axisBreak.endValue = arr[i + 1][key];
            axisBreak.breakSize = 0.005;

            var hoverState = axisBreak.states.create("hover");
            hoverState.properties.breakSize = 1;
            hoverState.properties.opacity = 0.1;
            hoverState.transitionDuration = 1500;

            axisBreak.defaultState.transitionDuration = 1000;
        }
    }
}

function render_in(response, day) {
    response = JSON.parse(response);
    var res_in = response.aggregations.q.buckets['*'].time_buckets.buckets;
    var interval = res_in.length >= 2 ? (res_in[1].key - res_in[0].key) / 1000 : default_interval;
    if (day == "t") {
        for (var i = 0; i < res_in.length; i++) {
            data_in.push({
                date1: new Date(res_in[i].key),
                value1: bytes_to_bps(res_in[i]["sum(IN_BYTES)"].value, interval)
            });
        }
        create_axis_break(chart_in.yAxes.getIndex(0), data_in, 'value1');
    } else {
        for (var i = 0; i < res_in.length; i++) {
            data_in.push({
                date2: new Date(res_in[i].key),
                value2: bytes_to_bps(res_in[i]["sum(IN_BYTES)"].value, interval)
            });
        }
        create_axis_break(chart_in.yAxes.getIndex(0), data_in, 'value2');
    }

    chart_in.data = data_in;
    itime_lab = chart_in.createChild(am4core.Label);
    itime_lab.text = "";
    itime_lab.fontSize = 15;
    itime_lab.align = "center";
    itime_lab.isMeasured = false;
    itime_lab.x = 130;
    itime_lab.y = 30;
    in_tlab = chart_in.createChild(am4core.Label);
    in_tlab.text = "Today";
    in_tlab.fontSize = 15;
    in_tlab.align = "center";
    in_tlab.isMeasured = false;
    in_tlab.x = 130;
    in_tlab.y = 50;
    in_ylab = chart_in.createChild(am4core.Label);
    in_ylab.text = "";
    in_ylab.fontSize = 15;
    in_ylab.align = "center";
    in_ylab.isMeasured = false;
    in_ylab.x = 130;
    in_ylab.y = 70;
}

function render_out(response, day) {
    response = JSON.parse(response);
    var res_out = response.aggregations.q.buckets['*'].time_buckets.buckets;
    var interval = res_out.length >= 2 ? (res_out[1].key - res_out[0].key) / 1000 : default_interval;
    if (day == "t") {
        for (var i = 0; i < res_out.length; i++) {
            data_out.push({
                date1: new Date(res_out[i].key),
                value1: bytes_to_bps(res_out[i]["sum(OUT_BYTES)"].value, interval)
            });
        }
        create_axis_break(chart_out.yAxes.getIndex(0), data_out, 'value1');
    } else {
        for (var i = 0; i < res_out.length; i++) {
            data_out.push({
                date2: new Date(res_out[i].key),
                value2: bytes_to_bps(res_out[i]["sum(OUT_BYTES)"].value, interval)
            });
        }
        create_axis_break(chart_out.yAxes.getIndex(0), data_out, 'value2');
    }
    chart_out.data = data_out;

    otime_lab = chart_out.createChild(am4core.Label);
    otime_lab.text = "";
    otime_lab.fontSize = 15;
    otime_lab.align = "center";
    otime_lab.isMeasured = false;
    otime_lab.x = 130;
    otime_lab.y = 30;
    out_tlab = chart_out.createChild(am4core.Label);
    out_tlab.text = "Today";
    out_tlab.fontSize = 15;
    out_tlab.align = "center";
    out_tlab.isMeasured = false;
    out_tlab.x = 130;
    out_tlab.y = 50;
    out_ylab = chart_out.createChild(am4core.Label);
    out_ylab.text = "";
    out_ylab.fontSize = 15;
    out_ylab.align = "center";
    out_ylab.isMeasured = false;
    out_ylab.x = 130;
    out_ylab.y = 70;
}

function setDefault() {
    data_flow = [];
    data_top5 = [];
    data_in = [];
    data_out = [];
    // chart_flow.xAxes.getIndex(0).zoom({start: prevZoomPos.st, end: prevZoomPos.en});
    // chart_top5.xAxes.getIndex(0).zoom({start: prevZoomPos.st, end: prevZoomPos.en});
    // chart_in.xAxes.getIndex(0).zoom({start: prevZoomPos.st, end: prevZoomPos.en});
    // chart_out.xAxes.getIndex(0).zoom({start: prevZoomPos.st, end: prevZoomPos.en});
    // chart_out.xAxes.getIndex(0).zoom({start: prevZoomPos.st, end: prevZoomPos.en});
}

function callAPI(apiurl, from, to, interval, graph, day) {
    if (env == 'test') {
        var sample_json = {
            "took": 34,
            "timed_out": false,
            "_shards": {
                "total": 4,
                "successful": 4,
                "skipped": 0,
                "failed": 0
            },
            "hits": {
                "total": 36942,
                "max_score": 0.0,
                "hits": []
            },
            "aggregations": {
                "q": {
                    "meta": {
                        "type": "split"
                    },
                    "buckets": {
                        "*": {
                            "doc_count": 36942,
                            "time_buckets": {
                                "meta": {
                                    "type": "time_buckets"
                                },
                                "buckets": []
                            },
                            "L7_PROTO_NAME": {
                                "meta": {
                                    "type": "split"
                                },
                                "doc_count_error_upper_bound": 336,
                                "sum_other_doc_count": 14163,
                                "buckets": [
                                    {
                                        "key": "Gentrice-L2TP",
                                        "doc_count": 13802,
                                        "time_buckets": {
                                            "meta": {
                                                "type": "time_buckets"
                                            },
                                            "buckets": []
                                        }
                                    },
                                    {
                                        "key": "Syslog",
                                        "doc_count": 9529,
                                        "time_buckets": {
                                            "meta": {
                                                "type": "time_buckets"
                                            },
                                            "buckets": []
                                        }
                                    },
                                    {
                                        "key": "SSL",
                                        "doc_count": 9529,
                                        "time_buckets": {
                                            "meta": {
                                                "type": "time_buckets"
                                            },
                                            "buckets": []
                                        }
                                    },
                                    {
                                        "key": "DNS",
                                        "doc_count": 9529,
                                        "time_buckets": {
                                            "meta": {
                                                "type": "time_buckets"
                                            },
                                            "buckets": []
                                        }
                                    },
                                    {
                                        "key": "Unknown",
                                        "doc_count": 9529,
                                        "time_buckets": {
                                            "meta": {
                                                "type": "time_buckets"
                                            },
                                            "buckets": []
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        };

        var ts;
        if (interval.indexOf('m') > -1) {
            ts = 60 * parseInt(interval.substr(0, interval.length - 1)) * 1000;
        } else if (interval.indexOf('h') > -1) {
            ts = 60 * 60 * parseInt(interval.substr(0, interval.length - 1)) * 1000;
        } else {
            ts = parseInt(interval.substr(0, interval.length - 1)) * 1000;
        }
        loaded = true;

        for (var i = from; i <= to; i += ts) {
            var y = Math.random() * 200000;
            if (y >= 190000) y = y * 10;
            if (graph == "flow") {
                // console.log(i, parseInt(i/1000));
                sample_json.aggregations.q.buckets['*'].time_buckets.buckets.push({
                    "key_as_string": parseInt(i / 1000).toString(),
                    "key": i,
                    "doc_count": y,
                    "count": {
                        "value": parseFloat(y)
                    }
                });

            } else if (graph == "top5") {
                for (var j = 0; j < 5; j++) {
                    y = Math.random() * 200000;
                    if (y >= 190000) y = y * 10;
                    sample_json.aggregations.q.buckets['*']['L7_PROTO_NAME'].buckets[j].time_buckets.buckets.push({
                        "key_as_string": (i / 1000).toString(),
                        "key": i,
                        "doc_count": y,
                        "sum(IN_BYTES)": {
                            "value": parseFloat(y)
                        }
                    });
                }
            } else if (graph == "in") {
                sample_json.aggregations.q.buckets['*'].time_buckets.buckets.push({
                    "key_as_string": (i / 1000).toString(),
                    "key": i,
                    "doc_count": y,
                    "sum(IN_BYTES)": {
                        "value": parseFloat(y)
                    }
                });
            } else if (graph == "out") {
                sample_json.aggregations.q.buckets['*'].time_buckets.buckets.push({
                    "key_as_string": (i / 1000).toString(),
                    "key": i,
                    "doc_count": y,
                    "sum(OUT_BYTES)": {
                        "value": parseFloat(y)
                    }
                });
            }
        }

        var response = JSON.stringify(sample_json);
        
        if (graph == "flow") {
            render_flow(response, day);
        }
        else if (graph == "top5") {
            render_top5(response, day);
        }
        else if (graph == "in") {
            render_in(response, day);
        }
        else if (graph == "out") {
            render_out(response, day);
        }
    } else {
        $.ajax({
            type: "GET",
            url: "api.php",
            data: {
                apiurl: apiurl,
                from: from,
                to: to,
                interval: interval
            },
            success: function (response) {
                if (graph == "flow") {
                    render_flow(response, day);
                }
                else if (graph == "top5") {
                    render_top5(response, day);
                }
                else if (graph == "in") {
                    render_in(response, day);
                }
                else if (graph == "out") {
                    render_out(response, day);
                }
            }
        });
    }
}

function thisweek() {
    console.log("this week view");
    // prevZoomPos = {
    //     st: 0,
    //     en: 1
    // };
    dispose();
    create();
    // setDefault();
    var interval = "1h";
    var tlday = new Date();
    var tto = tlday.getTime();
    tlday.setDate(tlday.getDate() - 7);
    var lto = tlday.getTime();
    var tfday = new Date();
    tfday.setHours(0, 0, 0, 0);
    var day = tfday.getDay(),
        diff = tfday.getDate() - day + (day == 0 ? -6 : 1);
    tfday.setDate(diff);
    var tfrom = tfday.getTime();
    tfday.setDate(tfday.getDate() - 7);
    var lfrom = tfday.getTime();
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-Flow-Count", tfrom, tto, interval, "flow");
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-Protocol-Top5", tfrom, tto, interval, "top5");
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-NetFlow-In", tfrom, tto, interval, "in");
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-NetFlow-Out", tfrom, tto, interval, "out");
}

function today() {
    // prevZoomPos = {
    //     st: 0,
    //     en: 1
    // };
    dispose();
    create();
    setDefault();
    var interval = "2m";
    var tday = new Date();
    var tto = tday.getTime();
    var lto = new Date(tto - (24 * 60 * 60 * 1000));
    lto = lto.getTime();
    tday.setHours(0, 0, 0, 0);
    var tfrom = tday.getTime();
    var lfrom = new Date(tfrom - (24 * 60 * 60 * 1000));
    var lfrom = lfrom.getTime();
    console.log("today", tday, tto, tday);

    callAPI("http://192.168.10.133:60080/api/visualize/Overview-Flow-Count", tfrom, tto, interval, "flow", "t");
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-Flow-Count", lfrom, lto, interval, "flow", "y");
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-Protocol-Top5", tfrom, tto, interval, "top5");
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-NetFlow-In", tfrom, tto, interval, "in", "t");
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-NetFlow-In", lfrom, lto, interval, "in", "y");
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-NetFlow-Out", tfrom, tto, interval, "out", "t");
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-NetFlow-Out", lfrom, lto, interval, "out", "y");
}

function last24h() {
    // prevZoomPos = {
    //     st: 0,
    //     en: 1
    // };
    dispose();
    create();
    setDefault();
    console.log("last 24 hours view");
    var interval = "10m";
    var tto = new Date();
    var tfrom = new Date(tto.getTime() - (24 * 60 * 60 * 1000));
    var lto = new Date(tfrom);
    var lfrom = new Date(lto.getTime() - (24 * 60 * 60 * 1000));
    tto = tto.getTime();
    tfrom = tfrom.getTime();
    lto = lto.getTime();
    lfrom = lfrom.getTime();
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-Flow-Count", tfrom, tto, interval, "flow", "t");
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-Protocol-Top5", tfrom, tto, interval, "top5");
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-NetFlow-In", tfrom, tto, interval, "in", "t");
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-NetFlow-Out", tfrom, tto, interval, "out", "t");
}

function last12h() {
    // prevZoomPos = {
    //     st: 0,
    //     en: 1
    // };
    dispose();
    create();
    setDefault();
    console.log("last 12 hours view");
    var interval = "5m";
    var tto = new Date();
    var tfrom = new Date(tto.getTime() - (12 * 60 * 60 * 1000));
    var lto = new Date(tfrom);
    var lfrom = new Date(lto.getTime() - (12 * 60 * 60 * 1000));
    tto = tto.getTime();
    tfrom = tfrom.getTime();
    lto = lto.getTime();
    lfrom = lfrom.getTime();
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-Flow-Count", tfrom, tto, interval, "flow", "t");
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-Protocol-Top5", tfrom, tto, interval, "top5");
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-NetFlow-In", tfrom, tto, interval, "in", "t");
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-NetFlow-Out", tfrom, tto, interval, "out", "t");
}

function last4h() {
    // prevZoomPos = {
    //     st: 0,
    //     en: 1
    // };
    dispose();
    create();
    setDefault();
    console.log("last 4 hours view");
    var interval = "1m";
    var tto = new Date();
    var tfrom = new Date(tto.getTime() - (4 * 60 * 60 * 1000));
    var lto = new Date(tfrom);
    var lfrom = new Date(lto.getTime() - (4 * 60 * 60 * 1000));
    tto = tto.getTime();
    tfrom = tfrom.getTime();
    lto = lto.getTime();
    lfrom = lfrom.getTime();
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-Flow-Count", tfrom, tto, interval, "flow", "t");
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-Protocol-Top5", tfrom, tto, interval, "top5");
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-NetFlow-In", tfrom, tto, interval, "in", "t");
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-NetFlow-Out", tfrom, tto, interval, "out", "t");
}

function last1h() {
    prevZoomPos = {
        st: 0,
        en: 1
    };
    dispose();
    create();
    setDefault();
    console.log("last 1 hour view");
    var interval = "10s";
    var tto = new Date();
    var tfrom = new Date(tto.getTime() - (60 * 60 * 1000));
    var lto = new Date(tfrom);
    var lfrom = new Date(lto.getTime() - (60 * 60 * 1000));
    tto = tto.getTime();
    tfrom = tfrom.getTime();
    lto = lto.getTime();
    lfrom = lfrom.getTime();
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-Flow-Count", tfrom, tto, interval, "flow", "t");
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-Protocol-Top5", tfrom, tto, interval, "top5");
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-NetFlow-In", tfrom, tto, interval, "in", "t");
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-NetFlow-Out", tfrom, tto, interval, "out", "t");
}

function last15m() {
    // prevZoomPos = {
    //     st: 0,
    //     en: 1
    // };
    dispose();
    create();
    setDefault();
    console.log("last 15 minutes view");
    var interval = "2s";
    var tto = new Date();
    var tfrom = new Date(tto.getTime() - (15 * 60 * 1000));
    var lto = new Date(tfrom);
    var lfrom = new Date(lto.getTime() - (15 * 60 * 1000));
    tto = tto.getTime();
    tfrom = tfrom.getTime();
    lto = lto.getTime();
    lfrom = lfrom.getTime();
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-Flow-Count", tfrom, tto, interval, "flow", "t");
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-Protocol-Top5", tfrom, tto, interval, "top5");
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-NetFlow-In", tfrom, tto, interval, "in", "t");
    callAPI("http://192.168.10.133:60080/api/visualize/Overview-NetFlow-Out", tfrom, tto, interval, "out", "t");
}
