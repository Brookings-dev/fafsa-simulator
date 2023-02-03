<script>
	// example chart from LayerCake
	// https://layercake.graphics/example/Bar/
	import { LayerCake, Svg, flatten, Html } from 'layercake';
	import { scaleBand, scaleOrdinal } from 'd3-scale';
	import { timeFormat, timeParse, extent } from 'd3';
	import { stack, stackOrderReverse } from 'd3-shape';
	import ColumnStacked from './ColumnStacked.svelte';
	import AxisX from './AxisX.svelte';
	import AxisY from './AxisY.svelte';
	import ArrowheadMarkerFlex from '$lib/components/helpers/ArrowheadMarkerFlex.svelte';
	import ArrowsFlex from '$lib/components/helpers/ArrowsFlex.svelte';
	import AnnotationsFlex from '$lib/components/helpers/AnnotationsFlex.html.svelte';
	import { onMount } from 'svelte';
	import getKeyColor from '$lib/keyLookup';

	import data from '$lib/data/covid-claims.csv';
	let mounted;
	let containerHeight;
	let containerWidth;
	$: isTablet = containerWidth < 980;

	onMount(() => {
		mounted = true;
	});

	const yKey = [0, 1];
	const zKey = 'key';

	let xKey = 'week_year';
	let covidData = data;
	let fill;
	let arrowFill = '#DCE2E7';
	let arrowStroke = 'transparent';
	let pathStroke = '#AAAAAA';
	let newData = [];

	$: newData = covidData.map((option) => {
		return {
			week_year: option.week_year,
			'Alternative Treatments/Prevention': {
				order: 1,
				value: option['Alternative Treatments/Prevention'],
				color: '#00649f',
				altName: 'Treatments/Prevention'
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
				altName: !isTablet ? 'Government Policy/Response' : 'Government Policy'
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

	let extentVals;
	let maxVal;
	$: extentVals = extent(flatten(series), (d) => d[1]);
	$: maxVal = Math.ceil(extentVals[1] / 5) * 5;

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

	const checkDate = (d) => timeFormat('%Y-%V')(timeParse('%Y-%V')(d));
	const checkDateU = (d) => timeFormat('%Y-%V')(timeParse('%Y-%U')(d));

	const formatTickX = (tick) =>
		checkDate(tick) == '2020-05' ||
		checkDate(tick) == '2021-05' ||
		checkDate(tick) == '2020-18' ||
		checkDateU(tick) == '2021-17' ||
		checkDate(tick) == '2020-31' ||
		checkDateU(tick) == '2021-30' ||
		checkDate(tick) == '2020-44' ||
		checkDate(tick) == '2021-44'
			? timeFormat('%b %Y')(timeParse('%Y-%W')(tick))
			: '';
	let annotations = [];
	$: annotations = [
		{
			text: "AMERICA'S FRONTLINE DOCTORS",
			modalText:
				'America’s Frontline Doctors, a controversial group of medical professionals, held a press conference outside the Supreme Court promoting the use of hydroxychloroquine and Zithromax to treat or prevent COVID-19. This led to a spike in claims tied to alternative treatments and prevention.',
			top: '-50px',
			left: !isTablet ? '12.7%' : '12.75%',
			width: '129px',
			padding: '5px',
			arrows: ['2020-31']
		},
		{
			text: '2020 ELECTION',
			modalText:
				'Following the 2020 election (and subsequent inauguration), the pandemic response changed hands from the administration of Donald Trump to the administration of Joe Biden. This did not lead to a noticeable increase in unsubstantiated or false COVID-19 related claims.',
			top: '-88px',
			left: !isTablet ? '31.9%' : '31.85%',
			width: '70px',
			arrows: ['2020-44']
		},
		{
			text: "FAUCI'S EMAILS RELEASED",
			modalText:
				'Dr. Fauci’s emails from early in the pandemic were released. They included speculation regarding both the efficacy of masks and the “lab leak” theory that the virus was manufactured and accidentally escaped from the Wuhan Institute of Virology. This led to a spike in conspiratorial claims.',
			top: '-130px',
			left: !isTablet ? '57.5%' : '57.5%',
			width: '100px',
			arrows: ['2021-23']
		},
		{
			text: 'DELTA VARIANT PEAK',
			modalText:
				'Following the widespread rollout of the COVID-19 vaccine in early 2021, vaccine-related claims remained steady over time, peaking slightly once the Delta variant became the predominant variant in the United States. ',
			top: '-170px',
			left: !isTablet ? '72%' : '72%',
			width: '85px',
			padding: '5px',
			arrows: ['2021-38']
		},
		{
			text: 'OMICRON WAVE',
			modalText:
				'Once vaccine-induced immunity began to wane during the height of the Omicron wave in early 2022, necessitating the need for booster shots, there was a slight spike in the spread of vaccine-related claims. ',
			top: '-210px',
			left: !isTablet ? '84.5%' : '84.5%',
			width: '65px',
			arrows: ['2021-48']
		}
	];
</script>

<figure bind:clientWidth={containerWidth} class={!isTablet ? 'bi-m-auto' : 'bi-mx-1'}>
	<figcaption class="bi-mb-4 bi-leading-6">
		The spread of unsubstantiated and false coronavirus-related claims ebbed and flowed throughout
		the pandemic
	</figcaption>

	<div class="bi-flex bi-flex-row bi-justify-between">
		<ul
			class={!isTablet
				? 'chart-list bi-flex bi-flex-row bi-gap-0 bi-flex-2 bi-list-none bi-m-0 bi-max-w-none'
				: 'chart-list bi-flex bi-flex-row bi-gap-0 bi-flex-2 bi-flex-wrap bi-flex-2 bi-list-none bi-m-0'}
		>
			{#each Object.entries(newData[0]) as [value, { color, order, altName }]}
				{#if value !== 'week_year'}
					<li class="bi-relative bi-list-none chart-list">
						<input
							type="checkbox"
							class="bi-sr-only bi-z-0 bi-peer bi-flex bi-p-5 bi-bg-white bi-border bi-border-gray-300 bi-rounded-lg bi-cursor-pointer focus:bi-outline-none peer-checked:bi-ring-2 peer-checked:bi-border-transparent"
							name={altName}
							{value}
							{order}
							id={value}
							checked={chosenValues.includes(value)}
							on:change={handleChange}
						/>
						<div
							class="bi-absolute bi-w-3.5 bi-h-3.5 bi-right-3 peer-checked:bi-block peer-checked:bi-bg-[{color}] bi-bg-bi-gray-light md:peer-hover:bi-opacity-50 bi-top-2 bi-left-2 bi-z-[2]"
							for={value}
						/>
						<label
							class="bi-flex bi-leading-3 bi-pl-7 bi-bg-white bi-border bi-border-gray-300 bi-cursor-pointer md:hover:bi-drop-shadow-lg bi-text-sm bi-p-2 bi-font-sans"
							for={value}
						>
							{altName}</label
						>
					</li>
				{/if}
			{/each}
		</ul>
	</div>
	<div class="bi-overflow-auto scrollbar-hide chart-container">
		<div
			bind:clientHeight={containerHeight}
			style="height:400px;width:1010px;"
			class={!isTablet
				? 'bi-overflow-auto scrollbar-hide'
				: 'bi-overflow-x-visible bi-flex-col scrollbar-hide'}
		>
			{#if mounted}
				<LayerCake
					padding={{ top: 70, right: 20, bottom: 30, left: 20 }}
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
						<AxisX
							gridlines={false}
							formatTick={formatTickX}
							tickMarksCovid={true}
							tickMarks={false}
							label="Week/Year"
							textAnchorLabel="end"
							dyLabel="9"
							rightAlignLabel={true}
						/>

						<AxisY
							ticks={4}
							rightAxis={isTablet ? true : false}
							gridlines={true}
							textAnchor="start"
							dyTick="4"
							xTick="0"
						/>
						<ColumnStacked />
						<svelte:fragment slot="defs">
							{#if chosenValues.length != 0}
								<ArrowheadMarkerFlex fill={arrowFill} stroke={arrowStroke} />
							{/if}
						</svelte:fragment>
						{#if chosenValues.length != 0}
							<ArrowsFlex {annotations} stroke={pathStroke} />
						{/if}
					</Svg>
					{#if chosenValues.length != 0}
						<Html>
							<AnnotationsFlex {annotations} />
						</Html>
					{/if}
				</LayerCake>
			{/if}
		</div>
	</div>
	{#if isTablet}
		<div style="left: 92%;top:0px" class="icon-arrow bi-z-2 isSticky bi-rounded-md bi-w-[20px]">
			<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="#AAAAAA"
				><path
					d="m12 19.625-1.075-1.075 5.825-5.8H4.375v-1.5H16.75l-5.825-5.8L12 4.375 19.625 12Z"
				/></svg
			>
		</div>
	{/if}
	<p class="footnote-chart chart-text bi-mt-4 bi-leading-4 bi-text-xs">
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
		/* height: 100%; */
	}
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}

	/* For IE, Edge and Firefox */
	.scrollbar-hide {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	.isSticky {
		position: -webkit-sticky;
		position: sticky;
		top: 0;
		background-color: rgba(255, 255, 255, 0.6);
	}
</style>
