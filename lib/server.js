Counter = function (name, collection, query, options, interval) {
  this.name = name
  this.collection = collection
  this.query = query || {}
  this.options = options || {}
  this.interval = interval || 1000 * 10
  this._collectionName = 'counters-collection'
}

// every cursor must provide a collection name via this method
Counter.prototype._getCollectionName = function () {
  return 'counter-' + this.name
}

// the api to publish
Counter.prototype._publishCursor = async function (sub) {
  const count = await this.collection.countDocuments(this.query, this.options)
  sub.added(this._collectionName, this.name, { count: count })
  const self = this

  const handler = Meteor.setInterval(async function () {
    const count = await self.collection.countDocuments(self.query, self.options)
    sub.changed(self._collectionName, self.name, { count: count })
  }, this.interval)

  sub.onStop(function () {
    Meteor.clearTimeout(handler)
  })

  return {
    stop: sub.onStop.bind(sub)
  }
}

export default { Counter }
