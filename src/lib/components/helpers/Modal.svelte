<!-- 
  @component An a11y-safe modal that wields body-scroll-lock and focus-trap to create a sandboxed modal (that could also be used as a side nav panel)
	@slot prompt - The inner content of a button element, most simply a string
	@slot modal-content - The inner content of the modal, inside of the outer backdrop and wrapper
 -->
<script>
	import { cubicOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	// import { beforeNavigate } from '$app/navigation';
	import clickOutside from '$lib/actions/clickOutside';
	import { createFocusTrap } from 'focus-trap';
	import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

	let trap;
	let modalEl;
	export let isModalOpen = false;

	// close menu before navigating
	// beforeNavigate(() => (isModalOpen = false));

	$: if (isModalOpen && modalEl) {
		trap = createFocusTrap(modalEl);
		trap.activate();
		disableBodyScroll(modalEl, { reserveScrollBarGap: true });
	} else {
		if (trap) trap.deactivate();
		clearAllBodyScrollLocks();
	}
</script>

<!-- <button
	class="my-2 bg-secondary-light border border-secondary rounded-sm text-primary text-sm leading-none p-1.5 hover:border-background0"
	on:click={() => (isModalOpen = true)}
>
	<slot name="prompt">Show Modal</slot>
</button> -->

{#if isModalOpen}
	<div
		class="bi-fixed bi-left-0 bi-right-0 bi-top-0 bi-bottom-0 bi-flex bi-justify-center bi-items-center bi-z-50 bi-bg-opacity-50 bi-bg-[#333333]"
		bind:this={modalEl}
	>
		<!-- <div
			class="bi-absolute bi-h-full bi-left-0 bi-top-0 bi-bg-white bi-opacity-20 bi-z-0"
			aria-hidden="true"
		/> -->
		<div use:clickOutside on:outclick={() => (isModalOpen = false)}>
			<article
				class="bi-min-w-1/2 bi-bg-white bi-border bi-border-primary bi-drop-shadow-lg bi-relative bi-z-50 bi-flex bi-flex-wrap bi-flex-col bi-justify-center bi-items-start bi-max-w-xs"
				in:scale={{ duration: 300, easing: cubicOut }}
			>
				<div class="bi-flex bi-w-full bi-justify-end">
					<button
						class="times-button bi-px-2 bi-py-1 bi-leading-none bi-my-0 bi-text-primary bi-rounded-bl-md bi-overflow-hidden hover:bi-bg-primary hover:bi-text-background"
						on:click={() => (isModalOpen = false)}
					>
						<i class="fas fa-times bi-text-[#003A70] outline-none" />
					</button>
				</div>
				<section class="bi-mx-4">
					<slot name="modal-content">
						<p>placeholder text</p>
					</slot>
				</section>
			</article>
		</div>
	</div>
{/if}

<style>
	.times-button {
		outline: none !important;
	}
</style>
