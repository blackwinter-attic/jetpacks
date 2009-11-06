/******************************************************************************
*                                                                             *
* promfacts -- Jetpack feature for prometheus Facts                           *
*                                                                             *
* Copyright (C) 2009 Jens Wille                                               *
*                                                                             *
* promfacts is free software; you can redistribute it and/or modify it under  *
* the terms of the GNU General Public License as published by the Free        *
* Software Foundation; either version 3 of the License, or (at your option)   *
* any later version.                                                          *
*                                                                             *
* promfacts is distributed in the hope that it will be useful, but WITHOUT    *
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or       *
* FITNESSFOR A PARTICULAR PURPOSE. See the GNU General Public License for     *
* more details.                                                               *
*                                                                             *
* You should have received a copy of the GNU General Public License along     *
* with promfacts. If not, see <http://www.gnu.org/licenses/>.                 *
*                                                                             *
* @title       prometheus Facts                                               *
* @description Jetpack feature for prometheus Facts                           *
* @author      Jens Wille <jens.wille@uni-koeln.de>                           *
* @license     GPL                                                            *
* @version     0.0.2                                                          *
* @url         http://wiki.github.com/blackwinter/jetpacks/promfacts          *
* @update      http://github.com/blackwinter/jetpacks/raw/master/promfacts.js *
*                                                                             *
******************************************************************************/

const prefs = Components.classes['@mozilla.org/preferences-service;1']
                        .getService(Components.interfaces.nsIPrefService)
                        .getBranch('jetpacks.promfacts.');

var Prom = {};

Prom.url  = 'http://prometheus-bildarchiv.de';
Prom.icon = Prom.url + '/fileadmin/layout/favicon.ico';
Prom.lang = prefs.getPrefType('lang') == prefs.PREF_STRING ? prefs.getCharPref('lang') : '1';

Prom.tr = {};

switch (Prom.lang) {
  case '0':  // de
    Prom.tr.title = 'prometheus in Zahlen';
    Prom.tr.none  = 'Keine gefunden';
    break;

  default:   // en
    Prom.tr.title = 'prometheus Facts';
    Prom.tr.none  = 'None found';
    break;
};

Prom.facts = function(callback) {
  jQuery.get(Prom.url + '/?L=' + Prom.lang, function(data) {
    data = jQuery(data, jetpack.tabs.focused.contentDocument);
    var facts;

    data.each(function() {
      if (this.id == 'facts') {
        facts = $(this);
        return false;
      }
    });

    if (callback) {
      callback(facts);
    }

    return facts;
  });
};

jetpack.statusBar.append({
  html:  '<img src="' + Prom.icon + '" alt="' + Prom.tr.title + '">',
  width: 18,

  onReady: function(widget) {
    $('img', widget).css({
      'padding-top': 3,
      cursor: 'pointer'
    });

    $(widget).click(function() {
      Prom.facts(function(facts) {
        jetpack.notifications.show({
          title: Prom.tr.title,
          body:  facts ? jQuery.trim(facts.text()).replace(/\n\s*/g, ', ') : Prom.tr.none + ' :-(',
          icon:  Prom.icon
        });
      });
    });
  }
});
