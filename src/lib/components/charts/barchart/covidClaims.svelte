<script>
	// example chart from LayerCake
	// https://layercake.graphics/example/Bar/
	import { LayerCake, Svg, flatten, uniques } from 'layercake';
	import { scaleBand, scaleOrdinal } from 'd3-scale';
	import * as d3 from 'd3';
	import { stack } from 'd3-shape';
	import { format, precisionFixed } from 'd3-format';

	import ColumnStacked from './ColumnStacked.svelte';
	import AxisX from './AxisX.svelte';
	import AxisY from './AxisY.svelte';

	// This example loads csv data as json using @rollup/plugin-dsv
	// import data from '$lib/data/election_fraud.csv';

	import data from '$lib/data/covid-claims.csv';
	import data2 from '$lib/data/covid_data_new.csv';
	console.log(data[0]);
	console.log(data2[0]);

	///
	const parseDateYearWeek = d3.timeParse('%Y-%U'); //parse 2012-23....YEAR_WEEK
	const parseDateYearMonth = d3.timeParse('%Y-%m'); //parse 2012-03....YEAR_MONTH
	const formatDateMonthYear = d3.timeFormat('%b-%Y'); //Jan-2021
	const formatDateWeek = d3.timeFormat('%U'); //42
	////////

	// const newDateTest = parseDateYearWeek('2020-34');
	// console.log(formatDateWeek(newDateTest));

	const xKey = 'week_year';
	const yKey = [0, 1];
	const zKey = 'key';

	const seriesNames = Object.keys(data[0]).filter((d) => d !== xKey);
	const seriesColors = ['#00649f', '#8BC6FD', '#2FA5B2', '#FEDB31', '#C7A70A', '#F25D00'];
	//[dark blue, light blue, turq, yellow, gold, orange]

	data.forEach((d) => {
		seriesNames.forEach((name) => {
			d[name] = +d[name];
		});
	});

	const stackData = stack().keys(seriesNames).order(d3.stackOrderReverse);

	const series = stackData(data);

	const checkMonth = (d) => d3.timeFormat('%b')(d3.timeParse('%Y-%V')(d));
	const checkWeek = (d) => d3.timeFormat('%V')(d3.timeParse('%Y-%V')(d));
	const checkYear = (d) => d3.timeFormat('%Y')(d3.timeParse('%Y-%V')(d));

	const formatTickX = (tick) =>
		(checkMonth(tick) == 'Feb' && checkWeek(tick) % 4 == 0) ||
		(checkMonth(tick) == 'May' && checkWeek(tick) % 4 == 0) ||
		(checkMonth(tick) == 'Aug' && checkWeek(tick) % 4 == 0 && checkWeek(tick) != 36) ||
		(checkMonth(tick) == 'Nov' && checkWeek(tick) % 4 == 0 && checkWeek(tick) != 44)
			? d3.timeFormat('%b %Y')(d3.timeParse('%Y-%V')(tick))
			: '';
</script>

<div class="cmsvelte-w-full" style:height="400px">
	<!-- <div class="chart-container"> -->
	<LayerCake
		padding={{ top: 0, right: 0, bottom: 20, left: 20 }}
		x={(d) => d.data[xKey]}
		y={yKey}
		z={zKey}
		xScale={scaleBand().paddingInner([0.12]).round(true)}
		yDomain={[0,25]}
		xDomain={uniques(data, xKey)}
		zScale={scaleOrdinal()}
		zDomain={seriesNames}
		zRange={seriesColors}
		flatData={flatten(series)}
		data={series}
	>
		<Svg>
			<AxisX gridlines={false} formatTick={formatTickX} />
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
