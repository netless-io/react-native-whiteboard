import type { Room } from "../Types";
import {
    EventEntry, 
    pptNamespace, 
    RemovePageParams, 
    RoomMemberState, 
    roomNamespace, 
    roomStateNamespace, 
    roomSyncNamespace, 
    WhiteRoomState, 
    AddPageParams, 
    GlobalState, 
    SceneState, 
    WhiteScene, 
    BroadcastState, 
    RoomPhase, 
    SceneDefinition, 
    ImageInformation, 
    TeleBoxColorScheme} from "@netless/whiteboard-bridge-types";
import { assignFuncsFromNameSpace, combineFuncsFromObjects } from './BridgeGenerator';
import type { Bridge } from "@netless/react-native-bridge";

export class RoomImplement implements Room {
    roomState: WhiteRoomState;
    constructor(props: {roomState: WhiteRoomState, bridge: Bridge}) {
        this.roomState = props.roomState;
        const objs = [
            new RoomAsyncImp(props.bridge), 
            new RoomBridgeImp(props.bridge), 
            new RoomSyncImp(props.bridge), 
            new RoomPPTImp(props.bridge), 
            new RoomStateImp(props.bridge)];
        combineFuncsFromObjects(objs, this);
    }

    setWindowManagerAttributes(attributes: any) {
        throw new Error("Method not implemented.");
    }
    setContainerSizeRatio(ratio: number) {
        throw new Error("Method not implemented.");
    }
    setPrefersColorScheme(scheme: "light" | "dark" | "auto") {
        throw new Error("Method not implemented.");
    }
    syncBlockTimestamp(timeStamp: any) {
        throw new Error("Method not implemented.");
    }
    disableSerialization(disable: boolean) {
        throw new Error("Method not implemented.");
    }
    copy() {
        throw new Error("Method not implemented.");
    }
    paste() {
        throw new Error("Method not implemented.");
    }
    duplicate() {
        throw new Error("Method not implemented.");
    }
    delete() {
        throw new Error("Method not implemented.");
    }
    disableEraseImage(disable: boolean) {
        throw new Error("Method not implemented.");
    }
    nextStep() {
        throw new Error("Method not implemented.");
    }
    previousStep() {
        throw new Error("Method not implemented.");
    }
    redo(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    undo(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    canRedoSteps(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    canUndoSteps(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    setGlobalState(modifyState: Partial<GlobalState>) {
        throw new Error("Method not implemented.");
    }
    setScenePath(scenePath: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    addPage(params: AddPageParams): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removePage(params: RemovePageParams): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    nextPage(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    prevPage(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    setMemberState(memberState: Partial<RoomMemberState>) {
        throw new Error("Method not implemented.");
    }
    setViewMode(viewMode: string) {
        throw new Error("Method not implemented.");
    }
    setWritable(writable: boolean): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getMemberState(): Promise<RoomMemberState> {
        throw new Error("Method not implemented.");
    }
    getGlobalState(): Promise<GlobalState> {
        throw new Error("Method not implemented.");
    }
    getSceneState(): Promise<SceneState> {
        throw new Error("Method not implemented.");
    }
    getRoomMembers(): Promise<RoomMemberState> {
        throw new Error("Method not implemented.");
    }
    setSceneIndex(index: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getScenes(): Promise<WhiteScene[]> {
        throw new Error("Method not implemented.");
    }
    getZoomScale(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    getBroadcastState(): Promise<BroadcastState> {
        throw new Error("Method not implemented.");
    }
    getRoomPhase(): Promise<RoomPhase> {
        throw new Error("Method not implemented.");
    }
    disconnect(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    disableCameraTransform(disableCamera: boolean) {
        throw new Error("Method not implemented.");
    }
    disableDeviceInputs(disable: boolean) {
        throw new Error("Method not implemented.");
    }
    disableWindowOperation(disable: boolean) {
        throw new Error("Method not implemented.");
    }
    putScenes(dir: string, scenes: SceneDefinition[], index: number): Promise<SceneState> {
        throw new Error("Method not implemented.");
    }
    removeScenes(dirOrPath: string) {
        throw new Error("Method not implemented.");
    }
    moveScene(source: string, target: string) {
        throw new Error("Method not implemented.");
    }
    insertText(x: number, y: number, textContent: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    cleanScene(retainPpt: boolean) {
        throw new Error("Method not implemented.");
    }
    insertImage(imageInfo: ImageInformation) {
        throw new Error("Method not implemented.");
    }
    completeImageUpload(uuid: string, url: string) {
        throw new Error("Method not implemented.");
    }
    dispatchMagixEvent(event: EventEntry) {
        throw new Error("Method not implemented.");
    }
    setTimeDelay(delay: number) {
        throw new Error("Method not implemented.");
    }
    addApp(kind: string, options: any, attributes: any): Promise<string> {
        throw new Error("Method not implemented.");
    }
    closeApp(appId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getSyncedState(): Promise<object> {
        throw new Error("Method not implemented.");
    }
    safeSetAttributes(attributes: any) {
        throw new Error("Method not implemented.");
    }
    safeUpdateAttributes(keys: string[], attributes: any) {
        throw new Error("Method not implemented.");
    }
    getRoomState(): Promise<WhiteRoomState> {
        throw new Error("Method not implemented.");
    }
    getTimeDelay(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    getPhase(): Promise<RoomPhase> {
        throw new Error("Method not implemented.");
    }
    isWritable(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    debugInfo(): Promise<object> {
        throw new Error("Method not implemented.");
    }
}

class RoomBridgeImp implements RoomBridge {
    constructor(bridge: Bridge) {
        assignFuncsFromNameSpace(roomNamespace, this, bridge, []);
    }
    setWindowManagerAttributes(attributes: any) {
        throw new Error("Method not implemented.");
    }
    setContainerSizeRatio(ratio: number) {
        throw new Error("Method not implemented.");
    }
    setPrefersColorScheme(scheme: "light" | "dark" | "auto") {
        throw new Error("Method not implemented.");
    }
}

class RoomPPTImp implements RoomPPT {
    constructor(bridge: Bridge) {
        assignFuncsFromNameSpace(pptNamespace, this, bridge, []);
    }
    nextStep() {
        throw new Error("Method not implemented.");
    }
    previousStep() {
        throw new Error("Method not implemented.");
    }
}

class RoomSyncImp implements RoomSync {
    constructor(bridge: Bridge) {
        assignFuncsFromNameSpace(roomSyncNamespace, this, bridge, []);
    }
    syncBlockTimestamp(timeStamp: any) {
        throw new Error("Method not implemented.");
    }
    disableSerialization(disable: boolean) {
        throw new Error("Method not implemented.");
    }
    copy() {
        throw new Error("Method not implemented.");
    }
    paste() {
        throw new Error("Method not implemented.");
    }
    duplicate() {
        throw new Error("Method not implemented.");
    }
    delete() {
        throw new Error("Method not implemented.");
    }
    disableEraseImage(disable: boolean) {
        throw new Error("Method not implemented.");
    }
}

class RoomAsyncImp implements RoomAsync {
    constructor(bridge: Bridge) {
        const promiseList = 
            [
                'redo',
                'undo',
                'canRedoSteps',
                'canUndoSteps',
                'setScenePath',
                'addPage',
                'removePage',
                'nextPage',
                'prevPage',
                'setWritable',
                'getMemberState',
                'getGlobalState',
                'getSceneState',
                'getRoomMembers',
                'setSceneIndex',
                'getScenes',
                'getZoomScale',
                'getBroadcastState',
                'getRoomPhase',
                'disconnect',
                'putScenes',
                'insertText',
                'addApp',
                'closeApp',
                'getSyncedState'
            ];
        assignFuncsFromNameSpace(roomNamespace, this, bridge, promiseList);
    }
    redo(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    undo(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    canRedoSteps(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    canUndoSteps(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    setGlobalState(modifyState: Partial<GlobalState>) {
        throw new Error("Method not implemented.");
    }
    setScenePath(scenePath: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    addPage(params: AddPageParams): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removePage(params: RemovePageParams): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    nextPage(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    prevPage(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    setMemberState(memberState: Partial<RoomMemberState>) {
        throw new Error("Method not implemented.");
    }
    setViewMode(viewMode: string) {
        throw new Error("Method not implemented.");
    }
    setWritable(writable: boolean): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getMemberState(): Promise<RoomMemberState> {
        throw new Error("Method not implemented.");
    }
    getGlobalState(): Promise<GlobalState> {
        throw new Error("Method not implemented.");
    }
    getSceneState(): Promise<SceneState> {
        throw new Error("Method not implemented.");
    }
    getRoomMembers(): Promise<RoomMemberState> {
        throw new Error("Method not implemented.");
    }
    setSceneIndex(index: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getScenes(): Promise<WhiteScene[]> {
        throw new Error("Method not implemented.");
    }
    getZoomScale(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    getBroadcastState(): Promise<BroadcastState> {
        throw new Error("Method not implemented.");
    }
    getRoomPhase(): Promise<RoomPhase> {
        throw new Error("Method not implemented.");
    }
    disconnect(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    disableCameraTransform(disableCamera: boolean) {
        throw new Error("Method not implemented.");
    }
    disableDeviceInputs(disable: boolean) {
        throw new Error("Method not implemented.");
    }
    disableWindowOperation(disable: boolean) {
        throw new Error("Method not implemented.");
    }
    putScenes(dir: string, scenes: SceneDefinition[], index: number): Promise<SceneState> {
        throw new Error("Method not implemented.");
    }
    removeScenes(dirOrPath: string) {
        throw new Error("Method not implemented.");
    }
    moveScene(source: string, target: string) {
        throw new Error("Method not implemented.");
    }
    insertText(x: number, y: number, textContent: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    cleanScene(retainPpt: boolean) {
        throw new Error("Method not implemented.");
    }
    insertImage(imageInfo: ImageInformation) {
        throw new Error("Method not implemented.");
    }
    completeImageUpload(uuid: string, url: string) {
        throw new Error("Method not implemented.");
    }
    dispatchMagixEvent(event: EventEntry) {
        throw new Error("Method not implemented.");
    }
    setTimeDelay(delay: number) {
        throw new Error("Method not implemented.");
    }
    addApp(kind: string, options: any, attributes: any): Promise<string> {
        throw new Error("Method not implemented.");
    }
    closeApp(appId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getSyncedState(): Promise<object> {
        throw new Error("Method not implemented.");
    }
    safeSetAttributes(attributes: any) {
        throw new Error("Method not implemented.");
    }
    safeUpdateAttributes(keys: string[], attributes: any) {
        throw new Error("Method not implemented.");
    }
}

class RoomStateImp implements RoomState {
    constructor(bridge: Bridge) {
        assignFuncsFromNameSpace(roomStateNamespace, this, bridge, [
            'getRoomState',
            'getTimeDelay',
            'getPhase',
            'isWritable',
            'debugInfo'
        ]);
    }
    getRoomState(): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getTimeDelay(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    getPhase(): Promise<RoomPhase> {
        throw new Error("Method not implemented.");
    }
    isWritable(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    debugInfo(): Promise<object> {
        throw new Error("Method not implemented.");
    }
}

type RoomBridge = {
    setWindowManagerAttributes(attributes: any)
    setContainerSizeRatio(ratio: number)
    setPrefersColorScheme(scheme: TeleBoxColorScheme)
}

type RoomPPT = {
    nextStep()
    previousStep()
}

type RoomSync = {
    syncBlockTimestamp(timeStamp)
    disableSerialization(disable: boolean)
    copy()
    paste()
    duplicate()
    delete();
    disableEraseImage(disable: boolean)
}

type RoomAsync = {
    redo(): Promise<number>
    undo(): Promise<number>
    canRedoSteps(): Promise<number>
    canUndoSteps(): Promise<number>
    setGlobalState(modifyState: Partial<GlobalState>)
    setScenePath(scenePath: string): Promise<string>
    addPage(params: AddPageParams): Promise<void>
    removePage(params: RemovePageParams): Promise<boolean>
    nextPage(): Promise<boolean>
    prevPage(): Promise<boolean>
    setMemberState(memberState: Partial<RoomMemberState>);
    setViewMode(viewMode: string)
    setWritable(writable: boolean): Promise<void>
    getMemberState(): Promise<RoomMemberState>
    getGlobalState(): Promise<GlobalState>
    getSceneState(): Promise<SceneState>
    getRoomMembers(): Promise<RoomMemberState>

    setSceneIndex(index: number): Promise<void>
    getScenes(): Promise<WhiteScene[]>
    getZoomScale(): Promise<number>
    getBroadcastState(): Promise<BroadcastState>
    getRoomPhase(): Promise<RoomPhase>

    disconnect(): Promise<void>

    disableCameraTransform(disableCamera: boolean)
    disableDeviceInputs(disable: boolean)
    disableWindowOperation(disable: boolean)

    putScenes(dir: string, scenes: SceneDefinition[], index: number): Promise<SceneState>
    removeScenes(dirOrPath: string)

    moveScene(source: string, target: string)

    insertText(x: number, y: number, textContent: string): Promise<string>

    cleanScene(retainPpt: boolean);
    insertImage(imageInfo: ImageInformation)
    completeImageUpload(uuid: string, url: string)

    dispatchMagixEvent(event: EventEntry)
    setTimeDelay(delay: number)

    addApp(kind: string, options: any, attributes: any): Promise<string>
    closeApp(appId: string): Promise<void>

    getSyncedState(): Promise<object>
    safeSetAttributes(attributes: any)
    safeUpdateAttributes(keys: string[], attributes: any)
}

type RoomState = {
    getRoomState(): Promise<WhiteRoomState>
    getTimeDelay(): Promise<number>
    getPhase(): Promise<RoomPhase>
    isWritable(): Promise<boolean>
    debugInfo(): Promise<object>
}