/* host */
const host = "http://47.106.8.44"
const dataHost = host + ":8081"
const videoHost = host + ":8080"
const pythonHost = "http://localhost:5000"

/* api */
export const videoApi = {
    hlsServer : videoHost + "/live",
    videoServer :  videoHost + "/vod"
}

export const pyApi = {
    searchFromStream : pythonHost + "/stream",
    searchFromHistory : pythonHost + "/history"
}

const baseUrl = "/api"
const dataApi = dataHost + baseUrl
export const cameraApi = {
    getAllCamera : dataApi + "/camera/all",
    getCameraByAreaid : dataApi + "/camera/areaid",
    deleteCameraByCameraid : dataApi + "/camera/cameraid",
    saveCamera : dataApi + "/camera"
}

export const historyApi = {
    getHistoryByAreaid : dataApi + "/history/areaid",
    deleteHistoryByHistoryid : dataApi + "/history/historyid",
    saveHistory : dataApi + "/history"
}

export const mapApi = {
    getAllMap : dataApi + "/map/all",
    getMapByAreaid : dataApi + "/map/areaid",
    deleteMapByMapid : dataApi + "/map/mapid",
    saveMap : dataApi + "/map"
}

/* url */ 
export const url = {
    home : "/home",
    liveVideo : "/video/live",
    historyVideo : "/video/history",
    management : "/management"
}