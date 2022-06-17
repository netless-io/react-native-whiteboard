import React from 'react';
import { WebView as RNWebView } from 'react-native-webview';
import { bridge } from '@netless/react-native-bridge';
import { RoomImplement } from './Implements/RoomImplement';
import type { WhiteboardViewProps  } from './Types';
import { SDKImplement } from './Implements/SDKImplement';
import { Platform } from 'react-native';
import type { WhiteRoomState } from '@netless/whiteboard-bridge-types';

export function WhiteboardView(props: WhiteboardViewProps) {
  let source = Platform.OS == 'ios' ? { uri: 'Whiteboard.bundle/index.html' } : {uri: "file:///android_asset/Resource/index.html"}
  return <RNWebView
    source={source}
    originWhitelist={['*']}
    allowFileAccessFromFileURLs={true}
    allowUniversalAccessFromFileURLs={true}
    allowingReadAccessToURL="*"
    onLoadEnd={() => {
      bridge.ready();
    }}
    onMessage={(event) => {
      bridge.recv(event.nativeEvent.data);
    }}
    style={props.style}
    ref={async (webView: RNWebView) => {
      bridge.bind(webView);

      // 注册room handler.
      // 把fire替换成on
      if (props.roomCallbacks) {
        const names = Object.getOwnPropertyNames(props.roomCallbacks);
        names.forEach((name) => {
          let registerName = name;
          if (name.startsWith('on')) {
            registerName = 'fire' + name.slice(2); 
          }
          bridge.register('room.' + registerName, props.roomCallbacks[name]);
        });
      }

      // 注册sdk handler.
      // 除了pptmedia以外，把on抛掉
      if (props.sdkCallbacks) {
        const names = Object.getOwnPropertyNames(props.sdkCallbacks);
        names.forEach((name) => {
          const exceptName = ['onPPTMediaPlay', 'onPPTMediaPause'];
          let registerName = name;

          if (!exceptName.find(item => item == name)) {
            if (name.startsWith('on')) {
              registerName = name.slice(2);
            } 
          }
          bridge.register('sdk.' + registerName, props.roomCallbacks[name]);
        });
      }

      bridge.call('sdk.newWhiteSdk', props.sdkConfig);
      try {
        const rawState = await bridge.callAsync('sdk.joinRoom', props.roomConfig);
        const roomState = (JSON.parse(rawState) as any).state as WhiteRoomState;
        props.joinRoomCallback(new RoomImplement({roomState}), new SDKImplement(), undefined);
      } catch(error) {
        props.joinRoomCallback(undefined, undefined, error);
        return;
      }
    }}
  />
}

export * from './Types';