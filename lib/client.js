import { Mongo } from "meteor/mongo";

Counter = {};
Counter.collection = new Mongo.Collection("counters-collection");

Counter.get = function (name) {
  const doc = Counter.collection.findOne(name);
  if (doc) {
    return doc.count;
  }
  return 0;
};

export default { Counter };
