package com.gladis

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.provider.OpenableColumns
import com.facebook.react.bridge.*
import android.database.Cursor
import com.facebook.react.bridge.Promise
import java.io.File
import java.io.FileOutputStream
import android.util.Base64
import java.io.ByteArrayOutputStream
import java.io.InputStream

class FilePickerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), ActivityEventListener {
    private var pickerPromise: Promise? = null
    private val PICK_PDF_FILE = 1

    init {
        reactContext.addActivityEventListener(this)
    }

    override fun getName(): String {
        return "FilePickerModule"
    }

    @ReactMethod
    fun pickSinglePDF(promise: Promise) {
        val activity = currentActivity

        if (activity == null) {
            promise.reject("NO_ACTIVITY", "Activity doesn't exist")
            return
        }

        pickerPromise = promise

        try {
            // Create an Intent to open the file picker and filter for PDFs
            val intent = Intent(Intent.ACTION_GET_CONTENT).apply {
                addCategory(Intent.CATEGORY_OPENABLE)
                type = "application/pdf" // Only PDF files
            }

            // Start the activity with the intent
            activity.startActivityForResult(intent, PICK_PDF_FILE)
        } catch (e: Exception) {
            pickerPromise?.reject("ERROR_PICKING_FILE", e.message)
            pickerPromise = null
        }
    }

    override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == PICK_PDF_FILE) {
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
            // Get file name
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