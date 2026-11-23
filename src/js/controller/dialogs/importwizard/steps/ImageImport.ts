import { app } from "@/app";
import type { Piskel } from "@/model/Piskel";
import { CanvasUtils } from "@/utils/CanvasUtils";
import { Dom } from "@/utils/Dom";
import { FileUtils } from "@/utils/FileUtils";
import { assertInitialized } from "@/utils/core";
import type { PublicPiskelController } from "@/controller/piskel/PublicPiskelController";
import type { ImportWizard } from "@/controller/dialogs/importwizard/ImportWizard";
import { AbstractImportStep } from "./AbstractImportStep";

export class ImageImport extends AbstractImportStep {
  importedImage_: HTMLImageElement | HTMLCanvasElement | null;
  file_: File | null;
  importPreview: HTMLElement | undefined;
  fileNameContainer: HTMLElement | undefined;
  singleImportType: HTMLInputElement | null | undefined;
  sheetImportType: HTMLInputElement | null | undefined;
  resizeWidth: HTMLInputElement | undefined;
  resizeHeight: HTMLInputElement | undefined;
  smoothResize: HTMLInputElement | undefined;
  frameSizeX: HTMLInputElement | undefined;
  frameSizeY: HTMLInputElement | undefined;
  frameOffsetX: HTMLInputElement | undefined;
  frameOffsetY: HTMLInputElement | undefined;
  frameMarginX: HTMLInputElement | undefined;
  frameMarginY: HTMLInputElement | undefined;

  constructor(
    piskelController: PublicPiskelController,
    importController: ImportWizard,
    container: HTMLElement
  ) {
    super(piskelController, importController, container);
    this.importedImage_ = null;
    this.file_ = null;
  }

  init(): void {
    super.init();

    // This step is only used if rawFiles contains a single image.
    this.file_ = this.mergeData.rawFiles[0];

    this.importPreview = Dom.getElement<HTMLElement>(
      ".import-section-preview",
      this.container
    );

    this.fileNameContainer = Dom.getElement<HTMLElement>(
      ".import-image-file-name",
      this.container
    );

    this.singleImportType = this.container.querySelector<HTMLInputElement>(
      "[name=import-type][value=single]"
    );
    this.sheetImportType = this.container.querySelector<HTMLInputElement>(
      "[name=import-type][value=sheet]"
    );

    this.resizeWidth = Dom.getElement<HTMLInputElement>(
      "[name=resize-width]",
      this.container
    );
    this.resizeHeight = Dom.getElement<HTMLInputElement>(
      "[name=resize-height]",
      this.container
    );
    this.smoothResize = Dom.getElement<HTMLInputElement>(
      "[name=smooth-resize-checkbox]",
      this.container
    );

    this.frameSizeX = Dom.getElement<HTMLInputElement>(
      "[name=frame-size-x]",
      this.container
    );
    this.frameSizeY = Dom.getElement<HTMLInputElement>(
      "[name=frame-size-y]",
      this.container
    );
    this.frameOffsetX = Dom.getElement<HTMLInputElement>(
      "[name=frame-offset-x]",
      this.container
    );
    this.frameOffsetY = Dom.getElement<HTMLInputElement>(
      "[name=frame-offset-y]",
      this.container
    );
    this.frameMarginX = Dom.getElement<HTMLInputElement>(
      "[name=frame-margin-x]",
      this.container
    );
    this.frameMarginY = Dom.getElement<HTMLInputElement>(
      "[name=frame-margin-y]",
      this.container
    );

    this.addEventListener(
      assertInitialized(this.singleImportType, "singleImportType"),
      "change",
      this.onImportTypeChange_
    );
    this.addEventListener(
      assertInitialized(this.sheetImportType, "sheetImportType"),
      "change",
      this.onImportTypeChange_
    );

    this.addEventListener(this.resizeWidth, "keyup", this.onResizeInputKeyUp_);
    this.addEventListener(this.resizeHeight, "keyup", this.onResizeInputKeyUp_);
    this.addEventListener(this.frameSizeX, "keyup", this.onFrameInputKeyUp_);
    this.addEventListener(this.frameSizeY, "keyup", this.onFrameInputKeyUp_);
    this.addEventListener(this.frameOffsetX, "keyup", this.onFrameInputKeyUp_);
    this.addEventListener(this.frameOffsetY, "keyup", this.onFrameInputKeyUp_);
    this.addEventListener(this.frameMarginX, 'keyup', this.onFrameInputKeyUp_);
    this.addEventListener(this.frameMarginY, 'keyup', this.onFrameInputKeyUp_);

    FileUtils.readImageFile(
      assertInitialized(this.file_, "file_"),
      this.onImageLoaded_.bind(this)
    );

    if (this.piskelController.isEmpty()) {
      assertInitialized(this.nextButton, "nextButton").textContent = "import";
    }
  }

  onNextClick(): void {
    this.container.classList.add("import-image-loading");
    this.createPiskelFromImage()
      .then((piskel: Piskel) => {
        this.mergeData.mergePiskel = piskel;
        this.container.classList.remove("import-image-loading");
        super.onNextClick();
      })
      .catch(function (e: Event) {
        console.error(e);
      });
  }

  onShow(): void {
    this.container.classList.remove("import-image-loading");
  }

  createPiskelFromImage(): Promise<Piskel> {
    let name = this.extractFileNameFromPath_(
      assertInitialized(this.file_, "file_").name
    );
    // Remove extension from filename.
    name = name.replace(/\.[a-zA-Z]+$/, "");

    return new Promise<Piskel>((resolve) => {
      assertInitialized(app.importService, "importService").newPiskelFromImage(
        assertInitialized(this.importedImage_, "importedImage_"),
        {
          importType: this.getImportType_(),
          frameSizeX:
            this.getImportType_() === "single"
              ? Number(assertInitialized(this.resizeWidth, "resizeWidth").value)
              : this.sanitizeInputValue_(this.frameSizeX, 1),
          frameSizeY:
            this.getImportType_() === "single"
              ? Number(
                  assertInitialized(this.resizeHeight, "resizeHeight").value
                )
              : this.sanitizeInputValue_(this.frameSizeY, 1),
          frameOffsetX: this.sanitizeInputValue_(this.frameOffsetX, 0),
          frameOffsetY: this.sanitizeInputValue_(this.frameOffsetY, 0),
          frameMarginX: this.sanitizeInputValue_(this.frameMarginX, 0),
          frameMarginY: this.sanitizeInputValue_(this.frameMarginY, 0),
          smoothing: !!assertInitialized(this.smoothResize, "smoothResize")
            .checked,
          name: name
        },
        resolve
      );
    });
  }

  onImportTypeChange_(): void {
    if (this.getImportType_() === "single") {
      // Using single image, so remove the frame grid
      this.hideFrameGrid_();
    } else {
      const mx = this.sanitizeInputValue_(this.frameMarginX, 0);
      const my = this.sanitizeInputValue_(this.frameMarginY, 0);
      // Using spritesheet import, so draw the frame grid in the preview
      const x = this.sanitizeInputValue_(this.frameOffsetX, 0);
      const y = this.sanitizeInputValue_(this.frameOffsetY, 0);
      const w = this.sanitizeInputValue_(this.frameSizeX, 1);
      const h = this.sanitizeInputValue_(this.frameSizeY, 1);
      this.drawFrameGrid_(x, y, w, h, mx, my);
    }
  }

  onResizeInputKeyUp_(evt: Event): void {
    const from = (evt.target as HTMLElement).getAttribute("name");
    if (this.importedImage_) {
      this.synchronizeResizeFields_(
        (evt.target as HTMLInputElement).value,
        from
      );
    }
  }

  onFrameInputKeyUp_(evt: Event): void {
    if (this.importedImage_) {
      this.synchronizeFrameFields_((evt.target as HTMLInputElement).value);
    }
  }

  synchronizeResizeFields_(input: string, from: string | null): void {
    let value = parseInt(input, 10);
    if (isNaN(value)) {
      value = 0;
    }
    const height = assertInitialized(
      this.importedImage_,
      "importedImage_"
    ).height;
    const width = assertInitialized(
      this.importedImage_,
      "importedImage_"
    ).width;

    // Select single image import type since the user changed a value here
    assertInitialized(this.singleImportType, "singleImportType").checked = true;

    if (from === "resize-width") {
      assertInitialized(this.resizeHeight, "resizeHeight").value = String(
        Math.round((value * height) / width)
      );
    } else {
      assertInitialized(this.resizeWidth, "resizeWidth").value = String(
        Math.round((value * width) / height)
      );
    }
  }

  synchronizeFrameFields_(input: string): void {
    let value = parseInt(input, 10);
    if (isNaN(value)) {
      value = 0;
    }

    // Parse the frame input values
    const frameSizeX = this.sanitizeInputValue_(this.frameSizeX, 1);
    const frameSizeY = this.sanitizeInputValue_(this.frameSizeY, 1);
    const frameOffsetX = this.sanitizeInputValue_(this.frameOffsetX, 0);
    const frameOffsetY = this.sanitizeInputValue_(this.frameOffsetY, 0);
    const frameMarginX = this.sanitizeInputValue_(this.frameMarginX, 0);
    const frameMarginY = this.sanitizeInputValue_(this.frameMarginY, 0);

    // Select spritesheet import type since the user changed a value here
    assertInitialized(this.sheetImportType, "sheetImportType").checked = true;

    // Draw the grid
    this.drawFrameGrid_(frameOffsetX, frameOffsetY, frameSizeX, frameSizeY, frameMarginX, frameMarginY);
  }

  sanitizeInputValue_(
    maybeInput: HTMLInputElement | undefined,
    minValue: number
  ): number {
    const input = assertInitialized(maybeInput, "input");
    let value = parseInt(input.value, 10);
    if (value <= minValue || isNaN(value)) {
      input.value = String(minValue);
      value = minValue;
    }
    return value;
  }

  getImportType_(): string {
    if (assertInitialized(this.singleImportType, "singleImportType").checked) {
      return assertInitialized(this.singleImportType, "singleImportType").value;
    } else if (
      assertInitialized(this.sheetImportType, "sheetImportType").checked
    ) {
      return assertInitialized(this.sheetImportType, "sheetImportType").value;
    } else {
      throw "Could not find the currently selected import type";
    }
  }

  onImageLoaded_(image: HTMLImageElement | HTMLCanvasElement): void {
    this.importedImage_ = image;

    const w = this.importedImage_.width;
    const h = this.importedImage_.height;

    // FIXME : We remove the onload callback here because JsGif will insert
    // the image again and we want to avoid retriggering the image onload
    this.importedImage_.onload = function () {};

    const fileName = this.extractFileNameFromPath_(
      assertInitialized(this.file_, "file_").name
    );
    assertInitialized(this.fileNameContainer, "fileNameContainer").textContent =
      fileName;
    assertInitialized(this.fileNameContainer, "fileNameContainer").setAttribute(
      "title",
      fileName
    );

    assertInitialized(this.resizeWidth, "resizeWidth").value = String(w);
    assertInitialized(this.resizeHeight, "resizeHeight").value = String(h);

    assertInitialized(this.frameSizeX, "frameSizeX").value = String(w);
    assertInitialized(this.frameSizeY, "frameSizeY").value = String(h);
    assertInitialized(this.frameOffsetX, "frameOffsetX").value = String(0);
    assertInitialized(this.frameOffsetY, "frameOffsetY").value = String(0);
    assertInitialized(this.frameMarginX, "frameMarginX").value = String(0);
    assertInitialized(this.frameMarginY, "frameMarginY").value = String(0);

    assertInitialized(this.importPreview, "importPreview").innerHTML = "";
    assertInitialized(this.importPreview, "importPreview").appendChild(
      this.createImagePreview_()
    );
  }

  createImagePreview_(): HTMLImageElement {
    const image = document.createElement("img");
    image.src = (
      assertInitialized(
        this.importedImage_,
        "importedImage_"
      ) as HTMLImageElement
    ).src;
    return image;
  }

  extractFileNameFromPath_(path: string): string {
    let parts = [];
    if (path.indexOf("/") !== -1) {
      parts = path.split("/");
    } else if (path.indexOf("\\") !== -1) {
      parts = path.split("\\");
    } else {
      parts = [path];
    }
    return parts[parts.length - 1];
  }

  drawFrameGrid_(
    frameX: number,
    frameY: number,
    frameW: number,
    frameH: number,
    marginX = 0,
    marginY = 0
  ): void {
    if (!this.importedImage_) {
      return;
    }

    // Grab the sizes of the source and preview images
    const width = this.importedImage_.width;
    const height = this.importedImage_.height;

    const image = Dom.getElement<HTMLElement>("img", this.importPreview);
    const previewWidth = image.offsetWidth;
    const previewHeight = image.offsetHeight;

    let canvas = assertInitialized(
      this.importPreview,
      "importPreview"
    ).querySelector("canvas");
    if (!canvas) {
      // Create a new canvas for the grid
      canvas = CanvasUtils.createCanvas(previewWidth + 1, previewHeight + 1);
      assertInitialized(this.importPreview, "importPreview").appendChild(
        canvas
      );
    }

    const context = Dom.getContext2d(canvas);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();

    // Calculate the number of whole frames
    const frameWM = frameW + marginX;
    const frameHM = frameH + marginY;
    const countX = Math.floor((width - frameX + marginX) / frameWM);
    const countY = Math.floor((height - frameY + marginY) / frameHM);

    if (countX > 0 && countY > 0) {
      const scaleX = previewWidth / width;
      const scaleY = previewHeight / height;
      const maxWidth = countX * frameW + frameX;
      const maxHeight = countY * frameH + frameY;

      // Draw the lines
      for (let i = 0; i < countX; i++) {
        var x = frameX + 0.5 + i * frameWM;
        for (let j = 0; j < countY; j++) {
          var y = frameY + 0.5 + j * frameHM;
          this.drawRectangle_(context, x * scaleX, y * scaleY, frameW * scaleX, frameH * scaleY);
        }
      }

      context.lineWidth = 1;
      context.strokeStyle = "gold";
      context.stroke();

      // Show the canvas
      canvas.style.display = "block";
    } else {
      this.hideFrameGrid_();
    }
  }

  drawRectangle_(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    // clockwise
    context.moveTo(x, y);
    context.lineTo(x + width, y);
    context.lineTo(x + width, y + height);
    context.lineTo(x, y + height);
    context.lineTo(x, y);
  };

  hideFrameGrid_(): void {
    const canvas = assertInitialized(
      this.importPreview,
      "importPreview"
    ).querySelector("canvas");
    if (canvas) {
      canvas.style.display = "none";
    }
  }
}
