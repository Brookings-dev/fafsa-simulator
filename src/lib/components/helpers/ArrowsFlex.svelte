<!--
  @component
  Adds SVG swoopy arrows based on a config object. It attaches arrows to divs, which are created by another component such as [Annotations.html.svelte](https://layercake.graphics/components/Annotations.html.svelte).
 -->
<script>
	import { getContext, onMount } from 'svelte';
	/** @type {Array} annotations - A list of annotation objects. See the [Column](https://layercake.graphics/example/Column) chart example for the schema and options. */
	export let annotations = [];

	/** @type {String} [annotationClass='.layercake-annotation'] - The class name of the text annotation divs. */
	export let containerClass = '.chart-container';

	/** @type {String} [containerClass='.chart-container'] - The class name / CSS selector of the parent element of the `<LayerCake>` component. This is used to crawl the DOM for the text annotations. */
	export let annotationClass = '.layercake-annotation';

	export let stroke = '#000';
	const { height, xScale } = getContext('LayerCake');

	let container;
	let annotationEls;

	// This searches the DOM for the HTML annotations
	// in the Annotations.svelte componenent and then
	// attaches arrows to those divs
	// Make sure the `.chart-container` and `.layercake-annotation`
	// selectors match what you have in your project
	// otherwise it won't find anything
	onMount(() => {
		annotationEls = Array.from(container.closest(containerClass).querySelectorAll(annotationClass));
	});
</script>

<g bind:this={container}>
	{#each annotations as anno, i}
		{#if anno.arrows}
			{#each anno.arrows as arrow}
				<line
					class="anno-line"
					x1={$xScale(arrow) + 3}
					y1={-$height / 12}
					x2={$xScale(arrow) + 3}
					y2={$height}
					{stroke}
					marker-start="url(#arrowheadflex)"
				/>
			{/each}
		{/if}
	{/each}
</g>

<!-- <g bind:this={container}>
	{#if annotations.length}
		<g class="swoops">
			{#each annotations as anno, i}
				{#if anno.arrows}
					{#each anno.arrows as arrow}
						<path marker-start="url(#arrowheadflex)" d={d(anno, i, arrow)} {stroke} />
					{/each}
				{/if}
			{/each}
		</g>
	{/if}
</g> -->
<style>
	.anno-line {
		fill: none;
		/* stroke: #000; */
		stroke-width: 1;
		stroke-dasharray: 1, 6;
		stroke-linecap: round;
	}
</style>
