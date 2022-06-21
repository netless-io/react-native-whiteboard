import React from 'react';
import { WebView as RNWebView, WebViewProps } from 'react-native-webview';
import { bridge } from '@netless/react-native-bridge';
import { RoomImplement } from './Implements/RoomImplement';
import type { SDKCallbackHandler, WhiteboardReplayViewProps, WhiteboardViewProps } from './Types';
import type {  WhiteRoomState } from '@netless/whiteboard-bridge-types';
import { SDKImplement } from './Implements/SDKImplement';
import { Platform } from 'react-native';
import { RoomPlayerImp } from './Implements/PlayerImplements';

const source = Platform.OS == 'ios' ? { uri: 'Whiteboard.bundle/index.html' } : { uri: "file:///android_asset/Resource/index.html" }
const defaultProps: WebViewProps = {
  source: source,
  originWhitelist: ['*'],
  allowFileAccessFromFileURLs: true,
  allowUniversalAccessFromFileURLs: true,
  allowingReadAccessToURL: "*",
  onLoadEnd: () => {
    bridge.ready();
  },
  onMessage: (event) => {
    bridge.recv(event.nativeEvent.data);
  }
}

function registerSDKCallbacks(sdkCallbacks?: Partial<SDKCallbackHandler>) {
      // 注册sdk handler.
      // 除了pptmedia以外，把on抛掉
      if (sdkCallbacks) {
        const names = Object.getOwnPropertyNames(sdkCallbacks);
        names.forEach((name) => {
          const exceptName = ['onPPTMediaPlay', 'onPPTMediaPause'];
          let registerName = name;

          if (!exceptName.find(item => item == name)) {
            if (name.startsWith('on')) {
              registerName = name.slice(2);
            }
          }
          bridge.register('sdk.' + registerName, sdkCallbacks[name]);
        });
      }
}

export function WhiteboardView(props: WhiteboardViewProps) {
  return <RNWebView
    {...defaultProps}
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

      registerSDKCallbacks(props.sdkCallbacks);

      bridge.call('sdk.newWhiteSdk', props.sdkConfig);
      try {
        const rawState = await bridge.callAsync('sdk.joinRoom', props.roomConfig);
        const roomState = (JSON.parse(rawState) as any).state as WhiteRoomState;
        props.joinRoomCallback(new RoomImplement({ roomState }), new SDKImplement(), undefined);
      } catch (error) {
        props.joinRoomCallback(undefined, undefined, error);
        return;
      }
    }
    }
  />
}

export function WhiteboardReplayView(props: WhiteboardReplayViewProps ) {
  return <RNWebView
    {...defaultProps}
    style={props.style}
    ref={async (webView: RNWebView) => {
      bridge.bind(webView);

      if (props.replayCallbacks) {
        const names = Object.getOwnPropertyNames(props.replayCallbacks);
        names.forEach((name) => {
          bridge.register('player.' + name, props.replayCallbacks[name]);
        });
      }
      registerSDKCallbacks(props.sdkCallbacks);

      bridge.call('sdk.newWhiteSdk', props.sdkConfig);
      try {
        await bridge.callAsync('sdk.replayRoom', props.replayConfig);
        props.replayRoomCallback(new RoomPlayerImp(), new SDKImplement(), undefined);
      } catch (error) {
        props.replayRoomCallback(undefined, undefined, error);
        return;
      }
    }}
    />
}

export * from './Types';