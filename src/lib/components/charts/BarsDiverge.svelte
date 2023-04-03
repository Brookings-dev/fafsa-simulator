<script>
	import data from '$lib/data/fafsa_long.csv';
	import { group, scaleLinear, format, select } from 'd3';
	import colors from '$lib/colors.json';
	import ArrowheadMarker from '$lib/components/arrows/ArrowheadMarker.svelte';
	import Range from '$lib/components/charts/furniture/Range.svelte';
	import Button from '$lib/components/charts/Button.svelte';
	import Slider from '$lib/components/charts/furniture/Slider.svelte';

	let width = 450;
	let barHeight = 6;
	let containerWidth;
	let isMobile;
	$: isMobile = containerWidth < 768;
	$: sliderWidth = isMobile ? 220 : 400;

	let selectedIncome = 0;
	let incomeGroups = [];
	$: selectedIncome = 0;
	$: incomeGroups = group(data, (d) => d.income);
	let incomes = [];
	$: incomes = Object.fromEntries(incomeGroups)[selectedIncome];
	$: loanGroups = group(incomes, (d) => d.type);
	$: loans = Object.fromEntries(loanGroups);
	$: keys = Object.keys(loans);
	let extents = [0, 300000];

	const domain = [-35000, 35000];
	const pellDomain = [-4000, 4000];

	let xScale = scaleLinear()
		.domain(domain)
		.range([0, width / 2.5]);

	let xScalePell = scaleLinear()
		.domain(pellDomain)
		.range([0, width / 2.5]);

	let siblings = {
		pell0: 0,
		pell1: 1,
		pell2: 2,
		public0: 0,
		public1: 1,
		public2: 2,
		private0: 0,
		private1: 1,
		private2: 2
	};

	let sibString = ' Siblings</b> in college';
	let sibString1 = ' Sibling</b> in college';

	const formatNumber = (d) => format(',.0f')(Math.abs(Math.ceil(d / 100) * 100));
	const tickFormat = (d) => (d > 0 ? '+' + d / 1000 + 'k' : d / 1000 + 'k');
	const capitalize = (string) => {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};
	let value = [selectedIncome, extents[1]];
	$: selectedIncome = value[0];
</script>

<figure class="bi-font-roboto md:bi-w-[768px] bi-m-auto">
	<div id="value" style="font-size: 50px;" />
	<div class="bi-flex bi-flex-col bi-justify-center bi-my-5 bi-items-center bi-mx-5">
		<h1
			class="bi-text-black-light bi-font-bold bi-text-center bi-text-2xl bi-max-w-[790px] bi-mb-10"
		>
			Simulated Impact of FAFSA Simplification on Eligibility for Financial Aid
		</h1>
		<h2 class="bi-text-blue-dark bi-font-bold bi-mb-3 bi-text-lg">Family Income</h2>
		<h3 class="border-dark bi-px-2 bi-text-blue-dark bi-rounded bi-text-lg">
			{'$' + formatNumber(selectedIncome)}
		</h3>
		<div class="bi-flex bi-flex-row bi-place-items-center bi-gap-5 bi-my-3 bi-justify-center">
			<Button
				src="minus"
				clicked={() =>
					value[0] > extents[0] ? (value[0] = value[0] - 10000) : (value[0] = value[0])}
			/>
			<div>
				<Slider bind:value width={sliderWidth} step="10000" min={extents[0]} max={extents[1]} />
			</div>
			<Button
				src="plus"
				clicked={() =>
					value[0] < extents[1] ? (value[0] = value[0] + 10000) : (value[0] = value[0])}
			/>
		</div>
	</div>
	<div class="chart bi-grid bi-justify-center" bind:clientWidth={containerWidth}>
		{#each keys as key}
			{#if key == 'public' && !isMobile}
				<div
					class="md:bi-col-start-5 md:bi-col-span-3 bi-bg-blue-dark bi-flex bi-items-center bi-justify-center"
				>
					<h1
						id="myBtn"
						class="bi-text-center bi-content-center bi-bg-blue-dark bi-text-white bi-font-bold bi-text-sm"
					>
						Impact on Institutional Grant Eligibility
					</h1>
				</div>
			{/if}
			{#if key == 'pell' && !isMobile}
				<div class="bi-min-w-[16px] bi-mt-20">
					{#each loans[key] as { loan }}
						<p class="bi-mt-10 bi-text-blue-dark bi-text-sm">
							{@html siblings[loan] !== 1
								? '<b>' + siblings[loan] + sibString
								: '<b>' + siblings[loan] + sibString1}
						</p>
					{/each}
				</div>
			{/if}
			{#if isMobile}
				{#each loans[key] as { loan }, i}
					<div
						class={key == 'pell'
							? 'bi-col-start-1 bi-row-start-1 bi-text-center bi-flex bi-items-center bi-font-bold bi-bg-blue-dark bi-text-white bi-text-sm border-right'
							: key == 'public'
							? 'bi-col-start-1 bi-row-start-4 bi-text-center bi-flex bi-items-center bi-font-bold bi-bg-blue-dark bi-text-white bi-text-sm border-right'
							: key == 'private'
							? 'bi-col-start-1 bi-row-start-7 bi-text-center bi-flex bi-items-center bi-font-bold bi-bg-blue-dark bi-text-white bi-text-sm border-right'
							: ''}
					>
						<p>Siblings in college</p>
					</div>

					<div
						class={key == 'pell'
							? 'bi-col-start-1 bi-row-start-2 bi-text-center border-left border-bottom dashed-right'
							: key == 'public'
							? 'bi-col-start-1 bi-row-start-5 bi-text-center border-left border-bottom dashed-right'
							: key == 'private'
							? 'bi-col-start-1 last-col bi-text-center border-left border-bottom dashed-right'
							: ''}
					>
						{#each loans[key] as { loan }}
							<p class="bi-mt-14 bi-text-blue-dark bi-text-sm">
								{@html '<b>' + siblings[loan] + '</b>'}
							</p>
						{/each}
					</div>
				{/each}
			{/if}
			{#if !isMobile}
				<div />
			{/if}

			<div
				class={key == 'pell'
					? 'bi-relative md:bi-row-start-1 bi-row-start-1 md:bi-row-span-2 md:bi-col-start-3 bi-bg-blue-dark bi-flex md:bi-items-start bi-items-center md:bi-pt-2 bi-leading-5'
					: key == 'public'
					? 'dashed-right dashed-top bi-relative md:bi-row-start-2 bi-row-start-4 md:bi-col-start-5 bi-col-start-2 bi-bg-blue-dark bi-flex bi-items-center bi-justify-center'
					: key == 'private'
					? 'dashed-top left-none bi-relative md:bi-row-start-2 bi-row-start-7 md:bi-col-start-7 bi-col-start-2 bi-bg-blue-dark bi-flex bi-items-center bi-justify-center'
					: ''}
			>
				<h1 class="bi-text-center bi-text-white bi-px-5 bi-text-sm">
					{@html key == 'pell'
						? '<b>Impact on Pell Grant Eligibility</b>'
						: key !== 'pell' && !isMobile
						? '<b>' + capitalize(key) + '</b>'
						: '<b>Impact on Institutional Grant Eligibility</b> ' + '(' + capitalize(key) + ')'}
				</h1>
			</div>

			<div
				class={key == 'pell'
					? 'border-bottom border-right border-left bi-relative md:bi-row-start-3 bi-row-start-2 md:bi-col-start-3 bi-col-start-2 dashed-left'
					: key == 'public'
					? 'border-left border-bottom bi-relative md:bi-row-start-3 bi-row-start-5 md:bi-col-start-5 bi-col-start-2 dashed-right dashed-left'
					: key == 'private'
					? 'border-right border-bottom bi-relative md:bi-row-start-3 last-col md:bi-col-start-7 bi-col-start-2 dashed-left left-none'
					: ''}
			>
				{#each loans[key] as { value }, i}
					<span
						class="bi-text-sm bi-text-white bi-px-[4px] bi-py-[1px] bi-rounded bi-absolute bi-max-w-fit"
						style="top: {5.64 * i + 1.35}rem; 
						transform: translate({value == 0
							? xScale(0) / 1.3
							: value < 1000
							? xScale(0) / 1.13
							: value > 10000
							? xScale(0) / 2
							: xScale(0) / 1.25}px, 0px);
								background: {value > 0
							? colors.blue.DEFAULT
							: value == 0
							? colors.gray.DEFAULT
							: colors.red.DEFAULT};"
					>
						{value == 0
							? 'No Impact'
							: value > 0
							? '+$' + formatNumber(value)
							: '-$' + formatNumber(value)}
					</span>
				{/each}

				<svg class="chart-block bi-p-4">
					<ArrowheadMarker stroke="none" />
					{#each loans[key] as { value }, i}
						<g>
							<line
								x1={xScale(0)}
								y1={90 * i + 15}
								x2={xScale(0)}
								y2={90 * i + 35.5}
								marker-end={value > 0
									? 'url(#arrowhead-plus)'
									: value == 0
									? 'url(#arrowhead-none)'
									: 'url(#arrowhead-minus)'}
							/>
						</g>
						<g>
							{#if key == 'pell'}
								{#each pellDomain as tick}
									<g class="tick bi-text-xs">
										<text style="fill: {colors.gray.DEFAULT}" x={xScalePell(tick) / 1.1} y={30}
											>{tickFormat(tick)}</text
										>
									</g>
								{/each}
							{:else}
								{#each domain as tick}
									<g class="tick bi-text-xs bi-fill-gray-light">
										<text style="fill: {colors.gray.DEFAULT}" x={xScale(tick) / 1.15} y={30}
											>{tickFormat(tick)}</text
										>
									</g>
								{/each}
							{/if}
						</g>
						<g class="column-group">
							<rect x={0} y={i * 90 + 40} height={barHeight} {width} fill={colors.gray.light} />
							<rect
								x={key == 'pell' ? xScalePell(Math.min(0, value)) : xScale(Math.min(0, value))}
								y={i * 90 + 40}
								height={barHeight}
								width={key == 'pell'
									? Math.abs(xScalePell(value) - xScalePell(0))
									: Math.abs(xScale(value) - xScale(0))}
								fill={value > 0
									? colors.blue.DEFAULT
									: value == 0
									? colors.gray.DEFAULT
									: colors.red.DEFAULT}
							/>
							<line
								x1={xScale(0)}
								x2={xScale(0)}
								y1={i * 90 + 38}
								y2={i * 90 + 48}
								stroke={colors.gray.DEFAULT}
							/>
						</g>
					{/each}
				</svg>
			</div>
		{/each}
	</div>
	<p
		class="bi-text-xs bi-text-gray bi-max-w-[760px] md:bi-m-auto md:bi-mt-10 bi-mt-10 bi-mx-5 footnote-chart"
	>
		<b>Notes:</b> All calculations are based on dependent students enrolled in college full-time and
		assume typical asset holdings for families at that income level. Income represents pre-tax levels.
		Pell Grant eligibility directly determines award levels, but institutional policy determines how
		eligibility for institutional grant aid translates to final award levels. Public and private institutions
		are assumed to charge a “sticker price” of $30,000 (in-state) and $60,000, respectively.
	</p>
</figure>

<style>
	.chart {
		grid-template-columns: 80px 10px 220px 15px 220px 0px 220px !important;
		grid-template-rows: 40px 40px 290px !important;
	}
	@media only screen and (max-width: 768px) {
		.chart {
			grid-template-columns: 100px 220px !important;
			grid-template-rows: 90px 290px 15px 90px 290px 15px 90px 290px !important;
		}
	}
	.chart-block {
		margin: 0 auto;
		width: 100%;
		height: 275px;
	}
	.dashed-right {
		border-right: 1.25px dotted #8dadd0;
	}
	.dashed-top {
		border-top: 1.25px dotted #8dadd0;
	}
	.border-left {
		border-left: 1px solid #8dadd0;
	}
	.border-right {
		border-right: 1px solid #8dadd0;
	}
	.border-bottom {
		border-bottom: 1px solid #8dadd0;
	}

	.border-dark {
		border: 0.5px solid #003a70 !important;
	}

	.column-group rect {
		transition: all 2s;
	}

	@media only screen and (max-width: 768px) {
		.dashed-left {
			border-left: none !important;
		}
		.dashed-right {
			border-right: 1px solid #8dadd0 !important;
		}
		.dashed-top {
			border-top: 1px solid #8dadd0 !important;
		}
	}
	@media only screen and (max-width: 768px) {
		.last-col {
			grid-row-start: 8;
		}
	}
</style>
