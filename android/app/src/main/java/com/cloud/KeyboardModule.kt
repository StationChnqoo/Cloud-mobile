package com.cloud

import android.app.Activity
import android.content.Context
import android.view.WindowManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class KeyboardModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "KeyboardModule"
    }

    /**
     * 设置软键盘弹出时的窗口调整模式
     * @param mode "adjustResize" | "adjustPan" | "adjustNothing"
     */
    @ReactMethod
    fun setSoftInputMode(mode: String) {
        val activity = currentActivity as? Activity
        activity?.runOnUiThread {
            activity.window?.setSoftInputMode(
                when (mode) {
                    "adjustResize" -> WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE
                    "adjustPan" -> WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN
                    else -> WindowManager.LayoutParams.SOFT_INPUT_ADJUST_NOTHING
                }
            )
        }
    }

    /**
     * 获取当前软键盘模式
     */
    @ReactMethod
    fun getSoftInputMode(promise: com.facebook.react.bridge.Promise) {
        val activity = currentActivity as? Activity
        val mode = activity?.window?.attributes?.softInputMode ?: WindowManager.LayoutParams.SOFT_INPUT_ADJUST_UNSPECIFIED
        val modeName = when (mode) {
            WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE -> "adjustResize"
            WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN -> "adjustPan"
            WindowManager.LayoutParams.SOFT_INPUT_ADJUST_NOTHING -> "adjustNothing"
            else -> "unspecified"
        }
        promise.resolve(modeName)
    }
}
