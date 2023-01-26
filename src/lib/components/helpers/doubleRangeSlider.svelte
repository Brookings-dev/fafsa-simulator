<script>
	import { clamp } from 'yootils';
	import { createEventDispatcher } from 'svelte';

	export let start = 0;
	export let end = 1;
	export let labels;
	export let startDateMin;
	export let endDateMax;
	export let name;

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
	const todayRfc = timeStampToRfc(today);
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

	let leftHandle;
	let body;
	let sliderNew;
	function draggable(node) {
		let x;
		let y;
		function handleMousedown(event) {
			if (event.type === 'touchstart') {
				event = event.touches[0];
			}
			x = event.clientX;
			y = event.clientY;
			node.dispatchEvent(
				new CustomEvent('dragstart', {
					detail: { x, y }
				})
			);
			window.addEventListener('mousemove', handleMousemove);
			window.addEventListener('mouseup', handleMouseup);
			window.addEventListener('touchmove', handleMousemove);
			window.addEventListener('touchend', handleMouseup);
		}
		function handleMousemove(event) {
			if (event.type === 'touchmove') {
				event = event.changedTouches[0];
			}
			const dx = event.clientX - x;
			const dy = event.clientY - y;
			x = event.clientX;
			y = event.clientY;
			node.dispatchEvent(
				new CustomEvent('dragmove', {
					detail: { x, y, dx, dy }
				})
			);
		}
		function handleMouseup(event) {
			x = event.clientX;
			y = event.clientY;
			node.dispatchEvent(
				new CustomEvent('dragend', {
					detail: { x, y }
				})
			);
			window.removeEventListener('mousemove', handleMousemove);
			window.removeEventListener('mouseup', handleMouseup);
			window.removeEventListener('touchmove', handleMousemove);
			window.removeEventListener('touchend', handleMouseup);
		}
		node.addEventListener('mousedown', handleMousedown);
		node.addEventListener('touchstart', handleMousedown);
		return {
			destroy() {
				node.removeEventListener('mousedown', handleMousedown);
				node.removeEventListener('touchstart', handleMousedown);
			}
		};
	}
	function setHandlePosition(which) {
		return function (evt) {
			const { left, right } = sliderNew.getBoundingClientRect();
			const parentWidth = right - left;
			const p = Math.min(Math.max((evt.detail.x - left) / parentWidth, 0), 1);
			if (which === 'start') {
				start = p;
				end = Math.max(end, p);
			} else {
				start = Math.min(p, start);
				end = p;
			}
		};
	}
	function setHandlesFromBody(evt) {
		const { width } = body.getBoundingClientRect();
		const { left, right } = sliderNew.getBoundingClientRect();
		const parentWidth = right - left;
		const leftHandleLeft = leftHandle.getBoundingClientRect().left;
		const pxStart = clamp(leftHandleLeft + event.detail.dx - left, 0, parentWidth - width);
		const pxEnd = clamp(pxStart + width, width, parentWidth);
		const pStart = pxStart / parentWidth;
		const pEnd = pxEnd / parentWidth;
		start = pStart;
		end = pEnd;
	}


</script>

<div id="slider-range" />
<div class="double-range-container">
	<div class="slider" bind:this={sliderNew}>
		<div
			class="body"
			bind:this={body}
			use:draggable
			on:dragmove|preventDefault|stopPropagation={setHandlesFromBody}
			style="
				left: {100 * start}%;
				right: {100 * (1 - end)}%;
			"
		/>
		<div
			class="handle"
			bind:this={leftHandle}
			on:input={() => {
				dateOrSliderChange('sliderStartTimestamp');
			}}
			data-which="start"
			use:draggable
			on:dragmove|preventDefault|stopPropagation={setHandlePosition('start')}
			style="
				left: {100 * start}%
			"
		/>
		<div
			class="handle"
			data-which="end"
			use:draggable
			on:input={() => {
				dateOrSliderChange('sliderEndTimestamp');
			}}
			on:dragmove|preventDefault|stopPropagation={setHandlePosition('end')}
			style="
				left: {100 * end}%
			"
		/>
	</div>
	<div class="bi-grid">
		<button class="applyButton" on:click={apply} title={labels.apply}>
			{labels.apply}
		</button>
	</div>
</div> 
<style>
	.applyButton {
		width: var(--applyButtonWidth, 25px);
		height: var(--applyButtonHeight, 25px);
		background-color: var(--applyButtonBackgroundColor, #007bff);
		color: var(--applyButtonColor, #fff);
		padding: var(--applyButtonPadding, 0.5px);
		/* margin: 10px; */
		font-family: roboto;
		font-size: 0.825em;
		pointer-events: all;
	}
	.double-range-container {
		width: 100%;
		height: 20px;
		user-select: none;
		box-sizing: border-box;
		white-space: nowrap;
	}
	.slider {
		position: relative;
		width: 100%;
		height: 6px;
		top: 50%;
		transform: translate(0, -50%);
		background-color: #e2e2e2;
		box-shadow: inset 0 7px 10px -5px #4a4a4a, inset 0 -1px 0px 0px #9c9c9c;
		border-radius: 1px;
	}
	.handle {
		position: absolute;
		top: 50%;
		width: 0;
		height: 0;
	}
	.handle:after {
		content: ' ';
		box-sizing: border-box;
		position: absolute;
		border-radius: 50%;
		width: 16px;
		height: 16px;
		background-color: #fdfdfd;
		border: 1px solid #7b7b7b;
		transform: translate(-50%, -50%);
	}
	/* .handle[data-which="end"]:after{
		transform: translate(-100%, -50%);
	} */
	.handle:active:after {
		background-color: #ddd;
		z-index: 9;
	}
	.body {
		top: 0;
		position: absolute;
		background-color: #34a1ff;
		bottom: 0;
	}
</style>
