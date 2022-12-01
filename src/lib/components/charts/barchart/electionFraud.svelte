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
	const yKey = 'total';

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

<!-- xDomain={['2020-35', '2020-40', '2020-45', '2020-50', '2020-55', '2021-01']} -->

<div class="cmsvelte-w-full" style:height="400px">
	<LayerCake
		padding={{ top: 0, right: 0, bottom: 20, left: 30 }}
		x={xKey}
		y={yKey}
		xScale={scaleBand().paddingInner([0.05]).round(true)}
		xDomain={xKey}
		yDomain={[0, null]}
		{data}
	>
		<Svg>
			<AxisX
				gridlines={true}
				formatTick={(tick) =>
					d3.timeFormat('%V')(tick) % 2 == 0 || d3.timeFormat('%V')(tick) == '01'
						? d3.timeFormat('%V')(tick)
						: ''}
			/>
			<AxisY gridlines={false} />
			<Bar />
		</Svg>
	</LayerCake>
</div>

<!-- 
<g>
	<AxisX
		gridlines={false}
		snapTicks
		ticks={[
			timeParse('%m %Y')('4 2020'),
			timeParse('%m %Y')('4 2021'),
			timeParse('%m %Y')('4 2022')
		]}
		formatTick={(tick) => `Q2 ${timeFormat('%Y')(tick)}`}
	/>
	<AxisY
		formatTick={() => ''}
		ticks={[minValue, (minValue + maxValue) / 2, maxValue]}
		label={i % numCols === 0 ? 'Review Mentions Per Million Words' : ''}
	/>
</g> -->
