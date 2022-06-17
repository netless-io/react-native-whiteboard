# @netless/react-native-whiteboard

interactive whiteboard for react-native

## Installation

```sh
npm install @netless/react-native-whiteboard
```

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
