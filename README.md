# @netless/react-native-whiteboard

interactive whiteboard for react-native

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
/>
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
