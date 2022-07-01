import type { Room, SDK } from 'react-native-whiteboard';
import create, { StoreApi, UseBoundStore } from 'zustand';
import { defaultColors, isShape } from './WhiteboardConfig';
import type { Appliance, ApplianceShape } from '@netless/whiteboard-bridge-types';
import { rgbToHex } from './utility';

export type AppliancePair = {appliance: Appliance, shape: ApplianceShape | undefined};

export interface WBStore {
    applianceAndShape: AppliancePair | undefined
    setApplianceAndShape: (value: AppliancePair | undefined) => void
    strokeColor: string
    setStrokeColor: (newColor: string) => void
    textColor: string
    setTextColor: (newColor: string) => void
    strokeWidth: number
    setStrokeWidth: (width: number) => void
    pageState: {index: number, length: number}
    setPageState: (info: {index: number, length: number}) => void
    prePageEnable: boolean
    nextPageEnable: boolean
    undoEnable: boolean
    setUndoEnable: (enable: boolean) => void
    redoEnable: boolean
    setRedoEnable: (enable: boolean) => void

    showCompactPanel: boolean
    setShowCompactPanel: (show: boolean) => void
    showTextPanel: boolean
    showPencilPanel: boolean
    showShapePanel: boolean
    showDelete: boolean
    hideAllSubPanel: () => void

    didInitialize: boolean
    initializeWithRoom:(room: Room) => void
}

export type WBStoreInstance = UseBoundStore<StoreApi<WBStore>>;

export function createWBStore(): UseBoundStore<StoreApi<WBStore>> {
  return create<WBStore>((set, get) => ({
    applianceAndShape: {appliance: undefined, shape: undefined},
    setApplianceAndShape: undefined,
    strokeColor: defaultColors[0],
    setStrokeColor: undefined as any,
    textColor: undefined,
    setTextColor: undefined as any,
    strokeWidth: 0,
    setStrokeWidth: undefined as any,
    pageState: {index: 0, length: 0},
    setPageState: undefined as any,
    prePageEnable: false,
    nextPageEnable: false,
    undoEnable: false,
    setUndoEnable: undefined as any,
    redoEnable: false,
    setRedoEnable: undefined as any,

    showCompactPanel: false,
    setShowCompactPanel: (show: boolean) => set({showCompactPanel: show}),
    showTextPanel: false,
    showPencilPanel: false,
    showShapePanel: false,
    showDelete: false,
    hideAllSubPanel: () => set({showCompactPanel: false, showTextPanel: false, showPencilPanel: false, showShapePanel: false}),

    didInitialize: false,

    initializeWithRoom: (room) => {
      let initShape: ApplianceShape | undefined
      const initAppliance = room.roomState.memberState.currentApplianceName;
      const initStrokeWidth = room.roomState.memberState.strokeWidth;
      if (room.roomState.memberState.currentApplianceName == 'shape') {
        initShape = room.roomState.memberState.shapeType ?? 'triangle';
      } else {
        initShape = undefined
      }

      const initializeStrokeColorNums = room.roomState.memberState.strokeColor;
      const initStrokeColor = initializeStrokeColorNums && rgbToHex(initializeStrokeColorNums[0], initializeStrokeColorNums[1], initializeStrokeColorNums[2])
      const initializeTextColorNums = room.roomState.memberState.textColor;
      const initTextColor = initializeTextColorNums && rgbToHex(initializeTextColorNums[0], initializeTextColorNums[1], initializeTextColorNums[2])

      set({
        didInitialize: true,
        applianceAndShape: {appliance: initAppliance, shape: initShape},
        setApplianceAndShape: (applianceAndShape) => {
          const oldApplianceShape = get().applianceAndShape;
          const isNewApplianceShape = isShape(applianceAndShape.appliance);
          const isOldApplianceShape = isShape(oldApplianceShape.appliance);
          const isSame = applianceAndShape.appliance == oldApplianceShape.appliance && applianceAndShape.shape == oldApplianceShape.shape;
          let shouldShowShapePanel: boolean;
          if (isNewApplianceShape) {
            if (isOldApplianceShape) {
              if (isSame) {
                shouldShowShapePanel = !get().showShapePanel;
              } else {
                shouldShowShapePanel = true;
              }
            } else {
              shouldShowShapePanel = true;
            }
          } else {
            shouldShowShapePanel = false;
          }

          set({
            applianceAndShape,
            showPencilPanel: applianceAndShape.appliance == 'pencil' ? !get().showPencilPanel : false,
            showDelete: applianceAndShape.appliance == 'selector',
            showShapePanel: shouldShowShapePanel,
            showTextPanel: applianceAndShape.appliance == 'text' ? !get().showTextPanel : false
          })
        },
        strokeColor: initStrokeColor ?? defaultColors[0],
        setStrokeColor: (newColor) => set({ strokeColor: newColor }),
        textColor: initTextColor ?? defaultColors[0],
        setTextColor: (newColor) => set({ textColor: newColor }),
        strokeWidth: initStrokeWidth,
        setStrokeWidth: (width) => set({strokeWidth: width}),
        pageState: {index: room.roomState.pageState.index, length: room.roomState.pageState.length},
        setPageState: (info) => set({pageState: info, prePageEnable: info.index > 0, nextPageEnable: info.index < info.length - 1}),
        prePageEnable: room.roomState.pageState.index > 0,
        nextPageEnable: room.roomState.pageState.index < room.roomState.pageState.length - 1,
        setRedoEnable: (enable) => set({redoEnable: enable}),
        setUndoEnable: (enable) => set({undoEnable: enable})
      })
    },
  }));
}