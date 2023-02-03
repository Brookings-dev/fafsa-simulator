<!--
  @component
  Adds SVG swoopy arrows based on a config object. It attaches arrows to divs, which are created by another component such as [Annotations.html.svelte](https://layercake.graphics/components/Annotations.html.svelte).
 -->
<script>
	import { getContext, onMount } from 'svelte';
	import { timeParse } from 'd3';

	/** @type {Array} annotations - A list of annotation objects. See the [Column](https://layercake.graphics/example/Column) chart example for the schema and options. */
	export let annotations = [];

	/** @type {String} [annotationClass='.layercake-annotation'] - The class name of the text annotation divs. */
	export let containerClass = '.chart-container';

	/** @type {String} [containerClass='.chart-container'] - The class name / CSS selector of the parent element of the `<LayerCake>` component. This is used to crawl the DOM for the text annotations. */
	export let annotationClass = '.layercake-annotation';

	export let stroke = '#000';

	export let getText1 = (d) => d.text1;
	export let getText2 = (d) => d.text2;

	export let getLeft = (d) => d.left;
	export let getTop = (d) => d.top;

	export let findMidpoint;
	export let findMidElection;

	let container;
	let markerWidth = 70;

	const { height, xScale } = getContext('LayerCake');

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
					x1={$xScale(timeParse('%Y-%V')(arrow))}
					y1={$height * 0.05}
					x2={$xScale(timeParse('%Y-%V')(arrow))}
					y2={$height}
					{stroke}
					marker-start={getText1(anno) == 'JAN' ? 'url(#arrowheadJan)' : 'url(#arrowhead)'}
				/>
			{/each}
		{/if}
		<text
			class="text-annotation"
			x={getText1(anno) == 'JAN'
				? $xScale(timeParse('%Y-%V')(getLeft(anno))) - markerWidth / 5
				: $xScale(timeParse('%Y-%V')(getLeft(anno))) - markerWidth / 2.3}
			y={$height - ($height - getTop(anno) * 2)}
		>
			<tspan class="text-break">{getText1(anno)}</tspan>
		</text>
		<text
			class="text-annotation"
			x={getText1(anno) == 'JAN'
				? $xScale(timeParse('%Y-%V')(getLeft(anno))) - markerWidth / 6
				: $xScale(timeParse('%Y-%V')(getLeft(anno))) - markerWidth / 5}
			y={$height - ($height - getTop(anno) * 2.85)}
		>
			<tspan class="text-break">{getText2(anno)}</tspan>
		</text>
	{/each}
</g>

<style>
	.text-break {
		max-width: 50px;
	}
	.anno-line {
		fill: none;
		/* stroke: #000; */
		stroke-width: 1;
		stroke-dasharray: 1, 6;
		stroke-linecap: round;
	}
	.text-annotation {
		position: relative;
		z-index: 1;
		max-width: 20px;
		text-align: center;
		font-family: roboto;
		font-size: small;
		font-weight: 400;
		fill: white;
	}
</style>
