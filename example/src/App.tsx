import * as React from 'react';
import {  StyleSheet, View } from 'react-native';
import { Room, WhiteboardView, WhiteboardReplayView, RoomPlayer, SDK, SDKConfig, RoomCallbackHandler, SDKCallbackHandler } from '../../lib/module';
import { Panel } from './Panel';
import { createWBStore } from './WBStore';
import { appIdentifier, replayToken, replayUuid, roomToken, uid, userPayload, uuid } from './roomConst';
import type { ReplayRoomParams } from 'white-web-sdk';
import type { ReplayCallbackHandler } from 'react-native-whiteboard';

let room: Room | undefined;
let sdk: SDK | undefined;

const sdkParams: SDKConfig = {log: true, userCursor: true, __platform: 'rn', appIdentifier, useMultiViews: true};
const roomParams = {uuid, uid, roomToken, userPayload};
const replayrParams: ReplayRoomParams = {
  room: replayUuid,
  roomToken: replayToken
}

const MemoWhiteboardView = React.memo(WhiteboardView);
const MemoWhiteboardReplayView = React.memo(WhiteboardReplayView);

const roomCallbacks: Partial<RoomCallbackHandler> = {
  onPhaseChanged: e=>console.log('state changed: ', e),
}

const sdkCallbacks: Partial<SDKCallbackHandler> = {
  onSetupFail: error=>console.log('setup fail: ', error)
}

const replayCallbacks: Partial<ReplayCallbackHandler> = {
  onPhaseChanged: e=>console.log('player phas: ', e)
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

  const replayCallback = React.useCallback((player?: RoomPlayer, sdk?: SDK, error?: Error) => {
    player.play();
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
        showPanel && <Panel style={styles.panel} store={createWBStore({room, sdk})} />
      }
      {/* <MemoWhiteboardReplayView 
      replayConfig={replayrParams} 
      sdkConfig={sdkParams}
      style={styles.whiteboard}
      replayRoomCallback={replayCallback}
      replayCallbacks={replayCallbacks}
      >
      </MemoWhiteboardReplayView> */}
      
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
    backgroundColor: '#00000000',
    left: 44,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  }
});

