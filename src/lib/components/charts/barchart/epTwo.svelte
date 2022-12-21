<script>
	// example chart from LayerCake
	// https://layercake.graphics/example/Bar/
	import { LayerCake, Svg, flatten, uniques } from 'layercake';
	import { scaleBand, scaleOrdinal } from 'd3-scale';
	import { color, filter, timeFormat, timeParse } from 'd3';
	import { stack, stackOrderReverse } from 'd3-shape';
	import ColumnStacked from './ColumnStacked.svelte';
	import AxisX from './AxisX.svelte';
	import AxisY from './AxisY.svelte';

	import DateRangeSelect from '$lib/components/helpers/DateRangeSelect.svelte';

	// This example loads csv data as json using @rollup/plugin-dsv
	// import data from '$lib/data/election_fraud_data.csv';
	import data from '$lib/data/ideology.csv';

	let filteredData = data;

	let options = filteredData.map((option) => {
		return {
			month_year: option.month_year,
			'More Conservative': { value: option['More Conservative'], color: '#F55D5B' },
			'More Liberal': { value: option['More Liberal'], color: '#16659D' },
			Moderate: { value: option.Moderate, color: '#FDDB46' },
			Unknown: { value: option.Unknown, color: '#B3B3B3' }
		};
	});

	const xKey = 'month_year';
	const yKey = [0, 1];
	const zKey = 'key';

	$: seriesNames = Object.keys(filteredData[0]).filter((d) => d !== xKey);

	$: chosenValues = Object.keys(filteredData[0]).filter((d) => d !== xKey);

	const seriesColors = ['#F55D5B', '#16659D', '#FDDB46', '#B3B3B3'];
	// console.log(seriesColors);

	$: options.forEach((d) => {
		seriesNames.forEach((name) => {
			name = +name;
		});
	});

	$: stackData = stack()
		.order(stackOrderReverse)
		.keys(chosenValues)
		.value((obj, key) => obj[key]['value']);

	$: series = stackData(options);
	// console.log(series);

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

	const handleApplyDateRange = (thisDate) => {
		let start = timeFormat('%Y-%m')(timeParse('%Y-%m')(thisDate.detail.startDate));
		let end = timeFormat('%Y-%m')(timeParse('%Y-%m')(thisDate.detail.endDate));
		console.log(end);
		const timeout = setTimeout(() => {
			options = options.filter((d) => d.month_year >= start && d.month_year <= end);
		}, 200);
	};

	let handleChange = (ev) => {
		let { checked, value } = ev.target;
		if (checked) {
			chosenValues = [...chosenValues, value];
		} else {
			chosenValues = chosenValues.filter((v) => v !== value);
		}
	};

	$: console.log(chosenValues);
	// this is if you want the scales to update too
	// const tweenOptions = {
	// 	duration: 300,
	// 	easing: eases.cubicInOut
	// 	};

	// $: xDomain = tweened(undefined, tweenOptions);
	// $: yDomain = tweened(undefined, tweenOptions);
</script>

<div>
	<!-- {#each seriesNames as variable}
		<div class="cmsvelte-grid cmsvelte-grid-col cmsvelte-p-5 cmsvelte-stroke">{variable}</div>
	{/each} -->
	<div class="cmsvelte-flex cmsvelte-flex-row cmsvelte-justify-between cmsvelte-items-center">
		<div class="cmsvelte-flex cmsvelte-flex-row cmsvelte-gap-2 cmsvelte-flex-1">
			{#each seriesNames as value}
				<div>
					<input
						type="checkbox"
						class="cmsvelte-select-items cmsvelte-self-center cmsvelte-peer cmsvelte-justify-self-center cmsvelte-appearance-none"
						name={value}
						{value}
						id={value}
						checked={chosenValues.includes(value)}
						on:change={handleChange}
					/>
					<label
						class="cmsvelte-grid cmsvelte-grid-flow-row-dense cmsvelte-border cmsvelte-border-solid cmsvelte-border-gray cmsvelte-justify-center cmsvelte-cursor-pointer hover:cmsvelte-bg-gray-light peer-checked:bg-gray-light cmsvelte-peer-checked:border-black"
						for={value}
					>
						<p
							class="cmsvelte-text-xs cmsvelte-self-center cmsvelte-justify-self-center cmsvelte-text-center cmsvelte-peer-checked:cmsvelte-bg-gray-light cmsvelte-p-2 cmsvelte-border"
						>
							{value}
						</p>
					</label>
				</div>
			{/each}
		</div>
		<div class="cmsvelte-flex cmsvelte-flex-row cmsvelte-gap-2 cmsvelte-flex-1">
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
	</div>
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
		flatData={flatten(series)}
		data={series}
		zScale={scaleOrdinal()}
		zDomain={chosenValues}
		zRange={seriesColors}
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
