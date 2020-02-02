$(function() {
	minderheiten.init();
});

minderheiten = {
	dhm: [],
	dhmc: [],
	timepointsAmount: 20,

	init: function() {
		const me = minderheiten;

		me.initSlider();
		me.initText();

		playground.init();

		me.initData(me.update);
	},

	update: function() {
		const me = minderheiten;

		const t = Math.round(me.timeSlider.slider("value") * (me.timepointsAmount - 1) / 100);
		const zoom = me.getZoom();

		const trait = JSON.parse($("#traitSelection option:selected")[0].value);
		let data;
		let graph;
		if (trait == 2) {
			data = me.dhmc[t];
			graph = me.combined;
		} else {
			data = me.dhm[trait][t];
			graph = me.graph;
		}

		const linkForce = d3.forceLink()
			  .id(function(d) {return d.id;})
			  .distance(function(d) {
				  let v = data[d.target.id - 1][d.source.id - 1];
				  v = v * (zoom + 10) / 5;
				  return v;
			  });

		playground.update(linkForce, graph, me.getZoom);
	},

	getZoom: function(){
		return minderheiten.zoomSlider.slider("value");
	},

	initData: function(callback){
		const me = minderheiten;

		d3.json("data/minderheiten_1.json", function(error, graph) {
			if (error) throw error;

			me.graph = graph;
			for (let trait = 0; trait < 2; trait++) {
				me.dhm[trait] = [];
				me.dhm[trait][0] = d3util.listToDhm(graph.links, trait, graph.nodes.length);
				for (let t = 1; t < me.timepointsAmount; t++) {
					me.dhm[trait][t] = th1.apply(me.dhm[trait][t - 1]);
				}
			}

			me.combined = d3util.combineGraph(graph);

			me.dhmc = [];
			me.dhmc[0] = d3util.listToDhm(me.combined.links, 0, me.combined.nodes.length);
			for (let t = 1; t < me.timepointsAmount; t++) {
				me.dhmc[t] = th1.apply(me.dhmc[t - 1]);
			}

			callback();
		});
	},

	initSlider: function(){
		const me = minderheiten;
		me.timeSlider = $("#slider_time").slider({
			slide: function(event, ui) {
				me.update();
				const t = Math.round(ui.value * (me.timepointsAmount - 1) / 100);
				$("#timepoint_label").html("t" + (t + 1));
			}
		});
		me.zoomSlider = $("#slider_zoom").slider({
			slide: function(event, ui) {
				me.update();
			}
		});
		$("#traitSelection").off("change").on("change", function() {
			me.update();
		});
	},

	initText: function() {
		const me = minderheiten;
		const str = th1.apply.toString().replace(/\n/gi, "<br>").replace(/\s/gi, "<span class='space'>&nbsp;</span>");
		$("#thesis_function").html(str);
	}
}