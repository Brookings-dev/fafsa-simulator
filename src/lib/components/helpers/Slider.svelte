<script>
	import { createEventDispatcher } from 'svelte';
	import Thumb from './Thumb.svelte';
	import { timeFormat, timeParse } from 'd3';
	export let labels;
	export let startDateMin;
	export let endDateMax;

	const dispatch = createEventDispatcher();
	let name = [];
	let range = false;
	let min = 1354320000000;
	let max = 1638316800000;
	let step = 1;
	let value = [min, max];
	let pos;
	let active = false;
	let order = false;

	let defaultLabels = {
		notSet: 'not set',
		greaterThan: 'greater than',
		lessThan: 'less than',
		range: 'range',
		apply: 'Apply'
	};
	labels = { ...defaultLabels, ...labels };
	if (!endDateMax) endDateMax = new Date();
	if (!startDateMin) {
		startDateMin = new Date(
			new Date().setFullYear(endDateMax.getFullYear(), endDateMax.getMonth() - 12)
		);
	}

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

	const formatDate = (d) => timeFormat('%b %Y')(timeParse('%Y-%m')(d));

	$: startDate = '2012-12';
	$: endDate = '2021-12';
</script>

<input type="number" value={value[0]} name={name[0]} />
{#if range}
	<input type="number" value={value[1]} name={name[1]} />
{/if}
<div class="track">
	<div class="progress" style={progress} />
	<Thumb bind:pos={pos[0]} on:active={({ detail: v }) => (active = v)}>
		<slot name="left">
			<slot>
				<div class="thumb bi-cursor-pointer" />
			</slot>
		</slot>
	</Thumb>
	{#if range}
		<Thumb bind:pos={pos[1]} on:active={({ detail: v }) => (active = v)}>
			<slot name="right">
				<slot>
					<div class="thumb bi-cursor-pointer" />
				</slot>
			</slot>
		</Thumb>
	{/if}

	<!-- <div class="bi-grid">
		<button class="applyButton" on:click={apply} title={labels.apply}>
			{labels.apply}
		</button>
	</div> -->
</div>

<style>
	input {
		display: none;
	}
	.track {
		margin: 10px 8px;
		position: relative;
		height: 1px;
		width: calc(100% - 16px);
		border-radius: 100vh;
		background: var(--track-bg, #ebebeb);
	}
	.progress {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		border-radius: 100vh;
		background: var(--progress-bg, #8abdff);
	}
	.thumb {
		width: 10px;
		height: 10px;
		border-radius: 100vh;
		background: var(--thumb-bg, #5784fd);
	}
	.applyButton {
		width: var(--applyButtonWidth, 25px);
		height: var(--applyButtonHeight, 25px);
		background-color: var(--applyButtonBackgroundColor, #707070);
		color: var(--applyButtonColor, #fff);
		padding: var(--applyButtonPadding, 0px);
		margin-left: 6px;
		font-family: roboto;
		font-size: 0.825em;
	}
</style>
