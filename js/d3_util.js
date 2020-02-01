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
	}
}