export const LOCALSTORAGE_TABLE_COLUMN_STATE_ITEM_NAME = '@cartola-statistics/athlete-table-config-state'

let localStorageListeners: (() => void)[] = []

export interface UpdateLocalStorage {
  columnOrder: string []
  columnVisibility: { [key: string]: boolean }
}

function updateLocalStorage({ columnOrder, columnVisibility }: UpdateLocalStorage) {
  localStorage.setItem(LOCALSTORAGE_TABLE_COLUMN_STATE_ITEM_NAME, JSON.stringify({ columnOrder, columnVisibility }))
  emitLocalStorageChanges()
}

function emitLocalStorageChanges() {
  for (let listener of localStorageListeners) {
    listener()
  }
}

function subscribe(callback: () => void) {
  localStorageListeners.push(callback)
  return () => {
    localStorageListeners = localStorageListeners.filter(listener => listener !== callback)
  }
}

function getSnapshot() {
  return localStorage.getItem(LOCALSTORAGE_TABLE_COLUMN_STATE_ITEM_NAME)
}

export const MarketTableAsyncExternalStorage = {
  updateLocalStorage,
  subscribe,
  getSnapshot
}