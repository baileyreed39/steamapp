'use strict';

( function() {

  class MainController {

    constructor($http, $scope, $compile, $timeout, Auth, Card, $rootScope) {
      this.$http = $http;
      this.$compile = $compile;
      this.$timeout = $timeout;
      this.awesomeThings = [];
      this.isLoggedIn = Auth.isLoggedIn;
      this.isAdmin = Auth.isAdmin;
      this.getCurrentUser = Auth.getCurrentUser;
      $rootScope.getCurrentUser = this.getCurrentUser;

      this.initialized = false;
      this.deck = {
        rootUrl: '/deckster',
        //settings for gridster
        gridsterOpts: {
          max_cols: 4,
          widget_margins: [10, 10],
          widget_base_dimensions: ['auto', 250],
          responsive_breakpoint: 850
        }
      };

      // examples Of how you can fetch content for cards
      // var getSummaryTemplate = (cardConfig, cb) => {
      //   console.log("Summary");
      //   // Not using the cardConfig here but you could use it to make request
      //   this.$http.get('components/deckster/testSummaryCard.html').success(html => {
      //      cb && cb(this.$compile(html)($scope));
      //   });
      // }
      //
      // var getDetailsTemplate = (cardConfig, cb) => {
      //   console.log("Test");
      //   // Not using the cardConfig here but you could use it to make request
      //   this.$http.get('components/deckster/testDetailsCard.html').success(html => {
      //     cb && cb(this.$compile(html)($scope));
      //   });
      // }

      // These cards require the user to add a steam profile before using
      this.deck.steamCards = [
        new Card({
          title: 'Your Profile',
          id: 'profileCard',
          summaryViewType: 'table',
          summaryViewOptions: {
            tooltipEnabled: true,
            tablePageSize: 12,
            pagination: false,
            columnBreakpoint: 5,
            numColumns: 2,
            hideHeader: true,
            apiUrl: '/api/steam/profile'
          },
          position: {
            size_x: 2,
            size_y: 1,
            col: 1,
            row: 1
          }

        }),
        new Card({
          title: "Friends' Playtimes",
          id: 'playtimeBarCard',
          summaryViewType: 'barChart',
          summaryViewOptions: {
            subtitle: 'What your friends have been playing recently',
            xTitle: 'Games Played',
            yTitle: 'Hours Played (in the last 2 weeks)',
            tooltipEnabled: true,
            tablePageSize: 12,
            pagination: false,
            columnBreakpoint: 5,
            numColumns: 1,
            apiUrl: '/api/steam/friendsGamesChart',
            dataTransform: {
              row: 'category',
              titleFormats: {
                category: 'categoryFormatter',
                series: 'seriesFormatter'
              },
              nameColumn: 'title',
              emptyRow: true
            }
          },
          position: {
            size_x: 3,
            size_y: 2,
            col: 1,
            row: 4
          }
        }),

        new Card({
          title: "Friends' Games",
          id: 'gamesCard',
          summaryViewType: 'table',
          summaryViewOptions: {
            tooltipEnabled: true,
            tablePageSize: 12,
            pagination: false,
            columnBreakpoint: 5,
            numColumns: 3,
            apiUrl: '/api/steam/friendGamesTable',
            preDataTransform: function(card, data, callback) {
              var games = _.flatten(data);

              // sort by title
              games.sort(function(a,b) {return (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0);} );

              games = _.map(games, function(game) {
                return {
                  icon: game.icon,
                  title: game.title,
                  //"devTitle": game.title, // unformatted title
                  owners: game.owner + ' (' + game.hours_played + ')'
                };
              });

              for (var i = 0; i < games.length-1; i++) {
                while (games[i].title === games[i+1].title) {
                  games[i].owners += ', ' + games[i+1].owners;
                  if(games[i+1].owners) {
                    _.pullAt(games, i + 1);
                  }
                }
              }
              for (var j = 0; j < games.length; j++) {
                // if 'owners' contains 'me', then bold the title
                games[j].title = ~games[j].owners.indexOf("<b>me</b>") ? '<b>' + games[j].title + '</b>' : games[j].title;
              }

              callback(games);
            }
          },
          position: {
            size_x: 2,
            size_y: 3,
            col: 3,
            row: 1
          }
        }),
        new Card({
          title: 'Your Friends',
          id: 'friendsCard',
          summaryViewType: 'table',
          steamOnly: true,
          summaryViewOptions: {
            tooltipEnabled: true,
            tablePageSize: 12,
            pagination: false,
            columnBreakpoint: 5,
            numColumns: 2,
            noDataMessage: 'Looks like you have no friends :(',
            apiUrl: '/api/steam/friends'
          },
          position: {
            size_x: 1,
            size_y: 2,
            col: 4,
            row: 4
          }
        }),
        new Card({
          title: 'Game News',
          id: 'newsCard',
          summaryViewType: 'table',
          summaryViewOptions: {
            tooltipEnabled: true,
            tablePageSize: 12,
            pagination: false,
            columnBreakpoint: 5,
            numColumns: 3,
            apiUrl: '/api/steam/news'
          },
          position: {
            size_x: 2,
            size_y: 2,
            col: 1,
            row: 2
          }
        })
      ];

      // Add cards here that do not need the user to be logged in for
      this.deck.cards = [

      ];

    }

    $onInit() {
      this.$http.get('/api/things')
        .then(response => {
          this.awesomeThings = response.data;
        });

      this.$timeout(() => {
        this.initialized = true
      });

    }

  }

  angular.module('steamAppApp')
    .component('main', {
      templateUrl: 'app/main/main.html',
      controller: MainController
    });
})();
