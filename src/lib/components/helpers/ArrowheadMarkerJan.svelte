<!--
  @component
  Generates an SVG marker containing a marker for a triangle makes a nice arrowhead. Add it to the named slot called "defs" on the SVG layout component.
 -->
<script>
	/** @type {String} [fill='#000'] – The arrowhead's fill color. */
	export let fill = '#000';

	/** @type {String} [stroke='#000'] – The arrowhead's fill color. */
	export let stroke = '#000';

	export let orient = 0;

	export let markerWidth;

	export let annotations = [];
</script>

<marker
	id="arrowheadJan"
	viewBox="0 0 81.6 55.4"
	preserveAspectRatio="none"
	{markerWidth}
	markerHeight="60"
	{orient}
	refX="41"
	refY="2"
	{annotations}
>
	<!-- <path d="M-6,-6 L 0,0 L -6,6" {fill} {stroke} /> -->
	<polygon
		points="0.5,0.5 81.1,0.5 81.1,47.2 47,47.2 40.8,54.6 35.1,47.2 0.5,47.2 "
		{fill}
		{stroke}
	/>
</marker>
