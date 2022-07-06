var db = require('../config/connection')
var collection= require('../config/collections')
const bcrypt = require('bcrypt')
const { default: Swal } = require('sweetalert2')

module.exports={
    adminSignup:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            adminData.Password = await bcrypt.hash(adminData.Password,10)
            db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminData).then((data)=>{
                resolve(data.insertedId)
            })
        })
    },
    adminLogin:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            try{

                let loginStatus = false
                let response={}
                let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({Email:adminData.Email})
                if(admin){
                    bcrypt.compare(adminData.Password,admin.Password).then((status)=>{
                        console.log(status)
                        if(status){
                            response.admin = admin
                            response.status = true
                            resolve(response)
                        }else{
                            resolve({status:false})
                        }
                    })
                }else{
                    resolve({status:false})
                }
            }catch(err){
                console.log(err)
            }

        })
    }
}