export class CanvasManager {
  private _panMode = false
  private _locked = false
  private _gridVisible = true

  get panMode(): boolean {
    return this._panMode
  }

  get locked(): boolean {
    return this._locked
  }

  get gridVisible(): boolean {
    return this._gridVisible
  }

  togglePan(): boolean {
    this._panMode = !this._panMode
    console.log("🖱️ Pan Mode:", this._panMode)
    return this._panMode
  }

  toggleLock(): boolean {
    this._locked = !this._locked
    console.log("🔒 Canvas Lock:", this._locked)
    return this._locked
  }

  toggleGrid(): boolean {
    this._gridVisible = !this._gridVisible
    console.log("🔲 Grid Visible:", this._gridVisible)
    return this._gridVisible
  }

  setPanMode(enabled: boolean): boolean {
    this._panMode = enabled
    console.log("🖱️ Pan Mode Set:", this._panMode)
    return this._panMode
  }

  setLocked(locked: boolean): boolean {
    this._locked = locked
    console.log("🔒 Canvas Lock Set:", this._locked)
    return this._locked
  }

  setGridVisible(visible: boolean): boolean {
    this._gridVisible = visible
    console.log("🔲 Grid Visible Set:", this._gridVisible)
    return this._gridVisible
  }
}

export const createCanvasManager = () => new CanvasManager()
