<script>
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';

	// Props
	export let width;
	export let min = 0;
	export let max = 100;
	export let initialValue = 0;
	export let id = null;
	export let value = typeof initialValue === 'string' ? parseInt(initialValue) : initialValue;

	// Node Bindings
	let container;
	let thumb = null;
	let progressBar = null;
	let element;

	// Internal State
	let elementX = null;
	let currentThumb = null;
	let holding = false;
	let thumbHover = false;
	let keydownAcceleration = 0;
	let accelerationTimer = null;

	// Dispatch 'change' events
	const dispatch = createEventDispatcher();

	// React to left position of element relative to window
	$: if (element) elementX = element.getBoundingClientRect().left;

	function resizeWindow() {
		elementX = element.getBoundingClientRect().left;
	}

	// Allows both bind:value and on:change for parent value retrieval
	function setValue(val) {
		value = val;
		dispatch('change', { value });
	}

	function onTrackEvent(e) {
		// Update value immediately before beginning drag
		updateValueOnEvent(e);
		onDragStart(e);
	}

	function onDragStart(e) {
		// If mouse event add a pointer events shield
		// if (e.type === 'mousedown') document.body.append(mouseEventShield);
		currentThumb = thumb;
	}

	function onDragEnd(e) {
		// If using mouse - remove pointer event shield
		if (e.type === 'mouseup') {
			// if (document.body.contains(mouseEventShield)) document.body.removeChild(mouseEventShield);
			// Needed to check whether thumb and mouse overlap after shield removed
			if (isMouseInElement(e, thumb)) thumbHover = true;
		}
		currentThumb = null;
	}

	// Check if mouse event cords overlay with an element's area
	function isMouseInElement(event, element) {
		let rect = element.getBoundingClientRect();
		let { clientX: x, clientY: y } = event;
		if (x < rect.left || x >= rect.right) return false;
		if (y < rect.top || y >= rect.bottom) return false;
		return true;
	}

	// Accessible keypress handling
	function onKeyPress(e) {
		// Max out at +/- 10 to value per event (50 events / 5)
		// 100 below is to increase the amount of events required to reach max velocity
		if (keydownAcceleration < 50) keydownAcceleration++;
		let throttled = Math.ceil(keydownAcceleration / 5);

		if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
			if (value + throttled > max || value >= max) {
				setValue(max);
			} else {
				setValue(value + throttled);
			}
		}
		if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
			if (value - throttled < min || value <= min) {
				setValue(min);
			} else {
				setValue(value - throttled);
			}
		}

		// Reset acceleration after 100ms of no events
		clearTimeout(accelerationTimer);
		accelerationTimer = setTimeout(() => (keydownAcceleration = 1), 100);
	}

	function calculateNewValue(clientX) {
		// Find distance between cursor and element's left cord (20px / 2 = 10px) - Center of thumb
		let delta = clientX - (elementX + 10);

		// Use width of the container minus (5px * 2 sides) offset for percent calc
		let percent = (delta * 100) / (container.clientWidth - 10);

		// Limit percent 0 -> 100
		percent = percent < 0 ? 0 : percent > 100 ? 100 : percent;

		// Limit value min -> max
		setValue(parseInt((percent * (max - min)) / 100) + min);
	}

	// Handles both dragging of touch/mouse as well as simple one-off click/touches
	function updateValueOnEvent(e) {
		// touchstart && mousedown are one-off updates, otherwise expect a currentPointer node
		if (!currentThumb && e.type !== 'touchstart' && e.type !== 'mousedown') return false;

		if (e.stopPropagation) e.stopPropagation();
		if (e.preventDefault) e.preventDefault();

		// Get client's x cord either touch or mouse
		const clientX =
			e.type === 'touchmove' || e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;

		calculateNewValue(clientX);
	}

	// Set a class based on if dragging
	$: holding = Boolean(currentThumb);

	// Update progressbar and thumb styles to represent value
	$: if (progressBar && thumb) {
		// Limit value min -> max
		value = value > min ? value : min;
		value = value < max ? value : max;

		let percent = ((value - min) * 100) / (max - min);
		let offsetLeft = (container.clientWidth - 10) * (percent / 100) + 5;

		// Update thumb position + active range track width
		thumb.style.left = `${offsetLeft}px`;
		progressBar.style.width = `${offsetLeft}px`;
	}
	$: console.log(element);
	$: console.log(elementX);
</script>

<svelte:window
	on:touchmove|nonpassive={updateValueOnEvent}
	on:touchcancel={onDragEnd}
	on:touchend={onDragEnd}
	on:mousemove={updateValueOnEvent}
	on:mouseup={onDragEnd}
	on:resize={resizeWindow}
	on:load={resizeWindow}
/>
<div
	class="range__wrapper"
	style="width: {width}px;"
	tabindex="0"
	on:keydown={onKeyPress}
	bind:this={element}
	role="slider"
	aria-valuemin={min}
	aria-valuemax={max}
	aria-valuenow={value}
	{id}
	on:mousedown={onTrackEvent}
	on:touchstart={onTrackEvent}
>
	<div class="range__track" bind:this={container}>
		<div class="range__track--highlighted" bind:this={progressBar} />
		<div
			class="range__thumb"
			class:range__thumb--holding={holding}
			bind:this={thumb}
			on:touchstart={onDragStart}
			on:mousedown={onDragStart}
		/>
	</div>
</div>

<svelte:head>
	<style>
		.mouse-over-shield {
			position: fixed;
			top: 0px;
			left: 0px;
			height: 100%;
			width: 100%;
			background-color: rgba(255, 0, 0, 0);
			z-index: 10000;
			cursor: grabbing;
		}
	</style>
</svelte:head>

<style>
	.range__wrapper {
		position: relative;
		padding: 0.5rem;
		box-sizing: border-box;
		outline: none;
	}

	.range__track {
		height: 6px;
		background-color: var(--track-bgcolor, #cccccc);
		border-radius: 999px;
	}

	.range__track--highlighted {
		background-color: var(--track-highlight-bgcolor, #6185ff);
		background: var(--track-highlight-bg, #003a70);
		width: 0;
		height: 6px;
		position: absolute;
		border-radius: 999px;
	}

	.range__thumb {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		width: 20px;
		height: 20px;
		background-color: var(--thumb-bgcolor, #003a70);
		cursor: pointer;
		border-radius: 999px;
		margin-top: -8px;
		transition: box-shadow 100ms;
		user-select: none;
		box-shadow: var(--thumb-boxshadow, #003a70);
	}

	.range__thumb--holding {
		box-shadow: 0 1px 1px 0 #003a70;
	}
</style>
