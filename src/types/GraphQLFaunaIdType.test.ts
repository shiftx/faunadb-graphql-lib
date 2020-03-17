import { GraphQLFaunaIdType } from "./GraphQLFaunaIdType"
import { query as q } from "faunadb"

describe("GraphQLFaunaIdType", () => {
    test("serialize/parse", () => {
        const Type = new GraphQLFaunaIdType({
            name: "Type",
            collection: "Items",
        })
        const parsed = Type.parseValue("123")
        console.log(parsed)

        // const token = [12345, q.Ref(q.Collection("Foos"), "12345")]
        // const string = Type.serialize(token)

        // expect(parsed[0]).toBe(12345)
        // expect(parsed[1].id).toBe("12345")
    })
})
