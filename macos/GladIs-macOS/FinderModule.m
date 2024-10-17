//
//  FinderModule.m
//  GladIs-macOS
//
//  Created by Raphaël Payet on 21/02/2024.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(FinderModule, NSObject)

RCT_EXTERN_METHOD(pickPDFFile: (RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(pickImage: (RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(pickCSVFile: (RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(pickPDFFilePath: (RCTResponseSenderBlock)callback)

@end
