<script>
	// example chart from LayerCake
	// https://layercake.graphics/example/Bar/
	import { LayerCake, Svg, Html } from 'layercake';
	import { scaleBand } from 'd3';
	import { timeParse, timeFormat } from 'd3';
	import { onMount } from 'svelte';

	import Bar from './Bar.svelte';
	import AxisX from './AxisX.svelte';
	import AxisY from './AxisY.svelte';
	import ArrowheadMarker from '$lib/components/helpers/ArrowheadMarker.svelte';
	import ArrowheadMarkerJan from '$lib/components/helpers/ArrowheadMarkerJan.svelte';
	import Arrows from '$lib/components/helpers/Arrows.svelte';
	import data from '$lib/data/election-fraud.csv';

	onMount(() => (mounted = true));

	let containerWidth;
	let mounted;
	let containerHeight;
	let chartWrapper;

	const mobile = 768;
	const tablet = 950;
	const desktop = 1011;
	$: isMobile = containerWidth <= mobile;
	$: isBiggerThanMobile = containerWidth > mobile;
	$: isTablet = containerWidth < tablet;
	$: isDesktop = containerWidth > tablet;
	// Mobile: 360-767px
	// Tablet: 768-1023px
	// Desktop: 1024px +

	let filteredData = data;
	let options = {};
	$: options = filteredData.map((option) => {
		return {
			year_week: option.year_week,
			total: { value: option.total, altName: isBiggerThanMobile ? 'All Shows' : 'All' },
			top_100: {
				value: option.top_100,
				altName: isBiggerThanMobile
					? 'In Apple’s Top 100 for Nov. 2020'
					: 'Apple’s Top 100 (Nov 2020)'
			},
			not_top_100: {
				value: option.not_top_100,
				altName: isBiggerThanMobile ? 'Not in Apple’s Top 100 for Nov. 2020' : 'Other Shows'
			}
		};
	});

	const xKey = (d) => timeParse('%Y-%V')(d.year_week);
	$: yKey = (d) => d.total * 100;
	let zKey = 'after_election';
	let selected = 'total';
	let arrowFill = '#F26D00';
	let arrowStroke = 'transparent';

	$: chosenValues = [];

	const handleChange = (event) => {
		let { checked, value } = event.target;
		if (checked) {
			yKey = (d) => d[value] * 100;
			chosenValues = [value];
		} else {
			chosenValues = chosenValues.filter((v) => v !== value);
		}
	};

	let annotations = [];
	$: annotations = [
		{
			text1: 'ELECTION',
			text2: 'DAY',
			arrows: ['2020-45'],
			top: '20',
			left: '2020-45',
			markerWidth: '80'
		},
		{
			text1: containerWidth < mobile ? 'JAN' : 'JANUARY',
			text2: '6th *',
			arrows: ['2021-1'],
			top: '20',
			left: '2021-1',
			markerWidth: isMobile ? '50' : '80'
		}
	];
</script>

<figure
	bind:clientWidth={containerWidth}
	bind:this={chartWrapper}
	class="bi-max-w-[1000px] bi-mx-1"
>
	<figcaption class="bi-my-2 bi-leading-6">
		Political series in Apple's Top 100 in November 2020 promoted election-fraud related topics more
		frequently than political shows not in Apple's Top 100
	</figcaption>
	<p
		class={!isMobile
			? 'subtitle chart-text bi-pb-0 bi-ml-0 bi-text-sm bi-leading-4'
			: 'subtitle chart-text bi-text-sm bi-mb-3 bi-mt-0 bi-ml-0 bi-leading-4'}
	>
		Between the 2020 Democratic National Convention and January 6, 2021
	</p>
	<div>
		<div
			class={!isMobile && !isTablet
				? 'bi-flex bi-flex-row bi-justify-between bi-items-center bi-pb-[40px]'
				: 'bi-flex bi-flex-col bi-justify-between bi-items-center bi-pb-[20px]'}
		>
			<div
				class={!isMobile && !isTablet
					? 'bi-flex bi-flex-row bi-gap-2 bi-flex-2'
					: 'bi-flex bi-flex-row bi-justify-center bi-flex-grow bi-w-full'}
			>
				{#each Object.entries(options[0]) as [value, { altName }]}
					{#if value !== 'year_week'}
						<div class="bi-flex bi-grow bi-justify-center">
							<input
								type="radio"
								class="bi-select-items bi-self-center bi-justify-self-center bi-appearance-none bi-peer"
								{value}
								id={value}
								bind:group={selected}
								name="fraud-selection"
								on:change={handleChange}
							/>
							<label
								class={!isTablet
									? 'bi-grid bi-grid-flow-row-dense bi-peer bi-border bi-border-solid bi-justify-center bi-cursor-pointer bi-bg-bi-gray-xLight md:hover:bi-bg-[#E2E8EE] md:hover:bi-drop-shadow-lg peer-checked:bi-bg-bi-gray-dark peer-checked:bi-text-white'
									: 'bi-flex bi-flex-1 bi-peer bi-border bi-border-solid bi-justify-center bi-cursor-pointer bi-bg-bi-gray-xLight md:hover:bi-bg-[#E2E8EE] md:hover:bi-drop-shadow-lg peer-checked:bi-bg-bi-gray-dark peer-checked:bi-text-white'}
								for={value}
							>
								<div class="bi-flex bi-flex-row bi-justify-end bi-items-center bi-p-[1px] ">
									<p
										class={!isMobile
											? 'chart-text bi-text-sm bi-mb-0 bi-self-center bi-leading-7 bi-justify-self-center bi-text-center bi-px-3 bi-mx-0'
											: 'chart-text bi-text-[.8rem] bi-mb-0 bi-self-center bi-leading-7 bi-justify-self-center bi-text-center bi-px-0 bi-mx-0'}
									>
										{altName}
									</p>
								</div>
							</label>
						</div>
					{/if}
				{/each}
			</div>
			<div
				class={!isTablet
					? 'bi-flex bi-flex-row bi-gap-3 bi-flex-1 bi-justify-end'
					: 'bi-flex bi-flex-row bi-gap-3 bi-flex-1 bi-justify-center'}
			>
				<div
					class={!isTablet
						? 'bi-flex bi-flex-row bi-justify-between bi-items-center bi-p-[1px]'
						: 'bi-flex bi-flex-row bi-justify-between bi-items-center bi-pt-[8px]'}
				>
					<div
						class={!isTablet
							? 'bi-bg-[#5AADF6] bi-w-4 bi-h-4 bi-m-0'
							: 'bi-bg-[#5AADF6] bi-w-4 bi-h-4 bi-m-0'}
					/>
					<p
						class="chart-text bi-text-sm bi-mb-0 bi-self-center bi-justify-self-center bi-mx-0 bi-text-center bi-p-1"
					>
						Before Election
					</p>
				</div>
				<div
					class={!isTablet
						? 'bi-flex bi-flex-row bi-justify-between bi-items-center bi-p-[1px]'
						: 'bi-flex bi-flex-row bi-justify-between bi-items-center bi-pt-[8px]'}
				>
					<div
						class={!isTablet
							? 'bi-bg-[#00649F] bi-w-4 bi-h-4 bi-m-0'
							: 'bi-bg-[#00649F] bi-w-4 bi-h-4 bi-m-0'}
					/>
					<p
						class="chart-text bi-text-sm bi-mx-0 bi-mb-0 bi-self-center bi-justify-self-center bi-text-center bi-p-1"
					>
						After Election
					</p>
				</div>
			</div>
		</div>
	</div>

	<div
		class={!isTablet ? 'chart-container bi-mb-20' : 'chart-container bi-mb-16'}
		style="height:400px;"
		bind:clientHeight={containerHeight}
	>
		{#if mounted}
			<LayerCake
				padding={{ top: 0, right: 5, bottom: 0, left: 20 }}
				x={xKey}
				y={yKey}
				z={zKey}
				xScale={scaleBand().paddingInner([0.2]).round(true)}
				xDomain={xKey}
				yDomain={[0, 80]}
				{data}
				height="400"
			>
				<Svg>
					<AxisX
						gridlines={false}
						baseline={true}
						fontColor="#333333"
						formatTick={!isMobile
							? (tick) =>
									timeFormat('%V')(tick) == 37 ||
									timeFormat('%V')(tick) == 41 ||
									timeFormat('%V')(tick) == 45 ||
									timeFormat('%V')(tick) == 50 ||
									timeFormat('%V')(tick) == 1
										? timeFormat('%b %Y')(tick)
										: ''
							: (tick) =>
									timeFormat('%V')(tick) == 37 ||
									timeFormat('%V')(tick) == 41 ||
									timeFormat('%V')(tick) == 45 ||
									timeFormat('%V')(tick) == 50 ||
									timeFormat('%V')(tick) == 1
										? timeFormat('%b')(tick)
										: ''}
						tickMarksFraud={true}
						label="Week/Year"
						dyLabel={!isMobile ? '35' : '45'}
						textAnchor="middle"
						centerLabel={true}
					/>

					<AxisX
						class="bi-p-10"
						gridlines={false}
						baseline={true}
						fontColor="#333333"
						formatTick={!isMobile
							? (tick) =>
									timeFormat('%V')(tick) == 37 ||
									timeFormat('%V')(tick) == 41 ||
									timeFormat('%V')(tick) == 45 ||
									timeFormat('%V')(tick) == 50 ||
									timeFormat('%V')(tick) == 1
										? timeFormat('%b %Y')(tick)
										: ''
							: (tick) =>
									timeFormat('%V')(tick) == 37 ||
									timeFormat('%V')(tick) == 41 ||
									timeFormat('%V')(tick) == 45 ||
									timeFormat('%V')(tick) == 50 ||
									timeFormat('%V')(tick) == 1
										? timeFormat('%Y')(tick)
										: ''}
						tickMarksFraud={true}
						dyTick={isMobile ? 17 : 0}
					/>
					<AxisY
						gridlines={true}
						textAnchor="start"
						dyTick="4"
						xTick="0"
						formatTick={(tick) => (tick !== 0 ? `${tick}%` : tick)}
					/>
					<Bar />
					<svelte:fragment slot="defs">
						<ArrowheadMarkerJan
							fill={arrowFill}
							stroke={arrowStroke}
							{annotations}
							markerWidth={containerWidth < mobile ? 50 : 80}
						/>
						<ArrowheadMarker fill={arrowFill} stroke={arrowStroke} {annotations} markerWidth="80" />
					</svelte:fragment>
					<Arrows
						{annotations}
						stroke={arrowFill}
						x="2020-38"
						findMidpoint={isMobile ? 7 : isTablet ? 14 : 20}
						findMidElection={isMobile ? 4 : 1.5}
					/>
				</Svg>
			</LayerCake>
		{/if}
	</div>
	<p
		class={!isMobile
			? 'chart-text bi-leading-4 bi-pb-1 bi-pt-6 bi-m-0 bi-text-xs'
			: 'chart-text bi-leading-4 bi-text-xs bi-m-0 bi-pb-1 bi-pt-8'}
	>
		<b class="bolded">Note:</b> * On January 6, 2021, supporters of outgoing President Donald Trump stormed
		the U.S. Capitol to stop the certification of the 2020 election results.
	</p>
	<p class="chart-text footnote-second-chart bi-leading-4 bi-m-0 bi-text-xs">
		<b class="bolded">Source:</b> Author's collection of available podcast episodes.
	</p>
</figure>
