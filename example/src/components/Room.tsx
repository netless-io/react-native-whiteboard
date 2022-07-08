import { WhiteboardView } from "../../../lib/module";
import React from "react";
import { View, Dimensions } from "react-native";
import type { Room, RoomCallbackHandler, SDK, SDKCallbackHandler, SDKConfig } from "react-native-whiteboard";
import { appIdentifier, uuid, uid, roomToken, userPayload } from "../roomConst";
import type { NativeJoinRoomParams } from "@netless/whiteboard-bridge-types";
import { CompactPanel } from "./panel/compactPanel";
import { styles } from "../styles/styles";
import { RegularPanel } from "./panel/regularPanel";
import { createPanelStateStore, EventName } from "../store/panelStateStore";

let room: Room | undefined;
let sdk: SDK | undefined;
const sdkParams: SDKConfig = { log: true, userCursor: true, appIdentifier, useMultiViews: true };
const roomParams: NativeJoinRoomParams = { uuid, uid, roomToken, userPayload, disableNewPencil: false };

const MemoWhiteboardView = React.memo(WhiteboardView);

const roomCallbacks: Partial<RoomCallbackHandler> = {
    onPhaseChanged: e => console.log('room state changed: ', e),
    onRoomStateChanged: e => wbStore.getState().dispatch({ name: EventName.roomStateUpdated, payload: e }),
    onCanRedoStepsUpdate: e => wbStore.getState().dispatch({ name: EventName.redoEnableUpdate, payload: e > 0 }),
    onCanUndoStepsUpdate: e => wbStore.getState().dispatch({ name: EventName.undoEnableUpdate, payload: e > 0 }),
}

const sdkCallbacks: Partial<SDKCallbackHandler> = {
    onSetupFail: error => console.log('sdk setup fail: ', error)
}

const wbStore = createPanelStateStore({ appliance: 'rectangle', shape: undefined });
export function WhiteRoom() {
    const didInitialize = wbStore(s => s.didInitialize);

    const memorizedShapeAppliancePair = wbStore(s => s.memorizedShapeAppliancePair);

    const currentShape = wbStore(s => s.applianceAndShape.shape);
    const currentAppliance = wbStore(s => s.applianceAndShape.appliance);
    const strokeWidth = wbStore(s => s.strokeWidth);
    const currentStrokeColor = wbStore(s => s.strokeColor);
    const currentTextColor = wbStore(s => s.textColor);

    const undoDisable = !wbStore(s => s.undoEnable)
    const redoDisable = !wbStore(s => s.redoEnable)
    const prePageDisable = !wbStore(s => s.prePageEnable);
    const nextPageDisable = !wbStore(s => s.nextPageEnable);

    const showCompactColorSubPanel = wbStore(s => s.showCompactColorSubPanel);
    const showCompactSubToolPanel = wbStore(s => s.showCompactSubToolPanel);
    const showCompactColorButton = wbStore(s => s.showCompactColorButton);

    const showTextAdjustPanel = wbStore(s => s.showTextAdjustPanel);
    const showDelete = wbStore(s => s.showDelete);
    const showPencilAdjustPanel = wbStore(s => s.showPencilAdjustPanel);

    const showShapePanel = wbStore(s => s.showShapePanel);

    const pageState = wbStore(s => s.pageState);
    const pageValue = `${pageState.index + 1} / ${pageState.length}`

    const joinRoomCallback = React.useCallback((aRoom, aSdk, error) => {
        room = aRoom;
        sdk = aSdk;
        if (error) {
            console.log(error);
        } else {
            wbStore.getState().initializeWithRoom(room);
        }
    }, []);

    const lessOne = Dimensions.get('window').width >= Dimensions.get('window').height ? Dimensions.get('window').height : Dimensions.get('window').width
    const isPad = lessOne >= 768;

    return (
        <View>
            <MemoWhiteboardView
                style={styles.whiteboard}
                sdkConfig={sdkParams}
                roomConfig={roomParams}
                roomCallbacks={roomCallbacks}
                sdkCallbacks={sdkCallbacks}
                joinRoomCallback={joinRoomCallback}
                onStartShouldSetResponder={() => {
                    wbStore.getState().dispatch({ name: EventName.whiteboardBeenTouched })
                    return true
                }}
            />

            {
                didInitialize && !isPad &&
                <CompactPanel
                    currentAppliance={currentAppliance}
                    currentShape={currentShape}
                    showCompactColorButton={showCompactColorButton}
                    showCompactColorSubPanel={showCompactColorSubPanel}
                    showCompactSubToolPanel={showCompactSubToolPanel}
                    showDelete={showDelete}
                    undoDisable={undoDisable}
                    redoDisable={redoDisable}
                    currentTextColor={currentTextColor}
                    currentStrokeColor={currentStrokeColor}
                    strokeWidth={strokeWidth}
                    room={room}
                    wbStore={wbStore} />
            }

            {didInitialize && isPad &&
                <RegularPanel
                    currentTextColor={currentTextColor}
                    showShapePanel={showShapePanel}
                    showDelete={showDelete}
                    showPencilAdjustPanel={showPencilAdjustPanel}
                    showTextAdjustPanel={showTextAdjustPanel}
                    undoDisable={undoDisable}
                    redoDisable={redoDisable}
                    prePageDisable={prePageDisable}
                    nextPageDisable={nextPageDisable}
                    pageValue={pageValue}
                    strokeWidth={strokeWidth}
                    currentStrokeColor={currentStrokeColor}
                    currentAppliance={currentAppliance}
                    currentShape={currentShape}
                    memorizedShapeAppliancePair={memorizedShapeAppliancePair}
                    room={room}
                    wbStore={wbStore}
                />
            }
        </View>
    );
}

