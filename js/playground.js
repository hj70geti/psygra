playground = {

	init: function(){
		const me = playground;

		me.element = $("#playground")[0];
		me.context = me.element.getContext("2d");

		d3.select(me.element)
		  .call(d3.drag()
			.container(me.element)
			.subject(me.dragsubject)
			.on("start", me.dragstarted)
			.on("drag", me.dragged)
			.on("end", me.dragended));

	},

	update: function(linkForce, graph, getZoom){
		const me = playground;

		me.simulation = d3.forceSimulation()
		  .force("link", linkForce)
		  .force("charge", d3.forceManyBody())
		  .force("center", d3.forceCenter(me.element.width / 2, me.element.height / 2));


		me.simulation.nodes(graph.nodes)
		  .on("tick", function(){
			  me.ticked(graph, getZoom());
		  })
		  .force("link")
		  .links(graph.links);

	},

	ticked: function(graph, zoom) {
		const me = playground;

		const context = me.context;
		const radius = 15 + (zoom + 1);

		context.clearRect(0, 0, me.element.width, me.element.height);
		context.beginPath();
		graph.links.forEach(function(d) {
			context.shadowBlur = 0;
			context.moveTo(d.source.x, d.source.y);
			context.lineTo(d.target.x, d.target.y);

		});
		context.strokeStyle = "#4b4b4b55";
		context.stroke();
		context.beginPath();
		graph.nodes.forEach(function(d) {
			// Create gradient
			const grd = context.createRadialGradient(d.x, d.y, 1, d.x, d.y, radius);
			grd.addColorStop(0, d.farbe);
			grd.addColorStop(1, d.farbe + "35");
			context.beginPath();
			context.moveTo(d.x + radius, d.y);
			context.arc(d.x, d.y, radius, 0, 2 * Math.PI);
			context.fillStyle = grd;
			context.fill();
		});
	},

	dragsubject:function () {
		return playground.simulation.find(d3.event.x, d3.event.y);
	},

	dragstarted: function() {
		const me = playground;

		if (!d3.event.active) {
			me.simulation.alphaTarget(0.3).restart();
		}
		d3.event.subject.fx = d3.event.subject.x;
		d3.event.subject.fy = d3.event.subject.y;
	},

	dragged: function() {
		d3.event.subject.fx = d3.event.x;
		d3.event.subject.fy = d3.event.y;
	},

	dragended: function() {
		const me = playground;

		if (!d3.event.active) {
			me.simulation.alphaTarget(0);
		}
		d3.event.subject.fx = null;
		d3.event.subject.fy = null;
	}
}