<script>
	// example chart from LayerCake
	// https://layercake.graphics/example/Bar/
	import { LayerCake, Svg, Html } from 'layercake';
	import { scaleBand } from 'd3';
	import { timeParse, timeFormat } from 'd3';

	import Bar from './Bar.svelte';
	import AxisX from './AxisX.svelte';
	import AxisY from './AxisY.svelte';
	import ArrowheadMarker from '$lib/components/helpers/ArrowheadMarker.svelte';
	import Arrows from '$lib/components/helpers/Arrows.svelte';
	import Annotations from '$lib/components/helpers/Annotations.html.svelte';

	import data from '$lib/data/election-fraud.csv';

	let filteredData = data;
	let options = filteredData.map((option) => {
		return {
			year_week: option.year_week,
			total: { value: option.total, altName: 'All Shows' },
			top_100: { value: option.top_100, altName: "In Apple's Top 100 Shows" },
			not_top_100: {
				value: option.not_top_100,
				altName: "Not in Apple's Top 100 Shows"
			}
		};
	});

	const xKey = (d) => timeParse('%Y-%V')(d.year_week);
	$: yKey = (d) => d.total * 100;
	let zKey = 'after_election';
	let selected = 'total';
	let arrowFill = '#F26D00';
	let arrowStroke = 'transparent';
	let insurrectionString = `JANUARY 6<sup>TH</sup>*`;

	const handleChange = (event) => {
		let { checked, value } = event.target;
		if (checked) {
			yKey = (d) => d[value] * 100;
			chosenValues = [value];
		} else {
			chosenValues = chosenValues.filter((v) => v !== value);
		}
	};
	const annotations = [
		{
			text: 'ELECTION DAY',
			top: '30px',
			left: '52%',
			arrows: [
				{
					clockwise: true, // true or false, defaults to true
					source: {
						anchor: 'middle-middle', // can be `{left, middle, right},{top-middle-bottom}`
						dx: 2,
						dy: -25
					},
					target: {
						x: '55%',
						y: '100%'
					}
				}
			]
		},
		{
			text: insurrectionString,
			top: '0px',
			left: '94.8%',
			arrows: [
				{
					source: {
						anchor: 'middle-middle',
						dy: -26,
						dx: 0
					},
					target: {
						x: '97.5%',
						y: '100%'
					}
				}
			]
		}
	];
</script>

<div>
	<div class="flex flex-row justify-between items-center pb-[40px]">
		<div class="flex flex-row gap-2 flex-2">
			{#each Object.entries(options[0]) as [value, { altName }]}
				{#if value !== 'year_week'}
					<div>
						<input
							type="radio"
							class="select-items self-center justify-self-center appearance-none peer"
							{value}
							id={value}
							bind:group={selected}
							name="fraud-selection"
							on:change={handleChange}
						/>
						<label
							class="grid grid-flow-row-dense peer border border-solid justify-center cursor-pointer bg-bi-gray-xLight hover:bg-bi-gray-light peer-checked:bg-bi-gray-dark peer-checked:text-white"
							for={value}
						>
							<div class="flex flex-row justify-between items-center p-[1px]">
								<p class="text-sm self-center justify-self-center text-center p-1">
									{altName}
								</p>
							</div>
						</label>
					</div>
				{/if}
			{/each}
		</div>
		<div class="flex flex-row gap-3 flex-1 justify-end">
			<div class="flex flex-row justify-between items-center p-[1px]">
				<div class="bg-[#5EAEF3] w-3 h-3 m-1" />
				<p class="text-sm self-center justify-self-center text-center p-1">Before Election</p>
			</div>
			<div class="flex flex-row justify-between items-center p-[1px]">
				<div class="bg-[#0D659D] w-3 h-3 m-1" />
				<p class="text-sm self-center justify-self-center text-center p-1">After Election</p>
			</div>
		</div>
	</div>
</div>

<div class="w-full chart-container" style:height="400px">
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
		<Html>
			<Annotations {annotations} />
		</Html>

		<Svg>
			<svelte:fragment slot="defs">
				<ArrowheadMarker fill={arrowFill} stroke={arrowStroke} />
			</svelte:fragment>
			<Arrows {annotations} stroke={arrowFill} />
		</Svg>
	</LayerCake>
</div>
