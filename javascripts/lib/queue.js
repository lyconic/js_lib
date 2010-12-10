/**
 * class Queue
 *
 *  A simple method queue.
**/
function Queue() {
  this._methods = [];
  this._response = null;
  this._flushed = false;
}

(function(Q){
  
  /**
   *  Queue#add(fn) -> undefined
   *  - fn (Function): callback to add to the Queue
   *
   *  Pushes the given function onto the callstack.
  **/
  Q.add = function (fn) {
    if (this._flushed) fn(this._response);
    else this._methods.push(fn);
  }
  
  /**
   *  Queue#flush(response) -> undefined
   *  - response (?): server response to pass to the callbacks
   *
   *  This is only called once, when a response is ready to be passed in.
   *  Executes every function on the callstack sequentially.
  **/
  Q.flush = function (response) {
    if (this._flushed) return;
    this._response = response;
    while (this._methods[0]) {
      this._methods.shift()(response);
    }
    this._flushed = true;
  }
  
})(Queue.prototype);