<!--
  @component
  Generates an SVG multi-series line chart. It expects your data to be an array of objects, each with a `values` key that is an array of data objects.
 -->
<script>
	import { getContext } from 'svelte';

	export let tick;

	const { xScale, height } = getContext('LayerCake');
</script>

<line
	class="tooltip-line"
	x1={$xScale(tick) + 3}
	y1={120}
	x2={$xScale(tick) + 3}
	y2={$height}
	stroke="black"
/>

<style>
	.tooltip-line {
		stroke-dasharray: 0.3, 5;
		stroke-linecap: round;
		stroke-width: 2;
		stroke: #003a70;
	}
</style>
