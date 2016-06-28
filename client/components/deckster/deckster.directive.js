angular.module('decksterjs', [])

.factory('Deckster', function () {
  return window.Deckster;
})

.directive('decksterDeck', function ($rootScope, $parse, $timeout) {

  // $.getJSON('http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=440&count=3&maxlength=300&format=json', function(data) {
  //   this.jsonData = data;
  // });

  var defaults = {
    gridsterOpts: {
      max_cols: 4,
      widget_margins: [10, 10],
      widget_base_dimensions: ['auto', 250],
      responsive_breakpoint: 850
    }
  };

  return {
    restrict: 'EA',
    replace: true,
    templateUrl: 'components/deckster/decksterDeck.html',
    scope: {
      deck: "=",
      initialized: "="
    },
    controller: function($scope) {
      $scope.deckInitialized = false;

      $scope.$on('deckster:resize', function () {
        if ($scope.deckster) {
          $timeout(function () {
            $scope.deckster.$gridster.recalculate_faux_grid();
          });
        }
      });

      this.addCard = function (card, callback) {
        $scope.deckster.addCard(card, function (card) {
          callback && callback(card);
        });
      };

      this.init = function (element, opts) {
        $scope.deckster = $(element).deckster(opts).data('deckster');
        $scope.deckInitialized = true;
      };
    },
    link: function (scope, element, attrs, ctrl) {
      var deckOptions = $.extend(true, {}, defaults, scope.deck);
      var $deckEl = $(element).find('.deckster-deck');

      scope.$watch('initialized', function(init) {
        if (init && !scope.deckInitialized) {
          ctrl.init($deckEl, deckOptions);
        }
      });

      scope.$on('$destroy', function() {
        scope.deckster.destroy();
        scope.deckInitialized = false;
      });
    }
  };
})

.directive('decksterCard', function ($parse, $q, $http, $timeout) {
  // var jsonData = {
  //   "appnews": {
  //     "appid": 440,
  //     "newsitems": [
  //       {
  //         "gid": "250329347077175405",
  //         "title": "Highlander Open #2",
  //         "url": "http://store.steampowered.com/news/externalpost/tf2_blog/250329347077175405",
  //         "is_external_url": true,
  //         "author": "",
  //         "contents": "<a href=\"http://highlanderopen.org\"> </a> If you're looking to get into league-style competitive Team Fortress, sign up for <a href=\"http://highlanderopen.org\">The Highlander Open</a>, a new initiative to introduce non-competitive players into the competitive scene. Anyone and everyone is welcome to participate in this massive competition. Sign-ups close on July 7th, with Week ...",
  //         "feedlabel": "TF2 Blog",
  //         "date": 1466982420,
  //         "feedname": "tf2_blog"
  //       },
  //       {
  //         "gid": "250329347073180648",
  //         "title": "Team Fortress 2 Update Released",
  //         "url": "http://store.steampowered.com/news/22618/",
  //         "is_external_url": false,
  //         "author": "Valve",
  //         "contents": "An update to Team Fortress 2 has been released. The update will be applied automatically when you restart Team Fortress 2. The major changes include: * Internal system changes in preparation for a future update. * Fixed erroneously being warned that leaving a bootcamp match will result in an abandon...",
  //         "feedlabel": "Product Update",
  //         "date": 1466884140,
  //         "feedname": "steam_updates"
  //       },
  //       {
  //         "gid": "250329347073197487",
  //         "title": "Team Fortress 2 Update Released",
  //         "url": "http://store.steampowered.com/news/externalpost/tf2_blog/250329347073197487",
  //         "is_external_url": true,
  //         "author": "",
  //         "contents": "An update to Team Fortress 2 has been released. The update will be applied automatically when you restart Team Fortress 2. The major changes include: * Internal system changes in preparation for a future update. ;* Fixed erroneously being warned that leaving a bootcamp match will result in an abando...",
  //         "feedlabel": "TF2 Blog",
  //         "date": 1466884140,
  //         "feedname": "tf2_blog"
  //       }
  //     ]
  //   }
  // };

  return {
    restrict: 'E',
    require: ['^decksterDeck', 'decksterCard'],
    controller: function ($scope, $compile) {
      // Default summaryContentHtml function
      // this.getSummaryContent = function (card, cb) {
      //   $timeout(function() {
      //     cb($compile('<div></div>')($scope));
      //   });
      // };
      //
      // // Default detailsContentHtml function
      // this.getDetailsContent = function (card, cb) {
      //   $timeout(function() {
      //     cb($compile('<div></div>')($scope));
      //   });
      // };

      // Default leftControlsHtml function
      this.getLeftControlsContent = function (card, cb) {
        $timeout(function() {
          cb($compile('<div></div>')($scope));
        });
      };

      // Default rightControlsHtml function
      this.getRightControlsContent = function (card, cb) {
        $timeout(function() {
          cb($compile('<div></div>')($scope));
        });
      };

      // Default centerControlsHtml function
      this.getCenterControlsContent = function (card, cb) {
        $timeout(function() {
          cb($compile('<div></div>')($scope));
        });
      };

      this.onReload = function (card) {
        console.log('card reloaded', card)
      };

      this.onResize = function (card) {
        console.log('card resized', card);
      };

      this.onExpand = function (card)  {
        console.log("card expanded", card);
      };

      this.scrollToCard = function () {
        $scope.card.scrollToCard();
      };

      this.toggleCard = function () {
        $scope.card.hidden ? $scope.card.showCard() : $scope.card.hideCard();
      };

      this.setUpCard = function (cardOpts) {
        if(!cardOpts.summaryViewType && !cardOpts.detailsViewType) {
          cardOpts.summaryContentHtml = cardOpts.summaryContentHtml || this.getSummaryContent;
          cardOpts.detailsContentHtml = cardOpts.detailsContentHtml || this.getDetailsContent;
          cardOpts.onResize = cardOpts.onResize || this.onResize;
          cardOpts.onReload = cardOpts.onReload || this.onReload;
        }

        cardOpts.showFooter = false;
        cardOpts.leftControlsHtml = this.getLeftControlsContent;
        cardOpts.rightControlsHtml = this.getRightControlsContent;
        cardOpts.centerControlsHtml = this.getCenterControlsContent;

        $scope.$on('deckster-card:scrollto-' + cardOpts.id, this.scrollToCard);
        $scope.$on('deckster-card:toggle-' + cardOpts.id, this.toggleCard);

        return cardOpts;
      };

    },
    link: function (scope, element, attrs, ctrls) {
      var deckCtrl = ctrls[0];
      var cardCtrl = ctrls[1];

      var cardOpts = $parse(attrs.cardOptions || {})(scope);

      scope.$watch('deckInitialized', function (initialized) {
        if (initialized) {
          deckCtrl.addCard(cardCtrl.setUpCard(cardOpts), function (card) {
            scope.card = card;

            // When the deck is resize resize this card as well
            scope.$on('deckster:resize', function () {
              // TODO code to resize cards
            });

            scope.$on('deckster:redraw', function () {
              $timeout(function () {
                // TODO code to redraw cards
              });
            });
          });
        }
      });
    }
  }
})

    //deckster popout
.directive('decksterPopout', ['$injector', '$compile', '$http', 'Deckster', function($injector, $compile, $http, Deckster) {
  return {
    restrict: 'E',
    link: function(scope, element) {
      var cardId, section;

      var $routeParams = $injector.get('$routeParams');
      cardId = $routeParams.id;
      section = $routeParams.section;


      var getSummaryTemplate = function(cardConfig, cb) {
        // Not using the cardConfig here but you could use it to make request
        $http.get('partials/testSummaryCard.html').success(function(html) {
          cb && cb($compile(html)(scope));
        });
      };

      var getDetailsTemplate = function(cardConfig, cb) {
        // Not using the cardConfig here but you could use it to make request
        $http.get('partials/testDetailsCard.html').success(function (html) {
          cb && cb($compile(html)(scope));
        });
      };

      // Get card config from server or angular constants using cardId
      var cardConfig =  {
        title: 'Photos',
        id: 'photoCard',
        summaryContentHtml: getSummaryTemplate,
        detailsContentHtml: getDetailsTemplate,
        position: {
          size_x: 1,
          size_y: 1,
          col: 1,
          row: 1
        }
      };

      Deckster.generatePopout(element, cardConfig, section);
    }
  };
}]);