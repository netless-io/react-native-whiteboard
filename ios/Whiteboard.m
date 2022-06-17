#import "Whiteboard.h"
#import <UIKit/UIKit.h>

@implementation Whiteboard

RCT_EXPORT_MODULE()

// Example method
// See // https://reactnative.dev/docs/native-modules-ios

RCT_REMAP_METHOD(getWhiteboardResourcePath,
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
    resolve(@"Whiteboard.bundle/index.html");
}

@end
