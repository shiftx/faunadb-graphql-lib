import { runQuery } from "../lib/runQuery"

test("readPostWithId", async () => {
    const query = /* GraphQL */ `
        query {
            foo: readPost(id: "1") {
                id
            }
            bar: readPost(id: "2") {
                id
            }
        }
    `
    const { fql, res } = await runQuery(query)

    expect(res.data.foo.id).toBe("1")
    expect(res.data.bar.id).toBe("2")
    expect(fql.data.foo.let[0].__CD__).toBe("__testing__")
    expect(fql.data.foo.in.object.id.from.var).toBe("__CD__")
    expect(fql.data.foo.in.object.id.select).toStrictEqual(["ref"])
})
