<!--
  @component
  Generates an SVG x-axis. This component is also configured to detect if your x-scale is an ordinal scale. If so, it will place the markers in the middle of the bandwidth.
 -->
<script>
	import { getContext } from 'svelte';
	const { width, height, xScale, yRange, padding } = getContext('LayerCake');
	import { timeFormat, timeParse } from 'd3';

	/** @type {Boolean} [gridlines=true] - Extend lines from the ticks into the chart space */
	export let gridlines = true;

	/** @type {Boolean} [tickMarks=false] - Show a vertical mark for each tick. */
	export let tickMarksIdeo = false;

	/** @type {Boolean} [tickMarks=false] - Show a vertical mark for each tick. */
	export let tickMarksFraud = false;

	/** @type {Boolean} [baseline=false] – Show a solid line at the bottom. */
	export let baseline = false;

	/** @type {Boolean} [snapTicks=false] - Instead of centering the text on the first and the last items, align them to the edges of the chart. */
	export let snapTicks = false;

	/** @type {Function} [formatTick=d => d] - A function that passes the current tick value and expects a nicely formatted value in return. */
	export let formatTick = (d) => d;

	/** @type {Number|Array|Function} [ticks] - If this is a number, it passes that along to the [d3Scale.ticks](https://github.com/d3/d3-scale) function. If this is an array, hardcodes the ticks to those values. If it's a function, passes along the default tick values and expects an array of tick values in return. If nothing, it uses the default ticks supplied by the D3 function. */
	export let ticks = undefined;

	/** @type {Number} [xTick=0] - TK */
	export let xTick = 0;

	/** @type {Number} [yTick=16] - The distance from the baseline to place each tick value. */
	export let yTick = 16;

	/** @type {String} [label=''] - Show a label at the top of the y axis. */
	export let label = '';

	/** @type {String} [fontColor=''] - Change color of font color in label. */
	export let fontColor = 'black';

	/** @type {String} [fontSize=''] - Change size of font in label. */
	export let fontSize = '0.875rem';

	export let tickMarksCovid = false;

	export let tickMarksIdeoMobile = false;

	export let dyTick;

	export let dxLabel;
	$: dxLabel = -$width / 2 - $padding.left / 2;

	export let dyLabel;

	export let textAnchorLabel = 'middle';

	export let rightAlignLabel = false;
	export let centerLabel = false;

	$: isBandwidth = typeof $xScale.bandwidth === 'function';

	$: tickVals = Array.isArray(ticks)
		? ticks
		: isBandwidth
		? $xScale.domain()
		: typeof ticks === 'function'
		? ticks($xScale.ticks())
		: $xScale.ticks(ticks);

	function textAnchor(i) {
		if (snapTicks === true) {
			if (i === 0) {
				return 'start';
			}
			if (i === tickVals.length - 1) {
				return 'end';
			}
		}
		return 'middle';
	}
	// const checkMonth = (d) => timeFormat('%b')(timeParse('%Y-%V')(d));
	// const checkWeek = (d) => timeFormat('%V')(timeParse('%Y-%V')(d));
	const checkDate = (d) => timeFormat('%Y-%V')(timeParse('%Y-%V')(d));
</script>

<g class="axis x-axis" class:snapTicks>
	{#each tickVals as tick, i (tick)}
		<g class="tick tick-{i}" transform="translate({$xScale(tick)},{Math.max(...$yRange)})">
			{#if gridlines !== false}
				<line class="gridline {tick}" y1={$height * -1} y2="0" x1="0" x2="0" />
			{/if}
			{#if tickMarksIdeo == true}
				{#if timeFormat('%b')(timeParse('%Y-%m')(tick)) == 'Jan'}
					<line
						class="bi-tick-mark-{i} bi-z-100 bi-stroke-[#333333]"
						y1={0}
						y2={6}
						x1={xTick || isBandwidth ? $xScale.bandwidth() / 2 : 0}
						x2={xTick || isBandwidth ? $xScale.bandwidth() / 2 : 0}
					/>
				{/if}
			{/if}
			{#if tickMarksIdeoMobile == true}
				{#if timeFormat('%m')(timeParse('%Y-%m')(tick)) == '01' && timeFormat('%Y')(timeParse('%Y-%m')(tick)) % 2 == 0}
					<line
						class="bi-tick-mark-{i} bi-z-100 bi-stroke-[#333333]"
						y1={0}
						y2={6}
						x1={xTick || isBandwidth ? $xScale.bandwidth() / 2 : 0}
						x2={xTick || isBandwidth ? $xScale.bandwidth() / 2 : 0}
					/>
				{/if}
			{/if}
			{#if tickMarksCovid == true}
				{#if checkDate(tick) == '2020-05' || checkDate(tick) == '2021-05' || checkDate(tick) == '2020-18' || checkDate(tick) == '2021-17' || checkDate(tick) == '2020-31' || checkDate(tick) == '2021-30' || checkDate(tick) == '2020-44' || checkDate(tick) == '2021-44'}
					<line
						class="bi-tick-mark-{tick} bi-z-100 bi-stroke-[#333333]"
						y1={0}
						y2={6}
						x1={xTick || isBandwidth ? $xScale.bandwidth() / 2 : 0}
						x2={xTick || isBandwidth ? $xScale.bandwidth() / 2 : 0}
					/>
				{/if}
			{/if}
			{#if tickMarksFraud == true}
				{#if timeFormat('%V')(tick) == 37 || timeFormat('%V')(tick) == 41 || timeFormat('%V')(tick) == 45 || timeFormat('%V')(tick) == 50 || timeFormat('%V')(tick) == 1}
					<line
						class="bi-tick-mark-{tick} bi-z-100 bi-stroke-[#333333]"
						y1={0}
						y2={6}
						x1={xTick || isBandwidth ? $xScale.bandwidth() / 2 : 0}
						x2={xTick || isBandwidth ? $xScale.bandwidth() / 2 : 0}
					/>
				{/if}
			{/if}

			<text
				x={xTick || isBandwidth ? $xScale.bandwidth() / 2 : 0}
				y={25}
				dx=""
				dy={dyTick}
				style="font-size: {fontSize}; fill: {fontColor};"
				text-anchor={textAnchor(i)}>{formatTick(tick)}</text
			>
			{#if centerLabel == true}
				<text
					class="bi-fill-black-light bi-text-sm bi-font-sans"
					x={isBandwidth ? $xScale.bandwidth() : 0}
					y={yTick}
					dx={dxLabel}
					dy={dyLabel}
					style="text-anchor:{isBandwidth
						? 'middle'
						: textAnchorLabel}; font-size: {fontSize}; fill: {fontColor}"
					>{`${label && i === tickVals.length - 1 ? label : ''}`}
				</text>
			{/if}
			{#if rightAlignLabel == true}
				<text
					class="bi-fill-black-light bi-text-sm bi-font-sans"
					x={isBandwidth ? $xScale.bandwidth() : 0}
					y={yTick}
					dx={-26}
					dy={dyLabel}
					style="text-anchor:{isBandwidth
						? 'middle'
						: textAnchorLabel}; font-size: {fontSize}; fill: {fontColor}"
					>{`${label && i === tickVals.length - 1 ? label : ''}`}
				</text>
			{/if}
		</g>
	{/each}

	{#if baseline === true}
		<line class="baseline bi-z-60" y1={$height + 0.5} y2={$height + 0.5} x1="0" x2={$width} />
	{/if}
</g>

<style lang="postcss">
	.tick {
		font-family: roboto;
		font-weight: 400;
		color: #333333;
	}

	.tick line {
		@apply bi-stroke-gray-300;
	}
	.tick text {
		color: #333333;
		font-size: small;
		/* font-weight: 600; */
	}
	.tick.tick-0 line {
		stroke-dasharray: 0;
	}
	.baseline {
		stroke: #333333;
	}
	.tick .gridline {
		stroke-dasharray: 0.3, 10;
		stroke-linecap: round;
		stroke-width: 2;
	}
	/* .tick-mark {
		stroke-dasharray: 2;
	} */
	/* This looks slightly better */
	.axis.snapTicks .tick:last-child text {
		transform: translateX(3px);
	}
	.axis.snapTicks .tick.tick-0 text {
		transform: translateX(-3px);
	}
</style>
