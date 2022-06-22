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
    AddPageParams,
    PlayerPhase,
    PlayerState,
    PlayerTimeInfo,
    ObserverMode,
    PlayerSeekingResult,
    NativeReplayParams,
    NativePlayerState,
    ViewMode
} from '@netless/whiteboard-bridge-types';

/**
 * See SDKConfig in source code
 */
export type SDKConfig = NativeSDKConfig;

/**
 * See RoomConfig in source code
 */
export type RoomConfig = Omit<NativeJoinRoomParams, 'nativeWebSocket'>;

/**
 * Create whiteboardView props
 */
export type WhiteboardViewProps = {
    /**
     * View style
     */
    style: StyleProp<ViewStyle>
    /**
     * Room config
     */
    roomConfig: RoomConfig
    /**
     * SDK Config
     */
    sdkConfig: SDKConfig
    /**
     * Called at the end of joining the room, regardless of success or failure
     */
    joinRoomCallback: ((room?: Room, sdk?: SDK, error?: Error)=>void)
    /**
     * Room state change callbacks
     */
    roomCallbacks?: Partial<RoomCallbackHandler>
    /**
     * SDK state change callbacks
     */
    sdkCallbacks?: Partial<SDKCallbackHandler>
}

/**
 * Create whiteboardReplayView props
 */
export type WhiteboardReplayViewProps = {
    /**
     * Replay config, see `NativeReplayParams`
     */
    replayConfig: NativeReplayParams
    /**
     * SDK Config
     */
    sdkConfig: SDKConfig
    /**
     * View style
     */
    style: StyleProp<ViewStyle>
    /**
     * Called at the end of joining the replay room, regardless of success or failure
     */
    replayRoomCallback: ((player?: RoomPlayer, sdk?: SDK, error?: Error)=>void)
    /**
     * Replay room state change callbacks
     */
    replayCallbacks?: Partial<ReplayCallbackHandler>
    /**
     * SDK state change callbacks
     */
    sdkCallbacks?: Partial<SDKCallbackHandler>
}

/**
 * This object can be used to control the room and perform operations on the room
 */
export interface Room {
    /**
     * Return the room states.
     * Include pages, boxState, memberState, and so on
     */
    roomState: WhiteRoomState;

    setWindowManagerAttributes(attributes: any)
    /**
     * Set the display ratio of the container
     */
    setContainerSizeRatio(ratio: number)
    /**
     * Set the color configuration of the child window
     */
    setPrefersColorScheme(scheme: TeleBoxColorScheme)

    /**
     * Let the ppt go to the next step
     * The ppt in the subwindow will not take effect
     */
    nextStep()

    /**
     * Let the ppt go to the previous step
     * The ppt in the subwindow will not take effect
     */
    previousStep()

    syncBlockTimestamp(timeStamp)

    /**
     * Whether or not to disable serialization and use undo and redo locally only after disabling it. 
     * The default is true
     */
    disableSerialization(disable: boolean)

    /**
     * Copy the current selection, only valid when there is a selection
     */
    copy()

    /**
     * Paste the copied content
     */
    paste()

    /**
     * Copy and paste the selected content, only valid when there is a selection
     */
    duplicate()

    /**
     * Delete the selected content
     */
    delete();

    /**
     * Disable image erasing. The default is false
     */
    disableEraseImage(disable: boolean)

    redo(): Promise<number>
    undo(): Promise<number>
    canRedoSteps(): Promise<number>
    canUndoSteps(): Promise<number>

    setGlobalState(modifyState: Partial<GlobalState>)

    /**
     * Switches to the specified scene. 
     * After a successful method call, all users in the room see the whiteboard switch to the specified scene. 
     * @param scenePath The scenePath after switching
     */
    setScenePath(scenePath: string): Promise<string>

    /**
     * Insert a new page
     */
    addPage(params: AddPageParams): Promise<void>

    /**
     * Delete the specified page
     */
    removePage(params: RemovePageParams): Promise<boolean>

    /**
     * Turn to next page
     */
    nextPage(): Promise<boolean>

    /**
     * Turn to previous page
     */
    prevPage: Promise<boolean>

    /**
     * Currently mainly used to update appliance
     */
    setMemberState(memberState: Partial<RoomMemberState>);

    /**
     * Switching user view mode
     * @param viewMode 
     * "freedom"     : This mode allows the user to actively adjust the viewpoint, and is not affected by other users' viewpoint mode settings, nor does it affect other users' viewpoint mode settings.
     * "follower"    : The user's view in this mode will follow the view of the anchor.
     * "broadcaster" : This mode allows users to actively adjust their view and sync their view to all other users in the room.
     */
    setViewMode(viewMode: ViewMode)

    /**
     * Set whether the user is in interactive mode in the room.
     */
    setWritable(writable: boolean): Promise<void>

    getMemberState(): Promise<RoomMemberState>
    getGlobalState(): Promise<GlobalState>
    getSceneState(): Promise<SceneState>
    getRoomMembers(): Promise<RoomMemberState>

    /**
     * Switches to the specified scene under the current scene group.
     */
    setSceneIndex(index: number): Promise<void>
    getScenes(): Promise<WhiteScene[]>
    getZoomScale(): Promise<number>
    getBroadcastState(): Promise<BroadcastState>
    getRoomPhase(): Promise<RoomPhase>

    /**
     * Disconnect from the whiteboard room. 
     */
    disconnect(): Promise<void>

    /**
     * Disable/allow the user to adjust (move or zoom) the view.
     */
    disableCameraTransform(disableCamera: boolean)

    /**
     * Disable/allow users to operate the tool.
     */
    disableDeviceInputs(disable: boolean)

    /**
     * Set readonly mode for all apps.
     */
    disableWindowOperation(disable: boolean)

    /**
     * Insert multiple scenes under the specified scene group. 
     * @param dir The name of the scene group, which must start with `/`. It cannot be a scene path.
     * @param scenes An array consisting of multiple scenes. 
     * @param index The index number of the first scene in the scene group of the multiple scenes to be inserted. If the index number passed is greater than the total number of existing scenes in the scene group, the newly inserted scene will be at the end of the existing scenes. The index number of the scene starts from 0.
     */
    putScenes(dir: string, scenes: SceneDefinition[], index: number): Promise<SceneState>

    /**
     * Deletes a scene or group of scenes. 
     * @param dirOrPath The scene group path or scene path. If a scene group is passed in, all scenes under that scene group will be deleted.
     */
    removeScenes(dirOrPath: string)

    /**
     * Move the special scene to a path
     * @param source The original path of the scene that needs to be moved. Must be a scene path, not a scene group path.
     * @param target Target Scene Group Path or Target Scene Path:
     *   - When `target` is set to target scene group, it means move the specified scene to other scene group, the scene path will be changed, but the scene name will be unchanged.
     *   - When `target` is set to target scene path, it means change the position of the specified scene in the current scene group, and both scene path and scene name will be changed.
     */
    moveScene(source: string, target: string)

    /**
     * Insert text in the specified location
     * @param x The midpoint of the left-hand side of the first character, the x-coordinate in the world coordinate system
     * @param y The midpoint of the left-hand side of the first character, the y-coordinate in the world coordinate system
     * @param textContent 
     * @returns The text id
     */
    insertText(x: number, y: number, textContent: string): Promise<string>

    /**
     * Clear all contents of the current scene. 
     * @param retainPpt whether to retain the ppt content
     */
    cleanScene(retainPpt: boolean);

    /**
     * Insert a image
     */
    insertImage(imageInfo: ImageInformation)

    /**
     * Show image
     * 
     * Before calling this method, make sure you have called the `insertImage` method to insert a display area for the image on the whiteboard.
     * 
     * @param uuid The UUID of the image display area, i.e. the image UUID passed in the `imageInfo` of the `insertImage` method
     * @param url The URL address of the image. You must ensure that the app client can access the URL, otherwise the image will not be displayed properly.
     */
    completeImageUpload(uuid: string, url: string)

    /**
     * Send custom events.
     */
    dispatchMagixEvent(event: EventEntry)

    /**
     * Set the synchronization delay of the remote whiteboard screen.
     * 
     * When this method is called, the SDK will delay the synchronization of the remote whiteboard screen.
     * 
     * In the CDN live broadcast scenario, setting the synchronization delay of the remote whiteboard screen can prevent users from perceiving the misalignment.  
     * 
     * **Note:** This method does not affect the display of the local whiteboard screen, i.e., the user's operation on the local whiteboard will be displayed on the local whiteboard immediately.  
     */
    setTimeDelay(delay: number)

    /**
     * Add Window
     * @param kind Window type
     * @param options Window Configuration
     * @param attributes Some additional optional properties required by the window
     */
    addApp(kind: string, options: any, attributes: any): Promise<string>

    /**
     * Close the specified window
     */
    closeApp(appId: string): Promise<void>

    /**
     * Get syncState values
     */
    getSyncedState(): Promise<object>

    /**
     * Set the value in syncedState.
     * 
     * It takes effect when writable is true
     */
    safeSetAttributes(attributes: any)

    /**
     * Update the value in syncedState.
     * 
     * It takes effect when writable is true
     */
    safeUpdateAttributes(keys: string[], attributes: any)

    getRoomState(): Promise<WhiteRoomState>
    getTimeDelay(): Promise<number>
    getPhase(): Promise<RoomPhase>
    isWritable(): Promise<boolean>
    debugInfo(): Promise<object>
}

export interface RoomPlayer {
    roomUUID(): Promise<string>
    phase(): Promise<PlayerPhase>
    playerState(): Promise<PlayerState>

    /**
     * Whether the current can play immediately (may buffer)
     */
    isPlayable(): Promise<boolean>
    playbackSpeed(): Promise<number>

    /**
     * Get the time information of the whiteboard playback.
     *
     */
    timeInfo(): Promise<PlayerTimeInfo>

    play()
    pause()
    stop()
    seekToScheduleTime(beginTime: number): Promise<PlayerSeekingResult>

    /**
     * Set the viewing mode of the whiteboard playback.
     * @param observerMode :
     * 'directory'
     * In directory mode, the viewfollowing rules when users watch the whiteboard playback are as follows.
     *   - If there is a host in the recorded live room, the host's view is followed.
     *   - If there is no host in the recorded live room, the view of the user with the smallest user ID with read/write access (i.e., the first user in the room in interactive mode) is followed.
     *   - If there is neither a host nor a user with read/write access in the recorded live room, the playback is viewed from the viewpoint of the initialized whiteboard (center point at the origin of the world coordinate system, scaled to 1.0).
     *
     *   **Note:**
     *   In directory mode, if the user has adjusted the viewpoint by touchscreen gestures, it will automatically switch to freedom mode.
     * 
     *  'freedom'
     *   In free mode, users can freely adjust the viewing angle when watching the playback.
     */
    setObserverMode(observerMode: ObserverMode)

    /**
     * Set the multiplier speed for whiteboard playback.
     */
    setPlaybackSpeed(rate: number)
}

export interface SDK {
    /**
     * Register a custom app
     */
    registerApp(para: AppRegisterParams): Promise<void>
}

export type SDKCallbackHandler = {
    /**
     * Receives the message callbacks sent by the web page.
 
     * Message callbacks include

     *   - iframe data in dictionary format
     *   - image load failure messages
     *   - ppt play/pause callback messages

     *  This callback is triggered when the local user receives a message from a web page (e.g. iframe plug-in, dynamic PPT).
     * 
     */
    onPostMessage(message: string)

    /**
     * SDK appears with an uncaught global error callback.
     */
    onThrowError(message: string)

    onLogger(args: any)

    /**
     * Image interception callback.
     * 
     * *Note:** 
 
     *   - To trigger this callback, you must set `enableInterrupterAPI(YES)` to enable image interception replacement when initializing the Whiteboard SDK. See WhiteSdkConfiguration for details.
     *   - When image intercept replacement is enabled, this callback will be triggered when inserting an image or scene in the whiteboard.
     * @param url The original address of the image.
     * @return The address of the replaced image.
     */
    onUrlInterrupter(url: string): string

    /**
     * SDK initialization failure callback.
     *
     * If the SDK initialization fails, the call to join a live room or playback room will remain unresponsive and the SDK will need to be reinitialized.
      
     * SDK initialization failures can be caused by the following.
      
     *   - A network anomaly during the initialization of the SDK, resulting in a failure to obtain configuration information.
     *   - An illegal App Identifier was passed in.
    
     * @param e error message.
     */
    onSetupFail(e: Error)

    /**
     * Playback of audio and video callbacks in dynamic PPT
     */
    onPPTMediaPlay(shapeId: string, type: MediaType)

    /**
     * Pause playback of audio and video callbacks in dynamic PPTs.
     */
    onPPTMediaPause(shapeId: string, type: MediaType)
}

export type RoomCallbackHandler = {
    /**
     * Callback for room connection status change.
     */
    onPhaseChanged(phase: RoomPhase)

    /**
     * The number of undoable change callbacks.
     */
    onCanUndoStepsUpdate(canUndoSteps: number)

    /**
     * The number of redoable change callbacks.
     */
    onCanRedoStepsUpdate (canRedoSteps: number)

    /**
     * Callback for room state change.
     */
    onRoomStateChanged(modifyState: Partial<WhiteRoomState>)

    /**
     * Callback for broken connection between Whiteboard SDK and Whiteboard server.
     * @param error error info for dicconnect.
     */
    onDisconnectWithError(error: Error)

    /**
     * The user is moved out of the room by the server callback.
     */
    onKickedWithReason(reason: string)

    /**
     * SyncedStoreState updated, state is the entire content of SyncedState
     */
    onAttributesUpdate(attributes: object)

    /**
     * Synchronized user behavior error callback.
     *
     * **Note:** This callback is usually ignored, and you can decide for yourself whether to listen to it or not depending on the business situation.
     */
    onCatchErrorWhenAppendFrame(userId: number, error: Error)
}

export type ReplayCallbackHandler = {
    /**
     * Callback for player phase change.
     */
    onPhaseChanged(phase: PlayerPhase)

    /**
     * Callback for player load the first frame.
     */
    onLoadFirstFrame()

    /**
     * Callback for room change in state, will only contain the properties that actually changed.
     */
    onPlayerStateChanged(modifyState: Partial<NativePlayerState>)

    /**
     * Callbacks where an error causes playback to pause.
     */
    onStoppedWithError(err: Error)

    /**
     * Callbcak when `player.progressTime` has changed. 
     */
    onProgressTimeChanged(scheduleTime: number)

    /**
     * Callback for error on rendering.
     */
    onCatchErrorWhenRender(err: Error)
}