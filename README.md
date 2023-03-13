# @netless/react-native-whiteboard

interactive whiteboard for react-native

[![TSC](https://github.com/netless-io/react-native-whiteboard/actions/workflows/tsc.yml/badge.svg)](https://github.com/netless-io/react-native-whiteboard/actions/workflows/tsc.yml)
[![pages-build-deployment](https://github.com/netless-io/react-native-whiteboard/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/netless-io/react-native-whiteboard/actions/workflows/pages/pages-build-deployment)

## Installation

### 1. Add dependencies

```sh
$ npm install --save react-native-webview
$ npm install --save @netless/react-native-whiteboard
```

### 2. Link native dependencies

From react-native 0.60 autolinking will take care of the link step but don't forget to run pod install

## Usage

```ts
import { WhiteboardView } from '@netless/react-native-whiteboard';

<WhiteboardView 
    sdkConfig={{
        appIdentifier: 'some-appIdentifier'
    }}
    roomConfig={{
        uid: 'some-uid', 
        uuid: 'some-uuid', 
        roomToken: 'some-token'
    }}
    joinRoomCallback={joinRoomCallback}
    roomCallbacks={roomCallbacks}
    sdkCallbacks={sdkCallbacks}
/>
```

For more api details, can see typedoc [here](https://netless-io.github.io/react-native-whiteboard/)

## Contributing

Suggest to submit pr or issue.

## License

MIT
