#pragma once

#include "pch.h"
#include <winrt/Windows.Storage.Pickers.h>
#include <winrt/Windows.Storage.h>
#include <winrt/Windows.Foundation.h>
#include <winrt/Microsoft.ReactNative.h>
#include <string>
#include <future>
#include <functional>

namespace FilePickerModule
{
  REACT_MODULE(FilePicker);
  struct FilePicker final
  {
    React::ReactContext m_reactContext;

    REACT_INIT(Initialize)
    void Initialize(React::ReactContext const& reactContext) noexcept {
      m_reactContext = reactContext;
    }

    // Asynchronous method for opening the file dialog
    REACT_METHOD(PickPDFFile, L"pickPDFFile");
    void PickPDFFile(winrt::Microsoft::ReactNative::ReactPromise<winrt::Microsoft::ReactNative::JSValue> promise) noexcept {
        // Run the operation on the UI thread
        m_reactContext.UIDispatcher().Post([promise, this]() {
            try {
                // Create a FilePicker
                winrt::Windows::Storage::Pickers::FileOpenPicker picker;
                picker.SuggestedStartLocation(winrt::Windows::Storage::Pickers::PickerLocationId::DocumentsLibrary);
                picker.FileTypeFilter().Append(L".pdf"); // Set file type filter (e.g., PDF)

                // Launch the picker (this is asynchronous)
                picker.PickSingleFileAsync().Completed([promise](winrt::Windows::Foundation::IAsyncOperation<winrt::Windows::Storage::StorageFile> const& operation, winrt::Windows::Foundation::AsyncStatus const status) {
                    if (status == winrt::Windows::Foundation::AsyncStatus::Completed) {
                        winrt::Windows::Storage::StorageFile file = operation.GetResults();
                        if (file) {
                            // Resolve the promise with the file path if a file is selected
                            promise.Resolve(winrt::to_string(file.Path().c_str()));
                        } else {
                            // Resolve with a message if no file was selected
                            promise.Resolve("No file selected");
                        }
                    } else {
                        // Reject the promise if the operation was not completed successfully
                        promise.Reject("Error opening file dialog");
                    }
                });
            } catch (const std::exception& e) {
                // Reject the promise in case of exceptions
                promise.Reject(e.what());
            }
        });
    }

    REACT_METHOD(PickImageFile, L"pickImageFile");
    void PickImageFile(winrt::Microsoft::ReactNative::ReactPromise<winrt::Microsoft::ReactNative::JSValue> promise) noexcept {
    // Run the operation on the UI thread
    m_reactContext.UIDispatcher().Post([promise, this]() {
        try {
            // Create a FileOpenPicker
            winrt::Windows::Storage::Pickers::FileOpenPicker picker;
            picker.SuggestedStartLocation(winrt::Windows::Storage::Pickers::PickerLocationId::DocumentsLibrary);
            picker.FileTypeFilter().Append(L".png");
            picker.FileTypeFilter().Append(L".jpg");
            picker.FileTypeFilter().Append(L".jpeg");

            // Launch the picker (this is asynchronous)
            picker.PickSingleFileAsync().Completed([promise](winrt::Windows::Foundation::IAsyncOperation<winrt::Windows::Storage::StorageFile> const& operation, winrt::Windows::Foundation::AsyncStatus const status) {
                if (status == winrt::Windows::Foundation::AsyncStatus::Completed) {
                    winrt::Windows::Storage::StorageFile file = operation.GetResults();
                    if (file) {
                        // Resolve the promise with the file path if a file is selected
                        promise.Resolve(winrt::to_string(file.Path().c_str()));
                    } else {
                        // Resolve with a message if no file was selected
                        promise.Resolve("No image selected");
                    }
                } else {
                    // Reject the promise if the operation was not completed successfully
                    promise.Reject("Error opening file dialog");
                }
            });
        } catch (const std::exception& e) {
            // Reject the promise in case of exceptions
            promise.Reject(e.what());
        }
    });
}
  };
}