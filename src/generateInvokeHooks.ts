import {
  IpcMainInvokeEvent,
  IpcRenderer,
  ipcRenderer,
  ipcMain,
  IpcMain,
} from 'electron'

type CreateInvoke<R> = (ipcRenderer: IpcRenderer) => () => Promise<R>

type CreateInvokeT<R, T> = (ipcRenderer: IpcRenderer) => (arg: T) => Promise<R>

type CreateHandle<R> = (
  ipcMain: IpcMain,
) => (handle: (event: IpcMainInvokeEvent) => R | Promise<R>) => void

type CreateHandleT<R, T> = (
  ipcMain: IpcMain,
) => (handle: (event: IpcMainInvokeEvent, arg: T) => R | Promise<R>) => void

interface Generate {
  <R>(key: string): {
    createHandle: CreateHandle<R>
    createInvoke: CreateInvoke<R>
    useInvoke: ReturnType<CreateInvoke<R>>
    useHandle: ReturnType<CreateHandle<R>>
  }
  <R, T>(key: string): {
    createHandle: CreateHandleT<R, T>
    createInvoke: CreateInvokeT<R, T>
    useInvoke: ReturnType<CreateInvokeT<R, T>>
    useHandle: ReturnType<CreateHandleT<R, T>>
  }
}

export const generateInvokeHooks: Generate = <R, T>(key: string) => {
  const createInvoke = (ipcRenderer: IpcRenderer) => (arg?: T) =>
    ipcRenderer.invoke(key, arg)

  const createHandle = (ipcMain: IpcMain) => (
    handle: (event: IpcMainInvokeEvent, arg?: T) => R,
  ) => ipcMain.handle(key, handle)

  return {
    createInvoke,
    createHandle,
    useInvoke: createInvoke(ipcRenderer),
    useHandle: createHandle(ipcMain),
  }
}
