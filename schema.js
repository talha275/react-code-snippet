
const { ApolloServer, gql } = require('apollo-server');

module.exports = gql`
type Product {
  id: Int
  name: String
  description: String
  price: String
  image: String
}
type User {
  id: Int
  firstName: String
  lastName: String
  email: String
  password:String
  userId: Int
}

type Query {
  productsByProductId(id: Int): Product
  productsAgainstUsers(Userid:Int): [Product]!
  AllProducts: [Product]!
  users(id: Int): User
  getAllUsersDetail: [User]!
}
type Mutation {
  login(email: String!, password: String!): User!
  addProduct(name:String,description: String,price: String,image: String): Product!
  updateProducts(id:Int,name:String,description: String,price: String,image: String): Product!
  removeProductByid(id:Int): Product!
  removeAllProducts: Product!
  updateProductImage(id:Int,image:String): Product!
  AttatchProductToRequestingUser(id:Int,userId:Int): Product!
  RemoveProductFromRequestingUser(id:Int,userId:Int): Product!
}
`;