<script>
	// example chart from LayerCake
	// https://layercake.graphics/example/Bar/
	import { LayerCake, Svg, flatten, uniques } from 'layercake';
	import { scaleBand, scaleOrdinal } from 'd3-scale';
	import * as d3 from 'd3';
	import { stack, stackOrderAppearance, stackOrderNone } from 'd3-shape';
	import { format, precisionFixed } from 'd3-format';

	import ColumnStacked from './ColumnStacked.svelte';
	import AxisX from './AxisX.svelte';
	import AxisY from './AxisY.svelte';

	import DateRangeSelect from 'svelte-date-range-select';
	

	// This example loads csv data as json using @rollup/plugin-dsv
	// import data from '$lib/data/election_fraud_data.csv';
	import data from '$lib/data/ideology_data_new.csv';

	let filteredData = data;
	// import dataNew from '$lib/data/episodes-per-month-ideology-interactive.csv';
	// console.log(dataNew[2]);
	console.log(filteredData);

	const xKey = 'month_year';
	const yKey = [0, 1];
	const zKey = 'key';

	const seriesNames = Object.keys(filteredData[0]).filter((d) => d !== xKey);
	const seriesColors = ['#B3B3B3', '#F55D5B', '#16659D', '#FDDB46'];

	filteredData.forEach((d) => {
		seriesNames.forEach((name) => {
			d[name] = +d[name];
		});
	});

	const stackData = stack().keys(seriesNames).order(d3.stackOrderReverse);
	$: series = stackData(filteredData);
	// x={(d) => d.data[xKey]}

	/// date range
	const name = 'createdDate'; 

  const heading = 'Created Date';

  // this limits the HTML5 date picker end date - e.g. today is used here 
  const endDateMax = new Date();

  // this limits the HTML5 date picker's start date - e.g. 3 years is select here
  const startDateMin = new Date(
    new Date().setFullYear(endDateMax.getFullYear(), endDateMax.getMonth() - 36)
  );

  // option to override the defaults - change to other language, below are the default values
  const labels = {
    notSet: 'not set',
    greaterThan: 'greater than',
    lessThan: 'less than',
    range: 'range',
    day: 'day',
    days: 'days',
    apply: 'Apply'
  }

  // form post ids
  const startDateId = 'start_date_id' 
  const endDateId = 'end_date_id' 
  console.log(data)

  function handleApplyDateRange(thisDate){
    // console.log(thisDate.detail.startDate)
	let start = d3.timeFormat('%Y-%m')(d3.timeParse('%Y-%m-%d')(thisDate.detail.startDate));
	let end =  d3.timeFormat('%Y-%m')(d3.timeParse('%Y-%m-%d')(thisDate.detail.endDate))
	// let dateRange = start + ' to ' + end;

	filteredData = data.filter(d => d.month_year >= start && d.month_year <= end)

	console.log(filteredData)

  }
</script>
<div>
<DateRangeSelect
	--applyButtonWidth= '100px'
    startDateMin = '12-01-2012'
    endDateMax = '12-01-2021'
    {name}
    {heading}
    {labels}
    {startDateId}
    {endDateId}
    on:onApplyDateRange={handleApplyDateRange} /></div>

<div class="cmsvelte-w-full" style:height="400px">
	<!-- <div class="chart-container"> -->
	<LayerCake
		padding={{ top: 20, right: 0, bottom: 20, left: 20 }}
		x={(d) => d.data[xKey]}
		y={yKey}
		z={zKey}
		xScale={scaleBand().paddingInner([0.12]).round(true)}
		xDomain={null}
		yDomain={[0,1200]}
		zScale={scaleOrdinal()}
		zDomain={seriesNames}
		zRange={seriesColors}
		flatData={flatten(series)}
		data={series}
	>
		<Svg>
			<AxisX
				gridlines={false}
				baseline={true}
				fontColor="#333333"
				formatTick={(tick) =>
					d3.timeFormat('%b')(d3.timeParse('%Y-%m')(tick)) == 'Jan' ||
					d3.timeFormat('%b %Y')(d3.timeParse('%Y-%m')(tick)) == 'Dec 2021'
						? d3.timeFormat('%b %Y')(d3.timeParse('%Y-%m')(tick))
						: ''}
			/>
			<AxisY ticks={4} gridlines={true} textAnchor="end" dyTick="4" xTick="-6" />
			<ColumnStacked />
		</Svg>
	</LayerCake>

	<!-- </div> -->
</div>

<style>
	/*
    The wrapper div needs to have an explicit width and height in CSS.
    It can also be a flexbox child or CSS grid element.
    The point being it needs dimensions since the <LayerCake> element will
    expand to fill it.
  */
	.chart-container {
		width: 100%;
		height: 100%;
	}
</style>
