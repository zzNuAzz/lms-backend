const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const ScalarDate = new GraphQLScalarType({
    name: 'Date',
    description: 'A Date() type in GraphQL as a scalar',
    serialize(value) {
        return new Date(+value).toISOString();
    },
    parseValue(value) {
        // const dateValue = new Date(value);
        // return Number.isNaN(dateValue) ? null : dateValue;
        console.log('parse value, scalar date');
    },
    parseLiteral(ast) {
        // if (ast.kind === Kind.INT) {
        //     const dateValue = new Date(ast.value);
        //     return Number.isNaN(dateValue) ? undefined : dateValue;
        // }
        // return undefined;
        console.log('parse literal, scalar date');
    },
});

module.exports = ScalarDate;
