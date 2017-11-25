{
    // Set dimensions and margins
    let margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 50
        },
        width = 900 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

    // Parse date and time
    let parseTime = d3.isoParse;

    // Set ranges
    let x = d3.scaleTime().range([0, width]);
    let y = d3.scaleLinear().range([height, 0]);

    // Scale the range of the data
    x.domain(d3.extent(data, function (d) {
        return d.date;
    }));
    y.domain([d3.min(data, function (d) {
        return d.macd;
    }), d3.max(data, function (d) {
        return d.macd;
    })]);


    // MACD values
    let line_macd = d3.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.macd);
        });

    let line_macd_signal = d3.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.macd_signal);
        });

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    let svg = d3.select('#macd-chart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


    svg.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr("class", function (d) {
            return "bar bar--" + (d.macd_hist < 0 ? "negative" : "positive");
        })
        .attr('x', function (d) {
            return (x(d.date))
        })
        .attr('width', 1)
        .attr('y', function (d) {
            return (y(d.macd_hist))
        })
        .attr('height', function (d) {
            return Math.abs(y(d.macd_hist) - y(0))
        });

    // MACD line charts
    svg.append('path')
        .data([data])
        .attr('id', 'line-macd')
        .attr('class', 'line')
        .attr('d', line_macd);

    svg.append('path')
        .data([data])
        .attr('id', 'line-macd-signal')
        .attr('class', 'line')
        .attr('d', line_macd_signal);

    svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append('g')
        .call(d3.axisLeft(y));
}