<script>
	// example chart from LayerCake
	// https://layercake.graphics/example/Bar/
	import { LayerCake, Svg } from 'layercake';
	import { scaleBand } from 'd3';
	import * as d3 from 'd3';

	import Bar from './Bar.svelte';
	import AxisX from './AxisX.svelte';
	import AxisY from './AxisY.svelte';

	import data from '$lib/data/election_fraud_data.csv';

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
	// let fillElection = (d) => (d.after_election == 'after' ? '#5EAEF3' : '#0D659D');

	data.forEach((d) => {
		d[yKey] = +d[yKey];
	});
</script>

<div class="cmsvelte-w-full" style:height="400px">
	<LayerCake
		padding={{ top: 0, right: 0, bottom: 20, left: 30 }}
		x={xKey}
		y={yKey}
		z={zKey}
		xScale={scaleBand().paddingInner([0.05]).round(true)}
		xDomain={xKey}
		yDomain={[0, 80]}
		{data}
	>
		<Svg>
			<AxisX
				gridlines={false}
				formatTick={(tick) =>
					d3.timeFormat('%V')(tick) % 2 == 0 || d3.timeFormat('%V')(tick) == '01'
						? d3.timeFormat('%V')(tick)
						: ''}
			/>
			<AxisY
				gridlines={true}
				dyTick="4"
				dxTick="-7"
				formatTick={(tick) => (tick !== 0 ? `${tick}%` : tick)}
			/>
			<Bar />
		</Svg>
	</LayerCake>
</div>
