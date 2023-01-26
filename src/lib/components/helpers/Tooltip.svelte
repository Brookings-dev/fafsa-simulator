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
	export let tipWidth = 200; // width of the tooltip
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

	$: left = cursor.x - tipWidth / 2;

	// $: console.log(left);
</script>

<svelte:window on:mousemove={mousemove} bind:innerWidth={pageWidth} />

{#if cursor.x !== 0 && cursor.y !== 0}
	<div
		class="tooltip bi-bg-[#F2F2F2] bi-text-primary bi-fixed bi-border-solid bi-border-[1px] bi-border-[#CCCCCC] bi-rounded-md bi-drop-shadow-lg bi-p-2 bi-z-40 bi-pointer-events-none bi-text-base bi-font-regular bi-max-w-[200px] bi-w-auto"
		style="left:{left}px;top:200px;"
		bind:offsetWidth={tipWidth}
	>
		<slot {cursor} {pageWidth} {tipWidth} />
	</div>
{/if}
