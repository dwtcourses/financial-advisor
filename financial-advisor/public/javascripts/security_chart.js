// Set dimensions and margins
let margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    },
    width = 850 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

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
    return d.price;
}), d3.max(data, function (d) {
    return d.price;
})]);


// Price line
let line_price = d3.line()
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.price); });

// Bollinger Bands
let line_bbands_hi = d3.line()
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.bbands_hi); });

let line_bbands_mid = d3.line()
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.bbands_mid); });

let line_bbands_lo = d3.line()
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.bbands_lo); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
let svg = d3.select('#main-chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform',
        'translate(' + margin.left + ',' + margin.top + ')');

// Price path
svg.append('path')
    .data([data])
    .attr('id', 'line-price')
    .attr('class', 'line')
    .attr('d', line_price);

// Bollinger Bands
svg.append('path')
    .data([data])
    .attr('id', 'line-bbands-hi')
    .attr('class', 'line')
    .attr('d', line_bbands_hi);

svg.append('path')
    .data([data])
    .attr('id', 'line-bbands-mid')
    .attr('class', 'line')
    .attr('d', line_bbands_mid);

svg.append('path')
    .data([data])
    .attr('id', 'line-bbands-lo')
    .attr('class', 'line')
    .attr('d', line_bbands_lo);

svg.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x));

// Add the Y Axis
svg.append('g')
    .call(d3.axisLeft(y));