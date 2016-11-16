import Backbone from 'backbone';
import Todo from '../models/todo';
Backbone.localStorage = require('backbone.localstorage');

export default class Todos extends Backbone.Collection {
  get model() { return Todo; }
  get localStorage() { return new Backbone.LocalStorage('todos-backbone'); }

  completed() {
    return this.where({completed: true});
  }
  remaining() {
    return this.where({completed: false});
  }

  nextOrder() {
    return this.length ? this.last().get('order') + 1 : 1;
  }

  get comparator() { return 'order'; }
}
