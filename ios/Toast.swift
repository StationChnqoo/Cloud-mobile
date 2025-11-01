import Foundation
import UIKit

@objc(Toast)
class Toast: NSObject {
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc func show(_ message: NSString, duration: NSNumber) {
    DispatchQueue.main.async {
      // ✅ 创建一个单独的 window，确保 Toast 显示在最顶层
      let toastWindow = UIWindow(frame: UIScreen.main.bounds)
      toastWindow.windowLevel = .alert + 1
      toastWindow.backgroundColor = .clear
      
      // 自定义根视图控制器
      let vc = UIViewController()
      toastWindow.rootViewController = vc
      toastWindow.makeKeyAndVisible()
      
      let label = UILabel()
      label.text = message as String
      label.textColor = .white
      label.backgroundColor = UIColor.black.withAlphaComponent(0.75)
      label.textAlignment = .center
      label.font = UIFont.systemFont(ofSize: 14)
      label.numberOfLines = 0
      label.alpha = 0
      label.layer.cornerRadius = 10
      label.layer.masksToBounds = true
      
      let maxSize = CGSize(width: toastWindow.frame.size.width - 80, height: CGFloat.greatestFiniteMagnitude)
      let expectedSize = label.sizeThatFits(maxSize)
      label.frame = CGRect(
        x: (toastWindow.frame.size.width - expectedSize.width - 20) / 2,
        y: toastWindow.frame.size.height - 150,
        width: expectedSize.width + 20,
        height: expectedSize.height + 10
      )
      
      vc.view.addSubview(label)
      
      UIView.animate(withDuration: 0.3, animations: {
        label.alpha = 1.0
      }) { _ in
        UIView.animate(withDuration: 0.3, delay: duration.doubleValue, options: .curveEaseOut, animations: {
          label.alpha = 0.0
        }) { _ in
          // ✅ 动画结束后销毁 window
          toastWindow.isHidden = true
        }
      }
    }
  }
}
