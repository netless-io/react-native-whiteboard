import { WhiteboardView } from "../../../lib/module";
import React from "react";
import { View, StyleSheet, PixelRatio, Text, Platform, SafeAreaView, Button, Shape, Dimensions } from "react-native";
import type { Room, RoomCallbackHandler, SDK, SDKCallbackHandler, SDKConfig } from "react-native-whiteboard";
import { appIdentifier, uuid, uid, roomToken, userPayload } from "../roomConst";
import { ColorButton, ExecutionButton, StrokeSlider, ImageSelectableButton } from "../Panel";
import { AppliancePair, createWBStore } from "../WBStore";
import { shift, useFloating } from "@floating-ui/react-native";
import { defaultColors, isShape, shapes } from "../WhiteboardConfig";
import { imageSources } from "../Images";
import { colorStringToRgbNums } from "../utility";

let room: Room | undefined;
let sdk: SDK | undefined;
const sdkParams: SDKConfig = { log: true, userCursor: true, appIdentifier, useMultiViews: true };
const roomParams = { uuid, uid, roomToken, userPayload };

const MemoWhiteboardView = React.memo(WhiteboardView);

const roomCallbacks: Partial<RoomCallbackHandler> = {
    onPhaseChanged: e => {
        console.log('room state changed: ', e)
    },
    onRoomStateChanged: e => {
        if (e.pageState) {
            wbStore.getState().setPageState(e.pageState);
        }
    },
    onCanRedoStepsUpdate: e => wbStore.getState().setRedoEnable(e > 0),
    onCanUndoStepsUpdate: e => wbStore.getState().setUndoEnable(e > 0)
}

const sdkCallbacks: Partial<SDKCallbackHandler> = {
    onSetupFail: error => console.log('sdk setup fail: ', error)
}

const wbStore = createWBStore();
export function WhiteRoom(props: { leaveRoomHandler: () => void }) {
    const controlBarFloating = useFloating({
        placement: 'top',
        middleware: [shift()]
    });

    const didInitialize = wbStore(s => s.didInitialize);

    const currentShape = wbStore(s => s.applianceAndShape.shape);
    const currentAppliance = wbStore(s => s.applianceAndShape.appliance);
    const strokeWidth = wbStore(s => s.strokeWidth);
    const currentStrokeColor = wbStore(s => s.strokeColor);
    const currentTextColor = wbStore(s => s.textColor);

    const undoDisable = !wbStore(s => s.undoEnable)
    const redoDisable = !wbStore(s => s.redoEnable)
    const prePageDisable = !wbStore(s => s.prePageEnable);
    const nextPageDisable = !wbStore(s => s.nextPageEnable);

    const showCompactPanel = wbStore(s => s.showCompactPanel);
    const showTextPanel = wbStore(s => s.showTextPanel);
    const showDelete = wbStore(s => s.showDelete);
    const showPencil = wbStore(s => s.showPencilPanel);
    const showShapePanel = wbStore(s => s.showShapePanel);

    const pageState = wbStore(s => s.pageState);
    const pageValue = `${pageState.index + 1} / ${pageState.length}`

    let displayShapeProps: AppliancePair
    let shapeSelected: boolean
    if (isShape(currentAppliance)) {
        displayShapeProps = { appliance: currentAppliance, shape: currentShape }
        shapeSelected = true
    } else {
        displayShapeProps = { appliance: 'rectangle', shape: undefined }
        shapeSelected = currentAppliance == 'rectangle';
    }

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
    const isPad = false//lessOne >= 768;
    // TBD: Compact UI
    const mainBar: AppliancePair[] = [
        { appliance: 'clicker', shape: undefined },
        { appliance: 'selector', shape: undefined },
        { appliance: 'pencil', shape: undefined },
        { appliance: 'text', shape: undefined },
        { appliance: 'eraser', shape: undefined },
        displayShapeProps,
    ];

    const compactAppliance: AppliancePair[] = [
        {appliance: 'clicker', shape: undefined},
        {appliance: 'selector', shape: undefined},
        {appliance: 'pencil', shape: undefined},
        {appliance: 'eraser', shape: undefined},
        {appliance: 'straight', shape: undefined},
        {appliance: 'rectangle', shape: undefined},
        {appliance: 'ellipse', shape: undefined},
    ]

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
                    wbStore.getState().hideAllSubPanel()
                    return true
                }}
            />

            {
                didInitialize && !isPad &&
                <SafeAreaView style={{ 
                    position: 'absolute', 
                    width: '100%', 
                    height: '100%', 
                    flexDirection: 'column',
                    justifyContent: 'center'
                    }} 
                    pointerEvents={'box-none'}
                >
                    {showDelete &&
                        <View style={styles.controlBar}>
                            <ExecutionButton image={imageSources.delete} tintColor={"#ff0000"} onPress={room.delete}/>
                        </View>
                    }
                    {
                        !showDelete && <View style={{width: 44, height: 44}}/>
                    }
                        <View style={{...styles.controlBar, marginTop: 6}} ref={controlBarFloating.reference}>
                            <ImageSelectableButton
                                image={imageSources[currentShape ?? currentAppliance]}
                                selected={true}
                                onPress={() => {
                                    wbStore.getState().setShowCompactPanel(!showCompactPanel);
                                }}
                                width={"100%"}
                            />
                        </View>

                        <View style={{...styles.controlBar, marginTop: 6}}>
                            <ExecutionButton image={imageSources.undo} disabled={undoDisable} onPress={room.undo} />
                            <ExecutionButton image={imageSources.redo} disabled={redoDisable} onPress={room.redo} />
                        </View>

                        {showCompactPanel &&
                            (<View
                                style={{
                                    ...styles.subPanel,
                                    position: 'absolute',
                                    top: safeFloatingValue(Platform.OS == 'ios' ? controlBarFloating.y + 100 : controlBarFloating.y + 188),
                                    left: safeFloatingValue(controlBarFloating.x + 44)
                                }}
                                ref={controlBarFloating.floating}
                            >
                                {compactAppliance.map(value => {
                                    return <ImageSelectableButton
                                        image={imageSources[value.shape ?? value.appliance]}
                                        selected={currentAppliance == value.appliance && currentShape == value.shape}
                                        onPress={() => {
                                            room.setMemberState({ currentApplianceName: value.appliance, shapeType: value.shape });
                                            wbStore.getState().setApplianceAndShape(value)
                                        }}
                                        width={"25%"}
                                        key={value.appliance + (value.shape ?? '')}
                                    />
                                }
                                )}
                                <ExecutionButton image={imageSources.clean} disabled={false} onPress={() => room.cleanScene(true)} width={'25%'} />
                            </View>)
                        }
                </SafeAreaView>
            }

            {didInitialize && isPad &&
                <SafeAreaView style={{ 
                    position: 'absolute', 
                    width: '100%', 
                    height: '100%', 
                    flexDirection: 'row', 
                    alignItems: 'flex-end', 
                    justifyContent: 'center'}} 
                    pointerEvents={'box-none'}
                >
                    <View style={{...styles.controlBar, position: 'absolute', left: 0, alignSelf: 'center'}} ref={controlBarFloating.reference}>
                        {
                            mainBar.map(value => {
                                return <ImageSelectableButton
                                    image={imageSources[value.shape ?? value.appliance]}
                                    selected={isShape(value.appliance) ? shapeSelected : currentAppliance == value.appliance}
                                    onPress={() => {
                                        room.setMemberState({ currentApplianceName: value.appliance, shapeType: value.shape });
                                        wbStore.getState().setApplianceAndShape(value);
                                    }}
                                    width={"100%"}
                                    key={value.appliance + (value.shape ?? '')}
                                />
                            })
                        }
                        <ExecutionButton tintColor={'#5D5D5D'} image={imageSources.clean} onPress={() => room.cleanScene(true)} />
                    </View>

                    <View style={{ ...styles.horizontalControlBar, position: 'absolute', left: 16}}>
                        <ExecutionButton image={imageSources.undo} disabled={undoDisable} onPress={room.undo} />
                        <ExecutionButton image={imageSources.redo} disabled={redoDisable} onPress={room.redo} />
                    </View>

                    <View style={{...styles.horizontalControlBar, position: 'absolute'}}>
                        <ExecutionButton image={imageSources.prev} disabled={prePageDisable} onPress={() => room.prevPage()} />
                        <Text style={{ alignSelf: 'center' }}>{pageValue}</Text>
                        <ExecutionButton image={imageSources.next} disabled={nextPageDisable} onPress={() => room.nextPage()} />
                        <ExecutionButton image={imageSources.whiteboardAdd} onPress={() => room.addPage({}).then(() => room.nextPage())} />
                    </View>

                    <View style={{ position: 'absolute', bottom: -44 }}>
                        <Button title="Leave" onPress={() => room.disconnect().then(props.leaveRoomHandler)} />
                    </View>

                    {showDelete &&
                        <View
                            style={{ ...styles.controlBar, position: 'absolute', left: safeFloatingValue(controlBarFloating.x), top: safeFloatingValue(Platform.OS == 'ios' ? controlBarFloating.y - 6 : controlBarFloating.y - 24) }}
                            ref={controlBarFloating.floating}
                        >
                            <ExecutionButton
                                image={imageSources.delete}
                                tintColor={"#ff0000"}
                                onPress={room.delete}
                            />
                        </View>
                    }

                    {showPencil &&
                        <View style={{ ...styles.subPanel, position: 'absolute', top: safeFloatingValue(controlBarFloating.y + 120), left: safeFloatingValue(controlBarFloating.x + 44) }} ref={controlBarFloating.floating}>
                            <StrokeSlider width={strokeWidth} onSlidingComplete={width => {
                                room.setMemberState({ strokeWidth: width })
                                wbStore.getState().setStrokeWidth(width)
                            }} />
                            {defaultColors.map(c => <ColorButton color={c} key={c.toString()} selected={currentStrokeColor == c} onPress={() => {
                                room.setMemberState({ strokeColor: colorStringToRgbNums(c) })
                                wbStore.getState().setStrokeColor(c)
                            }} />)}
                        </View>
                    }

                    {showShapePanel &&
                        (<View
                            style={{ ...styles.subPanel, position: 'absolute', top: safeFloatingValue(controlBarFloating.y + 240), left: safeFloatingValue(controlBarFloating.x + 44) }}
                            ref={controlBarFloating.floating}
                        >
                            {shapes.map(value => {
                                return <ImageSelectableButton
                                    image={imageSources[value.shape ?? value.appliance]}
                                    selected={currentAppliance == value.appliance && currentShape == value.shape}
                                    onPress={() => {
                                        room.setMemberState({ currentApplianceName: value.appliance, shapeType: value.shape });
                                        wbStore.getState().setApplianceAndShape(value)
                                    }}
                                    width={"25%"}
                                    key={value.appliance + (value.shape ?? '')}
                                />
                            }
                            )}
                            <StrokeSlider width={strokeWidth} onSlidingComplete={width => {
                                room.setMemberState({ strokeWidth: width });
                                wbStore.getState().setStrokeWidth(width);
                            }} />
                            {defaultColors.map(c => <ColorButton color={c} key={c.toString()} selected={currentStrokeColor == c} onPress={() => {
                                room.setMemberState({ strokeColor: colorStringToRgbNums(c) })
                                wbStore.getState().setStrokeColor(c)
                            }} />)}
                        </View>)
                    }

                    {
                        showTextPanel &&
                        (<View
                            style={{ ...styles.subPanel, position: 'absolute', top: safeFloatingValue(controlBarFloating.y + 200), left: safeFloatingValue(controlBarFloating.x + 44) }}
                            ref={controlBarFloating.floating}
                        >
                            {defaultColors.map(c => <ColorButton color={c} key={c.toString()} selected={currentTextColor == c} onPress={() => {
                                room.setMemberState({ textColor: colorStringToRgbNums(c) })
                                wbStore.getState().setTextColor(c)
                            }} />)}
                        </View>
                        )
                    }
                </SafeAreaView>}
        </View>
    );
}

const styles = StyleSheet.create({
    whiteboard: {
        aspectRatio: 1.666666666666666,
        flexGrow: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },
    subPanel: {
        borderWidth: 1 / PixelRatio.get(),
        borderColor: '#ccc',
        borderRadius: 4,
        backgroundColor: '#eee', width: 144,
        padding: 6,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        shadowColor: '#000000',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 4, height: 4 },
        margin: 6
    },
    controlBar: {
        borderWidth: 1 / PixelRatio.get(),
        borderColor: '#cccccc',
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
        width: 44,
        backgroundColor: '#ffffff'
    },
    horizontalControlBar: {
        borderWidth: 1 / PixelRatio.get(),
        borderColor: '#ccc',
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4,
        backgroundColor: 'white',
        flexDirection: 'row'
    }
})

function safeFloatingValue(value?: number): number {
    if (value) {
        return Number.isNaN(value) ? 0 : value;
    }
    return 0;
}