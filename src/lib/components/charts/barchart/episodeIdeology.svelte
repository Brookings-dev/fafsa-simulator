<script>
	// example chart from LayerCake
	// https://layercake.graphics/example/Bar/
	import { LayerCake, Svg, flatten, uniques } from 'layercake';
	import { scaleBand, scaleOrdinal } from 'd3-scale';
	import { timeFormat, timeParse } from 'd3';
	import { stack, stackOrderReverse } from 'd3-shape';
	import { tweened } from 'svelte/motion';
	import * as eases from 'svelte/easing';

	import ColumnStacked from './ColumnStacked.svelte';
	import AxisX from './AxisX.svelte';
	import AxisY from './AxisY.svelte';

	import DateRangeSelect from '$lib/components/helpers/DateRangeSelect.svelte';

	// This example loads csv data as json using @rollup/plugin-dsv
	// import data from '$lib/data/election_fraud_data.csv';
	import data from '$lib/data/ideology_data_new.csv';

	let filteredData = data;

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

	const stackData = stack().keys(seriesNames).order(stackOrderReverse);
	$: series = stackData(filteredData);
	// x={(d) => d.data[xKey]}

	/// date range
	const name = 'createdDate';

	const heading = 'Created Date';

	// option to override the defaults - change to other language, below are the default values
	const labels = {
		notSet: 'not set',
		greaterThan: 'greater than',
		lessThan: 'less than',
		range: 'range',
		day: 'day',
		days: 'days',
		apply: 'Apply'
	};

	// form post ids
	const startDateId = 'start_date_id';
	const endDateId = 'end_date_id';

	function handleApplyDateRange(thisDate) {
		let start = timeFormat('%Y-%m')(timeParse('%Y-%m')(thisDate.detail.startDate));
		let end = timeFormat('%Y-%m')(timeParse('%Y-%m')(thisDate.detail.endDate));
		const timeout = setTimeout(() => {
			filteredData = data.filter((d) => d.month_year >= start && d.month_year <= end);
		}, 200);
	}

	// this is if you want the scales to update too
	// const tweenOptions = {
	// 	duration: 300,
	// 	easing: eases.cubicInOut
	// 	};

	// $: xDomain = tweened(undefined, tweenOptions);
	// $: yDomain = tweened(undefined, tweenOptions);
</script>

<div>
	<DateRangeSelect
		--applyButtonWidth="100px"
		startDateMin="2012-12"
		endDateMax="2021-12"
		{name}
		{heading}
		{labels}
		{startDateId}
		{endDateId}
		on:onApplyDateRange={handleApplyDateRange}
	/>
</div>

<div class="cmsvelte-w-full" style:height="400px">
	<!-- <div class="chart-container"> -->
	<LayerCake
		padding={{ top: 20, right: 0, bottom: 20, left: 20 }}
		x={(d) => d.data[xKey]}
		y={yKey}
		z={zKey}
		xScale={scaleBand().paddingInner([0.12]).round(true)}
		xDomain={null}
		yDomain={[0, 1200]}
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
					timeFormat('%b')(timeParse('%Y-%m')(tick)) == 'Jan' ||
					timeFormat('%b %Y')(timeParse('%Y-%m')(tick)) == 'Dec 2021'
						? timeFormat('%b %Y')(timeParse('%Y-%m')(tick))
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
