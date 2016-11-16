import Backbone from 'backbone';
import $ from 'jquery';
import _ from 'underscore';
import { ENTER_KEY, ESC_KEY } from '../constants';
import { TodoFilter } from '../routers/router';

export default class TodoView extends Backbone.View {
  get tagName() { return 'li'; }

  get template() { return _.template($('#item-template').html()); }

  get events() {
    return {
      'click .toggle': 'toggleCompleted',
      'dblclick label': 'edit',
      'click .destroy': 'clear',
      'keypress .edit': 'updateOnEnter',
      'keydown .edit': 'revertOnEscape',
      'blur .edit': 'close'
    };
  }

  initialize() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
    this.listenTo(this.model, 'visible', this.toggleVisible);
  }

  render() {
    if (this.model.changed.id !== undefined) {
      return;
    }

    this.$el.html(this.template(this.model.toJSON()));
    this.$el.toggleClass('completed', this.model.get('completed'));
    this.toggleVisible();
    this.$input = this.$('.edit');
    return this;
  }

  toggleVisible() {
    this.$el.toggleClass('hidden', this.isHidden());
  }

  isHidden() {
    return this.model.get('completed') ?
    TodoFilter === 'active' :
    TodoFilter === 'completed';
  }

  // Toggle the `"completed"` state of the model.
  toggleCompleted() {
    this.model.toggle();
  }

  // Switch this view into `"editing"` mode, displaying the input field.
  edit() {
    this.$el.addClass('editing');
    this.$input.focus();
  }

  // Close the `"editing"` mode, saving changes to the todo.
  close() {
    const value = this.$input.val();
    const trimmedValue = value.trim();

    // We don't want to handle blur events from an item that is no
    // longer being edited. Relying on the CSS class here has the
    // benefit of us not having to maintain state in the DOM and the
    // JavaScript logic.
    if (!this.$el.hasClass('editing')) {
      return;
    }

    if (trimmedValue) {
      this.model.save({ title: trimmedValue });
    } else {
      this.clear();
    }

    this.$el.removeClass('editing');
  }

  // If you hit `enter`, we're through editing the item.
  updateOnEnter(e) {
    if (e.which === ENTER_KEY) {
      this.close();
    }
  }

  // If you're pressing `escape` we revert your change by simply leaving
  // the `editing` state.
  revertOnEscape(e) {
    if (e.which === ESC_KEY) {
      this.$el.removeClass('editing');
      // Also reset the hidden input back to the original value.
      this.$input.val(this.model.get('title'));
    }
  }

  // Remove the item, destroy the model from *localStorage* and delete its view.
  clear() {
    this.model.destroy();
  }
}
