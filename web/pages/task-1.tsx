import Head from "next/head"
import React, { useState } from "react"
import { of } from "rxjs"
import { useInterpretion } from "../src/use-interpretion"
import { ShapeEditor } from "../src/shape-editor"
import { cloneInstance, Instance, operations } from "cgv/domains/shape"
import { FacePrimitive } from "co-3gen"
import { Matrix4, Plane, Vector2, Vector3 } from "three"
import { InterpretionValue, MatrixEntriesObservable } from "cgv"

const lot: MatrixEntriesObservable<InterpretionValue<Instance>> = of([
    {
        index: [],
        value: of({
            terminated: false,
            eventDepthMap: {},
            parameters: {},
            value: {
                path: [],
                attributes: {},
                primitive: FacePrimitive.fromPointsAndPlane(new Matrix4(), new Plane(new Vector3(0, 1, 0)), [
                    new Vector2(200, 300),
                    new Vector2(-200, 200),
                    new Vector2(-300, -200),
                    new Vector2(200, -300),
                ]),
            },
        }),
    },
])

export default function Index() {
    const [text, setText] = useState("")

    const [changes, error] = useInterpretion(text, lot, operations, cloneInstance)

    return (
        <>
            <Head>
                <title>CGV | Editor</title>
                <meta name="description" content=""></meta>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <div className="d-flex responsive-flex-direction" style={{ width: "100vw", height: "100vh" }}>
                <ShapeEditor changes={changes} />
                <div className="d-flex flex-column flex-basis-0 flex-grow-1">
                    <textarea
                        style={{ resize: "none", outline: 0 }}
                        value={text}
                        spellCheck={false}
                        onChange={(e) => setText(e.target.value)}
                        className="overflow-auto p-3 flex-basis-0 h3 mb-0 text-light border-0 bg-dark flex-grow-1"
                    />
                    <div
                        className="overflow-auto p-3 flex-basis-0 h3 mb-0 bg-black flex-grow-1"
                        style={{ whiteSpace: "pre-line", maxHeight: 300 }}>
                        {error == null ? (
                            changes == null ? (
                                <span className="text-primary">loading ...</span>
                            ) : (
                                <span className="text-success">ok</span>
                            )
                        ) : (
                            <span className="text-danger">{error}</span>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
