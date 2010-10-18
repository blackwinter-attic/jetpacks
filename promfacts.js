/******************************************************************************
*                                                                             *
* promfacts -- Jetpack feature for prometheus Facts                           *
*                                                                             *
* Copyright (C) 2009-2010 Jens Wille                                          *
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
* @version     0.0.4                                                          *
* @url         http://wiki.github.com/blackwinter/jetpacks/promfacts          *
* @update      http://github.com/blackwinter/jetpacks/raw/master/promfacts.js *
*                                                                             *
******************************************************************************/

var Prom = function() {
  var prefs = Components.classes['@mozilla.org/preferences-service;1']
                        .getService(Components.interfaces.nsIPrefService)
                        .getBranch('jetpacks.promfacts.');

  var get_pref = function(key, deflt) {
    var type = prefs.getPrefType(key);
    return type === prefs.PREF_STRING ? prefs.getCharPref(key) : deflt;
  };

  var url  = 'http://prometheus.uni-koeln.de/pandora',
      lang = get_pref('lang', 'en'), tr = {};

  if (lang === 'de') {
    tr.title = 'prometheus in Zahlen';
    tr.none  = 'Keine gefunden';
  }
  else {
    tr.title = 'prometheus Facts';
    tr.none  = 'None found';
  }

  return {
    icon:  url + '/favicon.ico', tr: tr,
    facts: function(callback) {
      jQuery.ajax({
        type:    'GET', dataType: 'json',
        url:     url + '/' + lang + '/pandora.json',
        error:   function(xhr, status) { callback(); },
        success: function(data) {
          var facts = data.facts;
          callback(jQuery.isArray(facts) && facts.length > 0 && facts);
        }
      });
    }
  };
}();

jetpack.statusBar.append({
  html:    '<img src="' + Prom.icon + '" alt="promfacts">', width: 18,
  onReady: function(widget) {
    $('img', widget).css({ cursor: 'pointer' });

    $(widget).click(function() {
      Prom.facts(function(facts) {
        jetpack.notifications.show({
          title: Prom.tr.title, icon: Prom.icon,
          body:  facts ? '<table>' + jQuery.map(facts, function(i) {
            var cells = '<td align="right">$1</td><td></td><td>$2</td>';
            return '<tr>' + i.replace(/(\S+)\s+(.+)/, cells) + '</tr>';
          }).join('') + '</table>' : Prom.tr.none + ' :-('
        });
      });
    });
  }
});
