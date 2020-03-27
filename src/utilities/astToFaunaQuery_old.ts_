import {
    TypeInfo,
    visit,
    visitWithTypeInfo,
    isLeafType,
    GraphQLList,
} from "graphql"

// import { query as q } from "faunadb"
import { query as q } from "faunadb-fql-lib"

const reduceToObject = fields =>
    q.Reduce(
        q.Lambda(["acc", "val"], q.Merge(q.Var("acc"), q.Var("val"))),
        {},
        fields
    )

const nestedQuery = (query, fields, isList) => {
    if (isList) {
        return q.Map(query, q.Lambda("_item_", reduceToObject(fields)))
    } else {
        return q.Let(
            {
                _item_: query,
            },
            reduceToObject(fields)
        )
    }
}

const defaultEmbedQuery = (fieldName, isList) =>
    q.Let(
        {
            ref: q.Select(["data", `${fieldName}Ref`], q.Var("_item_"), null),
        },
        q.If(q.IsNull(q.Var("ref")), null, q.Get(q.Var("ref")))
    )

export const astToFaunaQuery = (ast, query) => {
    const { operation, schema, fieldName } = ast
    const typeInfo = new TypeInfo(schema)

    const visitor = {
        InlineFragment: {
            leave: node => {
                const type = typeInfo.getType()
                return q.If(
                    // @ts-ignore
                    type.fqlTypeCheck(q, q.Var("_item_")),
                    reduceToObject(node.selectionSet.selections),
                    {}
                )
            },
        },
        Field: {
            leave: (node, key, parent, path) => {
                const name = node.name.value
                const type = typeInfo.getType()
                const isLeaf = isLeafType(type)
                const isList = type instanceof GraphQLList

                // If name === fieldName then this is the root.
                if (name === fieldName) {
                    return nestedQuery(
                        query,
                        node.selectionSet.selections,
                        isList
                    )
                } else if (isLeaf) {
                    let selector
                    if (name === "id") {
                        selector = ["ref"]
                    } else if (name === "ts") {
                        selector = ["ts"]
                    } else {
                        selector = ["data", name]
                    }
                    return {
                        [name]: q.Select(selector, q.Var("_item_"), null),
                    }
                } else {
                    const field = typeInfo.getFieldDef()
                    let relQuery
                    // @ts-ignore 2
                    if (field.fql) {
                        // @ts-ignore 2
                        relQuery = field.fql(q)
                    } else {
                        relQuery = defaultEmbedQuery(name, isList)
                    }

                    return {
                        [name]: nestedQuery(
                            relQuery,
                            node.selectionSet.selections,
                            isList
                        ),
                    }
                }
            },
        },
    }

    const res = visit(operation, visitWithTypeInfo(typeInfo, visitor))
    return res.selectionSet.selections[0]
}
