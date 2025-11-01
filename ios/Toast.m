#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(Toast, NSObject)
RCT_EXTERN_METHOD(show:(NSString *)message duration:(nonnull NSNumber *)duration)
@end
