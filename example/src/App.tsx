import * as React from 'react';
import {  StyleSheet, View } from 'react-native';
import { Room, WhiteboardView, SDK, SDKConfig, RoomCallbackHandler, SDKCallbackHandler } from '@netless/react-native-whiteboard';
import { Panel } from './Panel';
import { createWBStore } from './WBStore';

const appIdentifier = ''
const uuid = ''
const roomToken = ''
const uid = '0'
const userPayload = { avatar: "" }

let room: Room | undefined;
let sdk: SDK | undefined;

const sdkParams: SDKConfig = {log: true, userCursor: true, __platform: 'rn', appIdentifier, useMultiViews: true};
const roomParams = {uuid, uid, roomToken, userPayload};

const MemoWhiteboardView = React.memo(WhiteboardView);

const roomCallbacks: Partial<RoomCallbackHandler> = {
  onPhaseChanged: e=>console.log('state changed: ', e),
}

const sdkCallbacks: Partial<SDKCallbackHandler> = {
  onSetupFail: error=>console.log('setup fail: ', error)
}

export default function App() {
  const [showPanel, setShowPanel] = React.useState<Boolean>(false);

  const joinRoomCallback = React.useCallback((aRoom, aSdk, error) => {
    room = aRoom;
    sdk = aSdk;
    if (error) {
      console.log(error);
    } else {
      setShowPanel(true);
    }
  }, []);

  return (
    <View style={styles.whiteboardContainer}>
      <MemoWhiteboardView
        style={styles.whiteboard}
        sdkConfig={sdkParams}
        roomConfig={roomParams}
        joinRoomCallback={joinRoomCallback}
        roomCallbacks={roomCallbacks}
        sdkCallbacks={sdkCallbacks}
      />
      {
        showPanel && <Panel style={{...styles.panel}} store={createWBStore({room, sdk})} />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  whiteboardContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'yellow',
  },
  whiteboard: {
    aspectRatio: 16.0/9.0,
    flexGrow: 1
  },
  panel: {
    position: 'absolute',
    backgroundColor: '#ff000000',
    left: 44,
    width: 40,
    height: '100%',
    justifyContent: 'center',
  }
});

