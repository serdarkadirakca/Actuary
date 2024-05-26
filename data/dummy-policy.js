const policyCasco = require("../models/policy-casco");
const policyTraffic = require("../models/policy-traffic");
const policyDask = require("../models/policy-dask");
const policyProperty = require("../models/policy-property");
const policyHealth = require("../models/policy-health");
const policyOther = require("../models/policy-other");

async function policyDummyData(){

    // policyCasco.insertMany([
    //     { policy:"65fd6e876966c8c94d16cbae",plate:"34FHL213",chassis:"a31268546214215612"}
    // ]);

    // policyTraffic.insertMany([
    //     { policy:"65fd6e876966c8c94d16cbae",plate:"34FHL213",chassis:"a31268546214215612"}
    // ]);

    // policyDask.insertMany([
    //     { policy:"65fd6e876966c8c94d16cbae",deed:"12632452",address:"Ümraniye,Kireçfırını,352"}
    // ]);

    // policyProperty.insertMany([
    //     { policy:"65fd6e876966c8c94d16cbae",deed:"12632452",address:"Ümraniye,Kireçfırını,352"}
    // ]);

    // policyHealth.insertMany([
    //     { policy:"65fd6e876966c8c94d16cbae",sgk:"16425518"}
    // ]);

    // policyOther.insertMany([
    //     { policy:"65fd6e876966c8c94d16cbae",invoice:"1258556342",order:"4621421561"}
    // ]);
}
module.exports = policyDummyData;