import {
    TypeInfo,
    visit,
    visitWithTypeInfo,
    isLeafType,
    GraphQLList,
} from "graphql"

import { Expr } from "faunadb"
import { isFaunaObjectType } from "./isFunaObjectType"
import { query as q } from "faunadb-fql-lib"

// For some reason using '_' as var does not play well. Is there some internal Fauna issue with that? Or is it reserved in Lambda as "not in use"?
const CURRENT_DOC = "__CD__"
const CURRENT_DOC_VAR = q.Var(CURRENT_DOC)

const nestedQuery = (query, field, fieldObj, isList) => {
    if (isList) return q.Map(query, q.Lambda(CURRENT_DOC, fieldObj))
    return q.Let(
        {
            [CURRENT_DOC]: query,
        },
        fieldObj
    )
}

const defaultEmbedQuery = (fieldName, isList) => {
    return q.Let(
        {
            ref: q.Select(["data", `${fieldName}Ref`], CURRENT_DOC_VAR, null),
        },
        q.If(q.IsNull(q.Var("ref")), null, q.Get(q.Var("ref")))
    )
}

const generateSelector = (name, field, leaf = true) => {
    if (field.fqlQuery) return [name, field.fqlQuery(CURRENT_DOC_VAR, q)]
    if (leaf) {
        if (name === "id" || name === "ref")
            return [name, q.Select(["ref"], CURRENT_DOC_VAR, null)]
        if (name === "ts")
            return [name, q.Select(["ts"], CURRENT_DOC_VAR, null)]
    }
    return [name, q.Select(["data", name], CURRENT_DOC_VAR, null)]
}

const generateParseFn = (typeInfo, fieldName) => node => {
    const name = node.name.value
    const type = typeInfo.getType()
    const field = typeInfo.getFieldDef()
    if (!type && !field) {
        console.log(node)
        throw new Error(`No field ${name}`)
    }
    const isList = type instanceof GraphQLList
    // @ts-ignore
    const typeInList = isList ? type.ofType : null
    const isLeaf = isLeafType(type) || isLeafType(typeInList)
    const isRoot = name === fieldName
    const returnName = isRoot ? "rootFQL" : name

    return {
        name,
        type,
        field,
        isList,
        typeInList,
        isLeaf,
        isRoot,
        returnName,
        selectionSet: node.selectionSet,
        isFaunaObjectType: isFaunaObjectType(typeInList || type),
    }
}

export const astToFaunaQuery = (ast, query) => {
    const { operation, schema, fieldName } = ast
    const typeInfo = new TypeInfo(schema)

    const parseFieldNode = generateParseFn(typeInfo, fieldName)

    const visitor = {
        enter: {
            Field: node => {
                if (!typeInfo.getFieldDef())
                    throw new Error(`No field ${node.name.value} defined`)
            },
        },
        leave: {
            // OperationDefinition:
            // Argument:
            // Name
            SelectionSet: ({ selections, ...rest }) => {
                const fragments = selections.filter(i => i instanceof Expr)
                const maps = selections.filter(i => i instanceof Array)

                const result = maps.reduce(
                    (acc, [key, val]) => ({ ...acc, [key]: val }),
                    {}
                )

                if (fragments.length) {
                    return q.Reduce(
                        q.Lambda(
                            ["acc", "val"],
                            q.Merge(q.Var("acc"), q.Var("val"))
                        ),
                        result,
                        fragments
                    )
                }
                return result
            },
            InlineFragment: node => {
                const type = typeInfo.getType()
                // console.log(node)
                // console.log(node.selectionSet)
                return q.If(
                    // @ts-ignore
                    type.fqlTypeCheck(CURRENT_DOC_VAR, q),
                    node.selectionSet,
                    {}
                )
            },
            Field: node => {
                const {
                    name,
                    field,
                    type,
                    isList,
                    isLeaf,
                    isRoot,
                    isFaunaObjectType,
                    returnName,
                    selectionSet,
                } = parseFieldNode(node)

                if (isLeaf) return generateSelector(returnName, field)
                if (!isFaunaObjectType)
                    return generateSelector(returnName, field, false)

                let nextQuery
                if (isRoot) nextQuery = query
                if (field.fqlQuery)
                    nextQuery = field.fqlQuery(CURRENT_DOC_VAR, q)
                if (!nextQuery) nextQuery = defaultEmbedQuery(name, isList)
                return [
                    returnName,
                    nestedQuery(nextQuery, field, selectionSet, isList),
                ]
            },
        },
    }

    try {
        const res = visit(operation, visitWithTypeInfo(typeInfo, visitor))
        return res.selectionSet.rootFQL
    } catch (err) {
        console.error(err)
        throw err
    }
}
