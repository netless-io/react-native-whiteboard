import React from "react";
import { Button, StyleSheet, View } from "react-native";
import { type RoomPlayer, type SDK, type SDKConfig, type SDKCallbackHandler, WhiteboardReplayView, type ReplayCallbackHandler, PlayerConfig } from "../../../lib/module";
import { appIdentifier, replayUuid, replayToken } from "../roomConst";

let roomPlayer: RoomPlayer | undefined;
let sdk: SDK | undefined;

const sdkParams: SDKConfig = { log: true, userCursor: true, appIdentifier, useMultiViews: true };
const replayrParams: PlayerConfig = {
    room: replayUuid,
    roomToken: replayToken
}

const sdkCallbacks: Partial<SDKCallbackHandler> = {
    onSetupFail: error => console.log('sdk setup fail: ', error)
}

const replayCallbacks: Partial<ReplayCallbackHandler> = {
    onPhaseChanged: e => console.log('player phase: ', e)
}

const MemoWhiteboardReplayView = React.memo(WhiteboardReplayView);

export function WhitePlayer(props: { leaveHandler: () => void }) {

    const replayCallback = React.useCallback((player?: RoomPlayer, sdk?: SDK, error?: Error) => {
        roomPlayer = player;
        player.play();
    }, []);

    return (
        <View>
            <MemoWhiteboardReplayView
                replayConfig={replayrParams}
                sdkConfig={sdkParams}
                style={styles.whiteboard}
                replayRoomCallback={replayCallback}
                replayCallbacks={replayCallbacks}
            />
            <Button title='Leave Player' onPress={async () => {
                try {
                    roomPlayer.stop();
                    setTimeout(() => {
                        props.leaveHandler();
                    }, 0);
                } catch (error) {
                    console.log(error)
                }
            }} />
        </View>)
}

const styles = StyleSheet.create({
    buttonContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    whiteboardContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    whiteboard: {
        aspectRatio: 16.0 / 9.0,
        flexGrow: 1
    },
    panel: {
        position: 'absolute',
        backgroundColor: '#00000000',
        left: 44,
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    }
});

