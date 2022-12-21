<script>
	// example chart from LayerCake
	// https://layercake.graphics/example/Bar/
	import { LayerCake, Svg } from 'layercake';
	import { scaleBand } from 'd3';
	import * as d3 from 'd3';

	import Bar from './Bar.svelte';
	import AxisX from './AxisX.svelte';
	import AxisY from './AxisY.svelte';

	import data from '$lib/data/election_fraud.csv';
	import dataNew from '$lib/data/episodes-per-month-ideology-interactive.csv';
	import { construct_svelte_component } from 'svelte/internal';

	const xKey = (d) => d3.timeParse('%Y-%V')(d.date);
	const formatXkey = d3.timeFormat();
	const zKey = 'after_election';
	const yKey = (d) => d.total * 100;

	///
	const parseDateYearWeek = d3.timeParse('%Y-%V'); //parse 2012-23....YEAR_WEEK
	const parseDateYearMonth = d3.timeParse('%Y-%m'); //parse 2012-03....YEAR_MONTH
	const formatDateMonthYear = d3.timeFormat('%b-%Y'); //Jan-2021
	const formatDateWeek = d3.timeFormat('%V'); //42

	////////
	data.forEach((d) => {
		d[yKey] = +d[yKey];
	});
</script>

<div class="w-full" style:height="400px">
	<LayerCake
		padding={{ top: 0, right: 42, bottom: 0, left: 5 }}
		x={xKey}
		y={yKey}
		z={zKey}
		xScale={scaleBand().paddingInner([0.2]).round(true)}
		xDomain={xKey}
		yDomain={[0, 80]}
		{data}
	>
		<Svg>
			<AxisX
				id="axis-week"
				gridlines={false}
				fontColor="#333333"
				label="Week"
				formatTick={(tick) =>
					d3.timeFormat('%V')(tick) % 2 == 0 || d3.timeFormat('%V')(tick) == '01'
						? d3.timeFormat('%V')(tick)
						: ''}
			/>
			<AxisX
				id="axis-year"
				gridlines={false}
				baseline={false}
				yTick="35"
				label="Year"
				fontColor="#707070"
				fontSize=".75rem"
				formatTick={(tick) =>
					tick == 'Mon Aug 17 2020 00:00:00 GMT-0400 (Eastern Daylight Time)' ||
					tick == 'Mon Jan 04 2021 00:00:00 GMT-0500 (Eastern Standard Time)'
						? d3.timeFormat('%Y')(tick)
						: ''}
			/>
			<AxisY
				gridlines={true}
				textAnchor="end"
				dyTick="4"
				xTick="-6"
				formatTick={(tick) => (tick !== 0 ? `${tick}%` : tick)}
			/>
			<Bar />
		</Svg>
	</LayerCake>
</div>
