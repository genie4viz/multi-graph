d3.json("data.json").then(function (dataset) {
    // console.log(dataset)
    var w = 800;
    var h = 600;
    var padding = 60;
    var svg = d3.select("body").append("svg").attr("width", w).attr("height", h);
    
    var minLeft = 0, maxLeft = 4 * Math.pow(10, 7),
        minRight = 0, maxRight = 8 * Math.pow(10, 8);
    var data = [];
    dataset.forEach(d => {
        var new_set = {
            date: d.date,
            url: d.url,
            dd: []
        }
        d.dd.forEach((e, i) => {
            if(i == 0 || i == 2 || i == 4 || i == 9){
                new_set.dd.push({
                    v: 'value' + i,
                    f: e.v == null || e.v == '' ? 0 : e.v * Math.pow(10, 6) 
                })
            }
        })
        data.push(new_set);        
    });
    console.log(data)

    var dates = data.map(d => d.date);
    var subs = data[0].dd.map(d => d.f);
    console.log(subs, 'subs')
    var x0 = d3
            .scaleBand()
            .range([0, w - padding * 2])
            .domain(dates)
            .padding(0.3),
        x = d3
            .scaleBand()
            .paddingOuter(0.25)
            .paddingInner(0.25)
            .domain(subs)
            .rangeRound([0, x0.bandwidth()]),
        yLeft = d3
            .scaleLinear()
            .domain([minLeft, maxLeft])
            .rangeRound([h - padding * 2, 0]),
        yRight = d3
            .scaleLinear()
            .domain([minRight, maxRight])
            .rangeRound([h - padding * 2, 0]),
        xAxis = d3
            .axisBottom(x0)            
            .ticks(data.length)
        yAxisLeft = d3
            .axisLeft(yLeft),
            // .tickSize(-rw)
            // .ticks(8);
        yAxisRight = d3
            .axisRight(yRight)
            .tickSize(w - padding * 2)
            .ticks(8);
        
        var graphArea = svg
            .append("g").attr('class', 'graphArea')
            .attr('transform', "translate(" + (padding) + "," + (padding) + ")")

        var xArea = graphArea.append('g').attr('class', 'xArea')
            .attr('transform', "translate(0," + (h - padding * 2) + ")");
        
        xArea
            .attr('class', 'x axis')
            .call(xAxis)
            .selectAll('text')
            .attr('opacity', (d, i) => i % 2 == 1 ? 0 : 1)            
            .style("font", "300 10px Arial")
            .attr('text-anchor','end')
            .attr('transform', 'rotate(-45)');
        
        var yAreaLeft = graphArea.append('g').attr('class', 'yAreaLeft')
        yAreaLeft
            .attr('class', 'y-axis-left')
            .call(yAxisLeft)
            .selectAll('text')
            .style("font", "300 10px Arial")
            .select('.domain')
            .remove();
        var yAreaRight = graphArea.append('g').attr('class', 'yAreaRight')
        yAreaRight
            .attr('class', 'y-axis-right')
            .call(yAxisRight)
            .selectAll('text')
            .style("font", "300 10px Arial")
            .select('.domain')
            .remove();

        var slice = graphArea.selectAll(".slice")
            .data(data)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform",function(d) { return "translate(" + x0(d.date) + ",0)"; });
      
        slice.selectAll("rect")
            .data(function(d) { console.log(d);return d.dd; })
        .enter().append("rect")
            .attr("width", x.bandwidth())
            .attr("x", function(d) {console.log(d,'aaa'); return x(d.f); })
            // .style("fill", function(d) { return color(d.rate) })
            .attr("y", function(d) { return yLeft(0); })
            .attr("height", function(d) { return h - padding * 2 - yLeft(0); })
            .on("mouseover", function(d) {
                // d3.select(this).style("fill", d3.rgb(color(d.rate)).darker(2));
            })
            .on("mouseout", function(d) {
                // d3.select(this).style("fill", color(d.rate));
            });
      
        slice.selectAll("rect")
            .transition()
            .delay(function (d) {return Math.random()*1000;})
            .duration(1000)
            .attr("y", function(d) { return yLeft(d.f); })
            .attr("height", function(d) { return h - padding * 2 - yLeft(d.f); });
});