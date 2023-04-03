<script>
	export let src;
	export let style = 'fitler: none';

	export let hover = false;
	export let stroke = '#ccc';

	export let clicked = () => {};
	export let mouseover = () => {
		hover = true;
		stroke = '#8dadd0';
		style = 'filter: drop-shadow(2px 2px 2px rgb(0.1 0.1 0.1 / 0.1));';
	};
	export let mouseout = () => {
		hover = false;
		stroke = '#ccc';
		style = 'filter: none;';
	};
</script>

<button
	on:click={clicked}
	on:mouseover={mouseover}
	on:mouseenter={mouseover}
	on:mouseleave={mouseout}
	on:focus={mouseover}
>
	<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 30 30" {style}>
		<g fill="#fff" {stroke} stroke-width="2">
			<circle cx="13" cy="13" r="13" stroke="none" {style} />
			<circle cx="13" cy="13" r="12" fill="none" {style} />
		</g>
		<line
			x2="11"
			transform="translate(7.5 13.5)"
			fill="none"
			{stroke}
			{style}
			stroke-linecap="round"
			stroke-width="2"
		/>
		{#if src == 'plus'}
			<line
				x2="11"
				transform="translate(13 8) rotate(90)"
				fill="none"
				{stroke}
				stroke-linecap="round"
				stroke-width="2"
				{style}
			/>
		{/if}
	</svg>
</button>
