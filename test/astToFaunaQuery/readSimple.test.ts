import { runQuery } from "../lib/runQuery"

describe("read", () => {
    test("readPostWithId", async () => {
        const query = /* GraphQL */ `
            query {
                readPost(id: "1") {
                    id
                }
            }
        `
        const { fql, res } = await runQuery(query)
        expect(res.data.readPost.id).toBe("1")
        expect(fql.data.readPost.let[0].__CD__).toBe("__testing__")
        expect(fql.data.readPost.in.object.id.from.var).toBe("__CD__")
        expect(fql.data.readPost.in.object.id.select).toStrictEqual(["ref"])
    })

    test("readPostWithArray", async () => {
        const query = /* GraphQL */ `
            query {
                readPost(id: "1") {
                    id
                    tags
                }
            }
        `
        const { res } = await runQuery(query)

        expect(res.data.readPost.id).toBe("1")
        expect(res.data.readPost.tags).toStrictEqual(["foo", "bar"])
    })

    test("readPostWithObject", async () => {
        const query = /* GraphQL */ `
            query {
                readPost(id: "1") {
                    id
                    coordinates {
                        x
                        y
                    }
                }
            }
        `
        const { res } = await runQuery(query)

        expect(res.data.readPost.id).toBe("1")
        expect(res.data.readPost.coordinates.x).toBe(1)
        expect(res.data.readPost.coordinates.y).toBe(2)
    })

    test("readPostWithNestedFaunaRelations", async () => {
        const query = /* GraphQL */ `
            query {
                readPost(id: "1") {
                    id
                    author {
                        id
                        name
                        email
                        posts(size: 1) {
                            next
                            previous
                            page {
                                id
                                title
                            }
                        }
                    }
                }
            }
        `
        const { res } = await runQuery(query)
        expect(res.data.readPost.id).toBe("1")
        expect(res.data.readPost.author.id).toBe("1")
        expect(res.data.readPost.author.name).toBe("Foo Bar")
        expect(res.data.readPost.author.email).toBe("foo@bar.com")
        expect(res.data.readPost.author.posts.page[0].title).toBe("Test post 1")
    })

    test("readPostWithNestedInterface", async () => {
        const query = /* GraphQL */ `
            query {
                readPost(id: "1") {
                    id
                    attachments(size: 1) {
                        previous
                        next
                        page {
                            id
                            ts
                            kind
                            ... on FileType {
                                file
                            }
                            ... on NoteType {
                                text
                            }
                        }
                    }
                }
            }
        `
        const { res } = await runQuery(query)
        expect(res.data.readPost.id).toBe("1")
        expect(res.data.readPost.attachments.page[0].file).toBe("foo.pdf")
        expect(res.data.readPost.attachments.page[1].text).toBe(
            "Lorem Ipsum..."
        )
    })
})
