import React from 'react';
import {Composition} from 'remotion';
import {ParecePobre, TOTAL_FRAMES} from './ParecePobre';
import {FullVideo, FULL_FRAMES} from './FullVideo';
import {Video2, V2_FRAMES} from './Video2';
import {Demo3, DEMO3_FRAMES} from './Demo3';
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="ParecePobre" component={ParecePobre} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="FullVideo" component={FullVideo} durationInFrames={FULL_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Video2" component={Video2} durationInFrames={V2_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Demo3" component={Demo3} durationInFrames={DEMO3_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
