import { GraphQLScalarType } from "graphql"

const digitsFromInt = int => {
    return Math.floor(Math.log10(int) + 1)
}

const intToNanoUnix = int => {
    const digits = digitsFromInt(int)
    switch (digits) {
        case 16:
            return int
        case 13:
            return int * 1000
        case 10:
            return int * 1000000
        default:
            throw new Error("Unsupported unix timestamp digit length")
    }
}

const toISO8601StringWithNanoseconds = int => {
    const digits = digitsFromInt(int)
    let date
    let remainder
    let millis = true
    switch (digits) {
        case 16:
            date = new Date(int / 1000)
            remainder = int % 1000
            break
        case 13:
            date = new Date(int)
            break
        case 10:
            date = new Date(int * 1000)
            millis = false
            break
        default:
            throw new Error("Unsupported unix timestamp digit length")
    }

    let string = date.toISOString().slice(0, -5)
    if (millis) string += `.${date.getUTCMilliseconds()}${remainder}`
    string += "Z"
    return string
}

const fromISO8601StringWithNanoseconds = string => {
    const match = string.match(/\.(\d+)Z$/)
    const subSeconds = match ? match[1] : "000000"
    const unixSeconds = Math.floor(Date.parse(string) / 1000)
    return Number(`${unixSeconds}${subSeconds.padEnd(6, "0")}`)
}

export const GraphQLFaunaTimestampType = new GraphQLScalarType({
    name: "GraphQLFaunaTimestampType",
    serialize(val) {
        return toISO8601StringWithNanoseconds(val)
    },
    parseValue(val) {
        if (Number.isInteger(val)) return intToNanoUnix(val)
        return fromISO8601StringWithNanoseconds(val)
    },
})
