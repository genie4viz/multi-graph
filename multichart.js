d3.json("data.json").then(function (dataset) {
    
    var w = 1400;
    var h = 500;
    var padding = 60;
    var svg = d3.select("body").append("svg").attr("width", w).attr("height", h);
    var colors = ["blue", "#ff00ff", "red", "green"];
    
    var minLeft = 0, maxLeft = 4 * Math.pow(10, 7),
        minRight = 0, maxRight = 8 * Math.pow(10, 8);
    var bar_data = [], line_data = [];
    dataset.forEach(d => {
        var new_bar_set = {
            date: d.date,
            url: d.url,
            dd: []
        }
        var new_line_set = {
            date: d.date,
            url: d.url,            
            value1: 0,
            value1_label:'',
            value3: 0,
            value3_label:'',
            value5: 0,
            value5_label:'',
            value8: 0,
            value8_label:'',
        }
        d.dd.forEach((e, i) => {
            if(i == 0 || i == 2 || i == 4 || i == 9){
                new_bar_set.dd.push({
                    date: d.date,
                    label: e.f,
                    v: 'value' + i,
                    f: e.v == null || e.v == '' ? 0 : e.v * Math.pow(10, 6)                    
                })
            }
            switch(i){
                case 1:
                    new_line_set.value1 = e.v == null || e.v == '' ? 0 : e.v * Math.pow(10, 6);
                    new_line_set.value1_label = e.f == null ? '' : e.f;
                break;
                case 3:
                    new_line_set.value3 = e.v == null || e.v == '' ? 0 : e.v * Math.pow(10, 6);
                    new_line_set.value3_label = e.f == null ? '' : e.f;
                break;
                case 5:
                    new_line_set.value5 = e.v == null || e.v == '' ? 0 : e.v * Math.pow(10, 6);
                    new_line_set.value5_label = e.f == null ? '' : e.f;
                break;
                case 8:
                    new_line_set.value8 = e.v == null || e.v == '' ? 0 : e.v * Math.pow(10, 6);
                    new_line_set.value8_label = e.f == null ? '' : e.f;
                break;
            }            
        })
        bar_data.push(new_bar_set);
        line_data.push(new_line_set)
    });
    console.log(line_data)

    var dates = bar_data.map(d => d.date);
    var bar_subs = bar_data[0].dd.map(d => d.v);
    
    var x0 = d3
            .scaleBand()
            .domain(dates)
            .range([0, w - padding * 2])
            .padding(0.2),
        x = d3
            .scaleBand()
            .domain(bar_subs)
            .range([0, x0.bandwidth()])
            .padding(0.2)
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
            .ticks(bar_data.length)
            .tickSize(0)
        yAxisLeft = d3
            .axisLeft(yLeft),
        yAxisRight = d3
            .axisRight(yRight)
            .tickSize(w - padding * 2)
            .ticks(8);
        
        var graphArea = svg
            .append("g").attr('class', 'graphArea')
            .attr('transform', "translate(" + (padding) + "," + (padding) + ")")

        var tooltip = graphArea.append('g');
        //shadow effect
        var defs = graphArea.append("defs");
        var filter = defs.append("filter")
            .attr("id", "drop-shadow")
            .attr("height", "150%");        

        filter.append("feDropShadow")
            .attr("stdDeviation", 2.5)
            .attr("flood-color", "grey")
            .attr("flood-opacity", 0.8);

        var feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode")
            .attr("in", "offsetBlur")
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");

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
            .data(bar_data)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", d => "translate(" + x0(d.date) + ",0)");
      
        slice.selectAll("rect")
            .data(d => d.dd)
        .enter().append("rect")
            .attr("width", x.bandwidth())
            .attr("x", d => x(d.v))
            .style("fill", (d, i) => colors[i])
            .attr("y", d => yLeft(d.f))
            .attr("height", d => h - padding * 2 - yLeft(d.f))
            .on("mouseover", function(d, i) {
                tooltip.attr('transform', 'translate(' + (x0(d.date) + x(d.v) + x.bandwidth()) + ',' + (yLeft(d.f)) + ')').call(callout, d);
                tooltip.raise();
            })
            .on("mouseout", function(d) {
                tooltip.call(callout, null);
            });
            
        // slice.selectAll("rect")
        //     .transition()
        //     .delay(Math.random() * 1000)
        //     .duration(1000)
        //     .attr("y", d => yLeft(d.f))
        //     .attr("height", d => h - padding * 2 - yLeft(d.f));

        
        //draw line
        // define the 1st line
        var valueline0 = d3.line()
            .defined(function(d) { return d.value1 == 0 ? false :d; })
            .x(d => x0(d.date))
            .y(d => yRight(d.value1));
        var valueline1 = d3.line()
            .defined(function(d) { return d.value3 == 0 ? false :d; })
            .x(d => x0(d.date))
            .y(d => yRight(d.value3));
        var valueline2 = d3.line()
            .defined(function(d) { return d.value5 == 0 ? false :d; })
            .x(d => x0(d.date))
            .y(d => yRight(d.value5));
        var valueline3 = d3.line()
            .defined(function(d) { return d.value8 == 0 ? false :d; })
            .x(d => x0(d.date))
            .y(d => yRight(d.value8));
        
        graphArea
            .append("path")
            .data([line_data])
            .attr("class", "line")
            .attr("stroke", colors[0])
            .attr("stroke-width", 3)
            .attr("fill", 'none')
            .attr("d", valueline0)
            .on("mouseover", function(d, i) {
                console.log(d, 'line')
                // tooltip.attr('transform', 'translate(' + (x0(d.date) + x(d.v) + x.bandwidth()) + ',' + (yLeft(d.f)) + ')').call(callout, d);
                // tooltip.raise();
            })
            .on("mouseout", function(d) {
                // tooltip.call(callout, null);
            });
        graphArea
            .append("path")
            .data([line_data])
            .attr("class", "line")
            .attr("stroke", colors[1])
            .attr("stroke-width", 3)
            .attr("fill", 'none')
            .attr("d", valueline1);
        graphArea
            .append("path")
            .data([line_data])
            .attr("class", "line")
            .attr("stroke", colors[2])
            .attr("stroke-width", 3)
            .attr("fill", 'none')
            .attr("d", valueline2);
        graphArea
            .append("path")
            .data([line_data])
            .attr("class", "line")
            .attr("stroke", colors[3])
            .attr("stroke-width", 3)
            .attr("fill", 'none')
            .attr("d", valueline3);        

        const callout = (g, d) => {
            
            if (!d) {
                g.selectAll("*").remove();
                return g.style('display', 'none');
            }

            g.style('display', null).style('pointer-events', 'none')

            const path = g
                .append("path")
                .attr("fill", 'white')
                .style("filter", "url(#drop-shadow)")
                .attr("stroke", "grey");

            const text = g
                .append("text");

            text.append('tspan')
                .text(d.date)
                .style('font-weight', 'bold')
                .attr('text-anchor', 'start')                
            text.append('tspan')
                .text(d.label)
                .attr('text-anchor', 'start')
                .attr('x', 0)
                .attr('dy', '.8em')

            const { width: tw, height: th } = text.node().getBBox();
            
            text.attr("transform", 'translate(' + (-x.bandwidth() - tw - 10) + ',-6)')
                .attr('dy', '0.3em')
            path
                .attr("transform", 'translate(' + (-x.bandwidth()) + ',0)')
                .attr("d", 'M0,0l-5,-5v' + (-(th - 10) / 2) + 'h' + (-tw - 10) + 'v' + th + 'h' + (tw + 10) + 'v' + (-(th - 10) / 2) + 'l5,-5z')
                
        }
});