<script>
	import { createEventDispatcher } from 'svelte';
	import { timeFormat, timeParse } from 'd3';
	export let startDateMin;
	export let endDateMax;
	export let name;
	export let labels;

	//////component for the main file
	// <SliderDateSelect
	// 			--applyButtonWidth="54px"
	// 			--applyButtonHeight="30px"
	// 			startDateMin="2012-12"
	// 			endDateMax="2021-12"
	// 			on:onApplyDateRange={handleApplyDateRange}
	// 		/>

	//////to use this, function for the maine file
	// const handleApplyDateRange = (thisDate) => {
	// 	console.log(thisDate);
	// 	start = timeFormat('%Y-%m')(timeParse('%Y-%m')(thisDate.detail.startDate));
	// 	end = timeFormat('%Y-%m')(timeParse('%Y-%m')(thisDate.detail.endDate));
	// 	const timeout = setTimeout(() => {
	// 		options = filteredData
	// 			.map((option) => {
	// 				return {
	// 					month_year: option.month_year,
	// 					'More Conservative': { value: option['More Conservative'], color: '#F55D5B' },
	// 					'More Liberal': { value: option['More Liberal'], color: '#16659D' },
	// 					Moderate: { value: option.Moderate, color: '#FDDB46' },
	// 					Unknown: { value: option.Unknown, color: '#B3B3B3' }
	// 				};
	// 			})
	// 			.filter((d) => d.month_year >= start && d.month_year <= end);
	// 	}, 200);
	// };

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
	const dispatch = createEventDispatcher();
	let today = new Date();
	// const todayRfc = timeStampToRfc(today);
	const todayTimestamp = dateToTimeStamp(today);
	const startDateMinTimestamp = dateToTimeStamp(startDateMin);
	const endDateMaxTimestamp = dateToTimeStamp(endDateMax);
	const startDateMinRfc = timeStampToRfc(startDateMin);
	const endDateMaxRfc = timeStampToRfc(endDateMax);
	let sliderStartTimestamp = 1354320000000;
	let sliderEndTimestamp = todayTimestamp;
	let startDate = '2012-12';
	let endDate = '2021-12';
	let lessThan = false;
	let greaterThan = false;
	// $: console.log(sliderStartTimestamp);

	function dateOrSliderChange(item) {
		if (item == 'endDate' && endDate && endDate < startDate) startDate = endDate;
		if (item == 'startDate' && startDate && startDate > endDate && endDate) endDate = startDate;
		if (item == 'endDate' || item == 'startDate') {
			sliderEndTimestamp = dateToTimeStamp(endDate);
			sliderStartTimestamp = dateToTimeStamp(startDate);
		}
		if (
			(item == 'sliderEndTimestamp' && sliderEndTimestamp < sliderStartTimestamp) ||
			!sliderStartTimestamp
		)
			sliderStartTimestamp = sliderEndTimestamp;
		if (
			(item == 'sliderStartTimestamp' && sliderStartTimestamp > sliderEndTimestamp) ||
			!sliderEndTimestamp
		)
			sliderEndTimestamp = sliderStartTimestamp;
		if (item == 'sliderEndTimestamp' || item == 'sliderStartTimestamp') {
			endDate = timeStampToRfc(sliderEndTimestamp);
			startDate = timeStampToRfc(sliderStartTimestamp);
		}
		if (!endDate && startDate) {
			greaterThan = true;
			lessThan = false;
		}
		if (!startDate && endDate) {
			greaterThan = false;
			lessThan = true;
		}
		if (startDate && endDate) {
			lessThan = false;
			greaterThan = false;
		}
	}
	const formatDate = (d) => timeFormat('%b %Y')(timeParse('%Y-%m')(d));

	function timeStampToRfc(date) {
		if (date) return new Date(date).toJSON().slice(0, 7);
		return undefined;
	}
	// console.log(new Date(startDateMin).valueOf());
	function dateToTimeStamp(date) {
		if (date) return new Date(date).valueOf();
		return undefined;
	}

	const apply = () => {
		dispatch('onApplyDateRange', {
			startDate: startDate,
			endDate: endDate,
			name: name
		});
	};
</script>

<div class="bi-grid bi-grid-flow-col bi-gap-0 bi-items-center bi-justify-end ">
	<div class="bi-grid">
		<h1 class="chart-title bi-text-sm bi-pb-2 bi-justify-end bi-text-center">
			{formatDate(startDate)}
		</h1>
		<!-- <input
			type="month"
			id={startDateId}
			class="dateSelect"
			min={startDateMinRfc}
			max={endDateMaxRfc}
			required="required"
			bind:value={startDate}
			on:input={() => {
				dateOrSliderChange('startDate');
			}}
		/> -->
		<!-- bind:value={sliderStartTimestamp} -->

		<input
			type="range"
			class="sliderStart"
			bind:value={sliderStartTimestamp}
			min={startDateMinTimestamp}
			max={endDateMaxTimestamp}
			step="86400"
			title={new Date(startDate)}
			on:input={() => {
				dateOrSliderChange('sliderStartTimestamp');
			}}
		/>
	</div>
	<h1 class="chart-title bi-text-sm bi-pb-2">-</h1>

	<div class="bi-grid">
		<h1 class="chart-title bi-text-sm bi-pb-2 bi-justify-end bi-text-center">
			{formatDate(endDate)}
		</h1>
		<!-- <input
			type="month"
			id={endDateId}
			class="dateSelect"
			min={startDateMinRfc}
			max={endDateMaxRfc}
			bind:value={endDate}
			on:input={() => {
				dateOrSliderChange('endDate');
			}}
		/> -->
		<input
			type="range"
			multiple
			data-values="1 86400"
			class="sliderEnd"
			bind:value={sliderEndTimestamp}
			min={startDateMinTimestamp}
			max={endDateMaxTimestamp}
			step="86400"
			title={new Date(endDate)}
			on:input={() => {
				dateOrSliderChange('sliderEndTimestamp');
			}}
		/>
	</div>
	<div class="bi-grid">
		<button class="applyButton" on:click={apply} title={labels.apply}>
			{labels.apply}
		</button>
	</div>
</div>
<br />

<!-- step="86400000" -->
<style lang="postcss">
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
	.sliderEnd {
		background: var(--sliderEndBackgroundColor, #707070);
		height: var(--sliderEndHeight, 1px);
		width: var(--sliderEndWidth, 100px);
		cursor: pointer;
		margin: var(--sliderEndMargin, 0px);
	}
	.sliderStart {
		background: var(--sliderStartBackgroundColor, #707070);
		height: var(--sliderStartHeight, 1px);
		width: var(--sliderStartWidth, 100px);
		cursor: pointer;
		margin: var(--sliderStartMargin, 0px);
	}
	.dateSelect {
		color: var(--dateSelectColor, #000);
		font-size: var(--dateSelectFontSize, 0.825em);
		font-weight: var(--dateSelectFontWeight, 300);
		font-family: roboto;
		height: var(--dateSelectHeight, 34px);
		width: var(--dateSelectWidth, 100px);
		margin-bottom: var(--dateSelectMarginBottom, 5px);
	}
	input[type='month']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		display: none;
	}
	input[type='month']::-webkit-calendar-picker-indicator {
		cursor: pointer;
		/* display: none;
		-webkit-appearance: none; */
	}
	/* .text-blue-600 {
		color: blueviolet;
	} */
	input[type='range']::-webkit-slider-thumb {
		height: 16px;
		width: 16px;
		border-radius: 1px;
		cursor: pointer;
		/* margin-top: -14px; You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
	}
</style>
