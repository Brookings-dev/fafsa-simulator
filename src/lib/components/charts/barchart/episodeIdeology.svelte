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

	// This example loads csv data as json using @rollup/plugin-dsv
	// import data from '$lib/data/election_fraud_data.csv';
	import data from '$lib/data/ideology_data_new.csv';
	// import dataNew from '$lib/data/episodes-per-month-ideology-interactive.csv';
	// console.log(dataNew[2]);
	console.log(data[2]);

	///
	const parseDateYearWeek = d3.timeParse('%Y-%U'); //parse 2012-23....YEAR_WEEK
	const parseDateYearMonth = d3.timeParse('%Y-%m'); //parse 2012-03....YEAR_MONTH
	const formatDateMonthYear = d3.timeFormat('%b-%Y'); //Jan-2021
	const formatDateWeek = d3.timeFormat('%U'); //42

	const xKey = 'month_year';
	// const xKey = (d) => d3.timeParse('%Y-%V')(d.month_year);
	const yKey = [0, 1];
	const zKey = 'key';

	const seriesNames = Object.keys(data[0]).filter((d) => d !== xKey);
	const seriesColors = ['#B3B3B3', '#F55D5B', '#16659D', '#FDDB46'];

	data.forEach((d) => {
		seriesNames.forEach((name) => {
			d[name] = +d[name];
		});
	});

	const stackData = stack().keys(seriesNames).order(d3.stackOrderReverse);
	const series = stackData(data);
	// x={(d) => d.data[xKey]}
</script>

<div class="cmsvelte-w-full" style:height="400px">
	<!-- <div class="chart-container"> -->
	<LayerCake
		padding={{ top: 0, right: 0, bottom: 20, left: 20 }}
		x={(d) => d.data[xKey]}
		y={yKey}
		z={zKey}
		xScale={scaleBand().paddingInner([0.12]).round(true)}
		xDomain={uniques(data, xKey)}
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
