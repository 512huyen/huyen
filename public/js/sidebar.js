if (!window.sidebar) {
  window.sidebar = function(i) {
    i.fn.extend({
      navigation: function(e) {
        var n = i.extend(
            {
              accordion: !0,
              animate: "easeOutExpo",
              speed: 200,
              closedSign: "[+]",
              openedSign: "[-]",
              initClass: "js-nav-built"
            },
            e
          ),
          o = i(this);
        o.hasClass(n.initClass)
          ? myapp_config.debugState &&
            console.log(o.get(0) + " this menu already exists")
          : (o.addClass(n.initClass),
            o.find("li").each(function() {
              0 !== i(this).find("ul").length &&
                (i(this)
                  .find("a:first")
                  .append("<b class='collapse-sign'>" + n.closedSign + "</b>"),
                "#" ==
                  i(this)
                    .find("a:first")
                    .attr("href") &&
                  i(this)
                    .find("a:first")
                    .click(function() {
                      return !1;
                    }));
            }),
            o.find("li.active").each(function() {
              i(this)
                .parents("ul")
                .parent("li")
                .find("a:first")
                .attr("aria-expanded", !0)
                .find("b:first")
                .html(n.openedSign);
            }),
            o.find("li a").on("mousedown", function(e) {
              0 !==
                i(this)
                  .parent()
                  .find("ul").length &&
                (n.accordion &&
                  (i(this)
                    .parent()
                    .find("ul")
                    .is(":visible") ||
                    ((parents = i(this)
                      .parent()
                      .parents("ul")),
                    (visible = o.find("ul:visible")),
                    visible.each(function(o) {
                      var t = !0;
                      parents.each(function(e) {
                        if (parents[e] == visible[o]) return (t = !1);
                      }),
                        t &&
                          i(this)
                            .parent()
                            .find("ul") != visible[o] &&
                          i(visible[o]).slideUp(
                            n.speed + 300,
                            n.animate,
                            function() {
                              i(this)
                                .parent("li")
                                .removeClass("open")
                                .find("a:first")
                                .attr("aria-expanded", !1)
                                .find("b:first")
                                .html(n.closedSign),
                                myapp_config.debugState &&
                                  console.log("nav item closed");
                            }
                          );
                    }))),
                i(this)
                  .parent()
                  .find("ul:first")
                  .is(":visible") &&
                !i(this)
                  .parent()
                  .find("ul:first")
                  .hasClass("active")
                  ? i(this)
                      .parent()
                      .find("ul:first")
                      .slideUp(n.speed + 100, n.animate, function() {
                        i(this)
                          .parent("li")
                          .removeClass("open")
                          .find("a:first")
                          .attr("aria-expanded", !1)
                          .find("b:first")
                          .delay(n.speed)
                          .html(n.closedSign),
                          myapp_config.debugState &&
                            console.log("nav item closed");
                      })
                  : i(this)
                      .parent()
                      .find("ul:first")
                      .slideDown(n.speed, n.animate, function() {
                        i(this)
                          .parent("li")
                          .addClass("open")
                          .find("a:first")
                          .attr("aria-expanded", !0)
                          .find("b:first")
                          .delay(n.speed)
                          .html(n.openedSign),
                          myapp_config.debugState &&
                            console.log("nav item opened");
                      }));
            }));
      },
      navigationDestroy: function() {
        (self = i(this)),
          self.hasClass(myapp_config.navInitalized)
            ? (self.find("li").removeClass("active open"),
              self
                .find("li a")
                .off("mousedown")
                .removeClass("active")
                .removeAttr("aria-expanded")
                .find(".collapse-sign")
                .remove(),
              self
                .removeClass(myapp_config.navInitalized)
                .find("ul")
                .removeAttr("style"),
              myapp_config.debugState &&
                console.log(self.get(0) + " destroyed"))
            : console.log("menu does not exist");
      }
    });
  };
  window.sidebar(jQuery);
}
