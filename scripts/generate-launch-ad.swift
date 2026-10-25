import AppKit
import AVFoundation
import CoreGraphics
import CoreText
import CoreVideo
import Foundation
import ImageIO

let width = 720
let height = 1280
let fps: Int32 = 24
let durationSeconds = 20.0
let frames = Int(durationSeconds * Double(fps))
let frameDuration = CMTime(value: 1, timescale: fps)
let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let output = CommandLine.arguments.count > 1
    ? URL(fileURLWithPath: CommandLine.arguments[1])
    : root.appendingPathComponent("artifacts/hisdayspring-launch-ad.mp4")

func image(_ path: String) -> CGImage {
    let url = root.appendingPathComponent(path) as CFURL
    guard let source = CGImageSourceCreateWithURL(url, nil),
          let image = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
        fatalError("Could not load image: \(path)")
    }
    return image
}

let pastors = image("public/images/pastors/Lead-Pastors-Olamijulo.jpg")
let pastor = image("public/images/pastors/Pastor-Blessing-Web-1.webp")
let crusadePhotos = [
    image("public/images/launch/_DSC4002.jpg"),
    image("public/images/launch/_DSC2549.jpg"),
    image("public/images/launch/_DSC2526.jpg"),
    image("public/images/launch/_DSC2509.jpg"),
    image("public/images/launch/_DSC2475.jpg"),
    image("public/images/launch/_DSC2459.jpg"),
]
let crest = image("public/icon-512.png")

func color(_ hex: UInt32, alpha: CGFloat = 1) -> CGColor {
    CGColor(
        red: CGFloat((hex >> 16) & 0xff) / 255,
        green: CGFloat((hex >> 8) & 0xff) / 255,
        blue: CGFloat(hex & 0xff) / 255,
        alpha: alpha
    )
}

let burgundy = color(0x71001f)
let wine = color(0x340014)
let scarlet = color(0xc4113b)
let gold = color(0xf5cd72)
let ivory = color(0xfff9f1)
let muted = color(0xffe9dd, alpha: 0.82)
let fullRect = CGRect(x: 0, y: 0, width: width, height: height)

func drawGradient(_ context: CGContext, top: CGColor, bottom: CGColor) {
    let colors = [bottom, top] as CFArray
    guard let gradient = CGGradient(colorsSpace: CGColorSpaceCreateDeviceRGB(), colors: colors, locations: [0, 1]) else { return }
    context.drawLinearGradient(gradient, start: CGPoint(x: 0, y: 0), end: CGPoint(x: 0, y: CGFloat(height)), options: [])
}

/// Draw an image edge-to-edge with a gentle animated Ken Burns scale.
func drawCover(_ context: CGContext, image: CGImage, rect: CGRect, focusX: CGFloat, focusY: CGFloat, zoom: CGFloat, alpha: CGFloat = 1) {
    let sourceWidth = CGFloat(image.width)
    let sourceHeight = CGFloat(image.height)
    let baseScale = max(rect.width / sourceWidth, rect.height / sourceHeight)
    let scaledWidth = sourceWidth * baseScale * zoom
    let scaledHeight = sourceHeight * baseScale * zoom
    let origin = CGPoint(
        x: rect.midX - scaledWidth * focusX,
        y: rect.midY - scaledHeight * focusY
    )
    context.saveGState()
    context.setAlpha(alpha)
    context.clip(to: rect)
    context.interpolationQuality = .high
    context.draw(image, in: CGRect(origin: origin, size: CGSize(width: scaledWidth, height: scaledHeight)))
    context.restoreGState()
}

func drawText(_ context: CGContext, _ text: String, centerX: CGFloat, baselineY: CGFloat, size: CGFloat, font: String = "HelveticaNeue-Bold", fill: CGColor = ivory, tracking: CGFloat = 0) {
    let ctFont = CTFontCreateWithName(font as CFString, size, nil)
    let attributes: [NSAttributedString.Key: Any] = [
        NSAttributedString.Key(kCTFontAttributeName as String): ctFont,
        NSAttributedString.Key(kCTForegroundColorAttributeName as String): fill,
        NSAttributedString.Key(kCTKernAttributeName as String): tracking,
    ]
    let line = CTLineCreateWithAttributedString(NSAttributedString(string: text, attributes: attributes))
    let lineWidth = CGFloat(CTLineGetTypographicBounds(line, nil, nil, nil))
    context.saveGState()
    context.textMatrix = .identity
    context.textPosition = CGPoint(x: centerX - lineWidth / 2, y: baselineY)
    CTLineDraw(line, context)
    context.restoreGState()
}

func drawPill(_ context: CGContext, text: String, y: CGFloat, opacity: CGFloat = 1) {
    let labelWidth = CGFloat(text.count) * 11 + 52
    let rect = CGRect(x: (CGFloat(width) - labelWidth) / 2, y: y, width: labelWidth, height: 42)
    context.saveGState()
    context.setAlpha(opacity)
    context.setFillColor(color(0xf5cd72, alpha: 0.16))
    context.setStrokeColor(color(0xf5cd72, alpha: 0.72))
    context.setLineWidth(1)
    let path = CGPath(roundedRect: rect, cornerWidth: 21, cornerHeight: 21, transform: nil)
    context.addPath(path)
    context.drawPath(using: .fillStroke)
    drawText(context, text, centerX: CGFloat(width) / 2, baselineY: y + 15, size: 17, font: "HelveticaNeue-Medium", fill: gold, tracking: 2.2)
    context.restoreGState()
}

func drawBrand(_ context: CGContext, y: CGFloat, opacity: CGFloat = 1, scale: CGFloat = 1) {
    let centerX = CGFloat(width) / 2
    let iconSize = 68 * scale
    let badge = CGRect(x: centerX - iconSize / 2, y: y - iconSize / 2, width: iconSize, height: iconSize)
    context.saveGState()
    context.setAlpha(opacity)
    context.setFillColor(color(0xfff9f1))
    context.addPath(CGPath(ellipseIn: badge, transform: nil))
    context.fillPath()
    context.clip(to: badge)
    context.interpolationQuality = .high
    context.draw(crest, in: badge.insetBy(dx: 7 * scale, dy: 7 * scale))
    context.restoreGState()
    context.saveGState()
    context.setAlpha(opacity)
    drawText(context, "HISDAYSPRING", centerX: centerX, baselineY: y - iconSize / 2 - 35 * scale, size: 24 * scale, tracking: 4)
    context.restoreGState()
}

struct Scene {
    let start: Double
    let end: Double
    let kind: Int
}

let scenes = [
    Scene(start: 0, end: 3, kind: 0),
    Scene(start: 3, end: 7, kind: 1),
    Scene(start: 7, end: 11, kind: 2),
    Scene(start: 11, end: 15, kind: 3),
    Scene(start: 15, end: 20, kind: 4),
]
let transitionDuration = 0.55

func ease(_ value: Double) -> CGFloat {
    let t = max(0, min(1, value))
    return CGFloat(t * t * (3 - 2 * t))
}

func renderScene(_ context: CGContext, scene: Scene, time: Double, opacity: CGFloat) {
    let progress = max(0, min(1, (time - scene.start) / (scene.end - scene.start)))
    let entrance = ease(min(1, progress / 0.24))
    let lift = (1 - entrance) * 36
    let drift = CGFloat(progress)

    context.saveGState()
    context.setAlpha(opacity)

    switch scene.kind {
    case 0:
        drawGradient(context, top: wine, bottom: burgundy)
        drawCover(context, image: pastors, rect: fullRect, focusX: 0.51 + 0.025 * drift, focusY: 0.50, zoom: 1.03 + 0.075 * drift)
        let overlay = CGGradient(colorsSpace: CGColorSpaceCreateDeviceRGB(), colors: [color(0x16000d, alpha: 0.06), color(0x18000b, alpha: 0.88)] as CFArray, locations: [0, 1])!
        context.drawLinearGradient(overlay, start: CGPoint(x: 0, y: CGFloat(height)), end: CGPoint(x: 0, y: 0), options: [])
        drawBrand(context, y: 1030, opacity: entrance)
        drawText(context, "A PLACE TO", centerX: 360, baselineY: 445 - lift, size: 39, fill: ivory, tracking: 5)
        drawText(context, "BELONG.", centerX: 360, baselineY: 375 - lift, size: 72, fill: gold, tracking: 1)
        drawText(context, "Faith. Family. Purpose.", centerX: 360, baselineY: 310 - lift, size: 24, font: "HelveticaNeue", fill: muted)
        drawPill(context, text: "WELCOME HOME", y: 196, opacity: entrance)

    case 1:
        drawGradient(context, top: color(0x24000f), bottom: color(0x7c092b))
        drawCover(context, image: crusadePhotos[0], rect: CGRect(x: 0, y: 250, width: 720, height: 790), focusX: 0.5 - 0.05 * drift, focusY: 0.49, zoom: 1.02 + 0.07 * drift)
        context.setFillColor(color(0x310014, alpha: 0.2))
        context.fill(CGRect(x: 0, y: 250, width: 720, height: 790))
        drawText(context, "GROW IN", centerX: 360, baselineY: 1115, size: 29, fill: gold, tracking: 5)
        drawText(context, "FAITH", centerX: 360, baselineY: 1015 - lift, size: 88, fill: ivory)
        drawText(context, "AND IN COMMUNITY.", centerX: 360, baselineY: 947 - lift, size: 22, font: "HelveticaNeue-Medium", fill: ivory, tracking: 2)
        drawText(context, "A family for every season of life.", centerX: 360, baselineY: 180, size: 22, font: "HelveticaNeue", fill: muted)

    case 2:
        drawGradient(context, top: color(0x14000a), bottom: color(0x6f061f))
        drawCover(context, image: crusadePhotos[1], rect: CGRect(x: 0, y: 0, width: 720, height: 1280), focusX: 0.5 + 0.025 * drift, focusY: 0.48, zoom: 1.03 + 0.08 * drift)
        let overlay = CGGradient(colorsSpace: CGColorSpaceCreateDeviceRGB(), colors: [color(0x190009, alpha: 0.08), color(0x21000e, alpha: 0.91)] as CFArray, locations: [0, 1])!
        context.drawLinearGradient(overlay, start: CGPoint(x: 0, y: 900), end: CGPoint(x: 0, y: 30), options: [])
        drawPill(context, text: "HISDAYSPRING", y: 1110, opacity: entrance)
        drawText(context, "RAISING", centerX: 360, baselineY: 790 - lift, size: 36, fill: ivory, tracking: 5)
        drawText(context, "HOLY.", centerX: 360, baselineY: 705 - lift, size: 76, fill: ivory)
        drawText(context, "HEALTHY.", centerX: 360, baselineY: 615 - lift, size: 76, fill: gold)
        drawText(context, "WEALTHY.", centerX: 360, baselineY: 525 - lift, size: 76, fill: ivory)
        drawText(context, "A life growing in Christ.", centerX: 360, baselineY: 155, size: 21, font: "HelveticaNeue", fill: muted)

    case 3:
        // Full-bleed worship photo of the congregation. The old layout framed a
        // photo here and drew the crest over it, which covered the moment it was
        // meant to show — the picture now stands on its own, with the wordmark
        // clear of it and the headline in the lower third.
        drawGradient(context, top: color(0x8e092d), bottom: color(0x3a0014))
        drawCover(context, image: crusadePhotos[4], rect: fullRect, focusX: 0.5 + 0.02 * drift, focusY: 0.54, zoom: 1.04 + 0.07 * drift)
        let worshipOverlay = CGGradient(colorsSpace: CGColorSpaceCreateDeviceRGB(), colors: [color(0x190009, alpha: 0.08), color(0x21000e, alpha: 0.9)] as CFArray, locations: [0, 1])!
        context.drawLinearGradient(worshipOverlay, start: CGPoint(x: 0, y: 780), end: CGPoint(x: 0, y: 0), options: [])
        drawBrand(context, y: 1150, opacity: entrance, scale: 0.9)
        drawText(context, "WORSHIP.", centerX: 360, baselineY: 545 - lift, size: 54, fill: ivory)
        drawText(context, "THE WORD.", centerX: 360, baselineY: 470 - lift, size: 54, fill: gold)
        drawText(context, "REAL COMMUNITY.", centerX: 360, baselineY: 405 - lift, size: 42, fill: ivory)
        drawText(context, "Come as you are. Grow with us.", centerX: 360, baselineY: 330, size: 20, font: "HelveticaNeue", fill: muted)

    case 4:
        drawGradient(context, top: color(0x870027), bottom: color(0x3b0014))
        drawCover(context, image: pastors, rect: CGRect(x: 0, y: 610, width: 720, height: 670), focusX: 0.5, focusY: 0.48, zoom: 1.05 + 0.04 * drift)
        let overlay = CGGradient(colorsSpace: CGColorSpaceCreateDeviceRGB(), colors: [color(0x370014, alpha: 0.18), color(0x370014, alpha: 1)] as CFArray, locations: [0, 1])!
        context.drawLinearGradient(overlay, start: CGPoint(x: 0, y: 870), end: CGPoint(x: 0, y: 0), options: [])
        // Brand sits in the clear band below the photo: drawn over the portrait it
        // landed across the pastors' faces and was unreadable.
        drawBrand(context, y: 300, opacity: entrance, scale: 0.92)
        drawText(context, "JOIN US THIS SUNDAY", centerX: 360, baselineY: 745 - lift, size: 35, fill: ivory, tracking: 1.2)
        drawText(context, "8 AM   ·   10 AM   ·   12 PM", centerX: 360, baselineY: 665 - lift, size: 27, fill: gold)
        context.setStrokeColor(color(0xf5cd72, alpha: 0.72))
        context.setLineWidth(1.5)
        context.move(to: CGPoint(x: 170, y: 600))
        context.addLine(to: CGPoint(x: 550, y: 600))
        context.strokePath()
        drawText(context, "EXPLORE THE NEW WEBSITE", centerX: 360, baselineY: 525 - lift, size: 18, fill: muted, tracking: 2.4)
        drawText(context, "hisdayspring.org", centerX: 360, baselineY: 450 - lift, size: 40, fill: ivory)
        drawText(context, "A PLACE TO BELONG.", centerX: 360, baselineY: 165, size: 18, fill: gold, tracking: 3)

    default:
        drawGradient(context, top: color(0x270010), bottom: burgundy)
        let photoIndex = max(0, min(crusadePhotos.count - 1, scene.kind - 4))
        let photo = crusadePhotos[photoIndex]
        let zoom = 1.03 + 0.075 * drift
        drawCover(context, image: photo, rect: fullRect, focusX: 0.5 + 0.02 * drift, focusY: 0.5, zoom: zoom)
        let overlay = CGGradient(colorsSpace: CGColorSpaceCreateDeviceRGB(), colors: [color(0x16000d, alpha: 0.04), color(0x18000b, alpha: 0.83)] as CFArray, locations: [0, 1])!
        context.drawLinearGradient(overlay, start: CGPoint(x: 0, y: CGFloat(height)), end: CGPoint(x: 0, y: 0), options: [])
        drawPill(context, text: scene.kind == 5 ? "INSIDE OUR CHURCH" : "HEALING FROM HEAVEN CRUSADE", y: 170, opacity: entrance)
        if scene.kind == 5 {
            drawText(context, "A HOUSE OF", centerX: 360, baselineY: 530 - lift, size: 30, fill: ivory, tracking: 4)
            drawText(context, "WORSHIP.", centerX: 360, baselineY: 455 - lift, size: 59, fill: gold)
            drawText(context, "A FAMILY OF FAITH.", centerX: 360, baselineY: 390 - lift, size: 24, fill: ivory)
        } else {
            drawText(context, "HOPE IN", centerX: 360, baselineY: 530 - lift, size: 32, fill: ivory, tracking: 4)
            drawText(context, "EVERY COMMUNITY.", centerX: 360, baselineY: 450 - lift, size: 44, fill: gold)
            drawText(context, "The gospel beyond four walls.", centerX: 360, baselineY: 385 - lift, size: 21, font: "HelveticaNeue", fill: ivory)
        }
        drawText(context, "Hisdayspring Ministries", centerX: 360, baselineY: 110, size: 17, font: "HelveticaNeue-Medium", fill: muted, tracking: 1.5)
    }
    context.restoreGState()
}

try FileManager.default.createDirectory(at: output.deletingLastPathComponent(), withIntermediateDirectories: true)
try? FileManager.default.removeItem(at: output)
let writer = try AVAssetWriter(outputURL: output, fileType: .mp4)
let settings: [String: Any] = [
    AVVideoCodecKey: AVVideoCodecType.h264,
    AVVideoWidthKey: width,
    AVVideoHeightKey: height,
    AVVideoCompressionPropertiesKey: [
        AVVideoAverageBitRateKey: 3_200_000,
        AVVideoExpectedSourceFrameRateKey: fps,
        AVVideoMaxKeyFrameIntervalKey: 48,
        AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
    ],
]
let input = AVAssetWriterInput(mediaType: .video, outputSettings: settings)
input.expectsMediaDataInRealTime = false
let attributes: [String: Any] = [
    kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32ARGB,
    kCVPixelBufferWidthKey as String: width,
    kCVPixelBufferHeightKey as String: height,
    kCVPixelBufferCGImageCompatibilityKey as String: true,
    kCVPixelBufferCGBitmapContextCompatibilityKey as String: true,
]
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: attributes)
guard writer.canAdd(input) else { fatalError("Could not add video input") }
writer.add(input)
guard writer.startWriting() else { fatalError("Could not start MP4 writer: \(writer.error?.localizedDescription ?? "unknown error")") }
writer.startSession(atSourceTime: .zero)

let colorSpace = CGColorSpaceCreateDeviceRGB()
for frame in 0..<frames {
    while !input.isReadyForMoreMediaData { Thread.sleep(forTimeInterval: 0.002) }
    var optionalBuffer: CVPixelBuffer?
    guard let pool = adaptor.pixelBufferPool,
          CVPixelBufferPoolCreatePixelBuffer(kCFAllocatorDefault, pool, &optionalBuffer) == kCVReturnSuccess,
          let buffer = optionalBuffer else {
        fatalError("Could not allocate frame \(frame)")
    }
    CVPixelBufferLockBaseAddress(buffer, [])
    guard let context = CGContext(
        data: CVPixelBufferGetBaseAddress(buffer),
        width: width,
        height: height,
        bitsPerComponent: 8,
        bytesPerRow: CVPixelBufferGetBytesPerRow(buffer),
        space: colorSpace,
        bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue
    ) else { fatalError("Could not create drawing context") }
    context.setFillColor(wine)
    context.fill(fullRect)
    let time = Double(frame) / Double(fps)
    let index = scenes.firstIndex(where: { time >= $0.start && time < $0.end }) ?? scenes.count - 1
    let current = scenes[index]
    if index > 0 && time < current.start + transitionDuration {
        renderScene(context, scene: scenes[index - 1], time: scenes[index - 1].end - 0.001, opacity: 1 - ease((time - current.start) / transitionDuration))
        renderScene(context, scene: current, time: time, opacity: ease((time - current.start) / transitionDuration))
    } else {
        renderScene(context, scene: current, time: time, opacity: 1)
    }
    let presentationTime = CMTimeMultiply(frameDuration, multiplier: Int32(frame))
    let status = adaptor.append(buffer, withPresentationTime: presentationTime)
    CVPixelBufferUnlockBaseAddress(buffer, [])
    guard status else { fatalError("Could not append frame \(frame): \(writer.error?.localizedDescription ?? "unknown error")") }
    if frame % (Int(fps) * 4) == 0 { print("Rendered \(frame)/\(frames) frames") }
}
input.markAsFinished()
let semaphore = DispatchSemaphore(value: 0)
writer.finishWriting { semaphore.signal() }
semaphore.wait()
guard writer.status == .completed else { fatalError("MP4 export failed: \(writer.error?.localizedDescription ?? "unknown error")") }
print("Wrote \(output.path) (\(frames) frames, \(width)x\(height), \(fps) fps, \(durationSeconds)s)")
