"use strict";
/*
 * commonQuery - commnQuery.js
 * Author: smartData Enterprises
 *
 */

var constant = require("../config/constant");
var mongoose = require("mongoose");
var fs = require("fs");

var path = require("path");
var async = require("async");

var commonQuery = {};

/**
 * Function is use to Fetch Single data
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 22-Jan-2018
 */
commonQuery.fetch_all_salons = function fetch_all_salons(
  model,
  cond = {},
  pageSize,
  page,
  lat,
  long,
  fromTable,
  localFieldVal,
  foreignFieldVal,
  second_fromTable,
  second_localFieldVal,
  second_foreignFieldVal,
  distance,
  name
) {
  return new Promise(function(resolve, reject) {
    let pageSizes = pageSize;
    let currentPage = page;

    let postQuery = model.aggregate([
      { $match: cond },
      {
        $lookup: {
          from: fromTable,
          localField: localFieldVal,
          foreignField: foreignFieldVal,
          as: "salons"
        }
      },
      { $unwind: "$salons" },
      {
        $match: {
          "salons.location": {
            $geoWithin: {
              $centerSphere: [[lat, long], distance / 3963.2]
            }
          }
        }
      },
      {
        $match: {
          "salons.name": new RegExp(name ? name : " ", "gi")
        }
      },
      {
        $lookup: {
          from: second_fromTable,
          localField: second_localFieldVal,
          foreignField: second_foreignFieldVal,
          as: "ratings"
        }
      },
      {
        $project: {
          _id: "$salons._id",
          name: "$salons.name",
          location: "$salons.location",
          address: "$salons.salonaddress",
          contact: "$salons.contact",
          image: "$salons.image",
          avgRatings: { $avg: "$ratings.ratings" }
        }
      }
    ]);

    if (pageSizes && currentPage) {
      postQuery.skip(pageSizes * (currentPage - 1)).limit(pageSizes);
    }
    postQuery
      .then(result => {
       // console.log("999999999999999999999", result);


        resolve(result);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
};

commonQuery.findoneData = async function findoneData(
  model,
  condition,
  fetchVal
) {
  return new Promise(function(resolve, reject) {
    model.findOne(condition, fetchVal, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

commonQuery.findAll = async function findAll(model, condition, pageSize, page) {
  let user = "_id";
  let pageSizes = pageSize;
  let currentPage = page;
  return new Promise(function(resolve, reject) {
    let postQuery = model.find(condition);

    if (pageSizes && currentPage) {
      postQuery.skip(pageSizes * (currentPage - 1)).limit(pageSizes);
    }
    postQuery.exec(function(err, data) {
      if (err) {
        console.log("err---->>>>>", err);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

commonQuery.findoneBySort = function findoneBySort(
  model,
  condition,
  fetchVal,
  sortby
) {
  return new Promise(function(resolve, reject) {
    if (!sortby) {
      sortby = {
        _id: -1
      };
    }
    model
      .findOne(condition, fetchVal)
      .sort(sortby)
      .exec(function(err, data) {
        if (err) {
          console.log("err---->>>>>", err);
          reject(err);
        } else {
          resolve(data);
        }
      });
  });
};
/**
 * Function is use to Last Inserted id
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 22-Jan-2018
 */
commonQuery.lastInsertedId = function lastInsertedId(model) {
  return new Promise(function(resolve, reject) {
    model
      .findOne()
      .sort({
        id: -1
      })
      .exec(function(err, data) {
        if (err) {
          resolve(0);
        } else {
          if (data) {
            var id = data.id + 1;
          } else {
            var id = 1;
          }
        }
        resolve(id);
      });
  });
};
commonQuery.sortAllData = function sortAllData(model, field_name) {
  return new Promise(function(resolve, reject) {
    model
      .find()
      .sort(field_name)
      .exec(function(err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
  });
};
commonQuery.sortAllDataDesc = function sortAllDataDesc(model, field_name) {
  return new Promise(function(resolve, reject) {
    let to_sort = {};
    to_sort[field_name] = -1;
    model
      .find()
      .sort(to_sort)
      .exec(function(err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
  });
};
commonQuery.lastInsertedIdPermissonId = function lastInsertedId(model) {
  return new Promise(function(resolve, reject) {
    model
      .findOne()
      .sort({
        permission_id: -1
      })
      .exec(function(err, data) {
        if (err) {
          resolve(0);
        } else {
          if (data) {
            var id = data.permission_id + 1;
          } else {
            var id = 1;
          }
        }
        resolve(id);
      });
  });
};

/**
 * Function is use to Insert object into Collections
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 22-Jan-2018
 */
commonQuery.InsertIntoCollection = function InsertIntoCollection(model, obj) {
  return new Promise(function(resolve, reject) {
    new model(obj).save(function(err, insertedData) {
      if (err) {
        console.log("errrrrrrrr", err);
        reject(err);
      } else {
        resolve(insertedData);
      }
    });
  });
};
/**
 * Function is use to Update One Document
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 23-Jan-2018
 */
commonQuery.updateOneDocument = function updateOneDocument(
  model,
  updateCond,
  updateData
) {
  return new Promise(function(resolve, reject) {
    model
      .findOneAndUpdate(
        updateCond,
        {
          $set: updateData
        },
        {
          new: true
        }
      )
      .lean()
      .exec(function(err, updatedData) {
        if (err) {
          console.log("errerrerrerrerrerr", err);
          reject(0);
        } else {
          console.log("updatedData", updatedData);
          resolve(updatedData);
        }
      });
  });
};
commonQuery.updateOne = function updateOne(model, updateCond, updateData) {
  return new Promise(function(resolve, reject) {
    model
      .updateOne(updateCond, {
        $set: updateData
      })
      .lean()
      .exec(function(err, updatedData) {
        if (err) {
          console.log("errerrerrerrerrerr", err);
          reject(0);
        } else {
          console.log("updatedData", updatedData);
          resolve(updatedData);
        }
      });
  });
};
/**
 * Function is use to Update One Document
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 23-Jan-2018
 */
commonQuery.updateOneDocumentWithOutInserting = (
  model,
  updateCond,
  updateData
) => {
  return new Promise((resolve, reject) => {
    model
      .findOneAndUpdate(updateCond, {
        $set: updateData
      })
      .exec((err, updatedData) => {
        if (err) {
          console.log(err);
          return reject(0);
        } else {
          return resolve(updatedData);
        }
      });
  });
};

/**
 * Function is use to Update All Document
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 23-Jan-2018
 */
commonQuery.updateAllDocument = function updateAllDocument(
  model,
  updateCond,
  userUpdateData
) {
  return new Promise(function(resolve, reject) {
    model
      .update(
        updateCond,
        {
          $set: userUpdateData
        },
        {
          multi: true
        }
      )
      .lean()
      .exec(function(err, userInfoData) {
        if (err) {
          resolve(0);
        } else {
          resolve(userInfoData);
        }
      });
  });
};
commonQuery.updateMany = function updateMany(
  model,
  updateCond,
  userUpdateData
) {
  return new Promise(function(resolve, reject) {
    model
      .updateMany(updateCond, {
        $set: userUpdateData
      })
      .lean()
      .exec(function(err, userInfoData) {
        if (err) {
          resolve(0);
        } else {
          resolve(userInfoData);
        }
      });
  });
};

/**
 * Function is use to Find all Documents
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 23-Jan-2018
 */
commonQuery.fetch_all = function fetch_all(model, cond = {}, fetchd = {}) {
  return new Promise(function(resolve, reject) {
    model.find(cond, fetchd).exec(function(err, userData) {
      console.log("userData", userData);
      if (err) {
        console.log("errrrrrr", err);
        reject(err);
      } else {
        resolve(userData);
      }
    });
  });
};
commonQuery.fetch_all_by_sort = function fetch_all_by_sort(
  model,
  cond = {},
  fetchd = {}
) {
  return new Promise(function(resolve, reject) {
    model
      .find(cond, fetchd)
      .sort("createdAt")
      .exec(function(err, userData) {
        if (err) {
          console.log("errrrrrr", err);
          reject(err);
        } else {
          resolve(userData);
        }
      });
  });
};
commonQuery.fetch_one = function fetch_one(model, cond = {}, fetchd = {}) {
  return new Promise(function(resolve, reject) {
    model.findOne(cond, fetchd).exec(function(err, userData) {
      if (err) {
        console.log("errrrrrr", err);
        reject(err);
      } else {
        resolve(userData);
      }
    });
  });
};
commonQuery.hard_delete = function hard_delete(model, cond = {}) {
  return new Promise(function(resolve, reject) {
    model.remove(cond).exec(function(err, Data) {
      if (err) {
        console.log("errrrrrr", err);
        reject(err);
      } else {
        console.log("Data", Data);

        resolve(Data);
      }
    });
  });
};
/**
 * Function is use to Find all Distinct value
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 27-June-2018
 */

commonQuery.fetch_all_distinct = function fetch_all_distinct(
  model,
  ditinctVal,
  cond
) {
  return new Promise(function(resolve, reject) {
    model.distinct(ditinctVal, cond).exec(function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

/**
 * Function is use to Count number of record from a collection
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 23-Jan-2018
 */
commonQuery.countData = function countData(model, cond) {
  return new Promise(function(resolve, reject) {
    model.countDocuments(cond).exec(function(err, userData) {
      if (err) {
        reject(err);
      } else {
        resolve(userData);
      }
    });
  });
};
/**
 * Function is use to Fetch All data from collection , Also it supports aggregate function
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 23-Jan-2018
 */
commonQuery.fetchAllLimit = function fetchAllLimit(query) {
  return new Promise(function(resolve, reject) {
    query.exec(function(err, userData) {
      if (err) {
        reject(err);
      } else {
        resolve(userData);
      }
    });
  });
};

/**
 * Function is use to Insert object into Collections , Duplication restricted
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 07-Feb-2018
 */

commonQuery.uniqueInsertIntoCollection = function uniqueInsertIntoCollection(
  model,
  obj
) {
  return new Promise(function(resolve, reject) {
    model
      .update(
        obj,
        {
          $setOnInsert: obj
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        }
      )
      .exec(function(err, data) {
        if (err) {
          resolve(0);
        } else {
          resolve(data);
        }
      });
  });
};

/**
 * Function is use to DeleteOne Query
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 07-Feb-2018
 */
commonQuery.deleteOneDocument = function deleteOneDocument(model, cond) {
  return new Promise(function(resolve, reject) {
    model.deleteOne(cond).exec(function(err, userData) {
      if (err) {
        resolve(0);
      } else {
        resolve(1);
      }
    });
  });
};
/**
 * Function is use to Insert Many object into Collections
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 15-Feb-2018
 */
commonQuery.InsertManyIntoCollection = function InsertManyIntoCollection(
  model,
  obj
) {
  return new Promise(function(resolve, reject) {
    model.insertMany(obj, function(error, inserted) {
      if (error) {
        console.log("---------------------", error);
        resolve(error);
      } else {
        resolve(inserted);
      }
    });
  });
};

/**
 * Function is use to delete Many document from Collection
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 16-Feb-2018
 */
commonQuery.deleteManyfromCollection = function deleteManyfromCollection(
  model,
  obj
) {
  return new Promise(function(resolve, reject) {
    model.deleteMany(obj, function(error, inserted) {
      if (error) {
        console.log("Reject", error);
        resolve(0);
      } else {
        console.log("Resolved");
        reject(1);
      }
    });
  });
};

commonQuery.mongoObjectId = function(data) {
  if (data && data !== null && data !== undefined) {
    return mongoose.Types.ObjectId(data);
  } else {
    return false;
  }
};

/**
 * Function is use to aggregate with match and lookup
 * @access private
 * @return json
 * Created by SmartData
 * @smartData Enterprises (I) Ltd
 * Created Date 27-June-2018
 */

commonQuery.aggregateFunc = function aggregateFunc(
  model,
  fromTable,
  localFieldVal,
  foreignFieldVal,
  condition
) {
  return new Promise(function(resolve, reject) {
    model
      .aggregate([
        {
          $match: condition
        },
        {
          $lookup: {
            from: fromTable,
            localField: localFieldVal,
            foreignField: foreignFieldVal,
            as: "docs"
          }
        }
      ])
      .exec(function(err, data) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(data);
        }
      });
  });
};

commonQuery.salonDetailsFetch = function salonDetailsFetch(
  model,
  fromTable,
  localFieldVal,
  foreignFieldVal,
  condition
) {
  console.log(fromTable, localFieldVal, foreignFieldVal, condition);
  return new Promise(function(resolve, reject) {
    model
      .aggregate([
        { $match: condition
        },
        {
          $lookup: {
            from: "reviewsratings",
            localField: "_id",
            foreignField: "salon_id",
            as: "reviewsratings"
          }
        },
        {
          $lookup: {
            from: "reviewratings",
            let: { salon_id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$salon_id", "$$salon_id"] }]
                  }
                }
              },
              {
                $group: {
                  _id: null,
                  rating: {
                    $first: {
                      $divide: [
                        {
                          $trunc: {
                            $multiply: [
                              {
                                $avg: "$ratings"
                              },
                              100
                            ]
                          }
                        },
                        100
                      ]
                    }
                  }
                }
              }
            ],
            as: "allRating"
          }
        },
        {
          $unwind: {
            path: "$allRating"
          }
        },
        {
          $lookup: {
            from: "services",
            let: { salon_id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ["$salon_id", "$$salon_id"]
                      }
                    ]
                  }
                }
              },
              {
                $group: {
                  _id: { category_id: "$category_id" },
                  services: {
                    $push: {
                      name: "$name",
                      price: "$price",
                      duration: "$duration",
                      id: "$_id"
                    }
                  }
                }
              },
              {
                $lookup: {
                  from: "categories",
                  let: { cat_id: "$_id.category_id" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            {
                              $eq: ["$_id", "$$cat_id"]
                            }
                          ]
                        }
                      }
                    }
                  ],
                  as: "saloncategory"
                }
              },
              {
                $unwind: {
                  path: "$saloncategory"
                }
              },
              {
                $project: {
                  _id: "$_id.category_id",
                  catname: "$saloncategory.catname",
                  services: "$services"
                }
              }
            ],
            as: "category"
          }
        },
        {
          $project: {
            name: 1,
            image: 1,
            address: "$salonaddress",
            location:1,
            opentime: 1,
            closetime: 1,
            contact:1,
            avgRatings: "$allRating.rating",
            categories: "$category"
          }
        }
      ])
      .exec(function(err, data) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(data[0]);
        }
      });
  });
};

commonQuery.doubleLookup = function doubleLookup(
  model,
  fromTable,
  localFieldVal,
  foreignFieldVal,
  condition,
  second_fromTable,
  second_localFieldVal,
  second_foreignFieldVal
) {
  return new Promise(function(resolve, reject) {
    model
      .aggregate([
        {
          $match: condition
        },
        {
          $lookup: {
            from: fromTable,
            localField: localFieldVal,
            foreignField: foreignFieldVal,
            as: "docs"
          }
        },
        {
          $lookup: {
            from: second_fromTable,
            localField: second_localFieldVal,
            foreignField: second_foreignFieldVal,
            as: "dataa"
          }
        }
      ])
      .exec(function(err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
  });
};
commonQuery.getNextSequenceValue = function(sequenceName) {
  return new Promise(function(resolve, reject) {
    let query = {
      _id: sequenceName
    };
    counters
      .findOneAndUpdate(
        query,
        {
          $inc: {
            sequence_value: 1
          }
        },
        {
          new: true
        }
      )
      .lean()
      .exec(function(err, updatedData) {
        if (err) {
          console.log("errerrerrerrerrerr", err);
          reject(0);
        } else {
          console.log("updatedData", updatedData);
          resolve(updatedData);
        }
      });
  });
};

/**
 * Function is use to Fetch all data
 * @access private
 * @return json
 * @smartData Enterprises (I) Ltd
 * 20-jun-2019e 20-jun-2019
 */
commonQuery.findData = function findData(model, cond, fetchVal) {
  return new Promise(function(resolve, reject) {
    let tempObj = {
      status: false
    };
    model.find(cond, fetchVal, function(err, userData) {
      if (err) {
        tempObj.error = err;
        reject(tempObj);
      } else {
        tempObj.status = true;
        tempObj.data = userData;
        resolve(tempObj);
      }
    });
  });
};

commonQuery.fileUpload = function fileUpload(imagePath, buffer) {
  return new Promise((resolve, reject) => {
    try {
      let tempObj = {
        status: false
      };
      fs.writeFile(imagePath, buffer, function(err) {
        if (err) {
          tempObj.error = err;
          reject(err);
        } else {
          tempObj.status = true;
          tempObj.message = "uploaded";
          resolve(tempObj);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
};

commonQuery.fetch_all_paginated_price = function fetch_all_paginated_price(
  model,
  cond = {},
  pageSize,
  page
) {
  return new Promise(function(resolve, reject) {
    let pageSizes = pageSize;
    let currentPage = page;

    let postQuery = model.find(cond).populate("category_id");

    if (pageSizes && currentPage) {
      postQuery.skip(pageSizes * (currentPage - 1)).limit(pageSizes);
    }
    postQuery
      .then(result => {
        console.log(result);
        resolve(result);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
};

commonQuery.fetch_all_paginated = function fetch_all_paginated(
  model,
  cond = {},
  pageSize,
  page
) {
  //console.log("inFETCHALLPAGINATED",model,cond,pageSize.page);
  return new Promise(function(resolve, reject) {
    let pageSizes = pageSize;
    let currentPage = page;
    //  console.log("pageSizes",pageSizes);
    // console.log("currentPage",currentPage);
    if (cond) {
      cond = cond;
    } else {
      cond = {};
    }

    let postQuery = model.find(cond);

    if (pageSizes && currentPage) {
      postQuery.skip(pageSizes * (currentPage - 1)).limit(pageSizes);
    }
    postQuery
      .then(result => {
        console.log(result);
        resolve(result);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
};

commonQuery.multiLookup = function multiLookup(
  model,
  fromTable,
  localFieldVal,
  foreignFieldVal,
  condition,
  second_fromTable,
  second_localFieldVal,
  second_foreignFieldVal,
  third_fromTable,
  third_foreignFieldVal
) {
  return new Promise(function(resolve, reject) {
    model
      .aggregate([
        { $match: condition },

        {
          $lookup: {
            from: fromTable,
            localField: localFieldVal,
            foreignField: foreignFieldVal,
            as: "ratings"
          }
        },
        {
          $lookup: {
            from: second_fromTable,
            localField: second_localFieldVal,
            foreignField: second_foreignFieldVal,
            as: "categories"
          }
        },
        {
          $lookup: {
            from: third_fromTable,
            localField: "categories._id",
            foreignField: third_foreignFieldVal,
            as: "services"
          }
        },
        {
          $group: {
            _id: 0,

            $addToSet: {
              _id: $categories._id,
              name: "$name",
              image: "$image",
              address: "",
              location: "$location",
              categories: {
                $push: { category: "categories.catname", services: $services }
              }
            }
          }
        }
      ])
      // model
      //   .aggregate([
      //     { $match:condition },

      //     {
      //       $lookup: {
      //         from: fromTable,
      //         localField: localFieldVal,
      //         foreignField: foreignFieldVal,
      //         as: "ratings"
      //       }
      //     },
      //     {
      //       $lookup: {
      //         from: second_fromTable,
      //         localField: second_localFieldVal,
      //         foreignField: second_foreignFieldVal,
      //         as: "categories"
      //       }
      //     },
      //     {
      //       $lookup: {
      //         from: third_fromTable,
      //         localField: "categories._id",
      //         foreignField: third_foreignFieldVal,
      //         as: "services"
      //       }
      //     },
      //     {
      //       $project: {
      //         _id: 0,
      //         name: "$name",
      //         image: "$image",
      //         address: "",
      //         location: "$location",
      //         categories: "$categories.catname"
      //       }
      //     }
      //   ])
      .exec(function(err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
  });
};

commonQuery.getSalonsBasedOnRatings = function getSalonsBasedOnRatings(
  model,
  fromTable,
  localFieldVal,
  foreignFieldVal,
  condition
) {
  return new Promise(function(resolve, reject) {
    model
      .aggregate([
        {
          $lookup: {
            from: fromTable,
            localField: localFieldVal,
            foreignField: foreignFieldVal,
            as: "data"
          }
        },
        {
          $unwind: "$data"
        },
        {
          $group: {
            _id: "$data.salon_id",
            avgRatings: { $avg: "$data.ratings" }
          }
        }
      ])
      .exec(function(err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
  });
};

commonQuery.getSalonOnPrice = function getSalonOnPrice() {
  return new Promise(function(resolve, reject) {
    model.find(cond, fetchd).exec(function(err, userData) {
      console.log("userData", userData);
      if (err) {
        console.log("errrrrrr", err);
        reject(err);
      } else {
        resolve(userData);
      }
    });
  });
};

module.exports = commonQuery;
