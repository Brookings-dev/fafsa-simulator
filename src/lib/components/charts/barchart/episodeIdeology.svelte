<script>
	// example chart from LayerCake
	// https://layercake.graphics/example/Bar/
	import { LayerCake, Svg, flatten } from 'layercake';
	import { scaleBand, scaleOrdinal } from 'd3-scale';
	import { timeFormat, timeParse } from 'd3';
	import { stack, stackOrderReverse } from 'd3-shape';
	// import { tweened } from 'svelte/motion';
	// import * as eases from 'svelte/easing';
	import ColumnStacked from './ColumnStacked.svelte';
	import AxisX from './AxisX.svelte';
	import AxisY from './AxisY.svelte';
	import DateRangeSelect from '$lib/components/helpers/DateRangeSelect.svelte';

	import getKeyColor from '$lib/keyLookup';

	import data from '$lib/data/ideology.csv';

	const yKey = [0, 1];
	const zKey = 'key';

	let filteredData = data;
	let fill;
	let xKey = 'month_year';

	let options = filteredData.map((option) => {
		return {
			month_year: option.month_year,
			'More Conservative': {
				order: 1,
				value: option['More Conservative'],
				color: '#F55D5B',
				className: 'conservative'
			},
			'More Liberal': {
				order: 2,
				value: option['More Liberal'],
				color: '#16659D',
				className: 'liberal'
			},
			Moderate: { order: 3, value: option.Moderate, color: '#FDDB46', className: 'moderate' },
			Unknown: { order: 4, value: option.Unknown, color: '#B3B3B3', className: 'unknown' }
		};
	});

	$: seriesNames = Object.keys(filteredData[0]).filter((d) => d !== xKey);
	$: chosenValues = seriesNames;

	$: seriesColors = ['#F55D5B', '#16659D', '#FDDB46', '#B3B3B3'];

	$: stackData = stack()
		.order(stackOrderReverse)
		.keys(chosenValues)
		.value((obj, key) => obj[key]['value']);

	$: series = stackData(options);

	const handleApplyDateRange = (thisDate) => {
		let start = timeFormat('%Y-%m')(timeParse('%Y-%m')(thisDate.detail.startDate));
		let end = timeFormat('%Y-%m')(timeParse('%Y-%m')(thisDate.detail.endDate));
		const timeout = setTimeout(() => {
			options = filteredData
				.map((option) => {
					return {
						month_year: option.month_year,
						'More Conservative': { value: option['More Conservative'], color: '#F55D5B' },
						'More Liberal': { value: option['More Liberal'], color: '#16659D' },
						Moderate: { value: option.Moderate, color: '#FDDB46' },
						Unknown: { value: option.Unknown, color: '#B3B3B3' }
					};
				})
				.filter((d) => d.month_year >= start && d.month_year <= end);
		}, 200);
	};

	const handleChange = (event) => {
		let { checked, value } = event.target,
			orderingValue = {}, // map for efficient lookup of sortIndex
			sortOrderValue = ['More Conservative', 'More Liberal', 'Moderate', 'Unknown'],
			orderingColor = {},
			sortOrderColor = ['#F55D5B', '#16659D', '#FDDB46', '#B3B3B3'];

		fill = getKeyColor(value);

		if (checked) {
			chosenValues = [...chosenValues, value];
			seriesColors = [...seriesColors, fill];
			///sort values
			for (let i = 0; i < sortOrderValue.length; i++) orderingValue[sortOrderValue[i]] = i;
			chosenValues.sort(function (a, b) {
				return orderingValue[a] - orderingValue[b];
			});
			//sort fills
			for (let i = 0; i < sortOrderColor.length; i++) orderingColor[sortOrderColor[i]] = i;
			seriesColors.sort(function (a, b) {
				return orderingColor[a] - orderingColor[b];
			});
		} else {
			chosenValues = chosenValues.filter((v) => v !== value);
			seriesColors = seriesColors.filter((v) => v !== fill);
		}
	};

	// this is if you want the scales to update too
	// const tweenOptions = {
	// 	duration: 300,
	// 	easing: eases.cubicInOut
	// };

	// $: xDomain = tweened(undefined, tweenOptions);
	// $: yDomain = tweened(undefined, tweenOptions);
</script>

<div class="flex flex-row justify-between items-center">
	<ul class="flex flex-row gap-2 flex-2">
		{#each Object.entries(options[0]) as [value, { color, order }]}
			{#if value !== 'month_year'}
				<li class="relative">
					<input
						type="checkbox"
						class="sr-only peer	flex p-5 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none hover:bg-gray-50 peer-checked:ring-green-500 peer-checked:ring-2 peer-checked:border-transparent"
						name={order}
						{value}
						{order}
						id={value}
						checked={chosenValues.includes(value)}
						on:change={handleChange}
					/>
					<div
						class="absolute w-3 h-3 right-3 peer-checked:block peer-checked:bg-[{color}] bg-bi-gray-light top-2 left-3"
						for={value}
					/>
					<label
						class="flex pl-7 bg-white border border-gray-300 cursor-pointer hover:bg-bi-gray-light text-sm self-center justify-self-center text-center p-1.5 font-sans"
						for={value}
					>
						{value}</label
					>
				</li>
			{/if}
		{/each}
	</ul>
	<div class="flex-1 flex-row gap-2 flex-1 justify-end">
		<DateRangeSelect
			--applyButtonWidth="65px"
			--applyButtonHeight="25px"
			startDateMin="2012-12"
			endDateMax="2021-12"
			on:onApplyDateRange={handleApplyDateRange}
		/>
	</div>
</div>

<div class="w-full" style:height="400px">
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
			<AxisY ticks={6} gridlines={true} textAnchor="end" dyTick="4" xTick="-6" />
			<ColumnStacked />
		</Svg>
	</LayerCake>
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
