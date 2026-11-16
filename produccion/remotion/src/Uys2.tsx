import React from 'react';
import {UysVideo, uysFrames} from './UysMotor';
import {PLAN_UYS2_MUESTRA} from './plan-uys2';
import wordsMuestra from './words-uys2-muestra.json';
const WM = wordsMuestra as {w: string; s: number; e: number}[];
export const UYS2_MUESTRA_FRAMES = uysFrames(PLAN_UYS2_MUESTRA, WM);
export const Uys2Muestra: React.FC = () => <UysVideo plan={PLAN_UYS2_MUESTRA} words={WM} voz="uys-2/voz/muestra.mp3" musica="n-musica.mp3" musicaVol={0.07} />;
