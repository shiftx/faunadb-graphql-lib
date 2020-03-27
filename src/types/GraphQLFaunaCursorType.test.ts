import { query as q } from "faunadb"
import { GraphQLFaunaCursorType } from "./GraphQLFaunaCursorType"

describe("GraphQLFaunaCursorType", () => {
    test("serialize/parse", () => {
        const token = [12345, q.Ref(q.Collection("Foos"), "12345")]
        const string = GraphQLFaunaCursorType.serialize(token)
        const parsed = GraphQLFaunaCursorType.parseValue(string)

        expect(parsed[0]).toBe(12345)
        expect(parsed[1].id).toBe("12345")
    })
})
