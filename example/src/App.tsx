import * as React from 'react';
import {  Button, StyleSheet, View } from 'react-native';
import { WhiteboardView, WhiteboardReplayView } from '../../lib/module';
import type { Room, RoomPlayer, SDK, SDKConfig, RoomCallbackHandler, SDKCallbackHandler } from '../../lib/typescript/index';
import { Panel } from './Panel';
import { createWBStore } from './WBStore';
import { appIdentifier, replayToken, replayUuid, roomToken, uid, userPayload, uuid } from './roomConst';
import type { ReplayRoomParams } from 'white-web-sdk';
import type { ReplayCallbackHandler } from 'react-native-whiteboard';

let room: Room | undefined;
let roomPlayer: RoomPlayer | undefined;
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
  onPhaseChanged: e=>console.log('room state changed: ', e),
}

const sdkCallbacks: Partial<SDKCallbackHandler> = {
  onSetupFail: error=>console.log('sdk setup fail: ', error)
}

const replayCallbacks: Partial<ReplayCallbackHandler> = {
  onPhaseChanged: e=>console.log('player phase: ', e)
}

export default function App() {
  const [showRoom, setShowRoom] = React.useState<Boolean>(false);
  const [showPlayer, setShowPlayer] = React.useState<Boolean>(false);
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
    roomPlayer = player;
    player.play();
  }, []);

  return (
    <View style={styles.whiteboardContainer}>
      {(!showRoom && !showPlayer) &&
        <View style={styles.buttonContainer}>
          <Button title='Live Room' onPress={() => setShowRoom(!showRoom)}></Button>
          <Button title='Player' onPress={() => setShowPlayer(!showPlayer)}></Button>
        </View>
      }
            
      { showRoom && <MemoWhiteboardView
            style={styles.whiteboard}
            sdkConfig={sdkParams}
            roomConfig={roomParams}
            joinRoomCallback={joinRoomCallback}
            roomCallbacks={roomCallbacks}
            sdkCallbacks={sdkCallbacks}
          />
      }
      { showPanel && <Panel style={styles.panel} store={createWBStore({ room, sdk })} /> }
      { showPanel && <Button title='Leave Room' onPress={async ()=> {
        try {
          await room.disconnect();
          setShowPanel(false);
          setShowRoom(false);
        } catch(error) {
          console.log(error)
        }
      }}/>}

      {showPlayer && <MemoWhiteboardReplayView
        replayConfig={replayrParams}
        sdkConfig={sdkParams}
        style={styles.whiteboard}
        replayRoomCallback={replayCallback}
        replayCallbacks={replayCallbacks}
      />
      }
      { showPlayer && <Button title='Leave Player' onPress={async ()=> {
        try {
          roomPlayer.stop();
          setTimeout(() => {
            setShowPlayer(false);
          }, 0);
        } catch(error) {
          console.log(error)
        }
      }}/>}
      
    </View>
  );
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

