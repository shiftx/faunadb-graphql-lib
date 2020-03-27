import { GraphQLFaunaTimestampType } from "./GraphQLFaunaTimestampType"

describe("GraphQLFaunaTimestampType", () => {
    test("parse with nanoseconds", () => {
        const value = GraphQLFaunaTimestampType.parseValue(
            "2019-01-16T08:17:11.099031Z"
        )
        expect(value).toBe(1547626631099031)
    })

    test("parse with no milliseconds", () => {
        const value = GraphQLFaunaTimestampType.parseValue(
            "2019-01-16T08:17:11.099Z"
        )
        expect(value).toBe(1547626631099000)
    })

    test("parse with no subdigits", () => {
        const value = GraphQLFaunaTimestampType.parseValue(
            "2019-01-16T08:17:11Z"
        )
        expect(value).toBe(1547626631000000)
    })
})
