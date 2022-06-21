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

export function combineFuncsFromObjects(objs: object[], obj: object) {
    const imps = objs.map ( obj => {
        return { proto: obj, funcNames:  Object.getOwnPropertyNames(Object.getPrototypeOf(obj))};
    });
    let proto = Object.getPrototypeOf(obj);
    const funcs = Object.getOwnPropertyNames(proto);
    funcs.forEach(f => {
        if (f == 'constructor') { return; }
        imps.forEach(obj => {
            if (obj.funcNames.find(name => name == f)) {
                proto[f] = obj.proto[f];
            }
        })
    })
}