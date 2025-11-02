import Foundation
import UIKit

// MARK: - 内边距 Label
class PaddingLabel: UILabel {
    var inset = UIEdgeInsets(top: 8, left: 12, bottom: 8, right: 12)

    override func drawText(in rect: CGRect) {
        super.drawText(in: rect.inset(by: inset))
    }

    override var intrinsicContentSize: CGSize {
        let size = super.intrinsicContentSize
        return CGSize(
            width: size.width + inset.left + inset.right,
            height: size.height + inset.top + inset.bottom
        )
    }

    override func sizeThatFits(_ size: CGSize) -> CGSize {
        let adjusted = super.sizeThatFits(size)
        return CGSize(
            width: adjusted.width + inset.left + inset.right,
            height: adjusted.height + inset.top + inset.bottom
        )
    }
}

// MARK: - Toast 模块
@objc(Toast)
class Toast: NSObject {
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  /// 显示 Toast
  /// - Parameters:
  ///   - message: 文本内容
  ///   - duration: 显示时长（秒）
  @objc func show(_ message: NSString, duration: NSNumber) {
    DispatchQueue.main.async {
      // ✅ 独立窗口，显示在最上层（覆盖 Modal）
      let toastWindow = UIWindow(frame: UIScreen.main.bounds)
      toastWindow.windowLevel = .alert + 1
      toastWindow.backgroundColor = .clear
      toastWindow.isUserInteractionEnabled = false
      
      let vc = UIViewController()
      vc.view.backgroundColor = .clear
      toastWindow.rootViewController = vc
      toastWindow.isHidden = false
      
      // ✅ 使用带 padding 的 Label
      let label = PaddingLabel()
      label.inset = UIEdgeInsets(top: 8, left: 12, bottom: 8, right: 12)
      label.text = message as String
      label.textColor = .white
      label.backgroundColor = UIColor.black.withAlphaComponent(0.75)
      label.textAlignment = .center
      label.font = UIFont.systemFont(ofSize: 16)
      label.numberOfLines = 0
      label.alpha = 0
      label.layer.cornerRadius = 5
      label.layer.masksToBounds = true
      
      // ✅ 自动计算大小并垂直居中显示
      let maxSize = CGSize(width: toastWindow.frame.size.width - 80, height: CGFloat.greatestFiniteMagnitude)
      let expectedSize = label.sizeThatFits(maxSize)

      let verticalOffset: CGFloat = 80 // 让 Toast 看起来在中间偏下
      label.frame = CGRect(
        x: (toastWindow.frame.size.width - expectedSize.width) / 2,
        y: (toastWindow.frame.size.height - expectedSize.height) / 2 + verticalOffset,
        width: expectedSize.width,
        height: expectedSize.height
      )
      vc.view.addSubview(label)
      
      // ✅ 淡入淡出动画
      UIView.animate(withDuration: 0.3, animations: {
        label.alpha = 1.0
      }) { _ in
        UIView.animate(withDuration: 0.3, delay: duration.doubleValue, options: .curveEaseOut, animations: {
          label.alpha = 0.0
        }) { _ in
          toastWindow.isHidden = true
        }
      }
    }
  }
}
