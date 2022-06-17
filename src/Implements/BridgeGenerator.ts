import { bridge } from "@netless/react-native-bridge";

export function assignFuncsFromNameSpace(s: string, obj: any, promiseList: string[]) {
    let proto = Object.getPrototypeOf(obj);
    const funcs = Object.getOwnPropertyNames(proto);

    funcs.forEach(f => {
        if (f == 'constructor') { return; }
        Object.getPrototypeOf(obj)[f] = (...args) => {
            const method = s + '.' + f;
            if (promiseList.find(item => item == f)) {
                return bridge.callAsync(method);
            } else {
                return bridge.call(method, ...args);
            }
        }
    })
}