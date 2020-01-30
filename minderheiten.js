$(function(){
 	var graphOriginal;

	$("#slider").slider({
		slide: function(event, ui) {
			update();
		}
	});



	var canvas = document.querySelector("canvas"),
	  context = canvas.getContext("2d"),
	  width = canvas.width,
	  height = canvas.height;

	var linkForce = d3.forceLink()
	  .id(function(d) {
		  return d.id;
	  })
	  .distance(function(d) {
		  return d.value[trait];
	  });
	var update = function() {
		trait = JSON.parse($("#traitSelection option:selected")[0].value);
		linkForce.distance(function(d) {


			var sliderValue = $("#slider").slider("value");
			var v=d.value[trait];

			/* hier kommt die theorie ins spiel*/
			v=sliderValue*10+v;

			other = graphOriginal.links;
			//if(d.source != other.source)


			return v;
		});
		simulation.alpha(1).restart();
	};
	var trait = JSON.parse($("#traitSelection option:selected")[0].value);
	$("#traitSelection").off("change").on("change", function() {
		update();
	});


	var simulation = d3.forceSimulation()
	  .force("link", linkForce)
	  .force("charge", d3.forceManyBody())
	  .force("center", d3.forceCenter(width / 2, height / 2));

	d3.json("minderheiten_1.json", function(error, graph) {
		if (error) throw error;
		graphOriginal = graph;

		simulation
		  .nodes(graph.nodes)
		  .on("tick", ticked);

		simulation.force("link")
		  .links(graph.links);

		d3.select(canvas)
		  .call(d3.drag()
			.container(canvas)
			.subject(dragsubject)
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended));

		function ticked() {
			context.clearRect(0, 0, width, height);

			context.beginPath();
			graph.links.forEach(function(d) {
				context.moveTo(d.source.x, d.source.y);
				context.lineTo(d.target.x, d.target.y);

			});
			context.strokeStyle = "#4b4b4b55";
			context.stroke();

			context.beginPath();
			graph.nodes.forEach(function(d) {
				context.beginPath();
				context.moveTo(d.x + 6, d.y);
				context.arc(d.x, d.y, 6, 0, 2 * Math.PI);
				context.fillStyle = d.farbe;
				context.fill();
				context.strokeStyle = "#00000055";
				context.stroke();
			});
		}

		function dragsubject() {
			return simulation.find(d3.event.x, d3.event.y);
		}
	});

	function dragstarted() {
		if (!d3.event.active) simulation.alphaTarget(0.3).restart();
		d3.event.subject.fx = d3.event.subject.x;
		d3.event.subject.fy = d3.event.subject.y;
	}

	function dragged() {
		d3.event.subject.fx = d3.event.x;
		d3.event.subject.fy = d3.event.y;
	}

	function dragended() {
		if (!d3.event.active) simulation.alphaTarget(0);
		d3.event.subject.fx = null;
		d3.event.subject.fy = null;
	}

});