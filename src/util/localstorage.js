import { parse } from 'util/index'

const storage = window.localStorage

// feature detect
const support = !!(storage && storage.getItem)

// ios 无痕浏览, localStorage可以读, 但是不可以写&删除
const available = (function () {
    try {
        storage.setItem('_h', ' ')
    }
    catch (e) {
        return false
    }

    return true;
})()

export function set(key, value) {
    if (!support || !available) {
        return
    }

    // 不同浏览器，分配给本地存储的空间是不一样的，一般存储大小为 5M 当本地存储满了，再往里面写数据，将会触发 error
    try {
        storage.setItem(key, JSON.stringify(value))
    }

    catch (e) {
        throw new Error(e)
    }
}

export function get(key) {
    if (!support) {
        return
    }

    // null || string
    return parse(storage.getItem(key))
}

export function remove(key) {
    if (!support || !available) {
        return
    }

    storage.removeItem(key)
}

export function clear() {
    if (!support || !available) {
        return
    }

    storage.clear()
}
