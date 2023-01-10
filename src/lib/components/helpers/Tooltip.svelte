<!-- 
  @component A tooltip wrapper sensitive to the cursor placement. Can either be fixed to a node by passing the parentContainer as a node or to the window if parentContainer does not exist.
	@slot - the inner content of the tooltip
 -->
<script>
	/** @type {Object} margin - padding from cursor position */
	export let margin = 10;

	/** @type {Boolean|Node} parentContainer - The node to bound the tooltip to */
	export let parentContainer = false;

	let pageWidth = 300;
	let tipWidth = 0; // width of the tooltip
	let cursor = { x: 0, y: 0 }; // cursor pos

	const mousemove = (e) => {
		// find where the cursor is
		cursor = { x: e.clientX, y: e.clientY };
		// cursor = { x: e.clientX + 50, y: 200 };
		// console.log(cursor);
	};

	// fixed positioning calculation
	$: reflectionX = parentContainer
		? parentContainer.offsetLeft + parentContainer.offsetWidth / 2
		: pageWidth / 2;
	$: left = cursor.x < reflectionX ? cursor.x + margin : cursor.x - margin - tipWidth;
	$: top = cursor.y + margin;
</script>

<svelte:window on:mousemove={mousemove} bind:innerWidth={pageWidth} />

{#if cursor.x !== 0 && cursor.y !== 0}
	<div
		class="tooltip bi-bg-white bi-text-primary bi-fixed bi-border-solid bi-border-[1px] bi-border-gray-dark bi-rounded-md bi-shadow-tooltip bi-text-left bi-p-2 bi-z-40 bi-pointer-events-none bi-text-base bi-font-regular bi-max-w-[200px] bi-w-auto"
		style="left:{left}px;top:{top}px;"
		bind:offsetWidth={tipWidth}
	>
		<slot {cursor} {tipWidth} {pageWidth} />
		<!-- <line class="tooltip-gridline" y1={400 * -1} y2="50" x1={-100} x2="300" /> -->
	</div>
{/if}
