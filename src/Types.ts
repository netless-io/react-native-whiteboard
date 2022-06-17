import type { StyleProp, ViewStyle } from "react-native";
import type { 
    AppRegisterParams,
    EventEntry,
    MediaType,
    NativeJoinRoomParams,
    NativeSDKConfig, 
    RemovePageParams, 
    RoomMemberState, 
    TeleBoxColorScheme, 
    WhiteRoomState,
    BroadcastState, 
    GlobalState,
    ImageInformation,
    RoomPhase,
    SceneDefinition,
    SceneState,
    WhiteScene,
    AddPageParams
} from '@netless/whiteboard-bridge-types';

export type SDKConfig = NativeSDKConfig;
export type RoomConfig = Omit<NativeJoinRoomParams, 'nativeWebSocket'>;

export type WhiteboardViewProps = {
    style: StyleProp<ViewStyle>,
    roomConfig: RoomConfig
    sdkConfig: SDKConfig
    joinRoomCallback: ((room?: Room, sdk?: SDK, error?: Error)=>void)
    roomCallbacks?: Partial<RoomCallbackHandler>
    sdkCallbacks?: Partial<SDKCallbackHandler>
}

export type Room = RoomBridge & RoomSync & RoomPPT & RoomAsync & RoomState & {
    roomState: WhiteRoomState;
}

export type RoomBridge = {
    setWindowManagerAttributes(attributes: any)
    setContainerSizeRatio(ratio: number)
    setPrefersColorScheme(scheme: TeleBoxColorScheme)
}

export type RoomPPT = {
    nextStep()
    previousStep()
}

export type RoomSync = {
    syncBlockTimestamp(timeStamp)
    disableSerialization(disable: boolean)
    copy()
    paste()
    duplicate()
    delete();
    disableEraseImage(disable: boolean)
}

export type RoomAsync = {
    /** redo count */
    redo(): Promise<number>
    /** 撤回 undo count */
    undo(): Promise<number>
    canRedoSteps(): Promise<number>
    canUndoSteps(): Promise<number>
    /** set 系列API */
    setGlobalState(modifyState: Partial<GlobalState>)
    /** 替代切换页面，设置当前场景。path 为想要设置场景的 path */
    setScenePath(scenePath: string): Promise<string>
    addPage(params: AddPageParams): Promise<void>
    removePage(params: RemovePageParams): Promise<boolean>
    nextPage(): Promise<boolean>
    prevPage: Promise<boolean>
    setMemberState(memberState: Partial<RoomMemberState>);
    setViewMode(viewMode: string)
    setWritable(writable: boolean): Promise<void>
    /** get 系列 API */
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

    zoomChange(scale: number)
    disableCameraTransform(disableCamera: boolean)
    disableDeviceInputs(disable: boolean)
    disableOperations(disableOperations: boolean)
    disableWindowOperation(disable: boolean)

    putScenes(dir: string, scenes: SceneDefinition[], index: number): Promise<SceneState>
    removeScenes(dirOrPath: string)

    /* 移动，重命名当前scene，参考 mv 命令 */
    moveScene(source: string, target: string)

    // /**
    //  * 在指定位置插入文字
    //  * @param x 第一个字的的左侧边中点，世界坐标系中的 x 坐标
    //  * @param y 第一个字的的左侧边中点，世界坐标系中的 y 坐标
    //  * @param textContent 初始化文字的内容
    //  * @param responseCallback 完成回调
    //  * @returns 该文字的标识符
    //  */
    insertText(x: number, y: number, textContent: string): Promise<Boolean>

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

export type RoomState = {
    getRoomState(): Promise<WhiteRoomState>
    getTimeDelay(): Promise<number>
    getPhase(): Promise<RoomPhase>
    isWritable(): Promise<boolean>
    debugInfo(): Promise<object>
}

export interface SDK {
    registerApp(para: AppRegisterParams): Promise<void>
}

export type SDKCallbackHandler = {
    onPostMessage(message: string)
    onThrowError(message: string)
    onLogger(args: any)
    onUrlInterrupter(url: string): string
    onSetupFail(e: Error)
    onPPTMediaPlay(shapeId: string, type: MediaType)
    onPPTMediaPause(shapeId: string, type: MediaType)
}

export type RoomCallbackHandler = {
    onPhaseChanged(phase: RoomPhase)
    onCanUndoStepsUpdate(canUndoSteps: number)
    onCanRedoStepsUpdate (canRedoSteps: number)
    onRoomStateChanged(modifyState: Partial<WhiteRoomState>)
    onDisconnectWithError(error: Error)
    onKickedWithReason(reason: string)
    onAttributesUpdate(attributes: object)
    onCatchErrorWhenAppendFrame(userId: number, error: Error)
    onCatchErrorWhenRender(err: Error)
}