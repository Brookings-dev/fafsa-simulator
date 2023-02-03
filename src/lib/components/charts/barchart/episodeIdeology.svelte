<script>
	// example chart from LayerCake
	// https://layercake.graphics/example/Bar/
	import { LayerCake, Svg, flatten, Html } from 'layercake';
	import { scaleBand, scaleOrdinal } from 'd3-scale';
	import { timeFormat, timeParse, extent } from 'd3';
	import { stack, stackOrderReverse } from 'd3-shape';
	import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import ColumnStacked from './ColumnStacked.svelte';
	import AxisX from './AxisX.svelte';
	import AxisY from './AxisY.svelte';
	import Slider from '$lib/components/helpers/Slider.svelte';
	import Tooltip from '$lib/components/helpers/Tooltip.svelte';
	import getKeyColor from '$lib/keyLookup';
	import data from '$lib/data/ideology.csv';
	import { onMount } from 'svelte';

	const yKey = [0, 1];
	const zKey = 'key';
	const xScale = scaleBand().paddingInner([0.12]).round(false);

	let filteredData = data;
	let fill;
	let xKey = 'month_year';
	let tooltip;
	let containerWidth;
	let containerHeight;
	let parentContainer;
	let height = 400;
	let mounted;
	let start = '2012-12';
	let end = '2021-12';
	let extentVal;
	let maxVal;
	let seriesNames = [];
	let pageWidth;
	let tipWidth = 200; // width of the tooltip
	let cursor = { x: 0, y: 0 }; // cursor pos
	let chartWrapper;
	let range = [1354320000000, 1638316800000];

	$: isMobile = containerWidth < 768;
	$: isTablet = containerWidth < 1010;

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

	$: extentVal = extent(flatten(series), (d) => d[1]);
	$: maxVal = Math.ceil(extentVal[1] / 94) * 100;
	$: seriesNames = Object.keys(filteredData[0]).filter((d) => d !== xKey);
	$: chosenValues = seriesNames;
	$: seriesColors = ['#F55D5B', '#16659D', '#FDDB46', '#B3B3B3'];
	$: stackData = stack()
		.order(stackOrderReverse)
		.keys(chosenValues)
		.value((obj, key) => obj[key]['value']);
	$: series = stackData(options);

	const formatDate = (d) => timeFormat('%b %Y')(timeParse('%Y-%m')(d));

	const formatTickX = (tick) =>
		!isMobile
			? timeFormat('%b')(timeParse('%Y-%m')(tick)) == 'Jan' ||
			  timeFormat('%Y')(timeParse('%Y-%m')(tick)) == 'Dec 2021'
				? timeFormat('%Y')(timeParse('%Y-%m')(tick))
				: ''
			: timeFormat('%m')(timeParse('%Y-%m')(tick)) == '01' &&
			  timeFormat('%Y')(timeParse('%Y-%m')(tick)) % 2 == 0
			? timeFormat('%Y')(timeParse('%Y-%m')(tick))
			: '';

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
	const tweenOptions = {
		duration: 300,
		easing: cubicInOut
	};
	$: xDomain = tweened(undefined, tweenOptions);
	$: yDomain = tweened(undefined, tweenOptions);

	// $: console.log({ tooltip });

	const mousemove = (e) => {
		// find where the cursor is
		cursor = { x: e.clientX, y: e.clientY };
		// console.log(cursor);
	};
	const mouseout = (e) => {
		cursor = undefined;
	};

	const timeStampToRfc = (date) => {
		if (date) return new Date(date).toJSON().slice(0, 7);
		return undefined;
	};

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
</script>

<svelte:window
	on:scroll={() => {
		if (tooltip) tooltip = undefined;
	}}
	on:mousemove={mousemove}
	on:mouseleave={mouseout}
	bind:innerWidth={pageWidth}
/>

<figure
	bind:clientWidth={containerWidth}
	bind:this={chartWrapper}
	class={!isTablet ? 'bi-mx-8' : 'bi-mx-1'}
>
	<figcaption class="leading-6">
		Popular political podcasters have recorded more episodes in recent years
	</figcaption>
	<p
		class={!isMobile
			? 'chart-text subtitle bi-ml-0 bi-text-sm bi-leading-4'
			: 'chart-text subtitle bi-text-sm bi-mb-3 bi-mt-2 bi-ml-0 bi-leading-3'}
	>
		Across 79 prominent political podcast series.
	</p>
	<div class="bi-flex bi-flex-row bi-justify-between bi-items-center">
		<ul
			class={!isMobile
				? 'chart-list bi-flex bi-m-0 bi-max-w-[500px] bi-flex-row bi-list-none before:bi-content-none after:bi-content-none bi-content-none'
				: 'chart-list bi-flex bi-flex-row bi-flex-wrap bi-list-none before:bi-content-none after:bi-content-none bi-content-none bi-m-0'}
		>
			{#each Object.entries(options[0]) as [value, { color, order }]}
				{#if value !== 'month_year' && value !== 'Total'}
					<li class="chart-list bi-relative bi-list-none">
						<input
							type="checkbox"
							class="bi-sr-only bi-z-0 bi-peer bi-flex bi-p-0 bi-bg-white bi-border bi-border-gray-300 bi-rounded-sm bi-cursor-pointer focus:bi-outline-none md:hover:bi-bg-gray-50 peer-checked:bi-ring-2 peer-checked:bi-border-transparent"
							name={order}
							{value}
							{order}
							id={value}
							checked={chosenValues.includes(value)}
							on:change={handleChange}
						/>
						<div
							class="bi-absolute bi-w-3.5 bi-h-3.5 bi-right-3 bi-left-2 bi-top-2 peer-checked:bi-block peer-checked:bi-bg-[{color}] bi-z-10 md:peer-hover:bi-opacity-50 bi-bg-bi-gray-light bi-z-[2]"
							for={value}
						/>
						<label
							class="bi-flex bi-leading-3 bi-pl-7 md:hover:bi-drop-shadow-lg bi-bg-white bi-border bi-border-gray-300 bi-cursor-pointer bi-text-sm bi-self-center bi-justify-self-center bi-text-center bi-p-2 bi-font-sans"
							for={value}
						>
							{value}</label
						>
					</li>
				{/if}
			{/each}
		</ul>
		{#if !isMobile}
			<div class="bi-flex shrink-0 bi-justify-end">
				<div class="bi-grid bi-justify-end">
					<div class="bi-grid">
						<h1
							class="bi-text-sm chart-title bi-text-center bi-leading-none bi-pointer-events-none"
						>
							{formatDate(start)} &nbsp; &#8212; &nbsp; {formatDate(end)}
						</h1>
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
		{/if}
	</div>
	<div
		class={!isMobile
			? 'bi-chart-container bi-max-w-[1000px]'
			: 'bi-chart-container bi-max-w-[1000px] bi-pb-2'}
		style="height:400px;"
		bind:this={parentContainer}
		bind:clientHeight={containerHeight}
	>
		{#if mounted}
			<LayerCake
				padding={{ top: 40, right: 0, bottom: 20, left: 20 }}
				x={(d) => d.data['month_year']}
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
						tickMarksIdeo={!isMobile ? true : false}
						tickMarksIdeoMobile={!isMobile ? false : true}
						gridlines={false}
						baseline={true}
						fontColor="#333333"
						formatTick={formatTickX}
						label={'Month/Year'}
						dyLabel={!isMobile ? 35 : 25}
						centerLabel={true}
					/>
					<AxisY ticks={5} gridlines={true} textAnchor="start" dyTick="4" xTick="0" />
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
							<!-- <TooltipLine tick={tooltip.month_year} lineHeight={cursor.y} /> -->
						{/if}
					{/if}
				</Svg>
			</LayerCake>
		{/if}
	</div>
	{#if isMobile}
		<div class="bi-grid bi-justify-center bi-pb-0 bi-pt-4">
			<h1
				class="bi-text-sm chart-title bi-text-center bi-mt-3 bi-leading-none bi-pointer-events-none"
			>
				{formatDate(start)} &nbsp; &#8212; &nbsp; {formatDate(end)}
			</h1>
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
	{/if}
	<p
		class={!isMobile
			? 'chart-text footnote-chart bi-mt-14 bi-leading-4 bi-text-xs'
			: 'chart-text footnote-chart bi-mt-4 bi-leading-4 bi-text-xs'}
	>
		<b class="bolded">Source:</b> Author's collection of available podcast episodes.
	</p>
</figure>

{#if !!tooltip}
	<Tooltip tipHeight={containerHeight} {tipWidth} parentContainer={chartWrapper} {height}>
		<h1 class="bi-text-[#003A70] chart-title bi-font-bold bi-text-sm bi-m-1 bi-mb-2">
			{timeFormat('%B %Y')(timeParse('%Y-%m')(tooltip.month_year))}
		</h1>
		{#if chosenValues.includes('More Conservative') && tooltip['More Conservative'].value != 0}
			<div class="bi-flex bi-my-1 bi-justify-between bi-items-center">
				<p class="chart-text bi-mx-1 bi-my-0 bi-text-sm bi-leading-3">More Conservative:</p>
				<p
					class="chart-text bi-w-[40px] bi-my-0 bi-text-sm bi-leading-3 bi-py-[.3rem] bi-font-semibold bi-text-center bi-px-0 bi-mx-1 bi-text-white bi-bg-[#EA3C3C]"
				>
					{tooltip['More Conservative'].value}
				</p>
			</div>
		{/if}
		{#if chosenValues.includes('More Liberal') && tooltip['More Liberal'].value != 0}
			<div class="bi-flex bi-my-1 bi-justify-between bi-items-center">
				<p class="chart-text bi-mx-1 bi-my-0 bi-text-sm bi-leading-3">More Liberal:</p>
				<p
					class="chart-text bi-w-[40px] bi-leading-3 bi-text-sm bi-py-[.3rem] bi-my-0 bi-font-semibold bi-text-center bi-px-0 bi-mx-1 bi-text-white bi-bg-[#1E7AB9]"
				>
					{tooltip['More Liberal'].value}
				</p>
			</div>
		{/if}
		{#if chosenValues.includes('Moderate') && tooltip['Moderate'].value != 0}
			<div class="bi-flex bi-my-1 bi-justify-between bi-items-center">
				<p class="chart-text bi-mx-1 bi-my-0 bi-text-sm bi-leading-3">Moderate:</p>
				<p
					class="chart-text bi-w-[40px] bi-text-sm bi-my-0 bi-leading-3 bi-py-[.3rem] bi-font-semibold bi-text-center bi-px-0 bi-mx-1 bi-text-white bi-bg-[#C6A634]"
				>
					{tooltip.Moderate.value}
				</p>
			</div>
		{/if}
		{#if chosenValues.includes('Unknown') && tooltip['Unknown'].value != 0}
			<div class="bi-flex bi-my-1 bi-justify-between bi-items-center">
				<p class="chart-text bi-mx-1 bi-text-sm bi-my-0 bi-leading-3">Unknown:</p>
				<p
					class="chart-text bi-w-[40px] bi-text-sm bi-my-0 bi-leading-3 bi-py-[.3rem] bi-font-semibold bi-text-center bi-px-0 bi-mx-1 bi-text-white bi-bg-[#999999]"
				>
					{tooltip.Unknown.value}
				</p>
			</div>
		{/if}
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
