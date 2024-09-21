import Embed from "./Embed.jsx";
import YouTube from "react-youtube";
import GetVideoID from "./video_lookup.js";
import { GetKeyframeInfo, GetNearestKeyframes } from "./keyframe_lookup.js";
import { useEffect, useState } from "react";

const Info = ({label, value}) => {
  return(
    <div className="flex gap-2">
      <div className="font-bold">{label}</div>
      <div className="">{value}</div>
    </div>
  )
}

let ytbPlayer = null;

function App() {
  const [input, setInput] = useState('');
  const [currFrame, setCurrFrame] = useState(null);


  const regex = /(L\d{2}_V\d{3})(?:_(\d{3}))?/g;
  const match = regex.exec(input);
  
  const video = match ? match[1] : null;
  const keyframe = match ? match[2] : null;

  const info = GetKeyframeInfo(video, keyframe);
  const frame = info[0];
  const second = info[1];
  const fps = info[2] ?? GetKeyframeInfo(video, 1)[2] ?? 25.0;

  const video_id = GetVideoID(video);

  const nearest_keyframes = GetNearestKeyframes(video, currFrame);

  const getCurrentFrame = () => {
    if (!ytbPlayer) return;
    const currentTime = ytbPlayer.getCurrentTime();
    const currentFrame = Math.round(currentTime * fps);
    setCurrFrame(currentFrame);
  }

  const storePlayer = (event) => {
    ytbPlayer = event.target;

    if (second) {
      ytbPlayer.seekTo(second);
      // ytbPlayer.pauseVideo();
    }
  }

  useEffect(() => {
    const interval = setInterval(() => getCurrentFrame(), 1000 / fps);
    return () => {
      clearInterval(interval);
      ytbPlayer = null;
    };
  }, [video_id]);

  useEffect(() => {
    if (!second || !ytbPlayer) return;

    console.log("Seek", second);
    ytbPlayer.seekTo(second);
  }, [video_id, second]);

  return (
    <div className="flex flex-col justify-start place-items-center p-4 gap-4 h-screen">
      <div className="bg-slate-200 rounded-lg w-1/2 p-4">
        <div className="flex flex-col gap-4">
          <label htmlFor="video" className="font-bold text-xl">Keyframe</label>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" id="video" placeholder="LXX_V0XX_XXX" className="bg-white p-4 rounded-lg"
                    value={input}
                    onChange={(e) => setInput(e.target.value.toUpperCase())}/>
            <div className="grid grid-cols-2">
              <Info label="Video" value={video} />
              <Info label="Second" value={second} />
              <Info label="Keyframe" value={keyframe} />
              <Info label="Frame" value={frame} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-1/2 h-full gap-2">
        <div className="flex justify-between">
          <Info label="Current Frame" value={currFrame} />
          <div className="flex gap-3">
            <div className="font-bold">Nearest keyframes</div>
            <div className="cursor-pointer text-blue-400" onClick={(e) => setInput(nearest_keyframes[2]) }>
              {nearest_keyframes[2]}
            </div>
            <div className="cursor-pointer text-blue-400" onClick={(e) => setInput(nearest_keyframes[5]) }>
              {nearest_keyframes[5]}
            </div>
          </div>
        </div>
        <div className="w-full h-full">
        {
          video && video_id ? 
          <YouTube videoId={video_id}
                    className="w-full h-full rounded-lg"
                    iframeClassName="w-full h-full rounded-lg"
                    onReady={storePlayer}
                    // onPause={storePlayer}
                    // onPlay={storePlayer}
          />
          // <Embed id={video_id} start={second && Math.floor(second)} className={"w-1/2 h-full rounded-lg"}/>
          :
          <div className="w-full h-full rounded-lg bg-slate-400 flex justify-center font-bold text-2xl text-slate-700 place-items-center">
            {
              !video ? 'Waiting for input'
              : !video_id ? 'Video not found' : ''   
            }
          </div>
        }
        </div>
      </div>
      
    </div>
  );
}

export default App;
