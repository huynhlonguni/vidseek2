/* eslint import/no-webpack-loader-syntax: off */
const context = require.context('./map-keyframes', true, /.csv$/);
const map_keyframes = {};
context.keys().forEach((key) => {
	const fileName = key.replace('./', '');
	const resource = require(`!!dsv-loader!./map-keyframes/${fileName}`);
	const namespace = fileName.replace('.csv', '');
	map_keyframes[namespace] = resource;
 
});


const GetKeyframeInfo = (video_name, index) => {
	const error = [null, null, null];
	if (!index)
		return error;

	if (!(video_name in map_keyframes))
		return error;

	const mapping = map_keyframes[video_name][index - 1];
	if (!mapping)
		return error;

	if (parseInt(mapping['n']) + 1 != index) {
		alert(`Failed to lookup frame, index ${index} not found in mappings data`);
		return error;
	}
	return [parseInt(mapping["frame_idx"]), parseFloat(mapping["pts_time"]), parseFloat(mapping["fps"])];
};

const getFrame = (mapping, index) => {
	if (index < 0 || index >= mapping.length) return -1;

	return parseInt(mapping[index]["frame_idx"]);
}

const GetNearestKeyframes = (video_name, currentFrame) => {
	const error = [null, null, null, null, null, null];

	const mapping = map_keyframes[video_name];
	if (!mapping)
		return error;

	//Lower bound, get index of first element greater than X
	let low = 0;
	let high = mapping.length;

	while (low < high) {
		let mid = Math.floor(low + (high - low) / 2);
		
		if (currentFrame <= getFrame(mapping, mid))
			high = mid;
		else
			low = mid + 1;
	}

	if (low < mapping.length && getFrame(mapping, low) < currentFrame)
		low++;

	low--;
	if (low < 0) low = 0;

	let next = low + 1;
	if (getFrame(mapping, next) == currentFrame)
		next++;

	if (next >= mapping.length) next = mapping.length - 1;

	return [low + 1, getFrame(mapping, low), `${video_name}_${String(low + 1).padStart(3, '0')}`,
			next + 1, getFrame(mapping, next), `${video_name}_${String(next + 1).padStart(3, '0')}`];
};

export {
	GetKeyframeInfo,
	GetNearestKeyframes
};