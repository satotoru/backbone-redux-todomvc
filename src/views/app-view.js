import Backbone from 'backbone';
import $ from 'jquery';
import _ from 'underscore';
import TodoView from './todo-view';
import { ENTER_KEY } from '../constants';
import { TodoFilter } from '../routers/router';

export default class AppView extends Backbone.View {
  get el() { return '.todoapp'; }
  get statsTemplate() { return _.template($('#stats-template').html()); }
  get events() {
    return {
      'keypress .new-todo': 'createOnEnter',
      'click .clear-completed': 'clearCompleted',
      'click .toggle-all': 'toggleAllComplete'
    };
  }

  initialize() {
    this.allCheckbox = this.$('.toggle-all')[0];
    this.$input = this.$('.new-todo');
    this.$footer = this.$('.footer');
    this.$main = this.$('.main');
    this.$list = $('.todo-list');

    this.listenTo(this.collection, 'add', this.addOne);
    this.listenTo(this.collection, 'reset', this.addAll);
    this.listenTo(this.collection, 'change:completed', this.filterOne);
    this.listenTo(this.collection, 'filter', this.filterAll);
    this.listenTo(this.collection, 'all', _.debounce(this.render, 0));
    this.collection.fetch({reset: true});
  }

	// Re-rendering the App just means refreshing the statistics -- the rest
	// of the app doesn't change.
  render() {
    const completed = this.collection.completed().length;
    const remaining = this.collection.remaining().length;

    if (this.collection.length) {
      this.$main.show();
      this.$footer.show();

      this.$footer.html(this.statsTemplate({
        completed: completed,
        remaining: remaining
      }));

      this.$('.filters li a')
			.removeClass('selected')
			.filter('[href="#/' + (TodoFilter || '') + '"]')
			.addClass('selected');
    } else {
      this.$main.hide();
      this.$footer.hide();
    }

    this.allCheckbox.checked = !remaining;
  }

	// Add a single todo item to the list by creating a view for it, and
	// appending its element to the `<ul>`.
  addOne(todo) {
    const view = new TodoView({ model: todo });
    this.$list.append(view.render().el);
  }

	// Add all items in the **Todos** collection at once.
  addAll() {
    this.$list.html('');
    this.collection.each(this.addOne, this);
  }

  filterOne(todo) {
    todo.trigger('visible');
  }

  filterAll() {
    this.collection.each(this.filterOne, this);
  }

	// Generate the attributes for a new Todo item.
  newAttributes() {
    return {
      title: this.$input.val().trim(),
      order: this.collection.nextOrder(),
      completed: false
    };
  }

	// If you hit return in the main input field, create new **Todo** model,
	// persisting it to *localStorage*.
  createOnEnter(e) {
    if (e.which === ENTER_KEY && this.$input.val().trim()) {
      this.collection.create(this.newAttributes());
      this.$input.val('');
    }
  }

	// Clear all completed todo items, destroying their models.
  clearCompleted() {
    _.invoke(this.collection.completed(), 'destroy');
    return false;
  }

  toggleAllComplete() {
    const completed = this.allCheckbox.checked;

    this.collection.each(function (todo) {
      todo.save({
        completed: completed
      });
    });
  }
}
