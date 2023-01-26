<script>
	// example chart from LayerCake
	// https://layercake.graphics/example/Bar/
	import { LayerCake, Svg, flatten, Html } from 'layercake';
	import { scaleBand, scaleOrdinal } from 'd3-scale';
	import { timeFormat, timeParse } from 'd3';
	import * as d3 from 'd3';
	import { stack, stackOrderReverse } from 'd3-shape';

	import ColumnStacked from './ColumnStacked.svelte';
	import AxisX from './AxisX.svelte';
	import AxisY from './AxisY.svelte';
	import ArrowheadMarkerFlex from '$lib/components/helpers/ArrowheadMarkerFlex.svelte';
	import ArrowsFlex from '$lib/components/helpers/ArrowsFlex.svelte';
	import AnnotationsFlex from '$lib/components/helpers/AnnotationsFlex.html.svelte';

	import getKeyColor from '$lib/keyLookup';

	import data from '$lib/data/covid-claims.csv';

	const yKey = [0, 1];
	const zKey = 'key';

	let xKey = 'week_year';
	let covidData = data;
	let fill;
	let arrowFill = '#DCE2E7';
	let arrowStroke = 'transparent';
	let pathStroke = '#AAAAAA';

	let newData = covidData.map((option) => {
		return {
			week_year: option.week_year,
			'Alternative Treatments/Prevention': {
				order: 1,
				value: option['Alternative Treatments/Prevention'],
				color: '#00649f',
				altName: 'Treatments/ Prevention'
			},
			Conspiracies: {
				order: 2,
				value: option['Conspiracies'],
				color: '#8BC6FD',
				altName: 'Conspiracies'
			},
			'Disease Severity': {
				order: 3,
				value: option['Disease Severity'],
				color: '#2FA5B2',
				altName: 'Disease Severity'
			},
			'Government Policy/Response': {
				order: 4,
				value: option['Government Policy/Response'],
				color: '#FEDB31',
				altName: 'Government Policy/Response'
			},
			Testing: { order: 5, value: option['Testing'], color: '#C7A70A', altName: 'Testing' },
			'Vaccine Efficacy/Side Effects': {
				order: 6,
				value: option['Vaccine Efficacy/Side Effects'],
				color: '#F25D00',
				altName: 'Vaccine'
			}
		};
	});

	let extent;
	let maxVal;
	$: extent = d3.extent(flatten(series), (d) => d[1]);
	$: maxVal = Math.ceil(extent[1] / 5) * 5;

	$: seriesNames = Object.keys(covidData[0]).filter((d) => d !== xKey);
	$: chosenValues = seriesNames;
	$: seriesColors = ['#00649f', '#8BC6FD', '#2FA5B2', '#FEDB31', '#C7A70A', '#F25D00'];
	//[dark blue, light blue, turq, yellow, gold, orange]

	$: stackData = stack()
		.order(stackOrderReverse)
		.keys(chosenValues)
		.value((obj, key) => obj[key]['value']);

	$: series = stackData(newData);

	const handleChange = (event) => {
		let { checked, value } = event.target,
			orderingValue = {}, // map for efficient lookup of sortIndex
			sortOrderValue = [
				'Alternative Treatments/Prevention',
				'Conspiracies',
				'Disease Severity',
				'Government Policy/Response',
				'Testing',
				'Vaccine Efficacy/Side Effects'
			],
			orderingColor = {},
			sortOrderColor = ['#00649f', '#8BC6FD', '#2FA5B2', '#FEDB31', '#C7A70A', '#F25D00'];

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

	const checkMonth = (d) => timeFormat('%b')(timeParse('%Y-%V')(d));
	const checkWeek = (d) => timeFormat('%V')(timeParse('%Y-%V')(d));
	// const checkYear = (d) => timeFormat('%Y')(timeParse('%Y-%V')(d));
	const formatTickX = (tick) =>
		// timeFormat('%b %Y')(timeParse('%Y-%V')(tick))
		(checkMonth(tick) == 'Feb' && checkWeek(tick) == 8 && checkMonth(tick) !== 'Mar') ||
		(checkMonth(tick) == 'May' && checkWeek(tick) == 20 && checkMonth(tick) != 'Jun') ||
		(checkMonth(tick) == 'Aug' && checkWeek(tick) == 33) ||
		(checkMonth(tick) == 'Nov' && checkWeek(tick) == 47)
			? timeFormat('%b %Y')(timeParse('%Y-%V')(tick))
			: '';
	console.log(covidData);
	const annotations = [
		{
			text: "AMERICA'S FRONTLINE DOCTORS",
			modalText:
				'America’s Frontline Doctors placeholder text. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
			top: '-50px',
			left: '12.5%',
			width: '129px',
			padding: '5px',
			arrows: ['2020-31']
		},
		{
			text: '2020 ELECTION',
			modalText:
				'2020 Election placeholder text. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
			top: '-88px',
			left: '31.75%',
			width: '70px',
			arrows: ['2020-44']
		},
		{
			text: "FAUCI'S EMAILS RELEASED",
			modalText:
				'FAUCI placeholder text. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
			top: '-130px',
			left: '56%',
			width: '100px',
			arrows: ['2021-23']
		},
		{
			text: 'DELTA VARIANT PEAK',
			modalText:
				'DELTA VARIANT placeholder text. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
			top: '-170px',
			left: '70%',
			width: '85px',
			padding: '5px',
			arrows: ['2021-38']
		},
		{
			text: 'OMICRON WAVE',
			modalText:
				'Fauci’s Emails Released — In June 2021, Dr. Fauci’s correspondences from the early stages of the pandemic were released via Freedom of Information Act. They included speculation regarding both the efficacy of masks and the “lab leak” theory that the virus was manufactured and accidentally escaped from the Wuhan Institute of Virology in China. This led to a spike in conspiratorial claims.',
			top: '-210px',
			left: '82%',
			width: '65px',
			arrows: ['2021-48']
		}
	];
</script>

<!-- <div class="flex flex-row justify-between items-center">
	<div class="flex flex-row gap-2 flex-1 pb-[50px]"> -->
<figure>
	<figcaption class="title-no-subtitle">
		The spread of unsubstantiated and false coronavirus-related claims ebbed and flowed throughout
		the pandemic
	</figcaption>
	<!-- <p class="subtitle bi-mb-8">Data presented on a weekly basis.</p> -->

	<div class="bi-flex bi-flex-row bi-justify-between bi-items-center">
		<ul class="bi-flex bi-flex-row bi-gap-2 bi-flex-1 bi-pb-[40px]">
			{#each Object.entries(newData[0]) as [value, { color, order, altName }]}
				{#if value !== 'week_year'}
					<li class="bi-relative">
						<input
							type="checkbox"
							class="bi-sr-only bi-peer bi-flex bi-p-5 bi-bg-white bi-border bi-border-gray-300 bi-rounded-lg bi-cursor-pointer focus:bi-outline-none peer-checked:bi-ring-2 peer-checked:bi-border-transparent"
							name={altName}
							{value}
							{order}
							id={value}
							checked={chosenValues.includes(value)}
							on:change={handleChange}
						/>
						<div
							class="bi-absolute bi-w-3.5 bi-h-3.5 bi-right-3 peer-checked:bi-block peer-checked:bi-bg-[{color}] bi-bg-bi-gray-light peer-hover:bi-opacity-50 bi-top-2.5 bi-left-2 bi-z-50"
							for={value}
						/>
						<label
							class="bi-flex bi-pl-7 bi-bg-white bi-border bi-border-gray-300 bi-cursor-pointer hover:bi-drop-shadow-lg bi-text-sm bi-self-center bi-justify-self-center bi-text-center bi-p-1.5 bi-font-sans"
							for={value}
						>
							{altName}</label
						>
					</li>
				{/if}
			{/each}
		</ul>
	</div>
	<div class="bi-w-full chart-container" style:height="400px">
		<LayerCake
			padding={{ top: 50, right: 0, bottom: 20, left: 20 }}
			x={(d) => d.data[xKey]}
			y={yKey}
			z={zKey}
			xScale={scaleBand().paddingInner([0.12]).round(true)}
			xDomain={null}
			yDomain={[0, maxVal]}
			flatData={flatten(series)}
			data={series}
			zScale={scaleOrdinal()}
			zDomain={chosenValues}
			zRange={seriesColors}
		>
			<Svg>
				<AxisX gridlines={false} formatTick={formatTickX} tickMarksCovid={true} tickMarks={false} />
				<AxisY ticks={4} gridlines={true} textAnchor="start" dyTick="4" xTick="0" />
				<ColumnStacked />
			</Svg>

			<Html>
				<AnnotationsFlex {annotations} />
			</Html>

			<Svg>
				<svelte:fragment slot="defs">
					<ArrowheadMarkerFlex fill={arrowFill} stroke={arrowStroke} />
				</svelte:fragment>
				<ArrowsFlex {annotations} stroke={pathStroke} />
			</Svg>
		</LayerCake>
	</div>
	<p class="footnote">
		<b class="bolded">Source:</b> Author's collection of available podcast episodes.
	</p>
</figure>

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
