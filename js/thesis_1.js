$(function() {
	th1.init();
});

th1 = {
	init: function() {

	},

	apply: function(distanceMatrix) {
		const len = distanceMatrix.length;
		let mean = 0;
		const n = (len * (len - 1) / 2);
		const result = [];
		for (let row = 0; row < len; row++) {
			result[row] = [];
			for (let column = 0; column < row; column++) {
				mean += distanceMatrix[row][column];
				result[row][column] = 0;
			}
			for (let column = row; column < len; column++) {
				result[row][column] = 0;
			}
		}
		mean = mean / n;
		let sd = 0;
		for (let row = 0; row < len; row++) {
			for (let column = 0; column < row; column++) {
				sd = sd + (distanceMatrix[row][column] - mean) * (distanceMatrix[row][column] - mean);
			}
		}
		sd = sd / n;
		sd = Math.sqrt(sd);
		for (let row = 0; row < len; row++) {
			for (let column = 0; column < row; column++) {
				const z = (distanceMatrix[row][column] - mean) / sd;
				if(z > 1.3 || z < -1.3){
					result[row][column] = distanceMatrix[row][column];
				}else{
					result[row][column] = mean;
				}
			}
		}
		return result;
	}
}