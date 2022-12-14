import {useGesture} from "react-use-gesture"
import {useThree} from "@react-three/fiber";
import {getPosition, useViewerState} from "./state";
import {panoramas} from "../global";
import axios from 'axios';
import {getImageSize} from 'react-image-size';
import {useBaseStore, useBaseStoreState} from "../../../global";
import {parse} from "cgv"
import {globalLocalRatio} from "./index";
import {tile2lat, tile2lon, tileMeterRatio} from "../../../../../dist/domains/shape";


export function ClickFacade() {
    const canvas = useThree(({gl}) => gl.domElement)

    useGesture({
            onDrag: async ({first, xy: [x, y], buttons, event}) => {
                event.preventDefault()
                const state = useViewerState.getState()
                if (first && buttons === 1 && state.viewType == "panorama" && state.facadeName != "") {

                    useViewerState.setState({
                        selectFacade: false
                    })

                    const panoramaIndex = state.panoramaIndex
                    const pan = panoramas[panoramaIndex]
                    const pan_url = window.location.origin + pan.url
                    const pan_angle = pan.rotationOffset


                    const {width, height} = await getImageSize(pan_url);

                    const w = width
                    //console.log("width: " + width)

                    //console.log("Dist: " + (x - window.innerWidth / 2))
                    //console.log("X: " + x + ", Y: " + y)
                    //console.log(state.rotation)
                    const rot = state.rotation

                    let facade_x = 0
                    let r = 0
                    if (rot) {
                        r = ((rot[1] - (pan_angle - 270) * Math.PI / 180)) % (2 * Math.PI) + Math.PI
                        if (r > Math.PI)
                            r -= 2 * Math.PI
                        if (r < -Math.PI)
                            r += 2 * Math.PI
                        console.log("Rot: " + (rot))
                        facade_x = (-r + Math.PI) * w / (2 * Math.PI)
                        console.log("T: " + facade_x)
                    }
                    //114.5


                    //console.log("FOV: " + state.fov)
                    //useViewerState.getState().rotation = [0,0,0]

                    runPython(rot[1], pan_url)


                }

            }
        },
        {
            domTarget: canvas,
            eventOptions: {
                passive: false,
            },
        })

    return null
}

function runPython(x: number, img: string) {
    // @ts-ignore
    //const [globalX, , globalZ] = getPosition(useViewerState.getState())
    //const ratio = tileMeterRatio(0, 18)


    axios.post('http://localhost:5000/flask/facade', {
        "x": x,
        "img": img
    }).then(response => {

        const grammar = response.data["message"]

        placeBuilding(grammar)
        // @ts-ignore
        //console.log(useViewerState.getState().store.getState())
    })

}


function placeBuilding(grammar: string) {
    const state = useViewerState.getState()

    const [globalX, , globalZ] = getPosition(state)

    const x = Math.floor(globalX * globalLocalRatio)
    const y = Math.floor(globalZ * globalLocalRatio)

    const name = state.facadeName

    //console.log(response.data["message"])

    // @ts-ignore
    state.store.getState().addDescriptions([{
        name: name + "_" + x + "_" + y,
        step: parse(grammar)[0].step
    }])


    const facadeName = ""
    useViewerState.setState({
        facadeName
    })
}