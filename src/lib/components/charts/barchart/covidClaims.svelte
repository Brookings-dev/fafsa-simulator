<script>
	// example chart from LayerCake
	// https://layercake.graphics/example/Bar/
	import { LayerCake, Svg, flatten, uniques } from 'layercake';
	import { scaleBand, scaleOrdinal } from 'd3-scale';
	import * as d3 from 'd3';
	import { stack, stackOrderReverse } from 'd3-shape';

	import ColumnStacked from './ColumnStacked.svelte';
	import AxisX from './AxisX.svelte';
	import AxisY from './AxisY.svelte';

	import getKeyColor from '$lib/keyLookup';

	import data from '$lib/data/covid-claims.csv';

	let xKey = 'week_year';
	const yKey = [0, 1];
	const zKey = 'key';

	let covidData = data;
	let fill;

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

	// console.log(newData);

	$: seriesNames = Object.keys(covidData[0]).filter((d) => d !== xKey);
	$: chosenValues = seriesNames;
	$: seriesColors = ['#00649f', '#8BC6FD', '#2FA5B2', '#FEDB31', '#C7A70A', '#F25D00'];
	//[dark blue, light blue, turq, yellow, gold, orange]

	$: newData.forEach((d) => {
		chosenValues.forEach((name) => {
			name = +name;
		});
	});

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

	const checkMonth = (d) => d3.timeFormat('%b')(d3.timeParse('%Y-%V')(d));
	const checkWeek = (d) => d3.timeFormat('%V')(d3.timeParse('%Y-%V')(d));
	const checkYear = (d) => d3.timeFormat('%Y')(d3.timeParse('%Y-%V')(d));

	const formatTickX = (tick) =>
		(checkMonth(tick) == 'Feb' && checkWeek(tick) % 4 == 0) ||
		(checkMonth(tick) == 'May' && checkWeek(tick) % 4 == 0) ||
		(checkMonth(tick) == 'Aug' && checkWeek(tick) % 4 == 0 && checkWeek(tick) != 36) ||
		(checkMonth(tick) == 'Nov' && checkWeek(tick) % 4 == 0 && checkWeek(tick) != 44)
			? d3.timeFormat('%b %Y')(d3.timeParse('%Y-%V')(tick))
			: '';
</script>

<div class="flex flex-row justify-between items-center">
	<div class="flex flex-row gap-2 flex-1 pb-[50px]">
		{#each Object.entries(newData[0]) as [value, { color, order, altName }]}
			{#if value !== 'week_year'}
				<div>
					<input
						type="checkbox"
						class="select-items self-center justify-self-center appearance-none"
						name={altName}
						{value}
						{order}
						id={value}
						checked={chosenValues.includes(value)}
						on:change={handleChange}
					/>
					<label
						class="grid grid-flow-row-dense peer border border-solid justify-center cursor-pointer hover:bg-bi-gray-light peer-checked:border-bi-gray-light peer-checked:bg-[{color}]"
						for={value}
					>
						<div class="flex flex-row justify-between items-center p-[1px]">
							<div class="w-3 h-3 peer-checked:bg-bi-gray-light bg-[{color}] m-1" for={value} />
							<p class="text-sm self-center justify-self-center text-center p-1">
								{altName}
							</p>
						</div>
					</label>
				</div>
			{/if}
		{/each}
	</div>
</div>
<div class="w-full" style:height="400px">
	<!-- <div class="chart-container"> -->
	<LayerCake
		padding={{ top: 0, right: 0, bottom: 20, left: 20 }}
		x={(d) => d.data[xKey]}
		y={yKey}
		z={zKey}
		xScale={scaleBand().paddingInner([0.12]).round(true)}
		xDomain={null}
		yDomain={[0, 25]}
		flatData={flatten(series)}
		data={series}
		zScale={scaleOrdinal()}
		zDomain={chosenValues}
		zRange={seriesColors}
	>
		<Svg>
			<AxisX gridlines={false} formatTick={formatTickX} />
			<AxisY ticks={4} gridlines={true} textAnchor="end" dyTick="4" xTick="-6" />
			<ColumnStacked />
		</Svg>
	</LayerCake>
	<!-- xDomain={uniques(data, xKey)} -->

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
