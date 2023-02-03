<!--
  @component
  Adds text annotations based on a config object that has CSS styles as fields.
 -->
<script>
	import Modal from '$lib/components/helpers/Modal.svelte';
	const vals = ['top', 'right', 'bottom', 'left', 'width', 'padding'];

	/** @type {Array} annotations - A list of annotation objects. It expects values of `top`, `right`, `bottom` and `left` whose values are CSS values like `'10px'` or `'5%'` that will be used to absolutely position the text div. See the [Column](https://layercake.graphics/example/Column) chart example for the schema and options. */
	export let annotations = [];

	/** @type {Function} [getText=d => d.text] - An accessor function to get the field to display. */
	export let getText = (d) => d.text;

	let isModalOpen;
	let isClicked;

	const clicked = (event) => {
		isModalOpen = true;
		isClicked = event.target.innerText;
	};
	const keydown = () => {
		isModalOpen = false;
		isClicked = undefined;
	};

	$: fillStyle = (d) => {
		let style = '';
		vals.forEach((val) => {
			if (d[val]) {
				style += `${val}:${d[val]};`;
			}
		});
		return style;
	};
</script>

<div class="layercake-annotations">
	{#each annotations as d, i}
		<div
			class="layercake-annotation hover:bi-drop-shadow-lg bi-cursor-pointer bi-relative bi-font-sans bi-bg-[#DCE2E7] bi-py-1 bi-text-xs bi-text-[#444444] bi-leading-4 bi-box-content"
			data-id={i}
			style={fillStyle(d)}
			on:click={clicked}
			on:keydown={keydown}
		>
			{@html getText(d)}
		</div>
		{#if d.text == isClicked}
			<Modal bind:isModalOpen>
				<svelte:fragment slot="modal-content">
					<p class="chart-text bi-leading-5 bi-mb-4">{d.modalText}</p>
				</svelte:fragment>
			</Modal>
		{/if}
	{/each}
</div>

<style>
	.layercake-annotation {
		position: relative;
		z-index: 1;
		/* max-width: 50px; */
		text-align: center;
	}
</style>
