const hashNode = function (key = null, value = null, nextNode = null) {
  return { key, value, nextNode };
};

const hashMap = function () {
  let capacity = 16;
  let loadFactorTreshold = 0.75;
  let buckets = [];
  let currentCount = 0;

  let isGrowing; //its just a flag for alerting about clears

  //I didn't see a use for this considering
  //it basically tests our hash function which is our only source of indexes in this case.

  // function _checkIndexBounds(index) {
  //   if (index < 0 || index >= buckets.length) {
  //     throw new Error("Trying to access index out of bounds");
  //   }
  // }

  function _hash(key) {
    let hashCode = 0;
    const primeNumber = 31;

    for (let i = 0; i < key.length; i++) {
      hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % capacity;
    }
    return hashCode;
  }

  function _grow() {
    isGrowing = true;

    const oldBuckets = buckets;
    capacity *= 2;
    clear();

    for (let i = 0; i < oldBuckets.length; i++) {
      let node = oldBuckets[i];
      while (node) {
        const nextNode = node.nextNode;
        node.nextNode = null;

        set(node.key, node.value);
        node = nextNode;
      }
    }
    console.log("hashMap grown!");

    isGrowing = false;
  }

  function set(key, value, currentNode = buckets[_hash(key)]) {
    const loadFactorAfterAdding = (currentCount + 1) / capacity;
    const isTresholdReached = loadFactorAfterAdding > loadFactorTreshold;
    let newIndex = _hash(key);

    ////check if key exists
    //at head
    if (currentNode && currentNode.key === key) {
      currentNode.value = value;
      console.log("Node updated!");
      return;
    }
    //deeper
    if (currentNode && currentNode.key !== key) {
      //if end of tail create new node if there is room
      if (!isTresholdReached && !currentNode.nextNode) {
        currentNode.nextNode = new hashNode(key, value);
        currentCount++;
        console.log("Node added!");
        return;
      }
      return set(key, value, currentNode.nextNode);
    }

    //not found, so check if time to grow and update hash
    if (isTresholdReached) {
      _grow();
      newIndex = _hash(key);
      return set(key, value, buckets[newIndex]);
    }
    // else just create new
    buckets[newIndex] = new hashNode(key, value);
    currentCount++;
    console.log("Node added!");
  }

  function get(key, currentNode = buckets[_hash(key)]) {
    if (!currentNode) return null;

    const isEnd = !currentNode.nextNode;
    const isKeyMismatch = currentNode.key !== key;

    if (currentNode.key === key) {
      console.log(`Value found: ${currentNode.value}`);
      return currentNode.value;
    }

    if (!isEnd && isKeyMismatch) {
      return get(key, currentNode.nextNode);
    }

    return null;
  }

  function has(key, currentNode = buckets[_hash(key)]) {
    if (!currentNode) return false;

    const isEnd = !currentNode.nextNode;
    const isKeyMismatch = currentNode.key !== key;

    if (currentNode.key === key) {
      console.log("Key found, value is:");
      console.log(currentNode.value);
      return true;
    }

    if (!isEnd && isKeyMismatch) {
      return has(key, currentNode.nextNode);
    }

    return false;
  }

  function remove(key, currentNode = buckets[_hash(key)], prevNode = null) {
    if (!currentNode) return false;

    if (prevNode && currentNode.key === key) {
      prevNode.nextNode = currentNode.nextNode;
      console.log("Node was removed!");
      return true;
    }

    if (!prevNode && currentNode.key === key) {
      buckets[_hash(key)] = currentNode.nextNode;
      console.log("Node was removed!");
      return true;
    }

    if (currentNode.nextNode && currentNode.key !== key) {
      return remove(key, currentNode.nextNode, currentNode);
    }

    return false;
  }

  // I guess this ended up being pointless hehhehh
  function lengthRecursive(currentNode = null) {
    //if recursive end hit
    if (currentNode && !currentNode.nextNode) {
      return 1;
    }

    //if not recursive end hit, count current and go deeper
    if (currentNode && currentNode.nextNode) {
      return 1 + length(currentNode.nextNode);
    }

    //if start of counting process
    if (!currentNode) {
      let total = 0;

      for (const node of buckets) {
        if (!node) continue;
        total += length(node);
      }

      return total;
    }

    return 0;
  }

  function length() {
    console.log(`hashMap length is ${currentCount}.`);
    return currentCount;
  }

  function clear() {
    buckets = new Array(capacity);
    currentCount = 0;

    if (!isGrowing) console.log("hashMap cleared!");
  }

  function keys() {
    let keys = [];

    for (let i = 0; i < capacity; i++) {
      let node = buckets[i];
      while (node) {
        keys.push(node.key);
        node = node.nextNode;
      }
    }
    console.log("Keys:");
    console.log(keys);
    return keys;
  }

  function values() {
    let values = [];

    for (let i = 0; i < capacity; i++) {
      let node = buckets[i];
      while (node) {
        values.push(node.value);
        node = node.nextNode;
      }
    }
    console.log("Values:");
    console.log(values);
    return values;
  }

  function entries() {
    let entries = [];

    for (let i = 0; i < capacity; i++) {
      let node = buckets[i];
      while (node) {
        entries.push([node.key, node.value]);
        node = node.nextNode;
      }
    }
    console.log("Entries:");
    console.log(entries);

    return entries;
  }

  return {
    set,
    get,
    has,
    remove,
    length,
    clear,
    keys,
    values,
    entries,
  };
};

// Testing the hashMap

const test = new hashMap();

// Add 12 items

test.set("apple", "red");
test.set("banana", "yellow");
test.set("carrot", "orange");
test.set("dog", "brown");
test.set("elephant", "gray");
test.set("frog", "green");
test.set("grape", "purple");
test.set("hat", "black");
test.set("ice cream", "white");
test.set("jacket", "blue");
test.set("kite", "pink");
test.set("lion", "goldens");

// Should be 12 items
test.length();

// Add 13th item, map should grow and count should be 13
test.set("moon", "silver");
test.length();

// Check for specific keys
test.get("apple");
test.get("nonExistentKey");

test.has("banana");
test.has("nonExistentKey");

// Remove banana, count should be 12 again
test.remove("banana");
test.length();

//
test.keys();
test.values();
test.entries();

// Check if clearing works
test.clear();
test.length();
