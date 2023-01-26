<!--
  @component
  Generates an SVG marker containing a marker for a triangle makes a nice arrowhead. Add it to the named slot called "defs" on the SVG layout component.
 -->
<script>
	/** @type {String} [fill='#000'] – The arrowhead's fill color. */
	export let fill = '#dce2e7';

	/** @type {String} [stroke='#000'] – The arrowhead's fill color. */
	export let stroke = '#000';

	export let orient = '-360deg';
</script>

<marker
	id="arrowheadflex"
	viewBox="0 0 2.5 4.04"
	markerWidth="20"
	markerHeight="12"
	{orient}
	refX="2"
	refY="2"
>
	<polygon id="pointer" points="0 0 2.5 1.92 0 4.04 0 0" {fill} {stroke} />
</marker>
