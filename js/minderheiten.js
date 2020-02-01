$(function() {
	let dhm_tp1;
	let dhm_tp2;

	const timeSlider = $("#slider_time").slider({
		slide: function(event, ui) {
			update();
		}
	});
	const zoomSlider = $("#slider_zoom").slider({
		slide: function(event, ui) {
			update();
		}
	});


	const playground = $("#playground")[0],
	  context = playground.getContext("2d"),
	  width = playground.width,
	  height = playground.height;

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
			const timePoint = timeSlider.slider("value");
			const zoom 		= zoomSlider.slider("value");

			let v;
			if (timePoint < 50) {
				v = dhm_tp1[d.target.id - 1][d.source.id - 1];
			} else {
				v = dhm_tp2[d.target.id - 1][d.source.id - 1];
			}

			v = v * (zoom+10)/5;

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

	d3.json("data/minderheiten_1.json", function(error, graph) {
		if (error) throw error;

		dhm_tp1 = d3util.listToDhm(graph.links, 0, graph.nodes.length);
		dhm_tp2 = th1.apply(dhm_tp1);

		simulation
		  .nodes(graph.nodes)
		  .on("tick", ticked);

		simulation.force("link")
		  .links(graph.links);

		d3.select(playground)
		  .call(d3.drag()
			.container(playground)
			.subject(dragsubject)
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended));

		function ticked() {
			const radius = 15 + (zoomSlider.slider("value")+1);


			context.clearRect(0, 0, width, height);

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
				grd.addColorStop(1, d.farbe + "00");


				context.beginPath();
				context.moveTo(d.x + radius, d.y);
				context.arc(d.x, d.y, radius, 0, 2 * Math.PI);
				// context.shadowColor = d.farbe;
				// context.shadowBlur = 5;
				context.fillStyle = grd;
				context.fill();
				
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

	update();
	
});