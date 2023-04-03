<script>
	/** @type {Number} min=1 - the minimum value */
	export let min = 1;

	/** @type {Number} max=100 - the maximum value */
	export let max = 100;

	/** @type {Number} step=1 - the incrementor */
	export let step = 1;

	/** @type {Number} bind:value - the value */
	export let value;

	/** @type {String} class="flex justify-center" - classes to apply to the wrapper  */
	let classes;
	export { classes as class };

	/** @type {String} style="border:1px solid red;" - styles to apply to the wrapper  */
	export let style;
</script>

<label class={classes} {style}>
	<input type="range" {min} {max} {step} bind:value />
</label>

<style lang="postcss">
	input {
		@apply appearance-none;
		background: var(--trackBackground, #cecece);
		border: var(--trackBorder, none);
		border-radius: var(--trackBorderRadius, 0);
		height: var(--trackHeight, 4px);
		width: var(--trackWidth, 10px);
	}

	/* thumb styles */
	input::-webkit-slider-thumb {
		@apply appearance-none;
		background: var(--thumbBackground, #000);
		border: var(--thumbBorder, none);
		border-radius: var(--thumbBorderRadius, 50%);
		box-shadow: var(--thumbBoxShadow, none);
		height: var(--thumbHeight, var(--thumbWidth, 12px));
		width: var(--thumbWidth, var(--thumbHeight, 12px));
	}

	input::-moz-range-thumb {
		@apply appearance-none;
		background: var(--thumbBackground, #000);
		border: var(--thumbBorder, none);
		border-radius: var(--thumbBorderRadius, 50%);
		box-shadow: var(--thumbBoxShadow, none);
		height: var(--thumbHeight, var(--thumbWidth, 12px));
		width: var(--thumbWidth, var(--thumbHeight, 12px));
	}

	input::-ms-thumb {
		@apply appearance-none;
		background: var(--thumbBackground, #000);
		border: var(--thumbBorder, none);
		border-radius: var(--thumbBorderRadius, 50%);
		box-shadow: var(--thumbBoxShadow, none);
		height: var(--thumbHeight, var(--thumbWidth, 12px));
		width: var(--thumbWidth, var(--thumbHeight, 12px));
	}

	/* reset tracks, use input itself */
	input::-webkit-slider-runnable-track {
		@apply bi-appearance-none bi-shadow-none bi-border-none bi-bg-transparent;
	}
	input::-moz-range-track {
		@apply bi-appearance-none bi-shadow-none bi-border-none bi-bg-transparent;
	}
	input::-ms-track {
		@apply bi-appearance-none bi-shadow-none bi-border-none bi-bg-transparent;
	}
</style>
