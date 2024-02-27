//
//  PDFViewer.swift
//  GladIs-macOS
//
//  Created by Raphaël Payet on 21/02/2024.
//

import Foundation
import AppKit
import PDFKit
import React

class PDFViewer: NSView {
  
  var pdfView: PDFView!
  
  var timer: Timer!
  let pasteboard: NSPasteboard = .general
  var lastChangeCount = 0
  
  @objc var dataString: NSString = "" {
    didSet {
      if let encodedData = Data(base64Encoded: String(dataString)) {
        loadPDF(with: encodedData)
      }
    }
  }

  override init(frame: CGRect) {
    super.init(frame: frame)
    setupPDFView()
    
    timer = Timer.scheduledTimer(withTimeInterval: 0.05, repeats: true, block: { t in
      if self.lastChangeCount != self.pasteboard.changeCount {
        self.lastChangeCount = self.pasteboard.changeCount
        NotificationCenter.default.post(name: .NSPasteboardDidChange, object: self)
      }
    })
  }

  required init?(coder: NSCoder) {
    super.init(coder: coder)
    setupPDFView()
    
    NotificationCenter.default.addObserver(self, selector: #selector(pasteboardDidChange), name: .NSPasteboardDidChange, object: pdfView)
    fatalError("init(coder:) has not been implemented")
  }
  
  deinit {
    NotificationCenter.default.removeObserver(self)
    timer.invalidate()
  }
  
  override func viewDidMoveToWindow() {
    super.viewDidMoveToWindow()
    NotificationCenter.default.addObserver(self, selector: #selector(pasteboardDidChange),
                                           name: .NSPasteboardDidChange, object: nil)
    self.window?.sharingType = .none
  }
  
  func setupPDFView() {
    pdfView = PDFView(frame: self.bounds)
    pdfView.autoresizingMask = [.width, .height]
    
    pdfView.autoScales = true
    pdfView.acceptsDraggedFiles = true
    
    addSubview(pdfView)
  }
  
  func loadPDF(with data: Data) {
    if let document = PDFDocument(data: data) {
      pdfView.document = document
    } else {
      print("Invalid PDF file")
    }
  }
  
  @objc
  func pasteboardDidChange(_ notification: Notification) {
    // TODO: To be improved as it completely blocks other apps from copying
//   pasteboard.clearContents()
//   pasteboard.setString("", forType: .string)
  }
}

extension NSNotification.Name {
  public static let NSPasteboardDidChange: NSNotification.Name = .init("pasteboardDidChangeNotification")
}
