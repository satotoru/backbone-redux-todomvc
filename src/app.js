import Backbone from 'Backbone';
import $ from 'jquery';
import AppView from './views/app-view';
import AppRouter from './routers/router';
import resources from './resources';

$(() => {
  new AppRouter();
  Backbone.history.start();
  new AppView({ collection: resources.todos });
});
