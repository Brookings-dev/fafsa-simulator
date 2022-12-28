<script>
	export let chosenValues = [];
	export let variables = [];
	export let handleChange = (d) => d;
	export let xKey;

	$: chosenValues = [];
</script>

{#each variables as [value, { color, order }]}
	{#if value !== xKey}
		<div>
			<input
				type="checkbox"
				class="select-items self-center justify-self-center appearance-none"
				name={order}
				{value}
				{order}
				id={value}
				checked={chosenValues.includes(value)}
				on:change={handleChange}
			/>
			<label
				class="grid grid-flow-row-dense peer border border-solid justify-center cursor-pointer hover:bg-bi-gray-light peer-checked:border-bi-gray-light peer-checked:bg-[{color}]"
				for={value}
			>
				<div class="flex flex-row justify-between items-center p-[1px]">
					<div class="w-3 h-3 peer-checked:bg-bi-gray-light bg-bi-gray-light m-1" for={value} />
					<p class="text-xs self-center justify-self-center text-center p-1">
						{value}
					</p>
				</div>
			</label>
		</div>
	{/if}
{/each}
