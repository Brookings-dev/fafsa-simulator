<!-- 
  @component A tooltip wrapper sensitive to the cursor placement. Can either be fixed to a node by passing the parentContainer as a node or to the window if parentContainer does not exist.
	@slot - the inner content of the tooltip
 -->
<script>
	/** @type {Boolean|Node} parentContainer - The node to bound the tooltip to */
	export let parentContainer = false;

	export let tipWidth = 200; // width of the tooltip
	export let tipHeight;
	// export let height;
	export let margin = 10;

	let cursor = { x: 0, y: 0 }; // cursor pos
	let pageWidth = 300;
	let pageHeight = 300;

	const mousemove = (e) => {
		// find where the cursor is
		cursor = { x: e.clientX, y: e.clientY };
		// cursor = { x: e.clientX, y: e.client };
		// console.log(cursor);
	};

	// fixed positioning calculation
	$: reflectionX = parentContainer
		? parentContainer.offsetLeft + parentContainer.offsetWidth / 2
		: pageWidth;
	$: reflectionY = parentContainer ? parentContainer.offsetHeight / 2 : pageHeight;
	$: left = cursor.x < reflectionX ? cursor.x + margin : cursor.x - margin - tipWidth;
	$: top = cursor.y < reflectionY ? cursor.y + margin : cursor.y - margin - tipHeight;
</script>

<svelte:window on:mousemove={mousemove} bind:innerWidth={pageWidth} bind:innerHeight={pageHeight} />

{#if cursor.x !== 0 && cursor.y !== 0}
	<div
		class="tooltip bi-bg-[#F2F2F2] bi-text-primary bi-fixed bi-border-solid bi-border-[1px] bi-border-[#CCCCCC] bi-rounded-md bi-drop-shadow-lg bi-p-2 bi-z-40 bi-pointer-events-none bi-text-base bi-font-regular bi-max-w-[200px] bi-w-auto"
		style="left:{left}px;top:{top}px"
		bind:offsetWidth={tipWidth}
		bind:offsetHeight={tipHeight}
	>
		<slot {cursor} {pageWidth} {tipWidth} />
	</div>
{/if}
