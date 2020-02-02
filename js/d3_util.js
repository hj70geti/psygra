d3util = {
	listToDhm: function(links, valueIndex, len) {

		// initialize matrix
		const dhm = [];
		for (let l = 0; l < len; l++) {
			dhm[l] = [];
			for (let m = 0; m < len; m++) {
				dhm[l][m] = 0;
			}
		}

		// fill
		for (let i = 0; i < links.length; i++) {
			dhm[links[i].target - 1][links[i].source - 1] = links[i].value[valueIndex];
		}
		return dhm;
	},

	findDistance: function(links, source, target, trait) {
		for (let l = 0; l < links.length; l++) {
			if (links[l].source == source && links[l].target === target) {
				return links[l].value[trait];
			}
		}
	},


	combineGraph: function(graph){
		const me = d3util;

		const result = {nodes: [], links: []}
		for (let n = 0, i = 1; n < graph.nodes.length; n++) {
			for (let m = 0; m < 2; m++, i++) {
				result.nodes.push({
					id: i,
					person: graph.nodes[n].id,
					trait: m,
					farbe: graph.nodes[n].farbe
				});
			}
		}

		for (let n = 0; n < result.nodes.length; n++) {
			for (let m = n + 1; m < result.nodes.length; m++) {
				let v = 0;
				let trait = -1;
				if(result.nodes[n].person === result.nodes[m].person){
					v = 1;
				} else{
					if(result.nodes[n].trait === result.nodes[m].trait){
						v = me.findDistance(graph.links,
						  result.nodes[n].person,
						  result.nodes[m].person,
						  result.nodes[n].trait);
						trait = result.nodes[n].trait
					} else{
						v = 0;
					}
				}
				if(v>0){
					result.links.push({source:n+1,target:m+1,value:[v], trait: trait});
				}
			}
		}
		return result;
	}
}