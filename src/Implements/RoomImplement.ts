import type { Room, RoomAsync, RoomBridge, RoomPPT, RoomState, RoomSync } from "../Types";
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
    ImageInformation } from "@netless/whiteboard-bridge-types";
import { assignFuncsFromNameSpace } from './BridgeGenerator';

export class RoomImplement implements Room {
    roomState: WhiteRoomState;
    constructor(props: {roomState: WhiteRoomState}) {
        this.roomState = props.roomState;
        const objs = [new RoomAsyncImp(), new RoomBridgeImp(), new RoomSyncImp(), new RoomPPTImp(), new RoomStateImp()];
        const imps = objs.map ( obj => {
            return { proto: obj, funcNames:  Object.getOwnPropertyNames(Object.getPrototypeOf(obj))};
        });
        
        let proto = Object.getPrototypeOf(this);
        const funcs = Object.getOwnPropertyNames(proto);
        funcs.forEach(f => {
            if (f == 'constructor') { return; }

            imps.forEach(obj => {
                if (obj.funcNames.find(name => name == f)) {
                    proto[f] = obj.proto[f];
                }
            })
        })
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
    prevPage: Promise<boolean>;
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
    zoomChange(scale: number) {
        throw new Error("Method not implemented.");
    }
    disableCameraTransform(disableCamera: boolean) {
        throw new Error("Method not implemented.");
    }
    disableDeviceInputs(disable: boolean) {
        throw new Error("Method not implemented.");
    }
    disableOperations(disableOperations: boolean) {
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
    insertText(x: number, y: number, textContent: string): Promise<Boolean> {
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
    constructor() {
        assignFuncsFromNameSpace(roomNamespace, this, []);
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
    constructor() {
        assignFuncsFromNameSpace(pptNamespace, this, []);
    }
    nextStep() {
        throw new Error("Method not implemented.");
    }
    previousStep() {
        throw new Error("Method not implemented.");
    }
}

class RoomSyncImp implements RoomSync {
    constructor() {
        assignFuncsFromNameSpace(roomSyncNamespace, this, []);
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
    constructor() {
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
        assignFuncsFromNameSpace(roomNamespace, this, promiseList);
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
    prevPage: Promise<boolean>;
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
    zoomChange(scale: number) {
        throw new Error("Method not implemented.");
    }
    disableCameraTransform(disableCamera: boolean) {
        throw new Error("Method not implemented.");
    }
    disableDeviceInputs(disable: boolean) {
        throw new Error("Method not implemented.");
    }
    disableOperations(disableOperations: boolean) {
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
    insertText(x: number, y: number, textContent: string): Promise<Boolean> {
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
    constructor() {
        assignFuncsFromNameSpace(roomStateNamespace, this, [
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