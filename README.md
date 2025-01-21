Meteor Publish Performant Counts
================================

A package to help you publish the count of a cursor in near real time.  Interval based counting suitable for very large collections and high user load.

## Upgrade to Meteor 3

There is a new signature for Meteor 3 version. Instead of the full cursor you need to pass in the collection object, followed by the query and options parameters.

From this:
```js
new Counter('countCollection', Collection.find({}, { sort: { createdAt: 1 } }));
```

You go to this:
```js
new Counter('countCollection', Collection, {}, { sort: { createdAt: 1 } });
```

This is because internally we are switching to the more performant `countDocuments` method which is also async.

## Counter API

```
new Counter(name, collection, [query, options, updateInterval])
```

`name` is a string used to fetch the count of the count

`collection` the collection object

**Optional parameters:**

`query` defaults to `{}`, the query to limit the search

`options` defaults to `{}`, options for `countDocuments`

`updateInterval` defaults to 10000, which will update the count every 10 seconds.


## Publish from Server


### Publish scoped counts

Counts that are specific to a user or parameter must be declared within the publish function.  This will create 1 counter for each user who subscribes.


```js
Meteor.publish('countPublish', function(someValue) {
  return new Counter('countCollection', CountCollection, {
  	userId:this.userId,
  	someField:someValue
  });
});
```

### Server scoped counts

Server scoped counts that are defined outside of publish functions are more efficient that specific counts as it only creates 1 counter per server.

```js
var counter = new Counter('countCollection', Collection);

Meteor.publish('countPublish', function() {
  return counter;
});
```


## Subscribe from client

Subscribe to the publication from client side code.

```js
Meteor.subscribe('countPublish');
```

## Blaze Usage

Define a global helper

```js
UI.registerHelper("getCount", function(name) {
	if(name)
      return Counter.get(name);
});
```


Call from within a template

```handlebars
...
{{getCount 'countCollection'}}
...
```

Credits
=======

Inspired by [publish-counts](https://github.com/percolatestudio/publish-counts) which is great, but does run into performance issues with large collections

Performant solution derived directly from [bullet-counter](https://github.com/bulletproof-meteor/bullet-counter/tree/solution)


License
=======
MIT
