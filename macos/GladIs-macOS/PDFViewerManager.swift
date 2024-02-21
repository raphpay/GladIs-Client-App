//
//  PDFViewerManager.swift
//  GladIs-macOS
//
//  Created by Raphaël Payet on 21/02/2024.
//

import Foundation
import React

@objc(PDFViewerManager)
class PDFViewerManager: RCTViewManager {
  
  override func view() -> NSView! {
      return PDFViewer()
  }

  override static func requiresMainQueueSetup() -> Bool {
      return true
  }
}
