import {useCallback, useMemo, useState} from "react"
import {useBaseStore} from "../../global"
import {CheckIcon} from "../../icons/check"
import {CloseIcon} from "../../icons/close"
import {useViewerState} from "../../domains/shape/viewer/state";

export function SelectFacade({
                                 fulfill,
                                 data,
                             }: {
    fulfill: (value: any) => void
    data?: { suffix: string }
}) {
    const store = useBaseStore()
    const [value, setValue] = useState("")
    const valueValid = useMemo(() => {
        if (value.length === 0) {
            return false
        }
        const state = store.getState()
        return state.type != "gui" || Object.keys(state.grammar).includes(value)
    }, [value])
    const submit = useCallback(
        (value: string) => {
            if (fulfill == null) {
                return
            }


            useViewerState.setState({
                facadeName: value,
                store,
                selectFacade: true
            })
            //store.getState().createNoun(value)
            fulfill(`${value}${data?.suffix ?? ""}`)
        },
        [fulfill, data?.suffix]
    )
    return (
        <>
            <input
                onKeyDown={(e) => e.key === "Enter" && submit(value)}
                autoFocus
                type="text"
                className="form-control form-control-sm mb-3"
                onChange={(e) => setValue(e.target.value)}
                value={value}
                placeholder="Description name"
            />
            <div className="d-flex flex-row align-items-center justify-content-end">
                <button
                    className="d-flex align-items-center ms-3 btn btn-sm btn-outline-secondary"
                    onClick={store.getState().cancelRequest}>
                    <CloseIcon/>
                </button>

                <button
                    className="d-flex align-items-center ms-3 btn btn-sm btn-outline-secondary"
                    onClick={() => submit(value)}
                    disabled={valueValid}>
                    <CheckIcon/>
                </button>
            </div>
        </>
    )
}

