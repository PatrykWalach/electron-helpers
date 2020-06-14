import {
  IpcRenderer,
  IpcRendererEvent,
  ipcRenderer,
  ipcMain,
  IpcMain,
} from 'electron'

export const generateEmitHooks: GenerateEmit = <T>(key: string) => {
  const createRendererOn = (ipcRenderer: IpcRenderer) => (
    handle: (event: IpcRendererEvent, arg?: T) => void,
  ) => {
    ipcRenderer.on(key, handle)

    return () => ipcRenderer.removeListener(key, handle)
  }

  const createEmit = (ipcMain: IpcMain) => (arg?: T) => ipcMain.emit(key, arg)

  return {
    createRendererOn,
    createEmit,
    useRendererOn: createRendererOn(ipcRenderer),
    emit: createEmit(ipcMain),
  }
}

type CreateEmit = (ipcMain: IpcMain) => () => boolean

type CreateEmitT<T> = <T>(ipcMain: IpcMain) => (arg: T) => boolean

type Unsubscribe = () => IpcRenderer

type CreateRendererOn = (
  ipcRenderer: IpcRenderer,
) => (handle: (event: IpcRendererEvent) => void) => Unsubscribe

type CreateRendererOnT<T> = <T>(
  ipcRenderer: IpcRenderer,
) => (handle: (event: IpcRendererEvent) => void, arg: T) => Unsubscribe

interface GenerateEmit {
  (key: string): {
    createEmit: CreateEmit
    emit: ReturnType<CreateEmit>
    useRendererOn: ReturnType<CreateRendererOn>
    createRendererOn: CreateRendererOn
  }
  <T>(key: string): {
    createEmit: CreateEmitT<T>
    emit: ReturnType<CreateEmitT<T>>
    useRendererOn: ReturnType<CreateRendererOnT<T>>
    createRendererOn: CreateRendererOnT<T>
  }
}
