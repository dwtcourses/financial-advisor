{
    // Set dimensions and margins
    let margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 50
        },
        width = 900 - margin.left - margin.right,
        height = 130 - margin.top - margin.bottom;

    // Parse date and time
    let parseTime = d3.isoParse;

    // Set ranges
    let x = d3.scaleTime().range([0, width]);
    let y = d3.scaleLinear().range([height, 0]);

    // Scale the range of the data
    x.domain(d3.extent(data, function (d) {
        return d.date;
    }));
    y.domain([0, 100]);


    // RSI line
    let line_rsi = d3.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.rsi);
        });

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    let svg = d3.select('#rsi-chart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // RSI chart
    svg.append('path')
        .data([data])
        .attr('id', 'line-rsi')
        .attr('class', 'line')
        .attr('d', line_rsi);

    // Draw the threshold lines
    let threshold_low = 30
    let threshold_high = 70
    let x_range = d3.extent(data, function (d) {
        return d.date;
    });

    svg.append('line')
        .attr('id', 'thresh-rsi-low')
        .attr('x1', x(x_range[0]))
        .attr('y1', y(threshold_low))
        .attr('x2', x(x_range[1]))
        .attr('y2', y(threshold_low))

    svg.append('line')
        .attr('id', 'thresh-rsi-high')
        .attr('x1', x(x_range[0]))
        .attr('y1', y(threshold_high))
        .attr('x2', x(x_range[1]))
        .attr('y2', y(threshold_high))

    svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append('g')
        .call(d3.axisLeft(y));
}