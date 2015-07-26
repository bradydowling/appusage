var defaultOptions = {
    scaleBeginAtZero: true,
    scaleShowGridLines: true,
    scaleGridLineColor: "rgba(0,0,0,.05)",
    scaleGridLineWidth: 1,
    scaleShowHorizontalLines: true,
    scaleShowVerticalLines: true,
    barShowStroke: true,
    barStrokeWidth: 2,
    barValueSpacing: 5,
    barDatasetSpacing: 1,
    legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
};

function showGraphs(file) {
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event) {
        var csv = event.target.result;
        var fileData = $.csv.toArrays(csv);
        var totalDailyUsage = getTotalDailyUsage(fileData);
        buildUsageChart(totalDailyUsage, "#myChart", defaultOptions);
    };
    reader.onerror = function() {
        alert('Unable to read ' + file.fileName);
    };
}


function buildUsageChart(parsedData, canvasID, options) {
    var chartData = {
        labels: parsedData.days,
        datasets: [{
            label: "Total Phone Usage Each Day",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: parsedData.minutes
        }]
    };

    // var ctx = document.getElementById("myChart").getContext("2d");
    var ctx = $(canvasID).get(0).getContext("2d");
    // Actually show the chart
    var thisChart = new Chart(ctx).Bar(chartData, defaultOptions);
}

function getTotalDailyUsage(fileData) {
    var chart = {};
    var minutesUsedEachDay = [];
    var thisDay = fileData[1][1].slice(0, 2);
    var secondsUsedToday = 0;
    var days = [];
    for (var i = 1; i < fileData.length; i++) {
        var thisRow = fileData[i];
        var theDate = thisRow[1];
        var dayInRow = theDate.slice(0, 2);
        var secondsInRow = parseInt(thisRow[3]);
        var sameDay = dayInRow === thisDay;
        if (sameDay) {
            // add the seconds used to the last one
            secondsUsedToday += secondsInRow;
        }
        else { //newDay
            // overwrite the day
            thisDay = dayInRow;
            days.push(dayInRow);
            // Store today's seconds
            minutesUsedEachDay.push((secondsUsedToday / 60));
            secondsUsedToday = secondsInRow;
        }
    }
    chart.days = days;
    chart.minutes = minutesUsedEachDay;
    return chart;
}

function getDailyUsageByApp(fileData) {
    var apps = {};
    var thisApp;

    var chart = {};
    var minutesUsedEachDay = [];
    var thisDay = fileData[1][1].slice(0, 2);
    var secondsUsedToday = 0;
    var days = [];
    for (var i = 1; i < fileData.length; i++) {
        var thisRow = fileData[i];
        thisApp = thisRow[0];

        var theDate = thisRow[1];
        var dayInRow = theDate.slice(0, 2);
        var secondsInRow = parseInt(thisRow[3]);
        var sameDay = dayInRow === thisDay;
        if (sameDay) {
            // add the seconds used to the last one
            secondsUsedToday += secondsInRow;
        }
        else { //newDay
            // overwrite the day
            thisDay = dayInRow;
            days.push(dayInRow);
            // Store today's seconds
            minutesUsedEachDay.push((secondsUsedToday / 60));
            secondsUsedToday = secondsInRow;
        }
    }
    chart.days = days;
    chart.minutes = minutesUsedEachDay;
    return chart;
}