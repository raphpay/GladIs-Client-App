//
//  FinderModule.swift
//  GladIs-macOS
//
//  Created by Raphaël Payet on 21/02/2024.
//

import Foundation
import Cocoa
import React

@objc(FinderModule)
class FinderModule: NSObject {
    
    @objc
    func pickPDFFile(_ callback: @escaping RCTResponseSenderBlock) {
        DispatchQueue.main.async {
            let panel = NSOpenPanel()
            panel.allowedFileTypes = ["pdf"]
            panel.canChooseFiles = true
            panel.canChooseDirectories = false
            panel.allowsMultipleSelection = false
            
            if panel.runModal() == .OK, let url = panel.url {
                callback([url.absoluteString])
            } else {
                callback([])
            }
        }
    }
    
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }
}
