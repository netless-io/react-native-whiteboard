import { AppRegisterParams, sdkNameSpace } from "@netless/whiteboard-bridge-types";
import type { SDK } from "src/Types";
import { assignFuncsFromNameSpace } from "./BridgeGenerator";

export class SDKImplement implements SDK {
    constructor() {
        const promiseList = ['registerApp'];
        assignFuncsFromNameSpace(sdkNameSpace, this, promiseList);
    }

    registerApp(para: AppRegisterParams): Promise<void> {
        throw new Error("Method not implemented.");
    }
}