<script>
	import { createEventDispatcher } from 'svelte';
	import Thumb from './Thumb.svelte';

	const dispatch = createEventDispatcher();

	let name = [];
	let range = false;
	export let width = 400;
	let min = 0;
	let max = 100;
	let step = 1;
	let value = [min, max];
	let pos;
	let active = false;
	let order = false;

	export { name, range, min, max, step, value, order };

	$: if (active) setValue(pos);
	$: if (!active) setPos(value);
	$: if (range && order && active) pos = checkPos(pos);
	$: min, max, clamp();
	$: progress = `
    left: ${range ? Math.min(pos[0], pos[1]) * 100 : 0}%;
    right: ${100 - Math.max(pos[0], range ? pos[1] : pos[0]) * 100}%;
  `;

	function setValue(pos) {
		const offset = min % step;
		const width = max - min;
		value = pos
			.map((v) => min + v * width)
			.map((v) => Math.round((v - offset) / step) * step + offset);
		dispatch('input', value);
	}

	function setPos(value) {
		pos = value.map((v) => Math.min(Math.max(v, min), max)).map((v) => (v - min) / (max - min));
	}

	function checkPos(pos) {
		return [Math.min(...pos), Math.max(...pos)];
	}

	function clamp() {
		setPos(value);
		setValue(pos);
	}
</script>

<input type="number" value={value[0]} name={name[0]} />
{#if range}
	<input type="number" value={value[1]} name={name[1]} />
{/if}
<div class="track" style="width:{width}px">
	<div class="progress" style={progress} />
	<Thumb bind:pos={pos[0]} on:active={({ detail: v }) => (active = v)}>
		<slot name="left">
			<slot>
				<div class="thumb" />
			</slot>
		</slot>
	</Thumb>
	{#if range}
		<Thumb bind:pos={pos[1]} on:active={({ detail: v }) => (active = v)}>
			<slot name="right">
				<slot>
					<div class="thumb" />
				</slot>
			</slot>
		</Thumb>
	{/if}
</div>

<style>
	input {
		display: none;
	}

	.track {
		margin: -3px 10px 0px 10px;
		position: relative;
		height: 6px;
		border-radius: 100vh;
		background: var(--track-bg, #cccccc);
	}

	.progress {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		border-radius: 100vh;
		background: var(--progress-bg, #003a70);
	}

	.thumb {
		width: 22px;
		height: 22px;
		border-radius: 100vh;
		background: var(--thumb-bg, #003a70);
		cursor: pointer;
	}
</style>
