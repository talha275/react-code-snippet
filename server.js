const express = require("express");
const cors = require("cors");
const config = require("../config/auth.config");
const jwToken = require("jsonwebtoken");
const schema = require('./schema');
const usersController = require("../controllers/users.controller");
const productsController = require("../controllers/products.controller");
const authControler = require('../controllers/auth.controller');
const { errorType, errorName } = require('./constants');
const { ApolloServer, gql } = require('apollo-server');
const { Products } = require("./models");
const typeDefs = schema;

const resolvers = {
        // All Queries Resolvers are initilize here to fetch data from DB
  Query: {
        // Rerutn All Products Against Product Id
        productsByProductId: async (parent, args, context, info)  => {
                const product_code = args.id;
                const product = await userHandler.productById(product_code);
                 
                return {
                  id: product[0].id,
                  name: product[0].name,
                  description: product[0].description,
                  price: product[0].price,
                  image: product[0].image
                }
                     
            },
              // Rerutn All Products Against User Id
      productsAgainstUsers: async (parent, args, context, info)  => {
            const product_code = args.userId;
            const product = await userHandler.ProductAgnUser(product_code);
            return product.map(prod=>{
              return {
              id: prod.id,
              name: prod.name,
              description: prod.description,
              price: prod.price,
              image: prod.image
            }
            })      
        },

        // Return Detail of One User Against its ID
          users: async (parent, args, context, info)  => {
                      const users_id = args.id;
                      const usersDetail = await userHandler.getUser(users_id);
                      return {
                        id: usersDetail.id,
                        firstName: usersDetail.firstName,
                        lastName: usersDetail.lastName,
                        email: usersDetail.email,

                      }         
                  },
            // Return List of All users 
          getAllUsersDetail: async ()  => {
                  const usersDetail = await userHandler.allUsersData();
                  return usersDetail.map(user=>{
                  return {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                  }
                  })                       
              },

              AllProducts: async ()  => {
                const productsDetail = await userHandler.getAllProducts();
                console.log("ProductsDetail", productsDetail)
                return productsDetail.map(prod=>{
                return {
                  id: prod.id,
                  name: prod.name,
                  description: prod.description,
                  price: prod.price,
                  image:prod.image
                }
                })                       
            },
      
        },
              // All Mutations to Post upload and delete data
  Mutation :{
             // Insert Data into Product table
            addProduct: async (parent, args, context, info)  => {
              const products = new Products({
                name:args.name,
                description:args.description,
                price:args.price,
                image:args.image
              })
              const result = await products.save()
              return result;
            },
            AttatchProductToRequestingUser: async (parent, args)  => {
              const product = await userHandler.AttatchProduct(args);
              return product
          },
            // Update Product against Its ID
            updateProducts: async (parent, args)  => {
                    const product = await userHandler.UpdateProuctByID(args);
                    return product   
                },
            // Upload Product Image
            updateProductImage: async (parent, args)  => {
                const product = await userHandler.uploadImage(args);
                return product
            },
           // Delete Product by its ID
            removeProductByid: async (parent, args, context, info)  => {
                    const product_code = args.id;
                    const product = await userHandler.deleteProductById(product_code);
                    return product;   
                },
             RemoveProductFromRequestingUser: async (parent, args, context, info)  => {
                  // const product_code = args.id;
                  const product = await userHandler.RemoveOnRequest(args);
                  return product;   
              },
              
            // Delete All Record of Product Table
            login: async (parent, args, context, info) => {
              const { request, response } = context;
              console.log(args)
              const info1 = await userHandler.signInUser(args);
              if(info1.dataValues.password !== args.password) {
                throw new Error(errorName.PASSWORD_MISMATCH);
              };
              const finalResponse = info1.error ? info1 : { 
                firstName: info1.firstName, 
                id: info1.id
              }
              const token = jwToken.sign({ id: info1.id }, config.secret);
              const options = {
                maxAge: 1000 * 60 * 15 , //expires in 15 minutes
                httpOnly: true, // client can't get cookie by script
                secure: false, // only transfer over http
                sameSite: true, // only sent for requests to the same FQDN as the domain in the cookie
              }
              // Setting the cookie by the name of token in response headers which secure API end points will expect
              // in authorization header of subsequent requests.
              console.log(context)
              // request.res.cookie('token', token, options);
              return finalResponse;
            }
  }
};
            // inilitialize all methods here that are link with there relevent Controller
          const userHandler = {
            getUser(code) {
              return usersController.users(code)
              .then(res=>res)
              .catch(err=>{
                return err
              });;
            },
            allUsersData() {
              return usersController.AllUsers()
              .then(res=>res)
              .catch(err=>{
                return err
              });;
            },
            getAllProducts() {
              return productsController.AllProductsDetail()
              .then(res=>res)
              .catch(err=>{
                return err
              });;
            },
            signInUser(data) {
              return authControler.signin(data)
              .then(res=>res)
              .catch(err=>{
                console.log("THE ERROR FROM LOGGED IN USER IS", err);
                return err
              });
            },
            getProduct(id) {
              return productsController.products(id)
              .then(res=>res)
              .catch(err=>{
                return err
              });
            },
            productById(id) {
              console.log("Function Call")
              return productsController.Allproducts(id)
              .then(res=>res)
              .catch(err=>{
                return err
              });
            },
            ProductAgnUser(id) {
              console.log("Function Call")
              return productsController.AllProductsAgainstUsers(id)
              .then(res=>res)
              .catch(err=>{
                return err
              });
            },
            
            UpdateProuctByID(obj) {
              return productsController.updateProduct(obj)
              .then(res=> {return res})
              .catch(err=>{
                return err
              });
              console.log(req);
            },
            AttatchProduct(obj) {
              return productsController.AttatchProdToRequestinguser(obj)
              .then(res=> {return res})
              .catch(err=>{
                return err
              });
              console.log(req);
            },

            
            uploadImage(obj){
              return productsController.UploadProductImage(obj)
              .then(res=> {return res})
              .catch(err=>{
                return err
              });
            },

            deleteProductById(id) {
              return productsController.deleteProductById(id)
              .then(res=>{res
                return res;
                }
                )
              .catch(err=>{
                return err
              });
              console.log(req);
            },
            RemoveOnRequest(obj) {
              return productsController.RemoveProduct(obj)
              .then(res=>{res
                return res;
                }
                )
              .catch(err=>{
                return err
              });
              console.log(req);
            },

            
    

            AddProduct(data) {
              return productsController.addProduct(data)
              .then(res=>{return res})
              .catch(err=>{
                console.log("THE ERROR FROM LOGGED IN USER IS", err);
                return err
              });
            }
          }
          const server = new ApolloServer({ typeDefs, resolvers });
          const getErrorCode = errorName => {
            return errorType[errorName]
          }
          const app = express();
          app.use(cors());

          server.listen().then(({ url }) => {
            console.log(`🚀  Server ready at ${url}`);
        });
              
