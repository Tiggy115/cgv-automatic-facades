import { of } from "rxjs"
import { Operation, operation, thisParameter } from "../.."

function computeSum(values: Array<number>) {
    return of([values.reduce<number>((prev, cur) => prev + cur, 0)])
}

const sum: Operation<number> = (clone, parameters) => (changes) =>
    changes.pipe(operation(computeSum, (values) => values, clone, [thisParameter, ...parameters]))

export const operations = {
    sum,
}
