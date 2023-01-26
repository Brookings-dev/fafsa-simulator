<script>
	// example chart from LayerCake
	// https://layercake.graphics/example/Bar/
	import { LayerCake, Svg, Html } from 'layercake';
	import { format, scaleBand } from 'd3';
	import { timeParse, timeFormat } from 'd3';

	import Bar from './Bar.svelte';
	import AxisX from './AxisX.svelte';
	import AxisY from './AxisY.svelte';
	import ArrowheadMarker from '$lib/components/helpers/ArrowheadMarker.svelte';
	import ArrowheadMarkerJan from '$lib/components/helpers/ArrowheadMarkerJan.svelte';
	import Arrows from '$lib/components/helpers/Arrows.svelte';
	import Annotations from '$lib/components/helpers/Annotations.html.svelte';

	import data from '$lib/data/election-fraud.csv';
	let containerWidth = 400;

	$: isMobile = containerWidth < 768;
	$: isTablet = containerWidth > 768 && containerWidth < 1023;
	// 	Mobile: 360-767px
	// Tablet: 768-1023px
	// Desktop: 1024px +

	let filteredData = data;
	let options = {};
	$: options = filteredData.map((option) => {
		return {
			year_week: option.year_week,
			total: { value: option.total, altName: !isMobile ? 'All Shows' : 'All' },
			top_100: {
				value: option.top_100,
				altName: !isMobile ? "In Apple's Top 100 Shows" : "Apple's Top 100"
			},
			not_top_100: {
				value: option.not_top_100,
				altName: !isMobile ? "Not in Apple's Top 100 Shows" : "Not Apple's Top 100"
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

	const checkMonth = (d) => timeFormat('%b')(timeParse('%Y-%V')(d));
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
			text1: isMobile ? 'JAN' : 'JANUARY',
			text2: '6th',
			arrows: ['2021-1'],
			top: '20',
			left: '2021-1',
			markerWidth: isMobile ? '50' : '80'
		}
	];
</script>

<figure>
	<figcaption class="bi-my-2 bi-">
		Political series in Apple's Top 100 in November 2020 promoted election-fraud related topics more
		frequently than political shows not in Apple's Top 100
	</figcaption>
	<p class="bi-mb-8 bi-text-md">
		Between the 2020 Democratic National Convention and January 6, 2021
	</p>
	<div>
		<div
			class={!isMobile
				? 'bi-flex bi-flex-row bi-justify-between bi-items-center bi-pb-[40px]'
				: 'bi-flex bi-flex-col bi-justify-between bi-items-center bi-pb-[20px]'}
		>
			<div
				class={!isMobile
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
								class={!isMobile
									? 'bi-grid bi-grid-flow-row-dense bi-peer bi-border bi-border-solid bi-justify-center bi-cursor-pointer bi-bg-bi-gray-xLight hover:bi-bg-[#E2E8EE] hover:bi-drop-shadow-lg peer-checked:bi-bg-bi-gray-dark peer-checked:bi-text-white'
									: 'bi-flex bi-flex-1 bi-peer bi-border bi-border-solid bi-justify-center bi-cursor-pointer bi-bg-bi-gray-xLight hover:bi-bg-[#E2E8EE] hover:bi-drop-shadow-lg peer-checked:bi-bg-bi-gray-dark peer-checked:bi-text-white'}
								for={value}
							>
								<div class="bi-flex bi-flex-row bi-justify-end bi-items-center bi-p-[1px] ">
									<p
										class={!isMobile
											? 'bi-text-sm bi-self-center bi-justify-self-center bi-text-center bi-p-1 bi-px-3'
											: 'bi-text-sm bi-self-center bi-justify-self-center bi-text-center bi-p-1'}
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
				class={!isMobile
					? 'bi-flex bi-flex-row bi-gap-3 bi-flex-1 bi-justify-end'
					: 'bi-flex bi-flex-row bi-gap-3 bi-flex-1 bi-justify-center'}
			>
				<div
					class={!isMobile
						? 'bi-flex bi-flex-row bi-justify-between bi-items-center bi-p-[1px]'
						: 'bi-flex bi-flex-row bi-justify-between bi-items-center bi-pt-[8px]'}
				>
					<div
						class={!isMobile
							? 'bi-bg-[#5EAEF3] bi-w-3 bi-h-3 bi-m-1'
							: 'bi-bg-[#5EAEF3] bi-w-4 bi-h-4 bi-m-.5'}
					/>
					<p class="bi-text-sm bi-self-center bi-justify-self-center bi-text-center bi-p-1">
						Before Election
					</p>
				</div>
				<div
					class={!isMobile
						? 'bi-flex bi-flex-row bi-justify-between bi-items-center bi-p-[1px]'
						: 'bi-flex bi-flex-row bi-justify-between bi-items-center bi-pt-[8px]'}
				>
					<div
						class={!isMobile
							? 'bi-bg-[#0D659D] bi-w-3 bi-h-3 bi-m-1'
							: 'bi-bg-[#0D659D] bi-w-4 bi-h-4 bi-m-.5'}
					/>
					<p class="bi-text-sm bi-self-center bi-justify-self-center bi-text-center bi-p-1">
						After Election
					</p>
				</div>
			</div>
		</div>
	</div>

	<div
		class={!isMobile ? 'bi-w-full chart-container bi-mb-20' : 'bi-w-full chart-container bi-mb-12'}
		style:height="400px"
		bind:clientWidth={containerWidth}
	>
		<LayerCake
			padding={{ top: 0, right: 5, bottom: 0, left: 20 }}
			x={xKey}
			y={yKey}
			z={zKey}
			xScale={scaleBand().paddingInner([0.2]).round(true)}
			xDomain={xKey}
			yDomain={[0, 80]}
			{data}
		>
			<Svg>
				<!-- <AxisX
					id="axis-week"
					gridlines={false}
					fontColor="#333333"
					label="Week"
					formatTick={(tick) =>
						timeFormat('%V')(tick) % 2 == 0 || timeFormat('%V')(tick) == '01'
							? timeFormat('%V')(tick)
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
							? timeFormat('%Y')(tick)
							: ''}
				/> -->
				<AxisX
					gridlines={false}
					baseline={true}
					fontColor="#333333"
					formatTick={!isMobile
						? (tick) =>
								timeFormat('%V')(tick) == 34 ||
								timeFormat('%V')(tick) == 38 ||
								timeFormat('%V')(tick) == 42 ||
								timeFormat('%V')(tick) == 46 ||
								timeFormat('%V')(tick) == 50 ||
								timeFormat('%V')(tick) == 1
									? timeFormat('%b %Y')(tick)
									: ''
						: (tick) =>
								timeFormat('%V')(tick) == 34 ||
								timeFormat('%V')(tick) == 38 ||
								timeFormat('%V')(tick) == 42 ||
								timeFormat('%V')(tick) == 46 ||
								timeFormat('%V')(tick) == 50 ||
								timeFormat('%V')(tick) == 1
									? timeFormat('%m/%y')(tick)
									: ''}
					tickMarksFraud={true}
				/>
				<AxisY
					gridlines={true}
					textAnchor="start"
					dyTick="4"
					xTick="0"
					formatTick={(tick) => (tick !== 0 ? `${tick}%` : tick)}
				/>
				<Bar />
			</Svg>
			<!-- <Html>
				<Annotations {annotations} />
			</Html> -->

			<Svg>
				<svelte:fragment slot="defs">
					<ArrowheadMarkerJan
						fill={arrowFill}
						stroke={arrowStroke}
						{annotations}
						markerWidth={isMobile ? 50 : 80}
					/>
					<ArrowheadMarker fill={arrowFill} stroke={arrowStroke} {annotations} markerWidth="80" />
				</svelte:fragment>
				<Arrows {annotations} stroke={arrowFill} x="2020-38" />
			</Svg>
		</LayerCake>
	</div>
	<p class={!isMobile ? 'bi-mb-3 bi-text-xs' : 'bi-text-xs bi-mb-3'}>
		<b class="bolded">Note:</b> * January 6th explainer text. Lorem ipsum dolor sit amet consectetur
		adipiscing elit sed do eiusmod tempor incididunt ut labore. Lorem ipsum dolor sit amet consectetur
		adipiscing elit sed do eiusmod tempor incididunt ut labore. Source: Author’s Analysis
	</p>
	<p class="footnote-second">
		<b class="bolded">Source:</b> Author's collection of available podcast episodes.
	</p>
</figure>
