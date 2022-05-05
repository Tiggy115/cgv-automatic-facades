import { useBaseStoreState } from "../../global"
import { CreateDescriptionDialog } from "./create-description"
import { CreateStepDialog } from "./create-step"
import { SetNameDialog } from "./set-name"

export function Dialogs() {
    const requested = useBaseStoreState((state) => (state.type === "gui" ? state.requested : undefined))
    if (requested == null) {
        return null
    }
    return (
        <div
            className="position-absolute d-flex flex-column align-items-center overflow-hidden"
            style={{ top: 0, right: 0, bottom: 0, left: 0, zIndex: 2, background: "rgba(0,0,0,0.3)" }}>
            <div
                style={{ maxWidth: "40rem", margin: "0 auto" }}
                className="rounded overflow-hidden shadow d-flex flex-column m-3 p-3 w-100 bg-light">
                {selectDialog(requested.type, requested.fulfill)}
            </div>
        </div>
    )
}

function selectDialog(type: string, fullfill: (value: any) => void) {
    switch (type) {
        case "create-step":
            return <CreateStepDialog fulfill={fullfill} />
        case "create-description":
            return <CreateDescriptionDialog fulfill={fullfill} />
        case "set-name":
            return <SetNameDialog fulfill={fullfill} />
    }
}

export * from "./create-step"
