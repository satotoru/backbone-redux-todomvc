import Backbone from 'backbone';
import resources from '../resources';

export let TodoFilter = '';
export default class TodoRouter extends Backbone.Router {
  routes() {
    return {
      '*filter': 'setFilter'
    };
  }

  setFilter(param) {
		// Set the current filter to be used
    TodoFilter = param || '';

		// Trigger a collection filter event, causing hiding/unhiding
		// of Todo view items
    resources.todos.trigger('filter');
  }
}
