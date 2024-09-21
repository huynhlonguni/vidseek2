const context = require.context('./media-info', true, /.json$/);
const media_info = {};
context.keys().forEach((key) => {
  const fileName = key.replace('./', '');
  const resource = require(`./media-info/${fileName}`);
  const namespace = fileName.replace('.json', '');
  media_info[namespace] = JSON.parse(JSON.stringify(resource));
 
});

const GetVideoID = (video_name) => {
	if (!(video_name in media_info)) return null;
	return media_info[video_name]['watch_url'].replace('https://youtube.com/watch?v=', '');
};

export default GetVideoID;