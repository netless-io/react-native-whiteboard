import React from 'react';
import { WebView as RNWebView, WebViewProps } from 'react-native-webview';
import { Bridge } from '@netless/react-native-bridge';
import { RoomImplement } from './Implements/RoomImplement';
import type { SDKCallbackHandler, WhiteboardReplayViewProps, WhiteboardViewProps } from './Types';
import type {  NativeSDKConfig, WhiteRoomState } from '@netless/whiteboard-bridge-types';
import { SDKImplement } from './Implements/SDKImplement';
import { Platform } from 'react-native';
import { RoomPlayerImp } from './Implements/PlayerImplements';

const source = Platform.OS == 'ios' ? { uri: 'Whiteboard.bundle/index.html' } : { uri: "file:///android_asset/Resource/index.html" }
function defaultProps(bridge: Bridge): WebViewProps {
  return {
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
}

function registerSDKCallbacks(bridge: Bridge, sdkCallbacks?: Partial<SDKCallbackHandler>) {
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

/**
 * Create a whiteboard view, it join room immediately
 * @param props
 * @returns a view contains a whiteboard
 */
export function WhiteboardView(props: WhiteboardViewProps) {
  const bridge = new Bridge();
  return <RNWebView
    {...defaultProps(bridge)}
    style={props.style}
    ref={async (webView: RNWebView) => {
      if (webView == undefined) { return }
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

      registerSDKCallbacks(bridge, props.sdkCallbacks);

      const sdkConfig: NativeSDKConfig = {...props.sdkConfig, __platform: 'rn'};
      bridge.call('sdk.newWhiteSdk', sdkConfig);
      try {
        const rawState = await bridge.callAsync('sdk.joinRoom', props.roomConfig);
        const roomState = (JSON.parse(rawState) as any).state as WhiteRoomState;
        props.joinRoomCallback(new RoomImplement({ roomState, bridge }), new SDKImplement(bridge), undefined);
      } catch (error) {
        props.joinRoomCallback(undefined, undefined, error);
        return;
      }
    }
    }
  />
}

/**
 * Create a whiteboard replay view
 * @param props
 * @returns a view contains a whiteboard replayer
 */
export function WhiteboardReplayView(props: WhiteboardReplayViewProps ) {
  const bridge = new Bridge();

  return <RNWebView
    {...defaultProps(bridge)}
    style={props.style}
    ref={async (webView: RNWebView) => {
      if (webView == undefined) { return }
      bridge.bind(webView);

      if (props.replayCallbacks) {
        const names = Object.getOwnPropertyNames(props.replayCallbacks);
        names.forEach((name) => {
          bridge.register('player.' + name, props.replayCallbacks[name]);
        });
      }
      registerSDKCallbacks(bridge, props.sdkCallbacks);

      const sdkConfig: NativeSDKConfig = {...props.sdkConfig, __platform: 'rn'};
      bridge.call('sdk.newWhiteSdk', sdkConfig);
      try {
        await bridge.callAsync('sdk.replayRoom', props.replayConfig);
        props.replayRoomCallback(new RoomPlayerImp(bridge), new SDKImplement(bridge), undefined);
      } catch (error) {
        props.replayRoomCallback(undefined, undefined, error);
        return;
      }
    }}
    />
}

export * from './Types';