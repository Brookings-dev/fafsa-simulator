<!--
  @component
  Generates an SVG column chart. It uses the z-scale for color assignments and aassumes both `xScale` and `zScale` are ordinal scales.  It assumes your data is in a [D3 stack format](https://github.com/d3/d3-shape#stack
 -->
<script>
	import { createEventDispatcher, getContext } from 'svelte';
	const { data, xGet, yGet, zGet, xScale } = getContext('LayerCake');
	const dispatch = createEventDispatcher();
</script>

<!-- 
  @component
  Generates an SVG column chart. It uses the z-scale for color assignments and aassumes both `xScale` and `zScale` are ordinal scales.  It assumes your data is in a [D3 stack format](https://github.com/d3/d3-shape#stack
 -->
<!-- <script>
	import { createEventDispatcher, getContext } from 'svelte';
	import Tooltip from '$lib/components/helpers/Tooltip.svelte';

	const { data, xGet, yGet, zGet, xScale } = getContext('LayerCake');

	let tooltip;
	export let modVal;

	$: tooltipData = {};

	const mouseover = (e) => {
		tooltip = e;
		tooltipData = e;
		modVal = tooltipData.Moderate.value;
		console.log(modVal);
	};

	const mouseout = () => {
		tooltip = undefined;
		tooltipData = undefined;
		modVal = undefined;
		// console.log('mouseouted');
	};
</script>

<g class="column-group">
	{#each $data as series, i}
		{#each series as d}
			{@const yVals = $yGet(d)}
			{@const columnHeight = yVals[0] - yVals[1]}
			{@const tooltipData = d.data}
			<rect
				class="group-rect"
				data-id={i}
				x={$xGet(d)}
				y={yVals[1]}
				width={$xScale.bandwidth()}
				height={columnHeight}
				fill={$zGet(series)}
				on:mouseenter={mouseover(tooltipData)}
				on:mouseleave={mouseout}
			/>
		{/each}
	{/each}
</g>

{#if !!tooltip}
	<Tooltip>
		<p>{modVal}</p>
	</Tooltip>
{/if}

<style>
	.column-group {
		outline: none !important;
	}
	.column-group rect {
		transition: all 1s;
	}
</style> -->

<g class="column-group">
	{#each $data as series, i}
		{#each series as d}
			{@const yVals = $yGet(d)}
			{@const columnHeight = yVals[0] - yVals[1]}
			<rect
				class="group-rect bi-z-10"
				data-id={i}
				x={$xGet(d)}
				y={yVals[1]}
				width={$xScale.bandwidth()}
				height={columnHeight}
				fill={$zGet(series)}
				on:pointerover={() => dispatch('pointerover', d.data)}
				on:pointerleave={() => dispatch('pointerleave', d.data)}
			/>
		{/each}
	{/each}
</g>

<style>
	.column-group {
		outline: none !important;
	}
	.column-group rect {
		transition: all 2s;
	}
</style>
