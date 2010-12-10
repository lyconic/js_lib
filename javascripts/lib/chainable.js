/**
 * class Chainable
 * includes Enumerable
 *
 * Uses the Queue class to create a chainable, asynchronous method queue API
**/

/**
 *  new Chainable(model)
 *  - model (Model): model class that responds to Model#read
 *
 *  Initializes method queue for given model and returns an instance
 *  ready for chaining enumerable methods off of.
**/
function Chainable (model) {
  if (!(this instanceof arguments.callee)) return new arguments.callee(model);
  this._model = model;
  this._queue = new Queue;
}

function $C (model) {
  return new Chainable(model);
}

(function(C){
  
  C._each = function (fn) {
    this._queue.add(function(response){
      response.each(fn);
    });
  }
  
  /**
   *  Chainable#fetch(conditions) -> Chainable
   *  - conditions (Object): filter conditions to send to the server
   *
   *  Executes the Model#read function to create the AJAX call, and
   *  uses the success callback to flush the queue.
   *
   *  This needs to be the first method you call after instantiation.
  **/
  C.fetch = function (conditions) {
    conditions = conditions || {};
    var queue = this._queue;
    this._model.read(conditions, function(results){
      queue.flush(results);
    });
    return this;
  }
  
  Object.extend(C, Enumerable);
  
})(Chainable.prototype);