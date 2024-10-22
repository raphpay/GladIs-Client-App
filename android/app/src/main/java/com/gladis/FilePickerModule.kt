package com.gladis

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.provider.OpenableColumns
import com.facebook.react.bridge.*
import com.facebook.react.bridge.Promise

class FilePickerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), ActivityEventListener {
    private var pickerPromise: Promise? = null
    private val PICK_FILE = 1

    init {
        reactContext.addActivityEventListener(this)
    }

    override fun getName(): String {
        return "FilePickerModule"
    }

    @ReactMethod
    fun pickSingleFile(types: ReadableArray, promise: Promise) {
        val activity = currentActivity

        if (activity == null) {
            promise.reject("NO_ACTIVITY", "Activity doesn't exist")
            return
        }

        pickerPromise = promise

        try {
            // Create an Intent to open the file picker with multiple MIME types
            val intent = Intent(Intent.ACTION_GET_CONTENT).apply {
                addCategory(Intent.CATEGORY_OPENABLE)
                type = "*/*" // Default to allow any file type
                // Prepare an array of MIME types
                if (types.size() > 1) {
                    val mimeTypes = Array(types.size()) { types.getString(it) }
                    putExtra(Intent.EXTRA_MIME_TYPES, mimeTypes)
                } else if (types.size() == 1) {
                    type = types.getString(0) // Set the specific type if only one is passed
                }
            }

            // Start the activity with the intent
            activity.startActivityForResult(intent, PICK_FILE)
        } catch (e: Exception) {
            pickerPromise?.reject("ERROR_PICKING_FILE", e.message)
            pickerPromise = null
        }
    }

    override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == PICK_FILE) {
            if (pickerPromise != null) {
                if (resultCode == Activity.RESULT_OK && data != null) {
                    val uri: Uri? = data.data
                    if (uri != null) {
                        val fileDetails = getFileDetails(uri)
                        if (fileDetails != null) {
                            pickerPromise?.resolve(fileDetails)
                        } else {
                            pickerPromise?.reject("FILE_READ_ERROR", "Could not read file details")
                        }
                    } else {
                        pickerPromise?.reject("FILE_NOT_FOUND", "No file selected")
                    }
                } else {
                    pickerPromise?.reject("CANCELED", "File picking was canceled")
                }
                pickerPromise = null
            }
        }
    }

    private fun getFileDetails(uri: Uri): WritableMap? {
        val fileDetails = Arguments.createMap()
        val contentResolver = reactApplicationContext.contentResolver

        try {
            // Get file name and size
            val cursor = contentResolver.query(uri, null, null, null, null)
            cursor?.use {
                if (it.moveToFirst()) {
                    val nameIndex = it.getColumnIndex(OpenableColumns.DISPLAY_NAME)
                    val sizeIndex = it.getColumnIndex(OpenableColumns.SIZE)

                    val fileName = it.getString(nameIndex)
                    val fileSize = it.getLong(sizeIndex)

                    fileDetails.putString("uri", uri.toString())
                    fileDetails.putString("name", fileName)
                    fileDetails.putDouble("size", fileSize.toDouble()) // in bytes
                }
            }

            return fileDetails
        } catch (e: Exception) {
            e.printStackTrace()
            return null
        }
    }

    override fun onNewIntent(intent: Intent?) {
        // Not needed for this functionality
    }
}