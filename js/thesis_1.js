$(function() {
	th1.init();
});

th1 = {
	init: function() {


	},

	apply: function(dhm/* distance half matrix */) {
		let min = 0;
		let max = 0;
		let mean = 0;
		const n = (dhm.length * (dhm.length - 1) / 2);
		const result = [];
		for (let row = 0; row < dhm.length; row++) {
			result[row]=[];
			for (let column = 0; column < row; column++) {
				mean += dhm[row][column];
				if (dhm[row][column] < min) {
					min = dhm[row][column]
				}
				if (dhm[row][column] > max) {
					max = dhm[row][column];
				}
				result[row][column] = 0;
			}
			for (let column = row; column < dhm.length; column++) {
				result[row][column] = 0;
			}
		}
		mean = mean / n;

		let sd = 0;
		for (let row = 0; row < dhm.length; row++) {
			for (let column = 0; column < row; column++) {
				sd = sd + (dhm[row][column] - mean) * (dhm[row][column] - mean);
			}
		}
		sd = sd / n;
		sd = Math.sqrt(sd);

		for (let row = 0; row < dhm.length; row++) {
			for (let column = 0; column < row; column++) {

				const z = (dhm[row][column] - mean) / sd;
				if(z > 1.3 || z < -1.3){
					result[row][column] = dhm[row][column];
				}else{
					result[row][column] = mean;
				}
			}
		}

		return result;
	}
}