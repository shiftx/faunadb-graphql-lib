import { GraphQLFaunaIdType } from "./GraphQLFaunaIdType"

describe("GraphQLFaunaIdType", () => {
    test("serialize/parse", () => {
        const Type = new GraphQLFaunaIdType({
            name: "Type",
            collection: "Items",
        })
        const parsed = Type.parseValue("123")
        const cleaned = JSON.parse(JSON.stringify(parsed))
        expect(cleaned.id).toBe("123")
    })
})
