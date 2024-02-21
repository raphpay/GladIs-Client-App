//
//  PDFViewerManager.m
//  GladIs-macOS
//
//  Created by Raphaël Payet on 21/02/2024.
//

#import <Foundation/Foundation.h>
#import "React/RCTViewManager.h"

@interface RCT_EXTERN_MODULE(PDFViewerManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(url, NSString)

@end
