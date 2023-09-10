'use client'

import isNil from 'lodash/isNil'

export const LOCALSTORAGE_TABLE_COLUMN_STATE_ITEM_NAME =
  '@cartola-statistics/athlete-table-config-state'

export interface UpdateLocalStorage {
  columnOrder: string[]
  columnVisibility: { [key: string]: boolean }
}

let localStorageListeners: (() => void)[] = []

let customizedTableColumnConfig: UpdateLocalStorage =
  getCustomizedTableColumnConfigFromLocalStorage()

function getCustomizedTableColumnConfigFromLocalStorage() {
  if (typeof localStorage === 'undefined') {
    return {}
  }

  return JSON.parse(localStorage.getItem(LOCALSTORAGE_TABLE_COLUMN_STATE_ITEM_NAME) ?? '{}')
}

function updateLocalStorage({ columnOrder, columnVisibility }: UpdateLocalStorage) {
  if (!isNil(localStorage)) {
    localStorage.setItem(
      LOCALSTORAGE_TABLE_COLUMN_STATE_ITEM_NAME,
      JSON.stringify({ columnOrder, columnVisibility })
    )
    emitLocalStorageChanges()
  }
}

function emitLocalStorageChanges() {
  for (let listener of localStorageListeners) {
    listener()
  }
}

function subscribe(callback: () => void) {
  localStorageListeners.push(callback)
  return () => {
    localStorageListeners = localStorageListeners.filter((listener) => listener !== callback)
  }
}

function getSnapshot() {
  if (isNil(localStorage)) {
    return '{}'
  }

  return localStorage.getItem(LOCALSTORAGE_TABLE_COLUMN_STATE_ITEM_NAME)
}

export const MarketTableAsyncExternalStorage = {
  updateLocalStorage,
  subscribe,
  getSnapshot,
  customizedTableColumnConfig
}
