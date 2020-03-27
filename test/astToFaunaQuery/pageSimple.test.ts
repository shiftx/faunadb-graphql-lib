import { runQuery } from "../lib/runQuery"

test("readPostWithId", async () => {
    const query = /* GraphQL */ `
        query {
            posts: pagePosts(size: 1) {
                previous
                next
                page {
                    id
                    ts
                }
            }
        }
    `
    const { fql, res } = await runQuery(query)
    expect(fql.data.posts.let[0]).toStrictEqual({ __CD__: "__testing__" })
    expect(res.data.posts.previous).toBeNull()
    expect(res.data.posts.next).toBeDefined()
    expect(res.data.posts.page).toHaveLength(1)
    expect(res.data.posts.page[0].id).toBe("1")
})
