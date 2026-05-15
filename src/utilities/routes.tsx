export enum Pathname {
  Home = '/',
  Welcome = '/welcome',
  Fallback = '*',
  Signin = '/auth/signin',
  PasswordReset = '/auth/reset',
  Live = '/live/:user',
  Profile = '/profile/:login/:tabId?',
  Results = '/results',
  Settings = '/settings',
  Help = '/help',
  Game = '/category/:gameId',
  PopularCategories = '/popular-categories',
}
