import { ObserverMode, playerNameSpace, PlayerPhase, PlayerSeekingResult, PlayerState, playerStateNameSpace, PlayerTimeInfo } from "@netless/whiteboard-bridge-types";
import type { RoomPlayer } from "src/Types";
import { assignFuncsFromNameSpace, combineFuncsFromObjects } from "./BridgeGenerator";

export class RoomPlayerImp implements RoomPlayer {
    constructor() {
        const objs = [new PlayerStateImp(), new PlayerAsyncImp()];
        combineFuncsFromObjects(objs, this);
    }
    roomUUID(): Promise<string> {
        throw new Error("Method not implemented.");
    }
    phase(): Promise<PlayerPhase> {
        throw new Error("Method not implemented.");
    }
    playerState(): Promise<PlayerState> {
        throw new Error("Method not implemented.");
    }
    isPlayable(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    playbackSpeed(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    timeInfo(): Promise<PlayerTimeInfo> {
        throw new Error("Method not implemented.");
    }
    play() {
        throw new Error("Method not implemented.");
    }
    pause() {
        throw new Error("Method not implemented.");
    }
    stop() {
        throw new Error("Method not implemented.");
    }
    seekToScheduleTime(beginTime: number): Promise<PlayerSeekingResult> {
        throw new Error("Method not implemented.");
    }
    setObserverMode(observerMode: ObserverMode) {
        throw new Error("Method not implemented.");
    }
    setPlaybackSpeed(rate: number) {
        throw new Error("Method not implemented.");
    }
}

class PlayerStateImp implements PlayerStateInterface {
    constructor() {
        assignFuncsFromNameSpace(playerStateNameSpace, this, [
        'roomUUID',
        'phase',
        'playerState',
        'isPlayable',
        'playbackSpeed',
        'timeInfo'
        ])
    }

    roomUUID(): Promise<string> {
        throw new Error("Method not implemented.");
    }
    phase(): Promise<PlayerPhase> {
        throw new Error("Method not implemented.");
    }
    playerState(): Promise<PlayerState> {
        throw new Error("Method not implemented.");
    }
    isPlayable(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    playbackSpeed(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    timeInfo(): Promise<PlayerTimeInfo> {
        throw new Error("Method not implemented.");
    }
}

class PlayerAsyncImp implements PlayerAsyncInterface {
    constructor() {
        assignFuncsFromNameSpace(playerNameSpace, this, [
            'seekToScheduleTime'
        ])
    }

    play() {
        throw new Error("Method not implemented.");
    }
    pause() {
        throw new Error("Method not implemented.");
    }
    stop() {
        throw new Error("Method not implemented.");
    }
    seekToScheduleTime(beginTime: number): Promise<PlayerSeekingResult> {
        throw new Error("Method not implemented.");
    }
    setObserverMode(observerMode: ObserverMode) {
        throw new Error("Method not implemented.");
    }
    setPlaybackSpeed(rate: number) {
        throw new Error("Method not implemented.");
    }
}

type PlayerStateInterface = {
    roomUUID(): Promise<string>
    phase(): Promise<PlayerPhase>
    playerState(): Promise<PlayerState>
    isPlayable(): Promise<boolean>
    playbackSpeed(): Promise<number>
    timeInfo(): Promise<PlayerTimeInfo>
}

type PlayerAsyncInterface = {
    play()
    pause()
    stop()
    seekToScheduleTime(beginTime: number): Promise<PlayerSeekingResult>
    setObserverMode(observerMode: ObserverMode)
    setPlaybackSpeed(rate: number)
}