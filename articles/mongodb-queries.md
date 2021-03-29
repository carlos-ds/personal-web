---
layout: layouts/article-layout.njk
title: 'Helpful MongoDB queries'
date: 2021-03-21
tags: ['article', 'featured']
preview: 'Keeping these close can come in handy.'
description: 'An overview of simple yet extremely handy MongoDB queries I keep in my notebook'
containsCodeSnippet: true
---

# {{ title }}

When I started working with MongoDB, I decided to keep helpful queries in a notebook. Maybe you'll find some of them handy too. Let's dive in!

## db.isMaster

Almost daily, I find myself manipulating data on one of our test environments. However, in our set-up, we can only write to the **primary instance** in our **replica set**.

That's where <code class="inline-code">db.isMaster()</code> comes into play. The returned document contains the address of the primary member of the replica set. Then I connect to that member and work my magic, all error-free!

## Getting all keys from a collection

While <code class="inline-code">distinct</code> gets the distinct values for a specific key, there is no standardized way of getting all the keys that exist within a collection. As usual, [Stackoverflow](https://stackoverflow.com/questions/2298870/get-names-of-all-keys-in-the-collection) had the answer:

<pre>
<code class="language-javascript">
db.collection.aggregate([
  {"$project":{"arrayofkeyvalue":{"$objectToArray":"$$ROOT"}}},
  {"$unwind":"$arrayofkeyvalue"},
  {"$group":{"_id":null,"allkeys":{"$addToSet":"$arrayofkeyvalue.k"}}}
])
</code>
</pre>

This query leverages the power of the aggregation framework: processing data by sequentially applying different operations to it. Let's break it down to see how it works.

Assume we want to get all the keys from the following data set:

<pre>
<code class="language-javascript">
[
  {
    "_id": ObjectId("5a934e000102030405000000"),
    "name": "Winter T-shirt",
    "size": "L",
  },
  {
    "_id": ObjectId("5a934e000102030405000001"),
    "name": "Fleece sweater",
    "brand": "Zelia",
  },
  {
    "_id": ObjectId("5a934e000102030405000002"),
    "name": "Jeans",
    "color": "grey",
  }
]
</code>
</pre>

In step 1, the <code class="inline-code">objectToArray</code> method is used to create an array of documents (1 for each original document). Every document in this new array has an <code class="inline-code">id</code> and <code class="inline-code">arrayofkeyvalue</code>, which contains two keys (<code class="inline-code">k</code> and <code class="inline-code">v</code>) per key-value pair in the original data.

**Query (step 1):**

<pre>
<code class="language-javascript">
db.collection.aggregate([
  {
    "$project": {
      "arrayofkeyvalue": {
        "$objectToArray": "$$ROOT"
      }
    }
  }
])
</code>
</pre>

**Output (step 1):**

<pre>
<code class="language-javascript">
[
  {
    "_id": ObjectId("5a934e000102030405000000"),
    "arrayofkeyvalue": [
      {
        "k": "_id",
        "v": ObjectId("5a934e000102030405000000")
      },
      {
        "k": "name",
        "v": "Winter T-shirt"
      },
      {
        "k": "size",
        "v": "L"
      }
    ]
  },
  {
    "_id": ObjectId("5a934e000102030405000001"),
    "arrayofkeyvalue": [
      {
        "k": "_id",
        "v": ObjectId("5a934e000102030405000001")
      },
      {
        "k": "name",
        "v": "Fleece sweater"
      },
      {
        "k": "brand",
        "v": "Zelia"
      }
    ]
  },
  {
    "_id": ObjectId("5a934e000102030405000002"),
    "arrayofkeyvalue": [
      {
        "k": "_id",
        "v": ObjectId("5a934e000102030405000002")
      },
      {
        "k": "name",
        "v": "Jeans"
      },
      {
        "k": "color",
        "v": "grey"
      }
    ]
  }
]
</code>
</pre>

In the next step, the output of step 1 is flattened with <code class="inline-code">unwind</code> into an array of documents that has the size of the amount of existing keys.

**Query (step 2):**

<pre>
<code class="language-javascript">
db.collection.aggregate([
  {
    "$project": {
      "arrayofkeyvalue": {
        "$objectToArray": "$$ROOT"
      }
    }
  },
  {
    "$unwind": "$arrayofkeyvalue"
  }
])
</code>
</pre>

**Output (step 2):**

<pre>
<code class="language-javascript">
[
  {
    "_id": ObjectId("5a934e000102030405000000"),
    "arrayofkeyvalue": {
      "k": "_id",
      "v": ObjectId("5a934e000102030405000000")
    }
  },
  {
    "_id": ObjectId("5a934e000102030405000000"),
    "arrayofkeyvalue": {
      "k": "name",
      "v": "Winter T-shirt"
    }
  },
  {
    "_id": ObjectId("5a934e000102030405000000"),
    "arrayofkeyvalue": {
      "k": "size",
      "v": "L"
    }
  },
  {
    "_id": ObjectId("5a934e000102030405000001"),
    "arrayofkeyvalue": {
      "k": "_id",
      "v": ObjectId("5a934e000102030405000001")
    }
  },
  {
    "_id": ObjectId("5a934e000102030405000001"),
    "arrayofkeyvalue": {
      "k": "name",
      "v": "Fleece sweater"
    }
  },
  {
    "_id": ObjectId("5a934e000102030405000001"),
    "arrayofkeyvalue": {
      "k": "brand",
      "v": "Zelia"
    }
  },
  {
    "_id": ObjectId("5a934e000102030405000002"),
    "arrayofkeyvalue": {
      "k": "_id",
      "v": ObjectId("5a934e000102030405000002")
    }
  },
  {
    "_id": ObjectId("5a934e000102030405000002"),
    "arrayofkeyvalue": {
      "k": "name",
      "v": "Jeans"
    }
  },
  {
    "_id": ObjectId("5a934e000102030405000002"),
    "arrayofkeyvalue": {
      "k": "color",
      "v": "grey"
    }
  }
]
</code>
</pre>

See how we're getting there? In the last step, we're adding all the <code class="inline-code">k</code> values (meaning: the keys from the original data) to a set using <code class="inline-code">addToSet</code>.

If you're not familiar with a set, just think of it (for our use case) as a deduplicated array.

**Query (step 3):**

<pre>
<code class="language-javascript">
db.things.aggregate([
  {"$project":{"arrayofkeyvalue":{"$objectToArray":"$$ROOT"}}},
  {"$unwind":"$arrayofkeyvalue"},
  {"$group":{"_id":null,"allkeys":{"$addToSet":"$arrayofkeyvalue.k"}}}
])
</code>
</pre>

**Output (step 3):**

<pre>
<code class="language-javascript">
[
  {
    "_id": null,
    "allkeys": [
      "name",
      "size",
      "color",
      "brand",
      "_id"
    ]
  }
]
</code>
</pre>

Easy, right?

## Querying dates

At the start of working with MongoDB, one of the hardest things was querying for dates. Not just because I wasn't yet accustomed to the date format, but I also found myself confused between <code class="inline-code">lt</code> (less than, which I seemed to often confuse for "larger than") and <code class="inline-code">gt</code> (greater than).

That's why this simple example will live forever in my notebook:

<pre>
<code class="language-javascript">
db.collection.find({
  "created": { $lt: new ISODate("2020-03-11T18:00:00Z") }
})
</code>
</pre>

## Finding arrays with a minimum size

The MongoDB **$size** operator has an **important limitation**: you can only use it to query for equality. However, you can harness array indexes just like in Javascript.

If for example you want to query for a document that has at least 5 values (mind the zero-based indexing!) in the tasks array:

<pre>
<code class="language-javascript">
db.collection.find({
  "tasks.4": {$exists: true}
})
</code>
</pre>

## Final notes on MongoDB

After a couple of years of working with and learning about MongoDB, I find it incredibly efficient and enjoyable. The [documentation](https://docs.mongodb.com/) is top-notch, [MongoDB university](https://university.mongodb.com/) provides excellent courses and managed tools such as [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) are great and they have a nice free tier too!

To get the most out of it, I use:

- [Robo3T](https://robomongo.org/), formerly known as Robomongo, for manual data validation and executing scripts. It's rather minimal and thus dead simple to work with.
- [MongoDB Compass](https://www.mongodb.com/products/compass) for creating and debugging aggregation queries or whenever I need a bit more than what Robo3T offers.

_Note: I'm not sponsored or endorsed by MongoDB in any way._
