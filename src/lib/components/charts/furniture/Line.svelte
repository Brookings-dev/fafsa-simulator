<script>
	import { area, curveMonotoneX, line } from 'd3';
	import { getContext } from 'svelte';

	const { data, xGet, yGet, yRange } = getContext('LayerCake');

	/** @type {Function} curve={curveMonotoneX} - a function to apply a curve to the Line. Most likely from [D3's curve functions](https://github.com/d3/d3-shape#curves) */
	export let curve = curveMonotoneX;

	/** @type {String} stroke="#000000" - stroke attribute */
	export let stroke = undefined;

	/** @type {Number} strokeWidth=2 - stroke width attribute */
	export let strokeWidth = 1;

	/** @type {String} strokeDashArray="2,2" - stroke dash array attribute */
	export let strokeDashArray = undefined;

	/** @type {('arcs','bevel','miter','miter-clip','round')} strokeLineJoin="round" - stroke line join attribute */
	export let strokeLineJoin = undefined;

	/** @type {('butt','round','square')} strokeLineCap="round" - stroke dash array attribute */
	export let strokeLineCap = undefined;

	/** @type {String} style="pointer-events:all;" - style attribute */
	export let style = undefined;

	/** @type {String} transform="translate(0, 150)" - transform attribute */
	export let transform = undefined;

	/** @type {Function} defined={() => true} - accessor to determine when data is not defined and should have gaps */
	export let defined = () => true;

	/** @type {String} hasArea={true} - Add an area mimicking the line chart */
	export let hasArea = undefined;

	/** @type {String} class="stroke-teal" - classes to apply to the path */
	let classes = undefined;
	export { classes as class };

	/** @type {String} areaClass="fill-teal" - classes to apply to the path */
	export let areaClass = undefined;
</script>

<g>
	<path
		class={classes}
		{transform}
		{stroke}
		stroke-width={strokeWidth}
		stroke-dasharray={strokeDashArray}
		stroke-linejoin={strokeLineJoin}
		stroke-linecap={strokeLineCap}
		fill="none"
		{style}
		d={line()
			.defined(defined)
			.x((d) => $xGet(d))
			.y((d) => $yGet(d))
			.curve(curve)($data)}
	/>

	{#if hasArea}
		<path
			class={areaClass}
			fill={stroke}
			stroke-width={strokeWidth}
			stroke-dasharray={strokeDashArray}
			stroke-linejoin={strokeLineJoin}
			stroke-linecap={strokeLineCap}
			opacity=".25"
			d={area()
				.defined(defined)
				.x((d) => $xGet(d))
				.y0((d) => $yRange[0])
				.y1((d) => $yGet(d))
				.curve(curve)($data)}
		/>
	{/if}
</g>
