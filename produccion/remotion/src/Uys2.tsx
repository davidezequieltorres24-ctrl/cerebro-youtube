import React from 'react';
import {UysVideo, uysFrames} from './UysMotor';
import {PLAN_UYS2} from './plan-uys2';
import words from './words-uys2-guion.json';
const WD = words as {w: string; s: number; e: number}[];
export const UYS2_FRAMES = uysFrames(PLAN_UYS2, WD);
export const Uys2: React.FC = () => <UysVideo plan={PLAN_UYS2} words={WD} voz="uys-2/voz/voz.mp3" musica="uys-2/sfx/musica.mp3" musicaVol={0.09} ambVol={0.14} />;
