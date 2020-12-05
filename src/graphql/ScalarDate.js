const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const ScalarDate = new GraphQLScalarType({
    name: 'Date',
    description: 'A Date type in GraphQL as a scalar',
    serialize(value) {
        return new Date(+value).toISOString();
    },
    parseValue(value) {
        const dateValue = new Date(value).getTime();
        return Number.isNaN(dateValue) ? null : dateValue;
    },
    parseLiteral(ast) {
        if(ast.kind === Kind.INT) {
            const value = parseInt(ast.value, 10);
            const dateValue = new Date(value).getTime();
            return Number.isNaN(dateValue) ? null : dateValue;
        } else {
            const value = ast.value;
            const dateValue = new Date(value).getTime();
            return Number.isNaN(dateValue) ? null : dateValue;
        } 
    },
});

module.exports = ScalarDate;
