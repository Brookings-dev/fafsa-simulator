<!--
  @component
  Generates a voronoi layer using [d3-delauney](https://github.com/d3/d3-delauney).
 -->
<script>
	import { getContext, createEventDispatcher } from 'svelte';
	import { uniques } from 'layercake';
	import { Delaunay } from 'd3-delaunay';

	const { data, xGet, yGet, width, height } = getContext('LayerCake');

	export let fill = 'transparent';
	export let stroke = 'none';

	const dispatch = createEventDispatcher();

	$: points = $data.map((d) => {
		const point = [$xGet(d), $yGet(d)];
		point.data = d;
		return point;
	});

	$: uniquePoints = uniques(points, (d) => d.join(), false);

	$: voronoi = Delaunay.from(uniquePoints).voronoi([0, 0, $width, $height]);

	const mouseover = (point) => dispatch('mouseover', point);
	const mouseout = () => dispatch('mouseout');
</script>

<g class="voronoi" on:mouseout={mouseout} on:blur={mouseout}>
	{#each uniquePoints as point, i}
		<path
			{fill}
			{stroke}
			stroke-width="0"
			d={voronoi.renderCell(i)}
			on:mouseover={() => mouseover(point)}
			on:focus={() => mouseover(point)}
		/>
	{/each}
</g>

<style>
	.voronoi path {
		pointer-events: all;
	}
</style>
