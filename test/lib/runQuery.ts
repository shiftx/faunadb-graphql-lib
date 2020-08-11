import { parse, graphql } from "graphql"
import { parseJSON } from "faunadb/src/_json"
import { generateFaunaQuery } from "../../src/utilities/generateFaunaQuery"
import { schema } from "../schema"
import { query as q } from "faunadb"

const createAstObject = (gqlQuery, fqlQuery = "__testing__") => {
    const document = parse(gqlQuery)
    const data = {}
    document.definitions[0].selectionSet.selections.forEach(field => {
        data[field.alias?.value || field.name.value] = generateFaunaQuery(
            {
                schema,
                operation: document.definitions[0],
                fieldName: field.name.value,
            },
            "__testing__"
            // fqlQuery
        )
    })
    return { data }
    // console.log(document.definitions[0].selectionSet.selections.map())
    // return { schema, operation: document.definitions[0] }
}

export const runQuery = async (gqlQuery, fqlQuery = null) => {
    const res = await graphql(schema, gqlQuery, null, null)
    const fql = createAstObject(gqlQuery, fqlQuery)

    return {
        res: JSON.parse(JSON.stringify(res)),
        fql: parseJSON(JSON.stringify(fql)),
    }
}
