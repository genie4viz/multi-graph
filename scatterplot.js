d3.csv("movies.csv").then(function (dataset) {

    dataset.forEach(function (d) {
        d.Rating = +d.Rating;
        d.WinsNoms = +d.WinsNoms;
        d.IsGoodRating = +d.IsGoodRating;
        d.Budget = +d.Budget;
        d.Votes = +d.Votes;
    });
    var w = 600;
    var h = 400;
    var padding = 40;

    //Define X Scale
    var xScaleRating = d3.scaleLinear()
        .domain([0, d3.max(dataset, function (d) {
            return d.Rating;
        })]).range([padding, w - padding * 2]);    

    //Define Y Scale
    var yScaleWinsNoms = d3.scaleLinear()
        .domain([0, d3.max(dataset, function (d) {
            return d.WinsNoms;
        })]).range([h - padding, padding]);
    var yScaleBudget = d3.scaleLinear()
        .domain([0, d3.max(dataset, function (d) {            
            return d.Budget;
        })]).range([h - padding, padding]);
    var yScaleVotes = d3.scaleLinear()
        .domain([0, d3.max(dataset, function (d) {
            return d.Votes;
        })]).range([h - padding, padding]);
    var yScaleWinsNoms_log = d3.scaleLog()
        .domain([1, d3.max(dataset, function (d) {            
            return d.WinsNoms != 0 ? d.WinsNoms : 1;
        })]).range([h - padding, padding]);        
    var yScaleWinsNoms_sqrt = d3.scaleSqrt()
        .domain([0, d3.max(dataset, function (d) {
            return d.WinsNoms;
        })]).range([h - padding, padding]);

    var szScaleWinsNoms = d3.scaleLinear()
        .domain([0, d3.max(dataset, function (d) {
            return d.WinsNoms;
        })]).range([1, 100]);
        
    // Define X axis
    var xAxisRating = d3.axisBottom(xScaleRating).ticks(10);
  
    //Define Y axis
    var yAxisWinsNoms = d3.axisLeft(yScaleWinsNoms).ticks(10);
    var yAxisVotes = d3.axisLeft(yScaleVotes).ticks(10);
    var yAxisBudget = d3.axisLeft(yScaleBudget).ticks(10);
    var yAxisWinsNoms_log = d3.axisLeft(yScaleWinsNoms_log).ticks(10);
    var yAxisWinsNoms_sqrt = d3.axisLeft(yScaleWinsNoms_sqrt).ticks(10);

    //////////////////////////////////////////////////////////////// CHART 1/////////////////////////////////////////////////////////////////

    //Create SVG element
    var svg1 = d3.select("body").append("svg").attr("width", w).attr("height", h);
    //draw points
    svg1.selectAll(".point").data(dataset)
        .enter().append("path").attr("class", "point")
        .attr("d", d3.symbol().size(40).type(d => d.IsGoodRating == 0 ? d3.symbolCircle : d3.symbolCross))
        .attr("fill", "none")
        .attr("stroke", d => d.IsGoodRating == 0 ? "red" : "blue")
        .attr('transform', function (d) {
            return "translate(" + xScaleRating(d.Rating) + "," + yScaleWinsNoms(d.WinsNoms) + ")";
        });

    //draw X axis
    svg1.append("g").attr("class", "axis").attr("transform", "translate(0," + (h - padding) + ")").call(xAxisRating);
    //draw Y axis
    svg1.append("g").attr("class", "axis").attr("transform", "translate(" + padding + ",0)").call(yAxisWinsNoms);
    // add label
    svg1.append("text").attr("x", (w / 2)).attr("y", h - 10).attr("text-anchor", "middle").text("Rating");
    svg1.append("text").attr("x", padding).attr("y", padding).attr("text-anchor", "middle").text("Wins+Noms");
    //add title
    svg1.append("text").attr("x", (w / 2)).attr("y", padding).attr("text-anchor", "middle").text("Wins+Nominations vs. Rating");
    //add legend
    var legendRW = svg1.selectAll(".legendrw").data([0, 1]).enter().append("g")
        .attr("class", "legendrw")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });

    legendRW.append("path").style("fill", "none")
        .style("stroke", d => d == 0 ? "blue" : "red")
        .attr("d", d3.symbol().size(40).type(d => d == 0 ? d3.symbolCross : d3.symbolCircle))
        .attr("transform", function (d, i) {
            return "translate(" + (w - 10) + "," + 47 + ")";
        });
    legendRW.append("text")
        .attr("x", w - 17).attr("y", 50).attr("font-size", 10).style("text-anchor", "end")
        .text(d => d == 0 ? "Good Rating" : "Bad Rating");

    ////////////////////////////////////////////////////////////////// CHART 2////////////////////////////////////////////////////////////////    

    //Create SVG element
    var svg2 = d3.select("body").append("svg").attr("width", w).attr("height", h);
    //draw points
    svg2.selectAll(".point").data(dataset)
        .enter().append("path").attr("class", "point")
        .attr("d", d3.symbol().size(40).type(d => d.IsGoodRating == 0 ? d3.symbolCircle : d3.symbolCross))
        .attr("fill", "none")
        .attr("stroke", d => d.IsGoodRating == 0 ? "red" : "blue")
        .attr('transform', function (d) {
            return "translate(" + xScaleRating(d.Rating) + "," + yScaleBudget(d.Budget) + ")";
        });

    //draw X axis
    svg2.append("g").attr("class", "axis").attr("transform", "translate(0," + (h - padding) + ")").call(xAxisRating);
    //draw Y axis
    svg2.append("g").attr("class", "axis").attr("transform", "translate(" + 70 + ",0)").call(yAxisBudget);
    // add label
    svg2.append("text").attr("x", (w / 2)).attr("y", h - 10).attr("text-anchor", "middle").text("Rating");
    svg2.append("text").attr("x", padding).attr("y", padding).attr("text-anchor", "middle").text("Budget");
    //add title
    svg2.append("text").attr("x", (w / 2)).attr("y", padding).attr("text-anchor", "middle").text("Budget vs. Rating");
    //add legend
    var legendRB = svg2.selectAll(".legendrb").data([0, 1]).enter().append("g")
        .attr("class", "legendrb")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });

    legendRB.append("path").style("fill", "none")
        .style("stroke", d => d == 0 ? "blue" : "red")
        .attr("d", d3.symbol().size(40).type(d => d == 0 ? d3.symbolCross : d3.symbolCircle))
        .attr("transform", function (d, i) {
            return "translate(" + (w - 10) + "," + 47 + ")";
        });
    legendRB.append("text")
        .attr("x", w - 17).attr("y", 50).attr("font-size", 10).style("text-anchor", "end")
        .text(d => d == 0 ? "Good Rating" : "Bad Rating");

    ////////////////////////////////////////////////////////////////// CHART 3////////////////////////////////////////////////////////////////

    var svg3 = d3.select("body").append("svg").attr("width", w).attr("height", h);
    //draw points
    svg3.selectAll(".point").data(dataset)
        .enter().append("path").attr("class", "point")
        .attr("d", d3.symbol().size(d => szScaleWinsNoms(d.WinsNoms)).type(d => d.IsGoodRating == 0 ? d3.symbolCircle : d3.symbolCross))
        .attr("fill", "none")
        .attr("stroke", d => d.IsGoodRating == 0 ? "red" : "blue")
        .attr('transform', function (d) {
            return "translate(" + xScaleRating(d.Rating) + "," + yScaleVotes(d.Votes) + ")";
        });

    //draw X axis
    svg3.append("g").attr("class", "axis").attr("transform", "translate(0," + (h - padding) + ")").call(xAxisRating);
    //draw Y axis
    svg3.append("g").attr("class", "axis").attr("transform", "translate(" + 50 + ",0)").call(yAxisVotes);
    // add label
    svg3.append("text").attr("x", (w / 2)).attr("y", h - 10).attr("text-anchor", "middle").text("Rating");
    svg3.append("text").attr("x", padding).attr("y", padding - 10).attr("text-anchor", "middle").text("Votes");
    //add title
    svg3.append("text").attr("x", (w / 2)).attr("y", padding).attr("text-anchor", "middle").text("Votes vs. Rating sized by Wins+Nominations");
    //draw legend
    var legendRV = svg3.selectAll(".legendrv").data([0, 1]).enter().append("g")
        .attr("class", "legendrv")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });
    legendRV.append("path").style("fill", "none")
        .style("stroke", d => d == 0 ? "blue" : "red")
        .attr("d", d3.symbol().size(40).type(d => d == 0 ? d3.symbolCross : d3.symbolCircle))
        .attr("transform", function (d, i) {
            return "translate(" + (w - 10) + "," + 47 + ")";
        });
    legendRV.append("text")
        .attr("x", w - 17).attr("y", 50).attr("font-size", 10).style("text-anchor", "end")
        .text(d => d == 0 ? "Good Rating" : "Bad Rating");
    
    ////////////////////////////////////////////////////////////////// CHART 4////////////////////////////////////////////////////////////////

    var svg4 = d3.select("body").append("svg").attr("width", w).attr("height", h);
    //draw points
    svg4.selectAll(".point").data(dataset)
        .enter().append("path").attr("class", "point")
        .attr("d", d3.symbol().size(40).type(d => d.IsGoodRating == 0 ? d3.symbolCircle : d3.symbolCross))
        .attr("fill", "none")
        .attr("stroke", d => d.IsGoodRating == 0 ? "red" : "blue")
        .attr('transform', function (d) {
            return "translate(" + xScaleRating(d.Rating) + "," + yScaleWinsNoms_sqrt(d.WinsNoms) + ")";
        });

    //draw X axis
    svg4.append("g").attr("class", "axis").attr("transform", "translate(0," + (h - padding) + ")").call(xAxisRating);
    //draw Y axis
    svg4.append("g").attr("class", "axis").attr("transform", "translate(" + 50 + ",0)").call(yAxisWinsNoms_sqrt);
    // add label
    svg4.append("text").attr("x", (w / 2)).attr("y", h - 10).attr("text-anchor", "middle").text("Rating");
    svg4.append("text").attr("x", padding).attr("y", padding - 10).attr("text-anchor", "middle").text("Wins+Noms");
    //add title
    svg4.append("text").attr("x", (w / 2)).attr("y", padding).attr("text-anchor", "middle").text("Wins+Nominations (square-root-scaled) vs. Rating");
    //draw legend
    var legendRWS = svg4.selectAll(".legendrws").data([0, 1]).enter().append("g")
        .attr("class", "legendrws")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });
    legendRWS.append("path").style("fill", "none")
        .style("stroke", d => d == 0 ? "blue" : "red")
        .attr("d", d3.symbol().size(40).type(d => d == 0 ? d3.symbolCross : d3.symbolCircle))
        .attr("transform", function (d, i) {
            return "translate(" + (w - 10) + "," + 47 + ")";
        });
    legendRWS.append("text")
        .attr("x", w - 17).attr("y", 50).attr("font-size", 10).style("text-anchor", "end")
        .text(d => d == 0 ? "Good Rating" : "Bad Rating");
    
    //////////////////////////////////////////////////////////////// CHART 5////////////////////////////////////////////////////////////////

    var svg5 = d3.select("body").append("svg").attr("width", w).attr("height", h);
    //draw points
    svg5.selectAll(".point").data(dataset)
        .enter().append("path").attr("class", "point")
        .attr("d", d3.symbol().size(40).type(d => d.IsGoodRating == 0 ? d3.symbolCircle : d3.symbolCross))
        .attr("fill", "none")
        .attr("stroke", d => d.IsGoodRating == 0 ? "red" : "blue")
        .attr('transform', function (d) {            
            return "translate(" + xScaleRating(d.Rating) + "," + yScaleWinsNoms_log(d.WinsNoms != 0 ? d.WinsNoms : 1) + ")";
        });

    //draw X axis
    svg5.append("g").attr("class", "axis").attr("transform", "translate(0," + (h - padding) + ")").call(xAxisRating);
    //draw Y axis
    svg5.append("g").attr("class", "axis").attr("transform", "translate(" + 50 + ",0)").call(yAxisWinsNoms_log);
    // add label
    svg5.append("text").attr("x", (w / 2)).attr("y", h - 10).attr("text-anchor", "middle").text("Rating");
    svg5.append("text").attr("x", padding).attr("y", padding - 10).attr("text-anchor", "middle").text("Wins+Noms");
    //add title
    svg5.append("text").attr("x", (w / 2)).attr("y", padding).attr("text-anchor", "middle").text("Wins+Nominations (log-scaled) vs. Rating");
    //draw legend
    var legendRWL = svg5.selectAll(".legendrwl").data([0, 1]).enter().append("g")
        .attr("class", "legendrws")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });
    legendRWL.append("path").style("fill", "none")
        .style("stroke", d => d == 0 ? "blue" : "red")
        .attr("d", d3.symbol().size(40).type(d => d == 0 ? d3.symbolCross : d3.symbolCircle))
        .attr("transform", function (d, i) {
            return "translate(" + (w - 10) + "," + 47 + ")";
        });
    legendRWL.append("text")
        .attr("x", w - 17).attr("y", 50).attr("font-size", 10).style("text-anchor", "end")
        .text(d => d == 0 ? "Good Rating" : "Bad Rating");
    
});