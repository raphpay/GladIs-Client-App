#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (void)applicationDidFinishLaunching:(NSNotification *)notification
{
    self.moduleName = @"GladIs";
    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = @{};
    
    // Call super to ensure that the rest of the setup is performed
    [super applicationDidFinishLaunching:notification];
    
    // Set minimum size for the main window
    NSWindow *mainWindow = [[[NSApplication sharedApplication] windows] firstObject];
    [mainWindow setMinSize:NSMakeSize(850, 850)]; // Set minimum size to 850x850
    
    // You can also set other window properties here if needed
    
    // Return from the method
    return;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
    return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
#ifdef RN_FABRIC_ENABLED
    return true;
#else
    return false;
#endif
}

@end
