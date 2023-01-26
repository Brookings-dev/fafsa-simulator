<script>
	// example chart from LayerCake
	// https://layercake.graphics/example/Bar/
	import { LayerCake, Svg, flatten, calcExtents } from 'layercake';
	import { scaleBand, scaleOrdinal } from 'd3-scale';
	import { timeFormat, timeParse, max, rollups, descending } from 'd3';
	import { stack, stackOrderReverse } from 'd3-shape';
	import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import ColumnStacked from './ColumnStacked.svelte';
	import AxisX from './AxisX.svelte';
	import AxisY from './AxisY.svelte';
	import Slider from '$lib/components/helpers/Slider.svelte';
	import SliderDateSelect from '$lib/components/helpers/SliderDateSelect.svelte';
	import Tooltip from '$lib/components/helpers/Tooltip.svelte';
	import TooltipLine from './TooltipLine.svelte';
	import * as d3 from 'd3';
	const tweenOptions = {
		duration: 300,
		easing: cubicInOut
	};

	// const { xScale, yRange } = getContext('LayerCake');

	import getKeyColor from '$lib/keyLookup';

	import data from '$lib/data/ideology.csv';
	import { onMount } from 'svelte';

	const implicit = Symbol('implicit');

	const yKey = [0, 1];
	const zKey = 'key';

	let filteredData = data;
	let fill;
	let xKey = 'month_year';
	let tooltip;
	let containerWidth;
	let parentContainer;
	let height = 400;
	$: isMobile = containerWidth < 768;
	let mounted;
	let start = '2012-12';
	let end = '2021-12';

	onMount(() => (mounted = true));

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
			Unknown: { order: 4, value: option.Unknown, color: '#B3B3B3', className: 'unknown' },
			Total:
				Number(option['More Conservative']) +
				Number(option['More Liberal']) +
				Number(option['Moderate']) +
				Number(option['Unknown'])
		};
	});

	let extent;
	let maxVal;
	$: extent = d3.extent(flatten(series), (d) => d[1]);
	$: maxVal = Math.ceil(extent[1] / 90) * 100;

	$: seriesNames = Object.keys(filteredData[0]).filter((d) => d !== xKey);
	$: chosenValues = seriesNames;

	$: seriesColors = ['#F55D5B', '#16659D', '#FDDB46', '#B3B3B3'];

	$: stackData = stack()
		.order(stackOrderReverse)
		.keys(chosenValues)
		.value((obj, key) => obj[key]['value']);

	$: series = stackData(options);

	// const handleApplyDateRange = (thisDate) => {
	// 	console.log(thisDate);
	// 	start = timeFormat('%Y-%m')(timeParse('%Y-%m')(thisDate.detail.startDate));
	// 	end = timeFormat('%Y-%m')(timeParse('%Y-%m')(thisDate.detail.endDate));
	// 	const timeout = setTimeout(() => {
	// 		options = filteredData
	// 			.map((option) => {
	// 				return {
	// 					month_year: option.month_year,
	// 					'More Conservative': { value: option['More Conservative'], color: '#F55D5B' },
	// 					'More Liberal': { value: option['More Liberal'], color: '#16659D' },
	// 					Moderate: { value: option.Moderate, color: '#FDDB46' },
	// 					Unknown: { value: option.Unknown, color: '#B3B3B3' }
	// 				};
	// 			})
	// 			.filter((d) => d.month_year >= start && d.month_year <= end);
	// 	}, 200);
	// };

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

	$: xDomain = tweened(undefined, tweenOptions);
	$: yDomain = tweened(undefined, tweenOptions);

	// $: console.log({ tooltip });

	let pageWidth;
	let tipWidth = 200; // width of the tooltip
	let cursor = { x: 0, y: 0 }; // cursor pos
	let chartWrapper;

	const xScale = scaleBand().paddingInner([0.12]).round(true);

	const mousemove = (e) => {
		// find where the cursor is
		cursor = { x: e.clientX, y: e.clientY };
		// cursor = { x: e.clientX + 50, y: 200 };
		// console.log(cursor);
	};
	const mouseout = (e) => {
		cursor = undefined;
	};

	const formatTickX = (tick) =>
		timeFormat('%b')(timeParse('%Y-%m')(tick)) == 'Jan' ||
		timeFormat('%b %Y')(timeParse('%Y-%m')(tick)) == 'Dec 2021'
			? timeFormat('%b %Y')(timeParse('%Y-%m')(tick))
			: '';

	let range = [1354320000000, 1638316800000];

	function timeStampToRfc(date) {
		if (date) return new Date(date).toJSON().slice(0, 7);
		return undefined;
	}

	const handleApplyDoubleDateRange = (thisDate) => {
		start = timeStampToRfc(thisDate.detail[0]);
		end = timeStampToRfc(thisDate.detail[1]);

		setTimeout(() => {
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
	const formatDate = (d) => timeFormat('%b %Y')(timeParse('%Y-%m')(d));
</script>

<svelte:window
	on:scroll={() => {
		if (tooltip) tooltip = undefined;
	}}
	on:mousemove={mousemove}
	on:mouseleave={mouseout}
	bind:innerWidth={pageWidth}
/>

<figure bind:clientWidth={containerWidth} bind:this={chartWrapper}>
	<figcaption>Popular political podcasters have recorded more episodes in recent years</figcaption>
	<p class="subtitle bi-mb-8">Across 79 prominent political podcast series.</p>
	<div class="bi-flex bi-flex-row bi-justify-between bi-items-center">
		<ul
			class="bi-flex bi-flex-row bi-gap-2 bi-flex-2 bi-list-none before:bi-content-none after:bi-content-none bi-content-none"
		>
			{#each Object.entries(options[0]) as [value, { color, order }]}
				{#if value !== 'month_year' && value !== 'Total'}
					<li class="bi-relative">
						<input
							type="checkbox"
							class="bi-sr-only bi-peer bi-flex bi-p-0 bi-bg-white bi-border bi-border-gray-300 bi-rounded-sm bi-cursor-pointer focus:bi-outline-none hover:bi-bg-gray-50 peer-checked:bi-ring-2 peer-checked:bi-border-transparent"
							name={order}
							{value}
							{order}
							id={value}
							checked={chosenValues.includes(value)}
							on:change={handleChange}
						/>
						<div
							class="bi-absolute bi-w-3.5 bi-h-3.5 bi-right-3 bi-top-2 peer-checked:bi-block peer-checked:bi-bg-[{color}] bi-z-40 peer-hover:bi-opacity-50 bi-bg-bi-gray-light bi-left-2"
							for={value}
						/>
						<label
							class="bi-flex bi-pl-7 hover:bi-drop-shadow-lg bi-bg-white bi-border bi-border-gray-300 bi-cursor-pointer bi-text-sm bi-self-center bi-justify-self-center bi-text-center bi-p-1 bi-font-sans"
							for={value}
						>
							{value}</label
						>
					</li>
				{/if}
			{/each}
		</ul>
		<div class="bi-gap-2 bi-flex-1 bi-justify-end">
			<!-- <SliderDateSelect
				--applyButtonWidth="54px"
				--applyButtonHeight="30px"
				startDateMin="2012-12"
				endDateMax="2021-12"
				on:onApplyDateRange={handleApplyDateRange}
			/> -->
			<div class="bi-grid bi-justify-end">
				<div class="bi-grid">
					<h1 class="bi-text-sm bi-text-center bi-leading-none bi-pointer-events-none">
						{formatDate(start)} &nbsp; &#8212; &nbsp; {formatDate(end)}
					</h1>
					<!-- <h1 class="bi-text-sm bi-pb-2 bi-justify-end bi-text-center">
				{formatDate(start)} - {formatDate(end)}
			</h1> -->
					<Slider
						class="svelte-slider"
						bind:value={range}
						range
						order
						startDateMin="2012-12"
						endDateMax="2021-12"
						on:input={handleApplyDoubleDateRange}
					/>
				</div>
			</div>
		</div>
	</div>
	<div class="bi-chart-container bi-w-full" style="height: {height}px;" bind:this={parentContainer}>
		{#if mounted}
			<LayerCake
				padding={{ top: 20, right: 0, bottom: 20, left: 20 }}
				x={(d) => d.data[xKey]}
				y={yKey}
				z={zKey}
				{xScale}
				{xDomain}
				yDomain={[0, maxVal]}
				flatData={flatten(series)}
				data={series}
				zScale={scaleOrdinal()}
				zDomain={chosenValues}
				zRange={seriesColors}
				height="400"
			>
				<Svg>
					<AxisX
						tickMarksIdeo={true}
						gridlines={false}
						baseline={true}
						fontColor="#333333"
						formatTick={formatTickX}
					/>
					<AxisY ticks={7} gridlines={true} textAnchor="start" dyTick="4" xTick="0" />
					<ColumnStacked
						on:pointerover={(e) => {
							// console.log('pointerover', e.detail);
							tooltip = e.detail;
						}}
						on:pointerleave={() => {
							tooltip = undefined;
						}}
					/>
					{#if cursor.x !== 0 && cursor.y !== 0}
						{#if !!tooltip}
							<TooltipLine tick={tooltip.month_year} />
						{/if}
					{/if}
				</Svg>
			</LayerCake>
		{/if}
	</div>
	<p class="footnote">
		<b class="bolded">Source:</b> Author's collection of available podcast episodes.
	</p>
</figure>

{#if !!tooltip}
	<Tooltip {tipWidth} parentContainer={chartWrapper}>
		<!-- <section> -->
		<h1 class="bi-text-[#003A70] bi-font-bold bi-text-sm bi-m-1 bi-mb-2">
			{timeFormat('%B %Y')(timeParse('%Y-%m')(tooltip.month_year))}
		</h1>
		{#if chosenValues.includes('More Conservative') && tooltip['More Conservative'].value != 0}
			<div class="bi-flex bi-my-1 bi-justify-between bi-text-sm">
				<p class="bi-mx-1">More Conservative:</p>
				<p
					class="bi-w-[40px] bi-font-semibold bi-text-center bi-px-2 bi-mx-1 bi-text-white bi-bg-[#EA3C3C]"
				>
					{tooltip['More Conservative'].value}
				</p>
			</div>
		{/if}
		{#if chosenValues.includes('More Liberal') && tooltip['More Liberal'].value != 0}
			<div class="bi-flex bi-my-1 bi-justify-between bi-text-sm">
				<p class="bi-mx-1">More Liberal:</p>
				<p
					class="bi-w-[40px] bi-font-semibold bi-text-center bi-px-2 bi-mx-1 bi-text-white bi-bg-[#1E7AB9]"
				>
					{tooltip['More Liberal'].value}
				</p>
			</div>
		{/if}
		{#if chosenValues.includes('Moderate') && tooltip['Moderate'].value != 0}
			<div class="bi-flex bi-my-1 bi-justify-between bi-text-sm">
				<p class="bi-mx-1">Moderate:</p>
				<p
					class="bi-w-[40px] bi-font-semibold bi-text-center bi-px-2 bi-mx-1 bi-text-white bi-bg-[#C6A634]"
				>
					{tooltip.Moderate.value}
				</p>
			</div>
		{/if}
		{#if chosenValues.includes('Unknown') && tooltip['Unknown'].value != 0}
			<div class="bi-flex bi-my-1 bi-justify-between bi-text-sm">
				<p class="bi-mx-1">Unknown:</p>
				<p
					class="bi-w-[40px] bi-font-semibold bi-text-center bi-px-2 bi-mx-1 bi-text-white bi-bg-[#999999]"
				>
					{tooltip.Unknown.value}
				</p>
			</div>
		{/if}

		<!-- </section> -->
	</Tooltip>
{/if}

<style>
	/*
    The wrapper div needs to have an explicit width and height in CSS.
    It can also be a flexbox child or CSS grid element.
    The point being it needs dimensions since the <LayerCake> element will
    expand to fill it.
  */
	/* .chart-container {
		width: 100%;
		height: 100%;
	} */
	.tooltip-line {
		stroke-dasharray: 0.3, 5;
		stroke-linecap: round;
		stroke-width: 2;
		stroke: #003a70;
	}
	div {
		--thumb-bg: #707070;
		--progress-bg: #707070;
		--track-bg: #cccccc;
	}
	.thumb {
		width: 2px !important;
	}
</style>
