import { createWriteStream } from "fs"
import availableTiles, { getTilePath } from "../src/domains/shape/available-tiles"
import fetch from "node-fetch"

async function download(filePath: string, url: string) {
    const buffer = await (await fetch(url)).buffer()
    const file = createWriteStream(filePath)
    file.write(buffer)
    file.close()
}

const token = "pk.eyJ1IjoiZ2V0dGlucWRvd24iLCJhIjoiY2t2NXVnMXY2MTl4cDJ1czNhd3AwNW9rMCJ9.k8Dv277a0znf4LE_Pkcl3Q"

//raster tiles
for (const { x, y, zoom } of availableTiles) {
    console.log("Load raster tile")
    download(
        getTilePath(zoom, x, y, "png"),
        `https://api.mapbox.com/v4/mapbox.satellite/${zoom}/${x}/${y}@2x.jpg70?access_token=${token}`
    )
}

//vector tiles
for (const { x, y, zoom } of availableTiles) {
    console.log("Load vector tile")
    download(
        getTilePath(zoom, x, y, "mvt"),
        `https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/${zoom}/${x}/${y}.mvt?access_token=${token}`
    )
}

//https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/18/77197/98512.mvt?access_token=pk.eyJ1IjoiZ2V0dGlucWRvd24iLCJhIjoiY2t2NXVnMXY2MTl4cDJ1czNhd3AwNW9rMCJ9.k8Dv277a0znf4LE_Pkcl3Q
