import Backbone from 'backbone';

export default class Todo extends Backbone.Model {
  get defaults() {
    return {
      title: '',
      completed: false
    };
  }

  toggle() {
    this.save({
      completed: !this.get('completed')
    });
  }
}
