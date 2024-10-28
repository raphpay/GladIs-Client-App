#pragma once

#include "pch.h"
#include <winrt/Windows.Storage.Pickers.h>
#include <winrt/Windows.Storage.h>
#include <winrt/Windows.Storage.Streams.h>
#include <winrt/Windows.Foundation.h>
#include <winrt/Microsoft.ReactNative.h>
#include <winrt/Windows.Security.Cryptography.h>
#include <string>
#include <vector>
#include <future>
#include <functional>

namespace FileOpenPickerModule
{
  REACT_MODULE(FileOpenPicker);
  struct FileOpenPicker final
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
                // Create a FileOpenPicker
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

    REACT_METHOD(PickCSVFile, L"pickCSVFile");
    void PickCSVFile(winrt::Microsoft::ReactNative::ReactPromise<winrt::Microsoft::ReactNative::JSValue> promise) noexcept {
        // Run the operation on the UI thread
        m_reactContext.UIDispatcher().Post([promise, this]() {
            try {
                // Create a FileOpenPicker
                winrt::Windows::Storage::Pickers::FileOpenPicker picker;
                picker.SuggestedStartLocation(winrt::Windows::Storage::Pickers::PickerLocationId::DocumentsLibrary);
                picker.FileTypeFilter().Append(L".csv"); // Set file type filter to CSV

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

    REACT_METHOD(ReadPDFFileData, L"readPDFFileData");
    void ReadPDFFileData(winrt::Microsoft::ReactNative::ReactPromise<winrt::Microsoft::ReactNative::JSValue> promise) noexcept {
        // Run the operation on the UI thread
        m_reactContext.UIDispatcher().Post([promise, this]() {
            try {
                // Create a FileOpenPicker
                winrt::Windows::Storage::Pickers::FileOpenPicker picker;
                picker.SuggestedStartLocation(winrt::Windows::Storage::Pickers::PickerLocationId::DocumentsLibrary);
                picker.FileTypeFilter().Append(L".pdf");

                // Launch the picker (this is asynchronous)
                picker.PickSingleFileAsync().Completed([promise](winrt::Windows::Foundation::IAsyncOperation<winrt::Windows::Storage::StorageFile> const& operation, winrt::Windows::Foundation::AsyncStatus const status) {
                    if (status == winrt::Windows::Foundation::AsyncStatus::Completed) {
                        winrt::Windows::Storage::StorageFile file = operation.GetResults();
                        if (file) {
                            // Read the file content
                            auto readOperation = file.OpenReadAsync();
                            readOperation.Completed([promise](auto const& operation, auto const status) {
                                if (status == winrt::Windows::Foundation::AsyncStatus::Completed) {
                                    auto stream = operation.GetResults();
                                    // Create a DataReader from the stream
                                    winrt::Windows::Storage::Streams::DataReader dataReader = winrt::Windows::Storage::Streams::DataReader(stream);
                                    
                                    // Load the entire stream into the DataReader
                                    uint32_t bytesLoaded = dataReader.LoadAsync(static_cast<uint32_t>(stream.Size())).get();  // Use get() to wait for completion

                                    // Read the bytes into a buffer
                                    std::vector<uint8_t> buffer(bytesLoaded);
                                    dataReader.ReadBytes(buffer);

                                    // Convert buffer to Base64 string
                                    std::string base64String = winrt::to_string(winrt::Windows::Security::Cryptography::CryptographicBuffer::EncodeToBase64String(winrt::Windows::Security::Cryptography::CryptographicBuffer::CreateFromByteArray(buffer)));

                                    // Resolve with JSValue containing Base64 string
                                    promise.Resolve(winrt::Microsoft::ReactNative::JSValue(base64String));
                                } else {
                                    promise.Reject("Error reading file");
                                }
                            });
                        } else {
                            promise.Resolve(winrt::Microsoft::ReactNative::JSValue("No file selected"));
                        }
                    } else {
                        promise.Reject("Error opening file dialog");
                    }
                });
            } catch (const std::exception& e) {
                promise.Reject(e.what());
            }
        });
    }

    REACT_METHOD(ReadImageFileData, L"readImageFileData");
    void ReadImageFileData(winrt::Microsoft::ReactNative::ReactPromise<winrt::Microsoft::ReactNative::JSValue> promise) noexcept {
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
                            // Read the file content
                            auto readOperation = file.OpenReadAsync();
                            readOperation.Completed([promise](auto const& operation, auto const status) {
                                if (status == winrt::Windows::Foundation::AsyncStatus::Completed) {
                                    auto stream = operation.GetResults();
                                    // Create a DataReader from the stream
                                    winrt::Windows::Storage::Streams::DataReader dataReader = winrt::Windows::Storage::Streams::DataReader(stream);
                                    
                                    // Load the entire stream into the DataReader
                                    uint32_t bytesLoaded = dataReader.LoadAsync(static_cast<uint32_t>(stream.Size())).get();  // Use get() to wait for completion

                                    // Read the bytes into a buffer
                                    std::vector<uint8_t> buffer(bytesLoaded);
                                    dataReader.ReadBytes(buffer);

                                    // Convert buffer to Base64 string
                                    std::string base64String = winrt::to_string(winrt::Windows::Security::Cryptography::CryptographicBuffer::EncodeToBase64String(winrt::Windows::Security::Cryptography::CryptographicBuffer::CreateFromByteArray(buffer)));

                                    // Resolve with JSValue containing Base64 string
                                    promise.Resolve(winrt::Microsoft::ReactNative::JSValue(base64String));
                                } else {
                                    promise.Reject("Error reading file");
                                }
                            });
                        } else {
                            promise.Resolve(winrt::Microsoft::ReactNative::JSValue("No file selected"));
                        }
                    } else {
                        promise.Reject("Error opening file dialog");
                    }
                });
            } catch (const std::exception& e) {
                promise.Reject(e.what());
            }
        });
    }

    REACT_METHOD(ReadCSVFileData, L"readCSVFileData");
    void ReadCSVFileData(winrt::Microsoft::ReactNative::ReactPromise<winrt::Microsoft::ReactNative::JSValue> promise) noexcept {
        // Run the operation on the UI thread
        m_reactContext.UIDispatcher().Post([promise, this]() {
            try {
                // Create a FileOpenPicker
                winrt::Windows::Storage::Pickers::FileOpenPicker picker;
                picker.SuggestedStartLocation(winrt::Windows::Storage::Pickers::PickerLocationId::DocumentsLibrary);
                picker.FileTypeFilter().Append(L".csv");

                // Launch the picker (this is asynchronous)
                picker.PickSingleFileAsync().Completed([promise](winrt::Windows::Foundation::IAsyncOperation<winrt::Windows::Storage::StorageFile> const& operation, winrt::Windows::Foundation::AsyncStatus const status) {
                    if (status == winrt::Windows::Foundation::AsyncStatus::Completed) {
                        winrt::Windows::Storage::StorageFile file = operation.GetResults();
                        if (file) {
                            // Read the file content
                            auto readOperation = file.OpenReadAsync();
                            readOperation.Completed([promise](auto const& operation, auto const status) {
                                if (status == winrt::Windows::Foundation::AsyncStatus::Completed) {
                                    auto stream = operation.GetResults();
                                    // Create a DataReader from the stream
                                    winrt::Windows::Storage::Streams::DataReader dataReader = winrt::Windows::Storage::Streams::DataReader(stream);
                                    
                                    // Load the entire stream into the DataReader
                                    uint32_t bytesLoaded = dataReader.LoadAsync(static_cast<uint32_t>(stream.Size())).get();  // Use get() to wait for completion

                                    // Read the bytes into a buffer
                                    std::vector<uint8_t> buffer(bytesLoaded);
                                    dataReader.ReadBytes(buffer);

                                    // Convert buffer to Base64 string
                                    std::string base64String = winrt::to_string(winrt::Windows::Security::Cryptography::CryptographicBuffer::EncodeToBase64String(winrt::Windows::Security::Cryptography::CryptographicBuffer::CreateFromByteArray(buffer)));

                                    // Resolve with JSValue containing Base64 string
                                    promise.Resolve(winrt::Microsoft::ReactNative::JSValue(base64String));
                                } else {
                                    promise.Reject("Error reading file");
                                }
                            });
                        } else {
                            promise.Resolve(winrt::Microsoft::ReactNative::JSValue("No file selected"));
                        }
                    } else {
                        promise.Reject("Error opening file dialog");
                    }
                });
            } catch (const std::exception& e) {
                promise.Reject(e.what());
            }
        });
    }
  };
}